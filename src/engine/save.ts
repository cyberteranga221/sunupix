/**
 * Enregistrement des fichiers : téléchargement classique, ZIP, ou écriture directe
 * dans un dossier choisi (File System Access API, Chrome/Edge sur ordinateur).
 */

interface DirectoryPickerWindow {
  showDirectoryPicker?: (options?: {
    mode?: 'read' | 'readwrite';
    id?: string;
  }) => Promise<FileSystemDirectoryHandle>;
}

/** Vrai si le navigateur permet d'écrire directement dans un dossier. */
export function supportsDirectoryPicker(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as DirectoryPickerWindow).showDirectoryPicker === 'function'
  );
}

/** Demande un dossier à l'utilisateur. Retourne null s'il annule. */
export async function pickDirectory(): Promise<FileSystemDirectoryHandle | null> {
  const picker = (window as DirectoryPickerWindow).showDirectoryPicker;
  if (!picker) return null;
  try {
    return await picker({ mode: 'readwrite', id: 'sunupix-sortie' });
  } catch {
    return null; // annulation ou refus
  }
}

async function exists(dir: FileSystemDirectoryHandle, name: string): Promise<boolean> {
  try {
    await dir.getFileHandle(name);
    return true;
  } catch {
    return false;
  }
}

/**
 * Écrit un fichier dans le dossier sans jamais écraser un fichier existant :
 * « IMG_1.jpg » existe déjà → « IMG_1 (2).jpg ». Retourne le nom réellement utilisé.
 */
export async function writeToDirectory(
  dir: FileSystemDirectoryHandle,
  name: string,
  blob: Blob,
): Promise<string> {
  const dot = name.lastIndexOf('.');
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  let candidate = name;
  for (let i = 2; await exists(dir, candidate); i++) candidate = `${stem} (${i})${ext}`;
  const handle = await dir.getFileHandle(candidate, { create: true });
  const writable = await handle.createWritable();
  try {
    await writable.write(blob);
  } finally {
    await writable.close();
  }
  return candidate;
}

/** Déclenche le téléchargement d'un Blob, puis libère son URL. */
export function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.rel = 'noopener';
  document.body.append(link);
  link.click();
  link.remove();
  // Laisse au navigateur le temps de démarrer le téléchargement.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Construit une archive ZIP sans compression (les JPEG/PNG/WebP sont déjà compressés),
 * en streaming avec client-zip : la mémoire utilisée reste proche de la taille du ZIP.
 */
export async function buildZip(files: ReadonlyArray<{ name: string; blob: Blob }>): Promise<Blob> {
  const { downloadZip } = await import('client-zip');
  const now = new Date();
  return downloadZip(files.map((f) => ({ name: f.name, input: f.blob, lastModified: now }))).blob();
}
