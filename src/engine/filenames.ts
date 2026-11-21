import { EXTENSION, type OutputFormat } from './types';

/** Caractères interdits dans un nom de fichier sous Windows, macOS ou dans un ZIP. */
// eslint-disable-next-line no-control-regex
const FORBIDDEN = /[\u0000-\u001f<>:"/\\|?*]+/g;

/** Retire le dossier éventuel (sélection d'un dossier) et l'extension. */
export function baseName(name: string): string {
  const file = name.split(/[\\/]/).pop() ?? name;
  const dot = file.lastIndexOf('.');
  const stem = dot > 0 ? file.slice(0, dot) : file;
  const clean = stem.replace(FORBIDDEN, '_').trim().replace(/^\.+/, '');
  return clean || 'photo';
}

/**
 * Attribue des noms de sortie uniques au sein d'un lot :
 * « IMG_0001.HEIC » → « IMG_0001.jpg », puis « IMG_0001 (2).jpg » en cas de doublon.
 * La comparaison ignore la casse (macOS et Windows ne distinguent pas « a.jpg » de « A.JPG »).
 */
export class NameAllocator {
  private readonly used = new Set<string>();

  allocate(originalName: string, format: OutputFormat): string {
    const stem = baseName(originalName);
    const ext = EXTENSION[format];
    let candidate = `${stem}.${ext}`;
    for (let i = 2; this.used.has(candidate.toLowerCase()); i++) {
      candidate = `${stem} (${i}).${ext}`;
    }
    this.used.add(candidate.toLowerCase());
    return candidate;
  }

  release(name: string): void {
    this.used.delete(name.toLowerCase());
  }

  clear(): void {
    this.used.clear();
  }
}
