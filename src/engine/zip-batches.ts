/**
 * Découpe une liste de fichiers en lots pour les ZIP :
 * au plus `maxFiles` fichiers et `maxBytes` octets par archive.
 * L'ordre est conservé. Un fichier plus gros que `maxBytes` forme un lot à lui seul.
 */
export function splitIntoBatches<T extends { size: number }>(
  items: readonly T[],
  maxFiles: number,
  maxBytes: number,
): T[][] {
  const batches: T[][] = [];
  let current: T[] = [];
  let bytes = 0;
  for (const item of items) {
    const full = current.length >= maxFiles || (current.length > 0 && bytes + item.size > maxBytes);
    if (full) {
      batches.push(current);
      current = [];
      bytes = 0;
    }
    current.push(item);
    bytes += item.size;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

/** Nom d'archive : « sunupix-2026-11-21.zip » ou « sunupix-2026-11-21-partie-2-sur-4.zip ». */
export function zipName(date: Date, index: number, total: number): string {
  const day = date.toISOString().slice(0, 10);
  return total > 1 ? `sunupix-${day}-partie-${index + 1}-sur-${total}.zip` : `sunupix-${day}.zip`;
}
