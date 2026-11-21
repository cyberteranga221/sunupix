import { useId, type ReactNode } from 'react';
import type { ConvertOptions, MetadataMode, ResizeMode } from '../../engine/types';
import { useT } from '../../i18n';
import { Icon } from '../Icon';

export type Destination = 'zip' | 'folder';

interface Props {
  options: ConvertOptions;
  onChange: (options: ConvertOptions) => void;
  folderSupported: boolean;
  destination: Destination;
  onDestinationChange: (d: Destination) => void;
  disabled: boolean;
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      {children}
      {hint && <p className="text-xs leading-relaxed text-muted">{hint}</p>}
    </fieldset>
  );
}

/**
 * Réglages secondaires, repliés par défaut (divulgation progressive) : qualité, taille,
 * métadonnées, destination. Le résumé d'une ligne montre ce qui va s'appliquer.
 */
export function AdvancedOptions(props: Props) {
  const { options, onChange, disabled } = props;
  const t = useT();
  const id = useId();
  const set = <K extends keyof ConvertOptions>(key: K, value: ConvertOptions[K]) =>
    onChange({ ...options, [key]: value });

  const resizeChoices: Array<{ value: ResizeMode; label: string }> = [
    { value: 'original', label: t.options.resizeOriginal },
    { value: '4k', label: t.options.resize4k },
    { value: '1080p', label: t.options.resize1080 },
    { value: '720p', label: t.options.resize720 },
    { value: 'custom', label: t.options.resizeCustom },
  ];
  const metadataChoices: Array<{ value: MetadataMode; label: string; hint: string }> = [
    { value: 'strip', label: t.options.metadataStrip, hint: t.options.metadataStripHint },
    {
      value: 'keep-no-gps',
      label: t.options.metadataKeepNoGps,
      hint: t.options.metadataKeepNoGpsHint,
    },
    { value: 'keep', label: t.options.metadataKeep, hint: t.options.metadataKeepHint },
  ];

  const sizeLabel =
    options.resize === 'custom'
      ? `${options.customMaxSide} px`
      : (resizeChoices.find((c) => c.value === options.resize)?.label ?? '');
  const summary = [
    options.format !== 'png' ? t.options.summaryQuality(Math.round(options.quality * 100)) : null,
    sizeLabel,
    t.options.summaryMetadata[options.metadata],
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <details className="group rounded-2xl border border-line" data-testid="advanced">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 select-none hover:bg-surface-2/60">
        <Icon
          name="chevron"
          className="size-4 shrink-0 text-muted transition-transform group-open:rotate-90"
        />
        <span className="min-w-0">
          <span className="block text-sm font-medium">{t.options.advanced}</span>
          <span className="block truncate text-xs text-muted">{summary}</span>
        </span>
      </summary>

      <div className="space-y-6 border-t border-line px-4 pt-4 pb-5">
        {options.format !== 'png' && (
          <Field label={t.options.quality} hint={t.options.qualityHint}>
            <div className="flex items-center gap-3">
              <input
                id={`${id}-quality`}
                type="range"
                min={40}
                max={100}
                step={1}
                value={Math.round(options.quality * 100)}
                disabled={disabled}
                onChange={(e) => set('quality', Number(e.currentTarget.value) / 100)}
                aria-label={t.options.quality}
                className="h-2 w-full cursor-pointer accent-[var(--accent)]"
              />
              <output
                htmlFor={`${id}-quality`}
                className="w-12 text-right font-mono text-sm tabular-nums"
              >
                {Math.round(options.quality * 100)} %
              </output>
            </div>
          </Field>
        )}

        <Field label={t.options.resize}>
          <select
            value={options.resize}
            disabled={disabled}
            onChange={(e) => set('resize', e.currentTarget.value as ResizeMode)}
            aria-label={t.options.resize}
            className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm"
          >
            {resizeChoices.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {options.resize === 'custom' && (
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted">{t.options.customSide}</span>
              <input
                type="number"
                inputMode="numeric"
                min={16}
                max={16384}
                value={options.customMaxSide}
                disabled={disabled}
                onChange={(e) =>
                  set('customMaxSide', Math.max(16, Number(e.currentTarget.value) || 16))
                }
                className="h-10 w-28 rounded-xl border border-line bg-surface px-3 text-right font-mono tabular-nums"
              />
            </label>
          )}
        </Field>

        <Field
          label={t.options.metadata}
          hint={
            options.metadata !== 'strip' && options.format !== 'jpeg'
              ? t.options.metadataJpegOnly
              : undefined
          }
        >
          <div className="space-y-1.5">
            {metadataChoices.map((c) => (
              <label
                key={c.value}
                className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                  options.metadata === c.value
                    ? 'border-accent bg-accent/[0.06]'
                    : 'border-line hover:bg-surface-2'
                } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <input
                  type="radio"
                  name={`${id}-metadata`}
                  value={c.value}
                  checked={options.metadata === c.value}
                  disabled={disabled}
                  onChange={() => set('metadata', c.value)}
                  className="mt-0.5 size-4 accent-[var(--accent)]"
                />
                <span>
                  <span className="block text-sm font-medium">{c.label}</span>
                  <span
                    className={`block text-xs ${c.value === 'keep' ? 'text-warn' : 'text-muted'}`}
                  >
                    {c.hint}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </Field>

        {props.folderSupported && (
          <Field
            label={t.options.destination}
            hint={props.destination === 'folder' ? t.options.destinationFolderHint : undefined}
          >
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1">
              {(['zip', 'folder'] as const).map((d) => (
                <label
                  key={d}
                  className={`flex cursor-pointer items-center justify-center rounded-lg px-2 py-2 text-center text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    props.destination === d
                      ? 'bg-surface text-fg shadow-sm'
                      : 'text-muted hover:text-fg'
                  }`}
                >
                  <input
                    type="radio"
                    name={`${id}-destination`}
                    value={d}
                    checked={props.destination === d}
                    disabled={disabled}
                    onChange={() => props.onDestinationChange(d)}
                    className="sr-only"
                  />
                  {d === 'zip' ? t.options.destinationZip : t.options.destinationFolder}
                </label>
              ))}
            </div>
          </Field>
        )}
      </div>
    </details>
  );
}
