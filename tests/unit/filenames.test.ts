import { describe, expect, it } from 'vitest';
import { NameAllocator, baseName } from '../../src/engine/filenames';

describe('noms de fichiers', () => {
  it('remplace l’extension en conservant le nom d’origine', () => {
    const names = new NameAllocator();
    expect(names.allocate('IMG_0001.HEIC', 'jpeg')).toBe('IMG_0001.jpg');
    expect(names.allocate('IMG_0002.heic', 'png')).toBe('IMG_0002.png');
    expect(names.allocate('photo.de.vacances.jpg', 'webp')).toBe('photo.de.vacances.webp');
  });

  it('gère les doublons sans tenir compte de la casse', () => {
    const names = new NameAllocator();
    expect(names.allocate('IMG_0001.HEIC', 'jpeg')).toBe('IMG_0001.jpg');
    expect(names.allocate('IMG_0001.jpg', 'jpeg')).toBe('IMG_0001 (2).jpg');
    expect(names.allocate('img_0001.png', 'jpeg')).toBe('img_0001 (3).jpg');
  });

  it('libère un nom', () => {
    const names = new NameAllocator();
    const a = names.allocate('a.heic', 'jpeg');
    names.release(a);
    expect(names.allocate('a.heic', 'jpeg')).toBe('a.jpg');
  });

  it('nettoie les chemins et caractères interdits', () => {
    expect(baseName('Vacances/Dakar/IMG_1.HEIC')).toBe('IMG_1');
    expect(baseName('a:b*c?.heic')).toBe('a_b_c_');
    expect(baseName('...')).toBe('photo');
    expect(baseName('<>.jpg')).toBe('_');
    expect(baseName('sans-extension')).toBe('sans-extension');
  });
});
