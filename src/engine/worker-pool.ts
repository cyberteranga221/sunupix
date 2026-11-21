/**
 * Pool de Web Workers.
 *
 * - au plus `size` workers, créés à la demande ;
 * - un worker dont la mémoire WebAssembly dépasse le seuil est recyclé (terminé puis recréé),
 *   car la mémoire WASM ne rétrécit jamais ;
 * - annuler une conversion en cours termine son worker : la mémoire est libérée tout de suite.
 */
import { ENGINE } from '../config';
import { ConversionError } from './errors';
import type { ConvertRequest, WorkerResponse } from './protocol';
import type { ConvertJob, ConvertOutput } from './types';

export class WorkerPool {
  private readonly idle: Worker[] = [];
  private readonly all = new Set<Worker>();
  private readonly waiting: Array<(worker: Worker) => void> = [];
  private nextJobId = 1;

  constructor(
    private size: number,
    private readonly createWorker: () => Worker,
  ) {}

  resize(size: number): void {
    this.size = Math.max(1, size);
  }

  run(job: ConvertJob, signal: AbortSignal): Promise<ConvertOutput> {
    return this.acquire().then(
      (worker) =>
        new Promise<ConvertOutput>((resolve, reject) => {
          const jobId = this.nextJobId++;
          if (signal.aborted) {
            this.release(worker);
            reject(new DOMException('Annulé', 'AbortError'));
            return;
          }
          const cleanup = () => {
            worker.removeEventListener('message', onMessage);
            worker.removeEventListener('error', onError);
            signal.removeEventListener('abort', onAbort);
          };
          const onMessage = (event: MessageEvent<WorkerResponse>) => {
            const data = event.data;
            if (data.jobId !== jobId) return;
            cleanup();
            if (data.heapBytes > ENGINE.workerRecycleHeapBytes) this.discard(worker);
            else this.release(worker);
            if (data.type === 'result') resolve(data.output);
            else reject(new ConversionError(data.code, data.message));
          };
          const onError = (event: ErrorEvent) => {
            // Un worker qui plante : souvent un manque de mémoire.
            event.preventDefault();
            cleanup();
            this.discard(worker);
            reject(new ConversionError('out-of-memory', event.message));
          };
          const onAbort = () => {
            cleanup();
            this.discard(worker);
            reject(new DOMException('Annulé', 'AbortError'));
          };
          worker.addEventListener('message', onMessage);
          worker.addEventListener('error', onError);
          signal.addEventListener('abort', onAbort, { once: true });
          const request: ConvertRequest = { type: 'convert', jobId, job };
          worker.postMessage(request);
        }),
    );
  }

  /** Termine tous les workers (libère toute la mémoire). */
  terminateAll(): void {
    for (const worker of this.all) worker.terminate();
    this.all.clear();
    this.idle.length = 0;
  }

  private acquire(): Promise<Worker> {
    const worker = this.idle.pop();
    if (worker) return Promise.resolve(worker);
    if (this.all.size < this.size) return Promise.resolve(this.spawn());
    return new Promise((resolve) => this.waiting.push(resolve));
  }

  private spawn(): Worker {
    const worker = this.createWorker();
    this.all.add(worker);
    return worker;
  }

  private release(worker: Worker): void {
    if (!this.all.has(worker)) return;
    if (this.all.size > this.size) {
      this.discard(worker);
      return;
    }
    const next = this.waiting.shift();
    if (next) next(worker);
    else this.idle.push(worker);
  }

  private discard(worker: Worker): void {
    worker.terminate();
    this.all.delete(worker);
    const index = this.idle.indexOf(worker);
    if (index >= 0) this.idle.splice(index, 1);
    const next = this.waiting.shift();
    if (next) next(this.spawn());
  }
}

/** Crée le worker de conversion (Vite le compile en fichier séparé). */
export const createConvertWorker = () =>
  new Worker(new URL('./convert.worker.ts', import.meta.url), {
    type: 'module',
    name: 'sunupix-convert',
  });
