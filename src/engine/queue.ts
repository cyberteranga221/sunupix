/**
 * File d'attente de conversions, indépendante du navigateur (testable avec Vitest).
 *
 * - au plus `concurrency` tâches en cours en même temps (jamais les 400 ensemble) ;
 * - `pause()` n'interrompt pas les tâches en cours : elle empêche d'en démarrer de nouvelles ;
 * - `cancel(id)` retire une tâche en attente ou interrompt une tâche en cours (AbortSignal) ;
 * - l'échec d'une tâche n'arrête jamais les autres.
 */

export type QueueEvent<R> =
  | { type: 'start'; id: string }
  | { type: 'success'; id: string; result: R }
  | { type: 'error'; id: string; error: unknown }
  | { type: 'cancel'; id: string }
  | { type: 'idle' };

export type Runner<T, R> = (data: T, signal: AbortSignal) => Promise<R>;

interface Task<T> {
  id: string;
  data: T;
}

export class TaskQueue<T, R> {
  private readonly pending: Task<T>[] = [];
  private readonly running = new Map<string, AbortController>();
  private paused = false;

  constructor(
    private readonly runner: Runner<T, R>,
    private concurrency: number,
    private readonly listener: (event: QueueEvent<R>) => void,
  ) {}

  get pendingCount(): number {
    return this.pending.length;
  }

  get runningCount(): number {
    return this.running.size;
  }

  get isPaused(): boolean {
    return this.paused;
  }

  get isIdle(): boolean {
    return this.pending.length === 0 && this.running.size === 0;
  }

  add(id: string, data: T): void {
    this.pending.push({ id, data });
    this.pump();
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
    this.pump();
  }

  setConcurrency(n: number): void {
    this.concurrency = Math.max(1, Math.floor(n));
    this.pump();
  }

  /** Annule une tâche. Retourne vrai si elle était en attente ou en cours. */
  cancel(id: string): boolean {
    const index = this.pending.findIndex((t) => t.id === id);
    if (index >= 0) {
      this.pending.splice(index, 1);
      this.emit({ type: 'cancel', id });
      this.checkIdle();
      return true;
    }
    const controller = this.running.get(id);
    if (controller) {
      controller.abort();
      return true;
    }
    return false;
  }

  /** Annule tout : tâches en attente et tâches en cours. */
  cancelAll(): void {
    const waiting = this.pending.splice(0);
    for (const task of waiting) this.emit({ type: 'cancel', id: task.id });
    for (const controller of this.running.values()) controller.abort();
    this.checkIdle();
  }

  private pump(): void {
    while (!this.paused && this.running.size < this.concurrency) {
      const task = this.pending.shift();
      if (!task) break;
      this.start(task);
    }
  }

  private start(task: Task<T>): void {
    const controller = new AbortController();
    this.running.set(task.id, controller);
    this.emit({ type: 'start', id: task.id });

    // `Promise.resolve().then` : une erreur levée de façon synchrone par le runner
    // devient un rejet, et ne casse pas la boucle `pump`.
    Promise.resolve()
      .then(() => this.runner(task.data, controller.signal))
      .then(
        (result) => {
          if (controller.signal.aborted) this.emit({ type: 'cancel', id: task.id });
          else this.emit({ type: 'success', id: task.id, result });
        },
        (error: unknown) => {
          if (controller.signal.aborted) this.emit({ type: 'cancel', id: task.id });
          else this.emit({ type: 'error', id: task.id, error });
        },
      )
      .finally(() => {
        this.running.delete(task.id);
        this.pump();
        this.checkIdle();
      });
  }

  private checkIdle(): void {
    if (this.isIdle) this.emit({ type: 'idle' });
  }

  private emit(event: QueueEvent<R>): void {
    try {
      this.listener(event);
    } catch (error) {
      // Une erreur dans l'interface ne doit jamais bloquer la file.
      console.error('[SunuPix] erreur dans un écouteur de la file', error);
    }
  }
}
