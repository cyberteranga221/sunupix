/**
 * Chaîne de conversion d'UNE image : décodage → redimensionnement → encodage → métadonnées.
 *
 * Ce code tourne normalement dans un Web Worker (OffscreenCanvas). Il fonctionne aussi
 * sur le thread principal avec un <canvas> classique, en repli pour les vieux navigateurs.
 *
 * Mémoire : chaque ressource lourde (ImageBitmap, canvas, pixels) est libérée dans un
 * `finally`, même en cas d'erreur, pour pouvoir enchaîner 400 photos sans fuite.
 */
import { ENGINE, RESIZE_PRESETS } from '../config';
import { computeTargetSize } from './dimensions';
import { ConversionError, toErrorCode } from './errors';
import { extractJpegExif, insertExifIntoJpeg, readOrientation, sanitizeExif } from './exif';
import { detectHeifColorSpace, extractHeifExif } from './heif';
import { applyOrientation, browserAppliesOrientation, swapsDimensions } from './orientation';
import {
  MIME,
  type ConvertJob,
  type ConvertOptions,
  type ConvertOutput,
  type WarningCode,
} from './types';

type AnyCanvas = OffscreenCanvas | HTMLCanvasElement;
type Ctx2D = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

/** Octets lus en tête de JPEG pour trouver l'EXIF (le segment APP1 fait au plus 64 Ko). */
const EXIF_SCAN_BYTES = 256 * 1024;

/** Une image décodée, prête à être dessinée. Dimensions = dimensions affichées (orientées). */
interface Source {
  width: number;
  height: number;
  hasAlpha: boolean;
  colorSpace: PredefinedColorSpace;
  draw(ctx: Ctx2D, width: number, height: number): Promise<void>;
  close(): void;
}

function createCanvas(width: number, height: number): AnyCanvas {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function encode(canvas: AnyCanvas, type: string, quality: number): Promise<Blob | null> {
  if ('convertToBlob' in canvas) return canvas.convertToBlob({ type, quality });
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Libère la mémoire d'un canvas (le navigateur ne le fait pas toujours tout de suite). */
function releaseCanvas(canvas: AnyCanvas | null) {
  if (!canvas) return;
  canvas.width = 0;
  canvas.height = 0;
}

let p3Supported: boolean | null = null;
function supportsP3Canvas(): boolean {
  if (p3Supported === null) {
    try {
      const ctx = createCanvas(1, 1).getContext('2d', { colorSpace: 'display-p3' }) as Ctx2D | null;
      // Un contexte P3 renvoie des ImageData en P3 ; sinon le navigateur l'ignore (Firefox).
      p3Supported = ctx?.getImageData(0, 0, 1, 1).colorSpace === 'display-p3';
    } catch {
      p3Supported = false;
    }
  }
  return p3Supported;
}

function maxSideFor(options: ConvertOptions): number | null {
  if (options.resize === 'custom') return Math.max(16, Math.round(options.customMaxSide));
  return RESIZE_PRESETS[options.resize];
}

/** Source HEIC : pixels RGBA fournis par libheif. */
async function heicSource(bytes: Uint8Array): Promise<Source> {
  const colorSpace = supportsP3Canvas() ? detectHeifColorSpace(bytes) : 'srgb';
  // Import paresseux : libheif n'est chargé qu'au premier HEIC.
  const { decodeHeic } = await import('./decoders/heic');
  let { image, hasAlpha } = await decodeHeic(bytes, colorSpace);
  return {
    width: image.width,
    height: image.height,
    hasAlpha,
    colorSpace,
    async draw(ctx, width, height) {
      if (!image) throw new ConversionError('unknown', 'image déjà libérée');
      if (width === image.width && height === image.height && !hasAlpha) {
        ctx.putImageData(image, 0, 0);
        return;
      }
      const bitmap = await createImageBitmap(image);
      try {
        ctx.drawImage(bitmap, 0, 0, width, height);
      } finally {
        bitmap.close();
      }
    },
    close() {
      // Lâche la référence aux pixels (souvent plusieurs dizaines de Mo).
      image = undefined as unknown as ImageData;
      hasAlpha = false;
    },
  };
}

/** Source native : le navigateur sait décoder (JPEG, PNG, WebP, AVIF, GIF, BMP). */
async function nativeSource(file: Blob, orientation: number): Promise<Source> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch (error) {
    const code = toErrorCode(error);
    throw new ConversionError(code === 'out-of-memory' ? code : 'corrupt', String(error));
  }
  const swap = swapsDimensions(orientation);
  const rawWidth = bitmap.width;
  const rawHeight = bitmap.height;
  return {
    width: swap ? rawHeight : rawWidth,
    height: swap ? rawWidth : rawHeight,
    hasAlpha: true,
    colorSpace: 'srgb',
    async draw(ctx, width, height) {
      ctx.save();
      // Mise à l'échelle vers la taille cible, puis rotation éventuelle.
      ctx.scale(width / (swap ? rawHeight : rawWidth), height / (swap ? rawWidth : rawHeight));
      applyOrientation(ctx, orientation, rawWidth, rawHeight);
      ctx.drawImage(bitmap, 0, 0);
      ctx.restore();
    },
    close() {
      bitmap.close();
    },
  };
}

/** Dessine et encode, en réduisant la taille si le navigateur refuse un canvas trop grand. */
async function render(
  source: Source,
  options: ConvertOptions,
  maxArea: number,
): Promise<{ blob: Blob; canvas: AnyCanvas; width: number; height: number; reduced: boolean }> {
  const mime = MIME[options.format];
  let { width, height, limitedByDevice } = computeTargetSize(
    source.width,
    source.height,
    maxSideFor(options),
    maxArea,
    ENGINE.maxCanvasSide,
  );
  for (let attempt = 0; ; attempt++) {
    let canvas: AnyCanvas | null = null;
    try {
      canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d', {
        alpha: options.format !== 'jpeg',
        colorSpace: source.colorSpace,
      }) as Ctx2D | null;
      if (!ctx) throw new ConversionError('canvas-too-large');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if (options.format === 'jpeg') {
        // Le JPEG n'a pas de transparence : fond blanc plutôt que noir.
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }
      await source.draw(ctx, width, height);
      const blob = await encode(canvas, mime, options.quality);
      if (!blob || blob.size === 0) throw new ConversionError('canvas-too-large');
      // Safari ne sait pas encoder en WebP : il renvoie silencieusement du PNG.
      if (blob.type !== mime) throw new ConversionError('encode-unsupported');
      return { blob, canvas, width, height, reduced: limitedByDevice };
    } catch (error) {
      releaseCanvas(canvas);
      const code = toErrorCode(error);
      const retryable = code === 'canvas-too-large' || code === 'out-of-memory';
      if (!retryable || attempt >= 3 || width * height < 1_000_000) {
        throw error instanceof ConversionError ? error : new ConversionError(code, String(error));
      }
      // Repli : on réduit d'environ 50 % en surface et on réessaie.
      width = Math.floor(width * 0.7);
      height = Math.floor(height * 0.7);
      limitedByDevice = true;
    }
  }
}

