import { describe, expect, it } from 'vitest';
import {
  extractJpegExif,
  hasGps,
  insertExifIntoJpeg,
  readOrientation,
  sanitizeExif,
} from '../../src/engine/exif';
import { detectHeifColorSpace, extractHeifExif } from '../../src/engine/heif';
import { fixture } from './helpers';

const text = (bytes: Uint8Array) => String.fromCharCode(...bytes);

describe('EXIF des JPEG', () => {
  it('lit le bloc EXIF et l’orientation', () => {
    const exif = extractJpegExif(fixture('rotated-6.jpg'));
    expect(exif).not.toBeNull();
    expect(readOrientation(exif!)).toBe(6);
    expect(hasGps(exif!)).toBe(true);
    expect(text(exif!)).toContain('SunuPix Test');
  });

  it('renvoie null sans EXIF', () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xda, 0, 2, 0xff, 0xd9]);
    expect(extractJpegExif(jpeg)).toBeNull();
    expect(extractJpegExif(fixture('sample.png'))).toBeNull();
  });

  it('remet l’orientation à 1 et conserve le GPS en mode « tout garder »', () => {
    const exif = extractJpegExif(fixture('rotated-6.jpg'))!;
    const clean = sanitizeExif(exif, { stripGps: false, width: 10, height: 10 })!;
    expect(readOrientation(clean)).toBe(1);
    expect(hasGps(clean)).toBe(true);
    // L'original n'est pas modifié.
    expect(readOrientation(exif)).toBe(6);
  });

  it('supprime la position GPS mais garde le reste', () => {
    const exif = extractJpegExif(fixture('rotated-6.jpg'))!;
    const clean = sanitizeExif(exif, { stripGps: true, width: 10, height: 10 })!;
    expect(hasGps(clean)).toBe(false);
    expect(text(clean)).toContain('SunuPix Test');
    expect(text(clean)).toContain('2026:01:01');
    // Les références « N » / « W » des coordonnées ont disparu.
    expect(clean.length).toBe(exif.length);
  });

  it('insère le bloc EXIF dans un JPEG', () => {
    const jpeg = fixture('sample.jpg');
    const exif = extractJpegExif(jpeg)!;
    const bare = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 4, 0, 0, 0xff, 0xd9]);
    const out = insertExifIntoJpeg(bare, exif);
    expect(out.length).toBe(bare.length + 4 + 6 + exif.length);
    const back = extractJpegExif(out);
    expect(back).toEqual(exif);
  });
});

describe('HEIC', () => {
  it('extrait le bloc EXIF d’un HEIC', () => {
    const exif = extractHeifExif(fixture('sample.heic'));
    expect(exif).not.toBeNull();
    expect(text(exif!)).toContain('SunuPix Test');
    expect(hasGps(exif!)).toBe(true);
  });

  it('renvoie null pour un HEIC tronqué ou sans EXIF', () => {
    expect(extractHeifExif(fixture('corrupt.heic'))).toBeNull();
    expect(extractHeifExif(fixture('p3.heic'))).toBeNull();
  });

  it('détecte le Display P3', () => {
    expect(detectHeifColorSpace(fixture('p3.heic'))).toBe('display-p3');
    expect(detectHeifColorSpace(fixture('sample.heic'))).toBe('srgb');
  });
});
