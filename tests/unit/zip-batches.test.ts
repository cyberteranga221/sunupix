import { describe, expect, it } from 'vitest';
import { splitIntoBatches, zipName } from '../../src/engine/zip-batches';

const files = (sizes: number[]) => sizes.map((size, i) => ({ id: i, size }));

describe('découpage en ZIP', () => {
  it('respecte le nombre maximal de fichiers', () => {
    const batches = splitIntoBatches(files(Array(250).fill(1)), 100, 1e9);
    expect(batches.map((b) => b.length)).toEqual([100, 100, 50]);
  });

  it('respecte la taille maximale', () => {
    const batches = splitIntoBatches(files([300, 300, 300, 100]), 100, 600);
    expect(batches.map((b) => b.map((f) => f.id))).toEqual([
      [0, 1],
      [2, 3],
    ]);
  });

  it('isole un fichier plus gros que la limite', () => {
    const batches = splitIntoBatches(files([10, 900, 10]), 100, 500);
    expect(batches.map((b) => b.map((f) => f.id))).toEqual([[0], [1], [2]]);
  });

  it('renvoie une liste vide pour aucun fichier', () => {
    expect(splitIntoBatches([], 100, 500)).toEqual([]);
  });

  it('400 photos de 3 Mo donnent 4 ZIP', () => {
    const batches = splitIntoBatches(files(Array(400).fill(3e6)), 100, 500 * 1024 * 1024);
    expect(batches).toHaveLength(4);
  });

  it('nomme les archives', () => {
    const date = new Date('2026-11-21T10:00:00Z');
    expect(zipName(date, 0, 1)).toBe('sunupix-2026-11-21.zip');
    expect(zipName(date, 1, 4)).toBe('sunupix-2026-11-21-partie-2-sur-4.zip');
  });
});
