import { useMemo, useState, type ReactNode } from 'react';
import { LIMITS } from '../../config';
import { isLowMemory } from '../../engine/device';
import { pickDirectory, supportsDirectoryPicker } from '../../engine/save';
import type { ConvertOptions, OutputFormat } from '../../engine/types';
import { useHydrated } from '../../hooks/useHydrated';
import { useT } from '../../i18n';
import { getBatchStore } from '../../state/batch';
import { DEFAULT_OPTIONS, loadOptions, saveOptions } from '../../state/options';
import { useBatch } from '../../state/useBatch';
import { Icon } from '../Icon';
import { DownloadPanel } from './DownloadPanel';
import { Dropzone } from './Dropzone';
import { FileList } from './FileList';
import { OptionsPanel, type Destination } from './OptionsPanel';
import { ProgressPanel } from './ProgressPanel';
import { Steps } from './Steps';

/** Le navigateur sait-il encoder du WebP ? (Safari : non.) */
function canEncodeWebp(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

interface Props {
  /** Format imposé par une page dédiée (« HEIC en PNG »…). */
  presetFormat?: OutputFormat;
}

export function Converter({ presetFormat }: Props) {
  const t = useT();
  const snapshot = useBatch();
  const hydrated = useHydrated();
  const [destination, setDestination] = useState<Destination>('zip');
  const [userOptions, setUserOptions] = useState<ConvertOptions | null>(null);

  // Capacités du navigateur, lues seulement après l'hydratation (le pré-rendu n'a pas de navigateur).
  const capabilities = useMemo(
    () =>
      hydrated
        ? {
            webp: canEncodeWebp(),
            folder: supportsDirectoryPicker() && !window.matchMedia('(pointer: coarse)').matches,
            lowMemory: isLowMemory(getBatchStore().deviceInfo),
          }
        : { webp: true, folder: false, lowMemory: false },
    [hydrated],
  );

  // Réglages mémorisés de la visite précédente (le format d'une page dédiée est prioritaire).
  const initialOptions = useMemo<ConvertOptions>(() => {
    const saved = hydrated ? loadOptions() : DEFAULT_OPTIONS;
    const format =
      presetFormat ?? (saved.format === 'webp' && !capabilities.webp ? 'jpeg' : saved.format);
    return { ...saved, format };
  }, [hydrated, presetFormat, capabilities.webp]);
  const options = userOptions ?? initialOptions;

  const updateOptions = (next: ConvertOptions) => {
    setUserOptions(next);
    saveOptions(next);
  };

  const { items, running } = snapshot;
  const store = typeof window === 'undefined' ? null : getBatchStore();
  const pending = items.filter((i) => i.status === 'pending' || i.status === 'cancelled').length;
  const convertible = items.filter((i) => i.format !== null && i.error !== 'too-large').length;
  const hasFinished = items.some((i) => i.status === 'done' || i.status === 'error');
  const step: 1 | 2 | 3 =
    items.length === 0 ? 1 : running || (hasFinished && pending === 0) ? 3 : 2;

  const start = async (reconvertAll: boolean) => {
    if (!store) return;
    let directory: FileSystemDirectoryHandle | null = null;
    if (destination === 'folder') {
      directory = await pickDirectory();
      if (!directory) return; // l'utilisateur a annulé
    }
    store.start(options, directory, reconvertAll);
  };

  return (
    <section
      aria-labelledby="convertisseur"
      className="border-line bg-surface rounded-3xl border p-4 shadow-sm sm:p-6"
    >
      <h2 id="convertisseur" className="sr-only">
        {t.nav.home}
      </h2>
      <Steps current={step} />
      {/* Mobile : ajout → réglages → progression → liste. Ordinateur : réglages à droite. */}
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4 lg:col-start-1">
          <Dropzone onFiles={(files) => void store?.addFiles(files)} compact={items.length > 0} />

          {snapshot.overflow > 0 && (
            <Notice tone="warn" onClose={() => store?.dismissOverflow()}>
              {t.notices.overflow(snapshot.overflow, LIMITS.maxFiles)}
            </Notice>
          )}
          {capabilities.lowMemory && items.length > 100 && destination === 'zip' && (
            <Notice tone="warn">{t.notices.lowMemory}</Notice>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <h3 className="text-muted text-sm font-semibold tracking-wide uppercase">
            {t.options.title}
          </h3>
          <OptionsPanel
            options={options}
            onChange={updateOptions}
            webpSupported={capabilities.webp}
            folderSupported={capabilities.folder}
            destination={destination}
            onDestinationChange={setDestination}
            disabled={running}
          />
          {!running && pending > 0 && (
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => void start(false)}
              data-testid="convert"
            >
              {t.actions.convert(pending)}
            </button>
          )}
          {!running && pending === 0 && hasFinished && convertible > 0 && (
            <button type="button" className="btn-secondary w-full" onClick={() => void start(true)}>
              <Icon name="retry" className="size-4" />
              {t.actions.reconvert}
            </button>
          )}
          <p className="text-muted flex items-center gap-2 text-xs">
            <Icon name="lock" className="size-4 shrink-0" />
            {t.notices.privacy}
          </p>
        </aside>

        <div className="min-w-0 space-y-4 lg:col-start-1">
          <ProgressPanel snapshot={snapshot} />
          <DownloadPanel snapshot={snapshot} />

          {items.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-medium">{t.list.title(items.length)}</h3>
                {!running && (
                  <button
                    type="button"
                    className="btn-ghost text-sm"
                    onClick={() => store?.clear()}
                  >
                    <Icon name="trash" className="size-4" />
                    {t.actions.clear}
                  </button>
                )}
              </div>
              <FileList items={items} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Notice({
  tone,
  children,
  onClose,
}: {
  tone: 'warn';
  children: ReactNode;
  onClose?: () => void;
}) {
  const t = useT();
  return (
    <div
      role="status"
      className={`animate-fade-in flex items-start gap-3 rounded-2xl border p-3 text-sm ${
        tone === 'warn' ? 'border-warn/30 bg-warn/10' : ''
      }`}
    >
      <Icon name="alert" className="text-warn mt-0.5 size-4 shrink-0" />
      <p className="flex-1">{children}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          className="text-muted hover:text-fg"
        >
          <Icon name="x" className="size-4" />
        </button>
      )}
    </div>
  );
}
