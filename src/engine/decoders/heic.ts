/**
 * Décodeur HEIC/HEIF basé sur libheif (WebAssembly, licence LGPL-3.0).
 *
 * Ce module n'est importé qu'à la demande, dans un worker, la première fois
 * qu'un fichier HEIC est rencontré : il ne pèse rien dans le bundle initial.
 * Le fichier .wasm (~1,4 Mo) est servi séparément et mis en cache par le navigateur.
 */
import type { LibHeif } from 'libheif-js/libheif-wasm/libheif.js';
import { ConversionError } from '../errors';

let loading: Promise<{ lib: LibHeif }> | null = null;

function loadLibheif(): Promise<{ lib: LibHeif }> {
  loading ??= (async () => {
    const [{ default: factory }, { default: wasmUrl }] = await Promise.all([
      import('libheif-js/libheif-wasm/libheif.js'),
      import('libheif-js/libheif-wasm/libheif.wasm?url'),
    ]);
    const response = await fetch(wasmUrl);
    if (!response.ok) throw new Error(`wasm ${response.status}`);
    const wasmBinary = await response.arrayBuffer();
    // On renvoie un objet enveloppe : le module Emscripten ne doit pas être « await-é » directement.
    return new Promise<{ lib: LibHeif }>((resolve, reject) => {
      // Avec `wasmBinary`, l'initialisation peut être synchrone : `lib` n'est pas encore
      // affecté quand le rappel s'exécute, d'où la micro-tâche.
      const lib = factory({
        wasmBinary,
        onRuntimeInitialized: () => queueMicrotask(() => resolve({ lib })),
        onAbort: reject,
        print: () => undefined,
        printErr: () => undefined,
      });
    });
  })().catch((error: unknown) => {
    loading = null; // nouvel essai possible (connexion revenue)
    throw new ConversionError('decoder-unavailable', String(error));
  });
  return loading;
}

/** Mémoire WebAssembly occupée par libheif (0 si non chargé). */
export async function heicHeapBytes(): Promise<number> {
  if (!loading) return 0;
  try {
    return (await loading).lib.HEAPU8.buffer.byteLength;
  } catch {
    return 0;
  }
}

function createImageData(width: number, height: number, colorSpace: PredefinedColorSpace) {
  try {
    return new ImageData(width, height, { colorSpace });
  } catch (error) {
    if (error instanceof RangeError) throw new ConversionError('out-of-memory');
    return new ImageData(width, height);
  }
}

export interface DecodedHeic {
  image: ImageData;
  hasAlpha: boolean;
}

/**
 * Décode l'image principale d'un HEIC en pixels RGBA déjà orientés
 * (libheif applique les transformations « irot »/« imir » du fichier).
 * Les Live Photos et rafales : seule l'image principale est décodée.
 */
export async function decodeHeic(
  bytes: Uint8Array,
  colorSpace: PredefinedColorSpace,
): Promise<DecodedHeic> {
  const { lib } = await loadLibheif();
  const context = lib.heif_context_alloc();
  if (!context) throw new ConversionError('out-of-memory');
  try {
    const error = lib.heif_context_read_from_memory(context, bytes);
    // `code` est une valeur d'énumération Embind : on la compare à la constante, pas à 0.
    if (error.code !== lib.heif_error_code.heif_error_Ok)
      throw new ConversionError('corrupt', error.message);
    const handle = lib.heif_js_context_get_primary_image_handle(context);
    if (!handle || handle.code) throw new ConversionError('corrupt', 'image principale absente');
    const heifImage = new lib.HeifImage(handle);
    try {
      const image = createImageData(heifImage.get_width(), heifImage.get_height(), colorSpace);
      await new Promise<void>((resolve, reject) => {
        heifImage.display(image, (result) =>
          result ? resolve() : reject(new ConversionError('corrupt', 'décodage HEVC impossible')),
        );
      });
      return { image, hasAlpha: heifImage.has_alpha_channel() };
    } finally {
      heifImage.free();
    }
  } finally {
    lib.heif_context_free(context);
  }
}
