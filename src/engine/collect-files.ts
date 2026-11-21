/**
 * Récupère les fichiers d'un glisser-déposer, y compris le contenu des dossiers
 * (et de leurs sous-dossiers). Les fichiers cachés (« .DS_Store »…) sont ignorés.
 */
export async function collectDroppedFiles(data: DataTransfer): Promise<File[]> {
  const entries: FileSystemEntry[] = [];
  for (const item of Array.from(data.items)) {
    const entry = item.kind === 'file' ? item.webkitGetAsEntry?.() : null;
    if (entry) entries.push(entry);
  }
  // Navigateur sans API d'entrées : on se contente de la liste plate.
  if (entries.length === 0) return visible(Array.from(data.files));

  const files: File[] = [];
  const walk = async (entry: FileSystemEntry): Promise<void> => {
    if (entry.isFile) {
      files.push(
        await new Promise<File>((resolve, reject) =>
          (entry as FileSystemFileEntry).file(resolve, reject),
        ),
      );
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      // readEntries renvoie les fichiers par paquets : on boucle jusqu'à une liste vide.
      for (;;) {
        const batch = await new Promise<FileSystemEntry[]>((resolve, reject) =>
          reader.readEntries(resolve, reject),
        );
        if (batch.length === 0) break;
        for (const child of batch) await walk(child);
      }
    }
  };
  for (const entry of entries) {
    try {
      await walk(entry);
    } catch {
      /* entrée illisible : ignorée */
    }
  }
  return visible(files);
}

/** Retire les fichiers cachés du système. */
export function visible(files: File[]): File[] {
  return files.filter((f) => !f.name.startsWith('.'));
}

/** Tri naturel par nom (IMG_2 avant IMG_10), comme dans le Finder. */
export function sortByName(files: File[]): File[] {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return [...files].sort((a, b) =>
    collator.compare(a.webkitRelativePath || a.name, b.webkitRelativePath || b.name),
  );
}
