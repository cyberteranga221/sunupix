import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { LIMITS } from '../../config';
import { isLowMemory } from '../../engine/device';
import { pickDirectory, supportsDirectoryPicker } from '../../engine/save';
import type { OutputFormat } from '../../engine/types';
import { useHydrated } from '../../hooks/useHydrated';
import { useT } from '../../i18n';
import { getBatchStore } from '../../state/batch';
import { canEncodeWebp, getOptions, setOptions } from '../../state/options';
import { useBatch } from '../../state/useBatch';
import { useOptions } from '../../state/useOptions';
import { Icon } from '../Icon';
import { AdvancedOptions, type Destination } from './AdvancedOptions';
import { DownloadPanel } from './DownloadPanel';
import { Dropzone } from './Dropzone';
import { FileList } from './FileList';
import { FormatPicker } from './FormatPicker';
import { ProgressPanel } from './ProgressPanel';

const FORMAT_LABEL: Record<OutputFormat, string> = { jpeg: 'JPG', png: 'PNG', webp: 'WebP' };

interface Props {
  /** Format imposé par une page dédiée (« HEIC en PNG »…). */
  presetFormat?: OutputFormat;
}

/**
 * Le convertisseur, en trois étapes visibles et numérotées :
 * 1. tes photos → 2. format de sortie → 3. convertis et télécharge.
 */
export function Converter({ presetFormat }: Props) {
  const t = useT();
  const snapshot = useBatch();
  const options = useOptions();
  const hydrated = useHydrated();
  const [destination, setDestination] = useState<Destination>('zip');

  // Page dédiée : on impose son format au chargement (c'est un système externe, pas un état React).
  useEffect(() => {
    if (presetFormat && getOptions().format !== presetFormat)
      setOptions({ ...getOptions(), format: presetFormat });
  }, [presetFormat]);

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

  const { items, running } = snapshot;
  const store = hydrated ? getBatchStore() : null;
  const pending = items.filter((i) => i.status === 'pending' || i.status === 'cancelled').length;
  const convertible = items.filter((i) => i.format !== null && i.error !== 'too-large').length;
  const hasFinished = items.some((i) => i.status === 'done' || i.status === 'error');
  const current: 1 | 2 | 3 =
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
      aria-label={t.nav.home}
      className="rounded-[28px] border border-line bg-surface p-4 shadow-card sm:p-6"
      data-testid="converter"
    >
      <ol className="space-y-1">
        <Step n={1} title={t.steps.choose} current={current}>
          <div className="space-y-3">
            <Dropzone onFiles={(files) => void store?.addFiles(files)} compact={items.length > 0} />
            {snapshot.overflow > 0 && (
              <Notice onClose={() => store?.dismissOverflow()}>
                {t.notices.overflow(snapshot.overflow, LIMITS.maxFiles)}
              </Notice>
            )}
            {capabilities.lowMemory && items.length > 100 && destination === 'zip' && (
              <Notice>{t.notices.lowMemory}</Notice>
            )}
          </div>
        </Step>

        <Step n={2} title={t.steps.format} current={current}>
          <div className="space-y-3">
            <FormatPicker
              value={options.format}
              onChange={(format) => setOptions({ ...options, format })}
              webpSupported={capabilities.webp}
              disabled={running}
            />
            <AdvancedOptions
              options={options}
              onChange={setOptions}
              folderSupported={capabilities.folder}
              destination={destination}
              onDestinationChange={setDestination}
              disabled={running}
            />
          </div>
        </Step>

        <Step n={3} title={t.steps.download} current={current} last>
          <div className="space-y-4">
            {!running && (pending > 0 || items.length === 0) && (
              <button
                type="button"
                className={`${pending > 0 ? 'btn-primary' : 'btn-secondary'} w-full text-base`}
                onClick={() => void start(false)}
                disabled={pending === 0}
                data-testid="convert"
              >
                {pending > 0
                  ? t.actions.convert(pending, FORMAT_LABEL[options.format])
                  : t.actions.convertEmpty}
                {pending > 0 && <Icon name="arrow" className="size-4" />}
              </button>
            )}
            {!running && pending === 0 && hasFinished && convertible > 0 && (
              <button
                type="button"
                className="btn-secondary w-full"
                onClick={() => void start(true)}
              >
                <Icon name="retry" className="size-4" />
                {t.actions.reconvert}
              </button>
            )}

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

            <p className="flex items-center gap-2 text-xs text-muted">
              <Icon name="lock" className="size-4 shrink-0" />
              {t.notices.privacy}
            </p>
          </div>
        </Step>
      </ol>
    </section>
  );
}

/** Une étape du parcours : pastille numérotée, fil vertical, titre et contenu. */
function Step({
  n,
  title,
  current,
  last = false,
  children,
}: {
  n: 1 | 2 | 3;
  title: string;
  current: 1 | 2 | 3;
  last?: boolean;
  children: ReactNode;
}) {
  const done = n < current;
  const active = n === current;
  return (
    <li
      className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 sm:gap-x-4"
      aria-current={active ? 'step' : undefined}
    >
      <div className="flex flex-col items-center">
        <span
          className={`relative z-10 inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-colors duration-200 ${
            done || active ? 'bg-accent text-on-accent' : 'border border-line bg-surface text-muted'
          }`}
        >
          {done ? <Icon name="check" className="size-4" /> : n}
        </span>
        {!last && (
          <span aria-hidden="true" className={`w-px flex-1 ${done ? 'bg-accent/50' : 'bg-line'}`} />
        )}
      </div>
      <div className={`min-w-0 ${last ? '' : 'pb-7'}`}>
        <h2
          className={`flex h-8 items-center text-base font-semibold tracking-tight ${active || done ? '' : 'text-muted'}`}
        >
          {title}
        </h2>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  );
}

function Notice({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  const t = useT();
  return (
    <div
      role="status"
      className="animate-fade-in flex items-start gap-3 rounded-2xl border border-warn/30 bg-warn/10 p-3 text-sm"
    >
      <Icon name="alert" className="mt-0.5 size-4 shrink-0 text-warn" />
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
