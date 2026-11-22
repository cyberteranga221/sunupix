/**
 * Statistiques de visite respectueuses de la vie privée (Vercel Web Analytics) :
 * sans cookie, sans identifiant, désactivables par l'utilisateur.
 * Rien n'est chargé si FEATURES.analytics vaut false (réglage par défaut).
 */
import { FEATURES } from './config';

const STORAGE_KEY = 'sunupix:analytics';
const listeners = new Set<() => void>();
let started = false;

/** Préférence de l'utilisateur : vrai sauf s'il a refusé. */
export function analyticsConsent(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setAnalyticsConsent(allowed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, allowed ? 'on' : 'off');
  } catch {
    /* sans importance */
  }
  for (const listener of listeners) listener();
  if (allowed) void startAnalytics();
}

export function subscribeAnalytics(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Charge le script de statistiques si le site l'active et si l'utilisateur ne l'a pas refusé. */
export async function startAnalytics(): Promise<void> {
  if (started || !FEATURES.analytics || !analyticsConsent() || import.meta.env.DEV) return;
  started = true;
  const { inject } = await import('@vercel/analytics');
  inject({ mode: 'production' });
}
