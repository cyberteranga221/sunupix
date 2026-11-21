import { describe, expect, it } from 'vitest';
import { detectFormat, formatFromName } from '../../src/engine/detect';
import { fixture } from './helpers';

describe('detectFormat', () => {
  it.each([
    ['sample.heic', 'heic'],
    ['p3.heic', 'heic'],
    ['sample.jpg', 'jpeg'],
    ['sample.png', 'png'],
  ])('reconnaît %s', (file, format) => {
    expect(detectFormat(fixture(file).subarray(0, 64))).toBe(format);
  });

  it('reconnaît WebP, GIF, BMP et AVIF par leurs octets', () => {
    const bytes = (s: string) => {
      const out = new Uint8Array(32);
      for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
      return out;
    };
    expect(detectFormat(bytes('RIFF\0\0\0\0WEBPVP8 '))).toBe('webp');
    expect(detectFormat(bytes('GIF89a......'))).toBe('gif');
    expect(detectFormat(bytes('BM..........'))).toBe('bmp');
    const avif = bytes('\0\0\0\x1cftypavif\0\0\0\0avifmif1miaf');
    expect(detectFormat(avif)).toBe('avif');
    const avifMif1 = bytes('\0\0\0\x1cftypmif1\0\0\0\0mif1avifmiaf');
    expect(detectFormat(avifMif1)).toBe('avif');
  });

  it('refuse un faux fichier image', () => {
    expect(detectFormat(fixture('not-an-image.jpg'))).toBeNull();
  });

  it('déduit un format depuis l’extension', () => {
    expect(formatFromName('IMG_0001.HEIC')).toBe('heic');
    expect(formatFromName('photo.JPEG')).toBe('jpeg');
    expect(formatFromName('document.pdf')).toBeNull();
  });
});
