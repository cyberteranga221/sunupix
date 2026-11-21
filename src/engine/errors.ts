import type { ErrorCode } from './types';

/** Erreur de conversion typée : le code est traduit en message clair dans l'interface. */
export class ConversionError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, detail?: string) {
    super(detail ?? code);
    this.name = 'ConversionError';
    this.code = code;
  }
}

/**
 * Transforme n'importe quelle erreur (y compris celles levées par le navigateur)
 * en code d'erreur compréhensible.
 */
export function toErrorCode(error: unknown): ErrorCode {
  if (error instanceof ConversionError) return error.code;
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: unknown }).code;
    if (typeof code === 'string' && isErrorCode(code)) return code;
  }
  const name = error instanceof Error ? error.name : '';
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  if (name === 'RangeError' || /memory|allocation|out of memory|oom/.test(message)) {
    return 'out-of-memory';
  }
  if (
    name === 'EncodingError' ||
    name === 'InvalidStateError' ||
    /decode|corrupt|invalid/.test(message)
  ) {
    return 'corrupt';
  }
  return 'unknown';
}

const CODES: readonly ErrorCode[] = [
  'unsupported',
  'corrupt',
  'too-large',
  'out-of-memory',
  'canvas-too-large',
  'encode-unsupported',
  'decoder-unavailable',
  'save-failed',
  'unknown',
];

function isErrorCode(value: string): value is ErrorCode {
  return (CODES as readonly string[]).includes(value);
}
