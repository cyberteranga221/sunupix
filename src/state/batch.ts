/**
 * État du lot de photos (liste, statuts, progression) et orchestration des conversions.
 *
 * Volontairement sans dépendance à React : l'interface s'y abonne avec
 * `useSyncExternalStore`. Les notifications sont regroupées (une par image affichée)
 * pour rester fluide même quand 4 conversions se terminent en même temps.
 */
import { LIMITS } from '../config';
import {
  computeConcurrency,
  maxCanvasArea,
  readDeviceInfo,
  type DeviceInfo,
} from '../engine/device';
import { detectFormat, formatFromName, SNIFF_BYTES } from '../engine/detect';
import { toErrorCode } from '../engine/errors';
import { NameAllocator } from '../engine/filenames';
import { TaskQueue, type QueueEvent } from '../engine/queue';
import { writeToDirectory } from '../engine/save';
import type {
  ConvertJob,
  ConvertOptions,
  ConvertOutput,
  ErrorCode,
  InputFormat,
  WarningCode,
} from '../engine/types';
import { createConvertWorker, WorkerPool } from '../engine/worker-pool';

export type ItemStatus = 'pending' | 'processing' | 'done' | 'error' | 'cancelled';

export interface BatchItem {
  readonly id: string;
  readonly file: File;
  readonly name: string;
  readonly size: number;
  readonly format: InputFormat | null;
  readonly status: ItemStatus;
  readonly error?: ErrorCode;
  readonly warnings: readonly WarningCode[];
  readonly outputName?: string;
  /** Fichier converti, gardé en mémoire tant qu'il n'est pas enregistré dans un dossier. */
  readonly output?: Blob;
  readonly outputSize?: number;
  /** Vrai si le fichier a été écrit directement dans le dossier choisi. */
  readonly saved?: boolean;
  readonly thumbUrl?: string;
}

export interface BatchSnapshot {
  readonly items: readonly BatchItem[];
  readonly running: boolean;
  readonly paused: boolean;
  /** Progression de la conversion en cours (ou de la dernière). */
  readonly run: RunProgress | null;
  /** Fichiers refusés lors du dernier ajout, car le lot était plein. */
  readonly overflow: number;
  readonly destination: string | null;
}

export interface RunProgress {
  total: number;
  finished: number;
  totalBytes: number;
  finishedBytes: number;
  startedAt: number;
  /** Temps restant estimé en millisecondes, ou null tant qu'on ne sait pas. */
  etaMs: number | null;
}

interface RunState {
  ids: Set<string>;
  startedAt: number;
  totalBytes: number;
  finishedBytes: number;
  finished: number;
  firstFinishAt: number | null;
}

let idCounter = 0;
const newId = () => `f${Date.now().toString(36)}${(idCounter++).toString(36)}`;

type Runner = (job: ConvertJob, signal: AbortSignal) => Promise<ConvertOutput>;

export class BatchStore {
  private items: BatchItem[] = [];
  private readonly index = new Map<string, number>();
  private readonly listeners = new Set<() => void>();
  private snapshot: BatchSnapshot;
  private scheduled = false;
  private overflow = 0;

  private device: DeviceInfo | null = null;
  private queue: TaskQueue<string, ConvertOutput> | null = null;
  private pool: WorkerPool | null = null;
  private runner: Runner | null = null;
  private readonly names = new NameAllocator();
  private options: ConvertOptions | null = null;
  private directory: FileSystemDirectoryHandle | null = null;
  private run: RunState | null = null;

  constructor() {
    this.snapshot = this.buildSnapshot();
  }

