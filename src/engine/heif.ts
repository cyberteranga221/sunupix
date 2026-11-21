/**
 * Lecture minimale de la structure d'un fichier HEIC/HEIF (format ISOBMFF, « boîtes »)
 * pour récupérer ce que le décodeur ne fournit pas : le bloc EXIF et l'espace colorimétrique.
 */

interface Box {
  type: string;
  /** Début du contenu (après l'en-tête). */
  content: number;
  end: number;
}

function* readBoxes(view: DataView, start: number, end: number): Generator<Box> {
  let offset = start;
  while (offset + 8 <= end) {
    let size = view.getUint32(offset);
    const type = fourcc(view, offset + 4);
    let header = 8;
    if (size === 1) {
      if (offset + 16 > end) return;
      size = Number(view.getBigUint64(offset + 8));
      header = 16;
    } else if (size === 0) {
      size = end - offset;
    }
    if (size < header || offset + size > end) return;
    yield { type, content: offset + header, end: offset + size };
    offset += size;
  }
}

function fourcc(view: DataView, offset: number): string {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3),
  );
}

function child(view: DataView, parent: Box, type: string, fullBox = false): Box | undefined {
  for (const box of readBoxes(view, parent.content + (fullBox ? 4 : 0), parent.end)) {
    if (box.type === type) return box;
  }
  return undefined;
}

function readUint(view: DataView, offset: number, size: number): number {
  if (size === 0) return 0;
  if (size === 4) return view.getUint32(offset);
  if (size === 8) return Number(view.getBigUint64(offset));
  if (size === 2) return view.getUint16(offset);
  throw new Error('taille iloc invalide');
}

function findMeta(view: DataView): Box | undefined {
  for (const box of readBoxes(view, 0, view.byteLength)) if (box.type === 'meta') return box;
  return undefined;
}

/** Identifiants des éléments de type `type` (boîte iinf). */
function itemsOfType(view: DataView, iinf: Box, type: string): number[] {
  const version = view.getUint8(iinf.content);
  const entriesStart = iinf.content + 4 + (version === 0 ? 2 : 4);
  const ids: number[] = [];
  for (const infe of readBoxes(view, entriesStart, iinf.end)) {
    if (infe.type !== 'infe') continue;
    const v = view.getUint8(infe.content);
    if (v < 2) continue;
    const idSize = v === 2 ? 2 : 4;
    const id = idSize === 2 ? view.getUint16(infe.content + 4) : view.getUint32(infe.content + 4);
    const itemType = fourcc(view, infe.content + 4 + idSize + 2);
    if (itemType === type) ids.push(id);
  }
  return ids;
}

/** Données d'un élément (boîte iloc, méthode de construction 0 = position dans le fichier). */
function itemData(view: DataView, iloc: Box, wanted: number): Uint8Array | null {
  let o = iloc.content;
  const version = view.getUint8(o);
  o += 4;
  const sizes1 = view.getUint8(o);
  const sizes2 = view.getUint8(o + 1);
  o += 2;
  const offsetSize = sizes1 >> 4;
  const lengthSize = sizes1 & 0x0f;
  const baseOffsetSize = sizes2 >> 4;
  const indexSize = version === 1 || version === 2 ? sizes2 & 0x0f : 0;
  const count = version < 2 ? view.getUint16(o) : view.getUint32(o);
  o += version < 2 ? 2 : 4;

  for (let i = 0; i < count; i++) {
    const id = version < 2 ? view.getUint16(o) : view.getUint32(o);
    o += version < 2 ? 2 : 4;
    let method = 0;
    if (version === 1 || version === 2) {
      method = view.getUint16(o) & 0x0f;
      o += 2;
    }
    o += 2; // data_reference_index
    const base = readUint(view, o, baseOffsetSize);
    o += baseOffsetSize;
    const extents = view.getUint16(o);
    o += 2;
    const parts: Array<[number, number]> = [];
    for (let e = 0; e < extents; e++) {
      o += indexSize;
      const offset = readUint(view, o, offsetSize);
      o += offsetSize;
      const length = readUint(view, o, lengthSize);
      o += lengthSize;
      parts.push([base + offset, length]);
    }
    if (id !== wanted) continue;
    if (method !== 0) return null;
    const total = parts.reduce((sum, [, len]) => sum + len, 0);
    const out = new Uint8Array(total);
    let w = 0;
    for (const [start, len] of parts) {
      if (start + len > view.byteLength) return null;
      out.set(new Uint8Array(view.buffer, view.byteOffset + start, len), w);
      w += len;
    }
    return out;
  }
  return null;
}

/** Extrait le bloc TIFF/EXIF d'un HEIC, ou null. */
export function extractHeifExif(bytes: Uint8Array): Uint8Array | null {
  try {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const meta = findMeta(view);
    if (!meta) return null;
    const iinf = child(view, meta, 'iinf', true);
    const iloc = child(view, meta, 'iloc', true);
    if (!iinf || !iloc) return null;
    const [exifId] = itemsOfType(view, iinf, 'Exif');
    if (exifId === undefined) return null;
    const data = itemData(view, iloc, exifId);
    if (!data || data.length < 12) return null;
    // Les 4 premiers octets indiquent où commence l'en-tête TIFF.
    const tiffOffset = 4 + new DataView(data.buffer, data.byteOffset).getUint32(0);
    const tiff = data.subarray(tiffOffset);
    const order = String.fromCharCode(tiff[0] ?? 0, tiff[1] ?? 0);
    return order === 'II' || order === 'MM' ? tiff.slice() : null;
  } catch {
    return null;
  }
}

/**
 * Espace colorimétrique déclaré dans le HEIC (boîtes « colr »).
 * Les iPhone produisent du Display P3.
 */
export function detectHeifColorSpace(bytes: Uint8Array): 'display-p3' | 'srgb' {
  try {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const meta = findMeta(view);
    const iprp = meta && child(view, meta, 'iprp', true);
    const ipco = iprp && child(view, iprp, 'ipco');
    if (!ipco) return 'srgb';
    for (const box of readBoxes(view, ipco.content, ipco.end)) {
      if (box.type !== 'colr') continue;
      const kind = fourcc(view, box.content);
      if (kind === 'nclx' && view.getUint16(box.content + 4) === 12) return 'display-p3';
      if (kind === 'prof' || kind === 'rICC') {
        const icc = new Uint8Array(
          view.buffer,
          view.byteOffset + box.content + 4,
          box.end - box.content - 4,
        );
        if (iccMentionsP3(icc)) return 'display-p3';
      }
    }
  } catch {
    /* structure inattendue : on suppose sRGB */
  }
  return 'srgb';
}

/** Lit la description du profil ICC (balise « desc ») et y cherche « P3 ». */
function iccMentionsP3(icc: Uint8Array): boolean {
  if (icc.length < 132) return false;
  const view = new DataView(icc.buffer, icc.byteOffset, icc.byteLength);
  const tagCount = view.getUint32(128);
  for (let i = 0; i < tagCount && 132 + i * 12 + 12 <= icc.length; i++) {
    const entry = 132 + i * 12;
    if (fourcc(view, entry) !== 'desc') continue;
    const offset = view.getUint32(entry + 4);
    const size = view.getUint32(entry + 8);
    const tag = icc.subarray(offset, Math.min(icc.length, offset + size));
    // Texte ASCII (ICC v2, « desc ») ou UTF-16BE (ICC v4, « mluc ») : on retire les octets nuls.
    const text = String.fromCharCode(...tag.filter((b) => b !== 0));
    return /P3/.test(text);
  }
  return false;
}
