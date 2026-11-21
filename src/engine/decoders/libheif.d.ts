// Déclarations minimales pour libheif-js (seules les fonctions utilisées par SunuPix).
declare module 'libheif-js/libheif-wasm/libheif.js' {
  export interface HeifError {
    code: unknown;
    message: string;
  }
  export interface HeifImage {
    get_width(): number;
    get_height(): number;
    has_alpha_channel(): boolean;
    display(target: ImageData, callback: (result: ImageData | null) => void): void;
    free(): void;
  }
  export interface LibHeif {
    heif_context_alloc(): unknown;
    heif_context_free(context: unknown): void;
    heif_context_read_from_memory(context: unknown, data: Uint8Array): HeifError;
    heif_js_context_get_primary_image_handle(context: unknown): (object & { code?: number }) | null;
    HeifImage: new (handle: unknown) => HeifImage;
    HEAPU8: Uint8Array;
    heif_error_code: { heif_error_Ok: unknown };
  }
  export interface LibHeifOptions {
    wasmBinary: ArrayBuffer;
    onRuntimeInitialized?: () => void;
    onAbort?: (reason: unknown) => void;
    print?: (text: string) => void;
    printErr?: (text: string) => void;
  }
  const factory: (options: LibHeifOptions) => LibHeif;
  export default factory;
}
