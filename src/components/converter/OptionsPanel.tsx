import { useId, type ReactNode } from 'react';
import type { ConvertOptions, MetadataMode, OutputFormat, ResizeMode } from '../../engine/types';
import { useT } from '../../i18n';

export type Destination = 'zip' | 'folder';

interface Props {
  options: ConvertOptions;
  onChange: (options: ConvertOptions) => void;
  webpSupported: boolean;
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
      {hint && <p className="text-muted text-xs leading-relaxed">{hint}</p>}
    </fieldset>
  );
}

/** Groupe de boutons radio présentés comme un sélecteur segmenté (accessible au clavier). */
function Segmented<T extends string>({
  name,
  value,
  options,
  onChange,
  disabled,
}: {
  name: string;
  value: T;
  options: Array<{ value: T; label: string; disabled?: boolean }>;
  onChange: (v: T) => void;
  disabled: boolean;
}) {
  return (
    <div className="bg-surface-2 grid auto-cols-fr grid-flow-col gap-1 rounded-xl p-1">
      {options.map((o) => (
        <label
          key={o.value}
          className={`has-[:focus-visible]:ring-accent relative flex cursor-pointer items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition has-[:focus-visible]:ring-2 ${
            value === o.value ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg'
          } ${o.disabled || disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            disabled={o.disabled || disabled}
            onChange={() => onChange(o.value)}
            className="sr-only"
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

export function OptionsPanel(props: Props) {
  const { options, onChange, disabled } = props;
  const t = useT();
  const id = useId();
  const set = <K extends keyof ConvertOptions>(key: K, value: ConvertOptions[K]) =>
    onChange({ ...options, [key]: value });

  const formatHints: Record<OutputFormat, string> = {
    jpeg: t.options.formatJpegHint,
    png: t.options.formatPngHint,
    webp: t.options.formatWebpHint,
  };
  const metadataChoices: Array<{ value: MetadataMode; label: string; hint: string }> = [
    { value: 'strip', label: t.options.metadataStrip, hint: t.options.metadataStripHint },
    {
      value: 'keep-no-gps',
      label: t.options.metadataKeepNoGps,
      hint: t.options.metadataKeepNoGpsHint,
    },
    { value: 'keep', label: t.options.metadataKeep, hint: t.options.metadataKeepHint },
  ];
  const resizeChoices: Array<{ value: ResizeMode; label: string }> = [
    { value: 'original', label: t.options.resizeOriginal },
    { value: '4k', label: t.options.resize4k },
    { value: '1080p', label: t.options.resize1080 },
    { value: '720p', label: t.options.resize720 },
    { value: 'custom', label: t.options.resizeCustom },
  ];

  return (
    <div className="space-y-6">
      <Field
        label={t.options.format}
        hint={
          !props.webpSupported && options.format !== 'webp'
            ? undefined
            : formatHints[options.format]
        }
      >
        <Segmented<OutputFormat>
          name={`${id}-format`}
          value={options.format}
          disabled={disabled}
          onChange={(v) => set('format', v)}
          options={[
            { value: 'jpeg', label: 'JPG' },
            { value: 'png', label: 'PNG' },
            { value: 'webp', label: 'WebP', disabled: !props.webpSupported },
          ]}
        />
        {!props.webpSupported && <p className="text-muted text-xs">{t.options.webpUnsupported}</p>}
      </Field>

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
            <output htmlFor={`${id}-quality`} className="w-12 text-right text-sm tabular-nums">
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
          className="border-line bg-surface h-11 w-full rounded-xl border px-3 text-sm"
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
              className="border-line bg-surface h-10 w-28 rounded-xl border px-3 text-right tabular-nums"
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
              className={`has-[:focus-visible]:ring-accent flex cursor-pointer gap-3 rounded-xl border p-3 transition has-[:focus-visible]:ring-2 ${
                options.metadata === c.value
                  ? 'border-accent bg-accent/5'
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
          <Segmented<Destination>
            name={`${id}-destination`}
            value={props.destination}
            disabled={disabled}
            onChange={props.onDestinationChange}
            options={[
              { value: 'zip', label: t.options.destinationZip },
              { value: 'folder', label: t.options.destinationFolder },
            ]}
          />
        </Field>
      )}
    </div>
  );
}
