import type { Dictionary } from './fr';

/** « 3,2 Mo » selon la langue. */
export function formatBytes(bytes: number, t: Dictionary): string {
  const units = t.units.bytes;
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  const digits = unit === 0 || value >= 100 ? 0 : 1;
  return `${new Intl.NumberFormat(t.locale, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value)} ${units[unit]}`;
}

/** Durée lisible : « 45 s », « 3 min ». */
export function formatDuration(ms: number, t: Dictionary): string {
  const seconds = Math.max(1, Math.round(ms / 1000));
  if (seconds < 60) return t.progress.seconds(seconds);
  return t.progress.minutes(Math.round(seconds / 60));
}
