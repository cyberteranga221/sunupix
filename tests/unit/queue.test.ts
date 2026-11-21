import { describe, expect, it } from 'vitest';
import { TaskQueue, type QueueEvent } from '../../src/engine/queue';

/** Tâche contrôlable depuis le test. */
function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

function setup(concurrency = 2) {
  const tasks = new Map<string, ReturnType<typeof deferred<string>>>();
  const signals = new Map<string, AbortSignal>();
  const events: QueueEvent<string>[] = [];
  const queue = new TaskQueue<string, string>(
    (id, signal) => {
      const d = deferred<string>();
      tasks.set(id, d);
      signals.set(id, signal);
      signal.addEventListener('abort', () => d.reject(new Error('aborted')));
      return d.promise;
    },
    concurrency,
    (e) => events.push(e),
  );
  const add = (...ids: string[]) => ids.forEach((id) => queue.add(id, id));
  const of = (type: QueueEvent<string>['type']) =>
    events.filter((e) => e.type === type).map((e) => ('id' in e ? e.id : ''));
  return { queue, tasks, signals, events, add, of };
}

describe('TaskQueue', () => {
  it('ne lance jamais plus de tâches que la limite', async () => {
    const { queue, add, of } = setup(3);
    add('a', 'b', 'c', 'd', 'e');
    await flush();
    expect(queue.runningCount).toBe(3);
    expect(queue.pendingCount).toBe(2);
    expect(of('start')).toEqual(['a', 'b', 'c']);
  });

  it('démarre la suivante dès qu’une tâche se termine', async () => {
    const { tasks, add, of } = setup(2);
    add('a', 'b', 'c');
    await flush();
    tasks.get('a')?.resolve('ok-a');
    await flush();
    expect(of('success')).toEqual(['a']);
    expect(of('start')).toEqual(['a', 'b', 'c']);
  });

  it('continue quand une tâche échoue', async () => {
    const { tasks, add, of, events } = setup(1);
    add('a', 'b');
    await flush();
    tasks.get('a')?.reject(new Error('fichier corrompu'));
    await flush();
    tasks.get('b')?.resolve('ok');
    await flush();
    expect(of('error')).toEqual(['a']);
    expect(of('success')).toEqual(['b']);
    expect(events.at(-1)).toEqual({ type: 'idle' });
  });

  it('pause et reprise', async () => {
    const { queue, tasks, add, of } = setup(1);
    add('a', 'b');
    await flush();
    queue.pause();
    tasks.get('a')?.resolve('ok');
    await flush();
    // La tâche en cours se termine, mais la suivante ne démarre pas.
    expect(of('start')).toEqual(['a']);
    expect(queue.isPaused).toBe(true);
    queue.resume();
    await flush();
    expect(of('start')).toEqual(['a', 'b']);
  });

  it('annule une tâche en attente ou en cours', async () => {
    const { queue, signals, add, of } = setup(1);
    add('a', 'b', 'c');
    await flush();
    expect(queue.cancel('b')).toBe(true);
    expect(queue.cancel('a')).toBe(true);
    expect(signals.get('a')?.aborted).toBe(true);
    await flush();
    expect(of('cancel').sort()).toEqual(['a', 'b']);
    expect(of('start')).toEqual(['a', 'c']);
    expect(queue.cancel('inconnu')).toBe(false);
  });

  it('annule tout', async () => {
    const { queue, add, of, events } = setup(2);
    add('a', 'b', 'c', 'd');
    await flush();
    queue.cancelAll();
    await flush();
    expect(of('cancel').sort()).toEqual(['a', 'b', 'c', 'd']);
    expect(of('success')).toEqual([]);
    expect(queue.isIdle).toBe(true);
    expect(events.at(-1)).toEqual({ type: 'idle' });
  });

  it('survit à une erreur synchrone du runner et d’un écouteur', async () => {
    const events: string[] = [];
    const queue = new TaskQueue<number, number>(
      (n) => {
        if (n === 1) throw new Error('boum');
        return Promise.resolve(n);
      },
      2,
      (e) => {
        events.push(e.type);
        if (e.type === 'start') throw new Error('écouteur cassé');
      },
    );
    queue.add('1', 1);
    queue.add('2', 2);
    await flush();
    await flush();
    expect(events).toContain('error');
    expect(events).toContain('success');
  });

  it('peut changer le parallélisme en cours de route', async () => {
    const { queue, add } = setup(1);
    add('a', 'b', 'c');
    await flush();
    queue.setConcurrency(3);
    await flush();
    expect(queue.runningCount).toBe(3);
  });
});
