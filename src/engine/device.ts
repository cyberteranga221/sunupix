import { ENGINE, LIMITS } from '../config';

export interface DeviceInfo {
  isIOS: boolean;
  cores: number;
  /** Mémoire vive approximative en Go (Chrome/Edge uniquement), sinon null. */
  memoryGB: number | null;
}

/** Informations sur l'appareil, lues sur le thread principal. */
export function readDeviceInfo(): DeviceInfo {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const isIOS =
    /iPhone|iPad|iPod/.test(nav.userAgent) ||
    (nav.userAgent.includes('Macintosh') && nav.maxTouchPoints > 1);
  return { isIOS, cores: nav.hardwareConcurrency || 2, memoryGB: nav.deviceMemory ?? null };
}

/**
 * Nombre de conversions simultanées : la moitié des cœurs, entre 2 et 4.
 * Limité à 2 sur iPhone/iPad et sur les appareils avec 4 Go de RAM ou moins.
 */
export function computeConcurrency(device: DeviceInfo): number {
  const byCores = Math.floor(device.cores / 2);
  let n = Math.min(LIMITS.maxConcurrency, Math.max(LIMITS.minConcurrency, byCores));
  if (device.isIOS || (device.memoryGB !== null && device.memoryGB <= 4)) {
    n = LIMITS.minConcurrency;
  }
  return n;
}

/** Surface de canvas maximale selon la plateforme. */
export function maxCanvasArea(device: DeviceInfo): number {
  return device.isIOS ? ENGINE.maxCanvasAreaIOS : ENGINE.maxCanvasAreaDefault;
}

/** Vrai si l'appareil semble juste en mémoire pour un gros lot. */
export function isLowMemory(device: DeviceInfo): boolean {
  return device.isIOS || (device.memoryGB !== null && device.memoryGB <= 4);
}
