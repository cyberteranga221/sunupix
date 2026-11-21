/**
 * Lecture et réécriture minimales des métadonnées EXIF (format TIFF).
 *
 * On ne réécrit jamais toute la structure : on copie le bloc d'origine puis on
 * modifie quelques octets en place (orientation, GPS, vignette), ce qui garde
 * le code court et robuste. Toute structure inattendue → on renonce (null).
 */

const TAG_ORIENTATION = 0x0112;
const TAG_EXIF_IFD = 0x8769;
const TAG_GPS_IFD = 0x8825;
const TAG_PIXEL_X = 0xa002;
const TAG_PIXEL_Y = 0xa003;

/** Taille en octets de chaque type TIFF. */
const TYPE_SIZE: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 4,
  5: 8,
  6: 1,
  7: 1,
  8: 2,
  9: 4,
  10: 8,
  11: 4,
  12: 8,
  13: 4,
};

/** Taille maximale d'un segment APP1 JPEG (longueur sur 16 bits). */
const MAX_APP1_PAYLOAD = 0xffff - 2 - 6;

class Tiff {
  readonly view: DataView;
  readonly little: boolean;

  constructor(readonly bytes: Uint8Array) {
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const order = this.view.getUint16(0);
    if (order !== 0x4949 && order !== 0x4d4d) throw new Error('en-tête TIFF invalide');
    this.little = order === 0x4949;
    if (this.u16(2) !== 42) throw new Error('en-tête TIFF invalide');
  }

  u16(o: number) {
    return this.view.getUint16(o, this.little);
  }
  u32(o: number) {
    return this.view.getUint32(o, this.little);
  }
  setU16(o: number, v: number) {
    this.view.setUint16(o, v, this.little);
  }
  setU32(o: number, v: number) {
    this.view.setUint32(o, v, this.little);
  }

  get ifd0(): number {
    return this.u32(4);
  }

  /** Position de l'entrée `tag` dans l'IFD situé à `ifd`, ou -1. */
  findEntry(ifd: number, tag: number): number {
    if (ifd <= 0 || ifd + 2 > this.bytes.length) return -1;
    const count = this.u16(ifd);
    for (let i = 0; i < count; i++) {
      const entry = ifd + 2 + i * 12;
      if (entry + 12 > this.bytes.length) return -1;
      if (this.u16(entry) === tag) return entry;
    }
    return -1;
  }

  /** Écrase une entrée par des zéros (et ses données hors ligne). */
  wipeEntry(entry: number): void {
    const size = (TYPE_SIZE[this.u16(entry + 2)] ?? 1) * this.u32(entry + 4);
    if (size > 4) {
      const offset = this.u32(entry + 8);
      if (offset + size <= this.bytes.length) this.bytes.fill(0, offset, offset + size);
    }
    this.bytes.fill(0, entry, entry + 12);
  }
}

/** Extrait le bloc TIFF/EXIF d'un fichier JPEG (segment APP1 « Exif »). */
export function extractJpegExif(jpeg: Uint8Array): Uint8Array | null {
  if (jpeg[0] !== 0xff || jpeg[1] !== 0xd8) return null;
  const view = new DataView(jpeg.buffer, jpeg.byteOffset, jpeg.byteLength);
  let offset = 2;
  while (offset + 4 <= jpeg.length) {
    if (jpeg[offset] !== 0xff) return null;
    const marker = jpeg[offset + 1];
    if (marker === 0xda || marker === 0xd9) return null; // début des données image
    const length = view.getUint16(offset + 2);
    if (marker === 0xe1 && length > 8) {
      const id = String.fromCharCode(...jpeg.subarray(offset + 4, offset + 10));
      if (id === 'Exif\0\0') return jpeg.slice(offset + 10, offset + 2 + length);
    }
    offset += 2 + length;
  }
  return null;
}

/** Lit l'orientation EXIF (1 à 8). 1 = normale. */
export function readOrientation(tiffBytes: Uint8Array): number {
  try {
    const tiff = new Tiff(tiffBytes);
    const entry = tiff.findEntry(tiff.ifd0, TAG_ORIENTATION);
    if (entry < 0) return 1;
    const value = tiff.u16(entry + 8);
    return value >= 1 && value <= 8 ? value : 1;
  } catch {
    return 1;
  }
}

export interface SanitizeOptions {
  stripGps: boolean;
  width: number;
  height: number;
}

