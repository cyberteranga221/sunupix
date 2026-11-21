import { useRef, useState, type DragEvent } from 'react';
import { LIMITS } from '../../config';
import { collectDroppedFiles, sortByName, visible } from '../../engine/collect-files';
import { ACCEPT_ATTRIBUTE } from '../../engine/detect';
import { useT } from '../../i18n';
import { Icon } from '../Icon';

interface Props {
  onFiles: (files: File[]) => void;
  compact: boolean;
}

/**
 * Zone d'ajout : glisser-déposer (fichiers ou dossiers), bouton « Choisir des photos »
 * (ouvre la galerie sur iPhone/Android) et « Choisir un dossier » (ordinateur).
 */
export function Dropzone({ onFiles, compact }: Props) {
  const t = useT();
  const filesInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const depth = useRef(0);

  const emit = (files: File[]) => {
    const list = sortByName(visible(files));
    if (list.length > 0) onFiles(list);
  };

  const onDrop = async (event: DragEvent) => {
    event.preventDefault();
    depth.current = 0;
    setDragging(false);
    emit(await collectDroppedFiles(event.dataTransfer));
  };

  const onInput = (input: HTMLInputElement | null) => {
    if (!input?.files) return;
    emit(Array.from(input.files));
    input.value = ''; // permet de re-choisir les mêmes fichiers
  };

  const maxMb = Math.round(LIMITS.maxFileBytes / 1024 / 1024);

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        depth.current++;
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setDragging(false);
      }}
      onDrop={(e) => void onDrop(e)}
      data-testid="dropzone"
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors ${
        dragging ? 'border-accent bg-accent/5' : 'border-line bg-surface-2/40'
      } ${compact ? 'gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:text-left' : 'gap-3 px-5 py-8 sm:py-9'}`}
    >
      {!compact && (
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon name="image" className="size-6" />
        </span>
      )}
      <div className={compact ? 'sm:mr-auto' : ''}>
        <p className={`font-medium ${compact ? 'whitespace-nowrap' : 'text-lg'}`}>
          {dragging ? (
            t.dropzone.titleActive
          ) : compact ? (
            t.dropzone.addMore
          ) : (
            <>
              <span className="pointer-coarse:hidden">{t.dropzone.title}</span>
              <span className="hidden pointer-coarse:inline">{t.dropzone.titleTouch}</span>
            </>
          )}
        </p>
        {!compact && (
          <p className="mt-1 text-sm text-muted">{t.dropzone.hint(LIMITS.maxFiles, maxMb)}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => filesInput.current?.click()}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 font-medium text-on-accent shadow-sm transition hover:brightness-110 active:scale-[0.98]"
        >
          <Icon name="upload" />
          {t.dropzone.pickFiles}
        </button>
        <button
          type="button"
          onClick={() => folderInput.current?.click()}
          className="hidden h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 font-medium transition hover:bg-surface-2 active:scale-[0.98] md:inline-flex"
        >
          <Icon name="folder" />
          {t.dropzone.pickFolder}
        </button>
      </div>
      <input
        ref={filesInput}
        type="file"
        multiple
        accept={ACCEPT_ATTRIBUTE}
        className="sr-only"
        tabIndex={-1}
        aria-label={t.dropzone.pickFiles}
        data-testid="file-input"
        onChange={(e) => onInput(e.currentTarget)}
      />
      <input
        ref={folderInput}
        type="file"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-label={t.dropzone.pickFolder}
        // Attributs non standard mais pris en charge par tous les navigateurs de bureau.
        {...{ webkitdirectory: '', directory: '' }}
        onChange={(e) => onInput(e.currentTarget)}
      />
    </div>
  );
}
