/** Types partagés par le moteur de conversion (thread principal et workers). */

export type InputFormat = 'heic' | 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'bmp';
export type OutputFormat = 'jpeg' | 'png' | 'webp';

/** Métadonnées : tout supprimer (défaut), tout garder, ou garder sauf la position GPS. */
export type MetadataMode = 'strip' | 'keep' | 'keep-no-gps';

export type ResizeMode = 'original' | '4k' | '1080p' | '720p' | 'custom';

export interface ConvertOptions {
  format: OutputFormat;
  /** Qualité de 0 à 1 (JPEG et WebP uniquement). */
  quality: number;
  resize: ResizeMode;
  /** Côté le plus long en pixels, si `resize === 'custom'`. */
  customMaxSide: number;
  metadata: MetadataMode;
}

export type ErrorCode =
  | 'unsupported'
  | 'corrupt'
  | 'too-large'
  | 'out-of-memory'
  | 'canvas-too-large'
  | 'encode-unsupported'
  | 'decoder-unavailable'
  | 'save-failed'
  | 'unknown';

/** Avertissements non bloquants affichés sur la ligne du fichier. */
export type WarningCode = 'downscaled-for-device' | 'metadata-not-kept';

export const MIME: Record<OutputFormat, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export const EXTENSION: Record<OutputFormat, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
};

/** Travail envoyé à un worker. */
export interface ConvertJob {
  file: Blob;
  inputFormat: InputFormat;
  options: ConvertOptions;
  /** Surface de canvas maximale autorisée sur cet appareil. */
  maxArea: number;
}

export interface ConvertOutput {
  blob: Blob;
  width: number;
  height: number;
  /** Miniature JPEG légère (≈ 96 px), ou null. */
  thumbnail: Blob | null;
  warnings: WarningCode[];
}