  // --- Abonnement (useSyncExternalStore) ---------------------------------------------

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): BatchSnapshot => this.snapshot;

  // --- Ajout et retrait de fichiers ---------------------------------------------------

  /** Ajoute des fichiers au lot. Le format réel est lu dans les premiers octets. */
  async addFiles(files: readonly File[]): Promise<void> {
    const room = LIMITS.maxFiles - this.items.length;
    const accepted = files.slice(0, Math.max(0, room));
    this.overflow = files.length - accepted.length;

    const items = await Promise.all(
      accepted.map(async (file): Promise<BatchItem> => {
        const base = { id: newId(), file, name: file.name, size: file.size, warnings: [] };
        if (file.size > LIMITS.maxFileBytes) {
          return {
            ...base,
            format: formatFromName(file.name),
            status: 'error',
            error: 'too-large',
          };
        }
        let format: InputFormat | null = null;
        try {
          format = detectFormat(new Uint8Array(await file.slice(0, SNIFF_BYTES).arrayBuffer()));
        } catch {
          /* fichier illisible */
        }
        if (!format) {
          // Une extension d'image connue mais des octets inconnus : fichier abîmé.
          const error: ErrorCode = formatFromName(file.name) ? 'corrupt' : 'unsupported';
          return { ...base, format: null, status: 'error', error };
        }
        return { ...base, format, status: 'pending' };
      }),
    );
    for (const item of items) {
      this.index.set(item.id, this.items.length);
      this.items.push(item);
    }
    this.notify();
  }

  remove(id: string): void {
    const item = this.get(id);
    if (!item) return;
    if (item.status === 'processing' || item.status === 'pending') this.queue?.cancel(id);
    if (this.run?.ids.has(id) && (item.status === 'processing' || item.status === 'pending')) {
      this.run.ids.delete(id);
      this.run.totalBytes -= item.size;
    }
    this.dispose(item);
    this.items = this.items.filter((i) => i.id !== id);
    this.reindex();
    this.notify();
  }

  /** Vide entièrement le lot et libère toute la mémoire. */
  clear(): void {
    this.queue?.cancelAll();
    this.pool?.terminateAll();
    for (const item of this.items) this.dispose(item);
    this.items = [];
    this.index.clear();
    this.names.clear();
    this.run = null;
    this.overflow = 0;
    this.directory = null;
    this.notify();
  }

  dismissOverflow(): void {
    this.overflow = 0;
    this.notify();
  }

  // --- Conversion ------------------------------------------------------------------------

  /**
   * Lance la conversion des photos en attente.
   * `reconvertAll` : reconvertit aussi les photos déjà converties (nouveaux réglages).
   */
  start(
    options: ConvertOptions,
    directory: FileSystemDirectoryHandle | null,
    reconvertAll = false,
  ): void {
    const queue = this.ensureQueue();
    this.options = options;
    this.directory = directory;

    if (reconvertAll) {
      this.names.clear();
      for (const item of this.items) {
        if (
          item.status === 'done' ||
          item.status === 'cancelled' ||
          (item.status === 'error' && item.format)
        ) {
          this.disposeOutput(item);
          this.patch(item.id, {
            status: 'pending',
            error: undefined,
            warnings: [],
            output: undefined,
            outputSize: undefined,
            outputName: undefined,
            saved: undefined,
            thumbUrl: undefined,
          });
        }
      }
    }

    const toRun = this.items.filter((i) => i.status === 'pending' || i.status === 'cancelled');
    if (toRun.length === 0) return;
    this.run = {
      ids: new Set(toRun.map((i) => i.id)),
      startedAt: performance.now(),
      totalBytes: toRun.reduce((sum, i) => sum + i.size, 0),
      finishedBytes: 0,
      finished: 0,
      firstFinishAt: null,
    };
    for (const item of toRun) {
      // Nom de sortie attribué dans l'ordre de la liste : stable et prévisible.
      this.patch(item.id, {
        status: 'pending',
        outputName: this.names.allocate(item.name, options.format),
      });
      queue.add(item.id, item.id);
    }
    queue.resume();
    this.notify();
  }

  pause(): void {
    this.queue?.pause();
    this.notify();
  }

  resume(): void {
    this.queue?.resume();
    this.notify();
  }

  cancel(id: string): void {
    this.queue?.cancel(id);
  }

  cancelAll(): void {
    this.queue?.cancelAll();
    this.notify();
  }

  retry(id: string): void {
    const item = this.get(id);
    if (!item || !this.options || !item.format) return;
    this.patch(id, { status: 'pending', error: undefined, warnings: [] });
    if (this.run && !this.run.ids.has(id)) {
      this.run.ids.add(id);
      this.run.totalBytes += item.size;
    }
    this.ensureQueue().add(id, id);
    this.notify();
  }

  get deviceInfo(): DeviceInfo {
    this.device ??= readDeviceInfo();
    return this.device;
  }

  // --- Interne -----------------------------------------------------------------------

  private ensureQueue(): TaskQueue<string, ConvertOutput> {
    if (this.queue) return this.queue;
    const device = this.deviceInfo;
    const canUseWorkers = typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined';
    const concurrency = canUseWorkers ? computeConcurrency(device) : 1;
    if (canUseWorkers) {
      this.pool = new WorkerPool(concurrency, createConvertWorker);
      const pool = this.pool;
      this.runner = (job, signal) => pool.run(job, signal);
    } else {
      // Repli pour les vieux navigateurs : conversion sur le thread principal, une à la fois.
      this.runner = (job) => import('../engine/pipeline').then((m) => m.convertImage(job));
    }
    this.queue = new TaskQueue<string, ConvertOutput>(
      (id, signal) => this.convert(id, signal),
      concurrency,
      (event) => this.onQueueEvent(event),
    );
    return this.queue;
  }

  private async convert(id: string, signal: AbortSignal): Promise<ConvertOutput> {
    const item = this.get(id);
    if (!item?.format || !this.options || !this.runner) throw new Error('élément introuvable');
    const job: ConvertJob = {
      file: item.file,
      inputFormat: item.format,
      options: this.options,
      maxArea: maxCanvasArea(this.deviceInfo),
    };
    return this.runner(job, signal);
  }

  private onQueueEvent(event: QueueEvent<ConvertOutput>): void {
    switch (event.type) {
      case 'start':
        this.patch(event.id, { status: 'processing' });
        break;
      case 'success':
        void this.complete(event.id, event.result);
        return;
      case 'error':
        this.finish(event.id, { status: 'error', error: toErrorCode(event.error) });
        break;
      case 'cancel':
        this.finish(event.id, { status: 'cancelled' });
        break;
      case 'idle':
        break;
    }
    this.notify();
  }

  private async complete(id: string, output: ConvertOutput): Promise<void> {
    const item = this.get(id);
    if (!item) return; // retiré entre-temps : le résultat est simplement abandonné
    const thumbUrl = output.thumbnail ? URL.createObjectURL(output.thumbnail) : undefined;
    const base = { warnings: output.warnings, outputSize: output.blob.size, thumbUrl };
    if (this.directory && item.outputName) {
      try {
        const finalName = await writeToDirectory(this.directory, item.outputName, output.blob);
        // Écrit sur le disque : on ne garde pas le fichier en mémoire.
        this.finish(id, { ...base, status: 'done', saved: true, outputName: finalName });
      } catch {
        this.finish(id, { ...base, status: 'done', output: output.blob, error: 'save-failed' });
      }
    } else {
      this.finish(id, { ...base, status: 'done', output: output.blob });
    }
    this.notify();
  }

  /** Met à jour un élément terminé et la progression. */
  private finish(id: string, patch: Partial<BatchItem>): void {
    const item = this.get(id);
    if (!item) return;
    if (item.thumbUrl && patch.thumbUrl && item.thumbUrl !== patch.thumbUrl)
      URL.revokeObjectURL(item.thumbUrl);
    this.patch(id, patch);
    if (this.run?.ids.has(id)) {
      this.run.finished += 1;
      this.run.finishedBytes += item.size;
      this.run.firstFinishAt ??= performance.now();
    }
  }

  private get(id: string): BatchItem | undefined {
    const i = this.index.get(id);
    return i === undefined ? undefined : this.items[i];
  }

  private patch(id: string, patch: Partial<BatchItem>): void {
    const i = this.index.get(id);
    const current = i === undefined ? undefined : this.items[i];
    if (i === undefined || !current) return;
    this.items[i] = { ...current, ...patch };
  }

  private reindex(): void {
    this.index.clear();
    this.items.forEach((item, i) => this.index.set(item.id, i));
  }

  private disposeOutput(item: BatchItem): void {
    if (item.thumbUrl) URL.revokeObjectURL(item.thumbUrl);
  }

  private dispose(item: BatchItem): void {
    this.disposeOutput(item);
    if (item.outputName) this.names.release(item.outputName);
  }

  private notify(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    const flush = () => {
      this.scheduled = false;
      this.snapshot = this.buildSnapshot();
      for (const listener of this.listeners) listener();
    };
    if (typeof requestAnimationFrame === 'function' && !document.hidden)
      requestAnimationFrame(flush);
    else setTimeout(flush, 50);
  }

  private buildSnapshot(): BatchSnapshot {
    const queue = this.queue;
    const running = !!queue && !queue.isIdle;
    return {
      items: this.items.slice(),
      running,
      paused: !!queue?.isPaused && running,
      run: this.run ? this.progress(this.run) : null,
      overflow: this.overflow,
      destination: this.directory?.name ?? null,
    };
  }

  private progress(run: RunState): RunProgress {
    let etaMs: number | null = null;
    const remainingBytes = run.totalBytes - run.finishedBytes;
    if (run.finished >= 2 && run.finishedBytes > 0 && remainingBytes > 0) {
      // Débit observé (octets d'entrée par ms, parallélisme compris).
      const elapsed = performance.now() - run.startedAt;
      etaMs = (remainingBytes * elapsed) / run.finishedBytes;
    } else if (remainingBytes === 0) {
      etaMs = 0;
    }
    return {
      total: run.ids.size,
      finished: run.finished,
      totalBytes: run.totalBytes,
      finishedBytes: run.finishedBytes,
      startedAt: run.startedAt,
      etaMs,
    };
  }
}

/** Instance unique, créée au premier usage côté navigateur. */
let store: BatchStore | null = null;
export function getBatchStore(): BatchStore {
  store ??= new BatchStore();
  return store;
}
