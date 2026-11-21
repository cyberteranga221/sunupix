import { useSyncExternalStore } from 'react';
import type { ConvertOptions } from '../engine/types';
import { DEFAULT_OPTIONS, getOptions, subscribeOptions } from './options';

/** Réglages de conversion partagés par toute la page (pré-rendu : valeurs par défaut). */
export function useOptions(): ConvertOptions {
  return useSyncExternalStore(subscribeOptions, getOptions, () => DEFAULT_OPTIONS);
}
