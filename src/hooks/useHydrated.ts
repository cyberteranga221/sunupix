import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;

/**
 * Faux pendant le pré-rendu et la première hydratation, vrai ensuite.
 * Permet de lire le navigateur (stockage local, capacités) sans écart d'hydratation.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