async function makeThumbnail(canvas: AnyCanvas): Promise<Blob | null> {
  const scale = ENGINE.thumbnailSize / Math.max(canvas.width, canvas.height);
  const width = Math.max(1, Math.round(canvas.width * Math.min(1, scale)));
  const height = Math.max(1, Math.round(canvas.height * Math.min(1, scale)));
  const thumb = createCanvas(width, height);
  try {
    const ctx = thumb.getContext('2d') as Ctx2D | null;
    if (!ctx) return null;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, width, height);
    return await encode(thumb, 'image/jpeg', 0.7);
  } catch {
    return null; // une miniature ratée n'empêche pas la conversion
  } finally {
    releaseCanvas(thumb);
  }
}

/** Convertit une image. Lève une ConversionError en cas d'échec. */
export async function convertImage(job: ConvertJob): Promise<ConvertOutput> {
  const { file, inputFormat, options } = job;
  const warnings: WarningCode[] = [];
  const keepMetadata = options.metadata !== 'strip';
  const writeExif = keepMetadata && options.format === 'jpeg';
  if (keepMetadata && options.format !== 'jpeg') warnings.push('metadata-not-kept');

  let exif: Uint8Array | null = null;
  let source: Source | null = null;
  let canvas: AnyCanvas | null = null;
  try {
    if (inputFormat === 'heic') {
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (writeExif) exif = extractHeifExif(bytes);
      source = await heicSource(bytes);
    } else {
      let orientation = 1;
      const autoOrient = await browserAppliesOrientation();
      if (inputFormat === 'jpeg' && (writeExif || !autoOrient)) {
        const head = new Uint8Array(await file.slice(0, EXIF_SCAN_BYTES).arrayBuffer());
        const tiff = extractJpegExif(head);
        if (tiff && writeExif) exif = tiff;
        if (tiff && !autoOrient) orientation = readOrientation(tiff);
      }
      source = await nativeSource(file, orientation);
    }

    const rendered = await render(source, options, job.maxArea);
    canvas = rendered.canvas;
    source.close();
    source = null;
    if (rendered.reduced) warnings.push('downscaled-for-device');

    const thumbnail = await makeThumbnail(canvas);

    let blob = rendered.blob;
    if (exif) {
      const clean = sanitizeExif(exif, {
        stripGps: options.metadata === 'keep-no-gps',
        width: rendered.width,
        height: rendered.height,
      });
      if (clean) {
        const jpeg = new Uint8Array(await blob.arrayBuffer());
        blob = new Blob([insertExifIntoJpeg(jpeg, clean) as Uint8Array<ArrayBuffer>], {
          type: blob.type,
        });
      }
    }
    return { blob, width: rendered.width, height: rendered.height, thumbnail, warnings };
  } finally {
    source?.close();
    releaseCanvas(canvas);
  }
}
