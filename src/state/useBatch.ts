import { useSyncExternalStore } from 'react';
import { getBatchStore, type BatchSnapshot } from './batch';

const EMPTY: BatchSnapshot = {
  items: [],
  running: false,
  paused: false,
  run: null,
  overflow: 0,
  destination: null,
};

const noop = () => () => undefined;

/** Abonne un composant à l'état du lot. Rien n'est créé pendant le pré-rendu. */
export function useBatch(): BatchSnapshot {
  const isServer = typeof window === 'undefined';
  return useSyncExternalStore(
    isServer ? noop : getBatchStore().subscribe,
    isServer ? () => EMPTY : getBatchStore().getSnapshot,
    () => EMPTY,
  );
}
