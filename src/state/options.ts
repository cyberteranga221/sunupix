import { ENGINE } from '../config';
import type { ConvertOptions, MetadataMode, OutputFormat, ResizeMode } from '../engine/types';

const STORAGE_KEY = 'sunupix:options:v1';

export const DEFAULT_OPTIONS: ConvertOptions = {
  format: 'jpeg',
  quality: ENGINE.defaultQuality,
  resize: 'original',
  customMaxSide: 2048,
  metadata: 'strip',
};

const FORMATS: readonly OutputFormat[] = ['jpeg', 'png', 'webp'];
const RESIZES: readonly ResizeMode[] = ['original', '4k', '1080p', '720p', 'custom'];
const METADATA: readonly MetadataMode[] = ['strip', 'keep', 'keep-no-gps'];

/** Valide des options venant du stockage local (qui peut contenir n'importe quoi). */
export function parseOptions(raw: unknown): ConvertOptions {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Partial<
    Record<keyof ConvertOptions, unknown>
  >;
  const pick = <T>(value: unknown, allowed: readonly T[], fallback: T): T =>
    allowed.includes(value as T) ? (value as T) : fallback;
  const num = (value: unknown, min: number, max: number, fallback: number) =>
    typeof value === 'number' && Number.isFinite(value)
      ? Math.min(max, Math.max(min, value))
      : fallback;
  return {
    format: pick(o.format, FORMATS, DEFAULT_OPTIONS.format),
    quality: num(o.quality, 0.4, 1, DEFAULT_OPTIONS.quality),
    resize: pick(o.resize, RESIZES, DEFAULT_OPTIONS.resize),
    customMaxSide: Math.round(num(o.customMaxSide, 16, 16384, DEFAULT_OPTIONS.customMaxSide)),
    metadata: pick(o.metadata, METADATA, DEFAULT_OPTIONS.metadata),
  };
}

/** Options mémorisées d'une visite à l'autre (stockage local, jamais envoyé nulle part). */
export function loadOptions(): ConvertOptions {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parseOptions(JSON.parse(raw)) : DEFAULT_OPTIONS;
  } catch {
    return DEFAULT_OPTIONS;
  }
}

export function saveOptions(options: ConvertOptions): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  } catch {
    /* navigation privée ou stockage plein : sans importance */
  }
}