/**
 * Prépare un bloc EXIF pour l'image convertie :
 *  - orientation remise à 1 (les pixels sont déjà tournés) ;
 *  - dimensions mises à jour ;
 *  - vignette intégrée supprimée (elle ne correspond plus à l'image) ;
 *  - position GPS effacée si demandé.
 * Retourne une copie, ou null si le bloc est illisible ou trop gros.
 */
export function sanitizeExif(source: Uint8Array, options: SanitizeOptions): Uint8Array | null {
  if (source.length > MAX_APP1_PAYLOAD) return null;
  try {
    const tiff = new Tiff(source.slice());
    const ifd0 = tiff.ifd0;
    const count = tiff.u16(ifd0);

    const orientation = tiff.findEntry(ifd0, TAG_ORIENTATION);
    if (orientation >= 0) tiff.setU16(orientation + 8, 1);

    // Supprime le lien vers l'IFD1 (vignette).
    tiff.setU32(ifd0 + 2 + count * 12, 0);

    const exifEntry = tiff.findEntry(ifd0, TAG_EXIF_IFD);
    if (exifEntry >= 0) {
      const exifIfd = tiff.u32(exifEntry + 8);
      for (const [tag, value] of [
        [TAG_PIXEL_X, options.width],
        [TAG_PIXEL_Y, options.height],
      ] as const) {
        const entry = tiff.findEntry(exifIfd, tag);
        if (entry < 0) continue;
        const type = tiff.u16(entry + 2);
        if (type === 3) tiff.setU16(entry + 8, Math.min(value, 0xffff));
        else if (type === 4) tiff.setU32(entry + 8, value);
      }
    }

    if (options.stripGps) {
      const gpsEntry = tiff.findEntry(ifd0, TAG_GPS_IFD);
      if (gpsEntry >= 0) {
        const gpsIfd = tiff.u32(gpsEntry + 8);
        if (gpsIfd > 0 && gpsIfd + 2 <= tiff.bytes.length) {
          const n = tiff.u16(gpsIfd);
          for (let i = 0; i < n; i++) {
            const entry = gpsIfd + 2 + i * 12;
            if (entry + 12 <= tiff.bytes.length) tiff.wipeEntry(entry);
          }
          // IFD GPS vide : 0 entrée, puis « IFD suivant = 0 » (octets déjà à zéro).
          tiff.setU16(gpsIfd, 0);
          if (gpsIfd + 6 <= tiff.bytes.length) tiff.setU32(gpsIfd + 2, 0);
        }
      }
    }
    return tiff.bytes;
  } catch {
    return null;
  }
}

/** Vrai si le bloc EXIF contient des coordonnées GPS. */
export function hasGps(tiffBytes: Uint8Array): boolean {
  try {
    const tiff = new Tiff(tiffBytes);
    const entry = tiff.findEntry(tiff.ifd0, TAG_GPS_IFD);
    if (entry < 0) return false;
    const gpsIfd = tiff.u32(entry + 8);
    return gpsIfd > 0 && tiff.u16(gpsIfd) > 0;
  } catch {
    return false;
  }
}

/** Insère un bloc EXIF dans un JPEG produit par le navigateur (après SOI et APP0/JFIF). */
export function insertExifIntoJpeg(jpeg: Uint8Array, tiff: Uint8Array): Uint8Array {
  if (tiff.length > MAX_APP1_PAYLOAD || jpeg[0] !== 0xff || jpeg[1] !== 0xd8) return jpeg;
  let insertAt = 2;
  if (jpeg[2] === 0xff && jpeg[3] === 0xe0) {
    insertAt = 4 + ((jpeg[4] ?? 0) << 8) + (jpeg[5] ?? 0);
  }
  const segmentLength = 2 + 6 + tiff.length;
  const out = new Uint8Array(jpeg.length + 2 + segmentLength);
  out.set(jpeg.subarray(0, insertAt), 0);
  let o = insertAt;
  out[o++] = 0xff;
  out[o++] = 0xe1;
  out[o++] = segmentLength >> 8;
  out[o++] = segmentLength & 0xff;
  out.set([0x45, 0x78, 0x69, 0x66, 0, 0], o); // « Exif\0\0 »
  o += 6;
  out.set(tiff, o);
  o += tiff.length;
  out.set(jpeg.subarray(insertAt), o);
  return out;
}
