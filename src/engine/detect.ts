import type { InputFormat } from './types';

/** Nombre d'octets à lire en tête de fichier pour reconnaître le format. */
export const SNIFF_BYTES = 64;

const ascii = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.subarray(start, start + length));

/** Marques ISOBMFF (« ftyp ») qui désignent une image HEIC/HEIF. */
const HEIF_BRANDS = new Set([
  'heic',
  'heix',
  'hevc',
  'hevx',
  'heim',
  'heis',
  'hevm',
  'hevs',
  'mif1',
  'msf1',
]);
const AVIF_BRANDS = new Set(['avif', 'avis']);

/**
 * Reconnaît le format réel d'une image à partir de ses premiers octets
 * (« nombres magiques »), sans se fier à l'extension qui peut mentir.
 */
export function detectFormat(head: Uint8Array): InputFormat | null {
  if (head.length < 12) return null;
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpeg';
  if (head[0] === 0x89 && ascii(head, 1, 3) === 'PNG') return 'png';
  if (ascii(head, 0, 4) === 'GIF8') return 'gif';
  if (ascii(head, 0, 2) === 'BM') return 'bmp';
  if (ascii(head, 0, 4) === 'RIFF' && ascii(head, 8, 4) === 'WEBP') return 'webp';
  if (ascii(head, 4, 4) === 'ftyp') {
    // Boîte ftyp : marque principale (octets 8-11) puis marques compatibles.
    const view = new DataView(head.buffer, head.byteOffset, head.byteLength);
    const boxSize = Math.min(view.getUint32(0), head.length);
    const brands = [ascii(head, 8, 4)];
    for (let offset = 16; offset + 4 <= boxSize; offset += 4) brands.push(ascii(head, offset, 4));
    // AVIF prioritaire : un AVIF déclare souvent aussi « mif1 ».
    if (brands.some((b) => AVIF_BRANDS.has(b))) return 'avif';
    if (brands.some((b) => HEIF_BRANDS.has(b))) return 'heic';
  }
  return null;
}

const EXTENSIONS: Record<string, InputFormat> = {
  heic: 'heic',
  heif: 'heic',
  hif: 'heic',
  jpg: 'jpeg',
  jpeg: 'jpeg',
  jfif: 'jpeg',
  png: 'png',
  webp: 'webp',
  avif: 'avif',
  gif: 'gif',
  bmp: 'bmp',
};

/** Format suggéré par l'extension (sert seulement à distinguer « corrompu » de « non supporté »). */
export function formatFromName(name: string): InputFormat | null {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSIONS[ext] ?? null;
}

/** Attribut `accept` des champs de fichier : extensions + types MIME (galeries iPhone/Android). */
export const ACCEPT_ATTRIBUTE = [
  'image/*',
  '.heic',
  '.heif',
  '.hif',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
  '.bmp',
].join(',');
