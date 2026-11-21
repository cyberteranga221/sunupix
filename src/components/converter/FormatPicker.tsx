import { useId } from 'react';
import type { OutputFormat } from '../../engine/types';
import { useT } from '../../i18n';
import { Icon } from '../Icon';

interface Props {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  webpSupported: boolean;
  disabled: boolean;
}

/**
 * Choix du format de sortie : trois grandes cartes (boutons radio natifs, donc
 * navigables au clavier avec les flèches et lus correctement par les lecteurs d'écran).
 */
export function FormatPicker({ value, onChange, webpSupported, disabled }: Props) {
  const t = useT();
  const name = useId();
  const choices: Array<{
    value: OutputFormat;
    label: string;
    hint: string;
    recommended?: boolean;
  }> = [
    { value: 'jpeg', label: 'JPG', hint: t.options.formatJpegHint, recommended: true },
    { value: 'png', label: 'PNG', hint: t.options.formatPngHint },
    {
      value: 'webp',
      label: 'WebP',
      hint: webpSupported ? t.options.formatWebpHint : t.options.webpUnsupported,
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={t.options.format}
      className="grid grid-cols-3 gap-2 sm:gap-3"
    >
      {choices.map((choice) => {
        const selected = value === choice.value;
        const off = disabled || (choice.value === 'webp' && !webpSupported);
        return (
          <label
            key={choice.value}
            className={`relative flex cursor-pointer flex-col rounded-2xl border p-3 transition-[border-color,background-color,box-shadow] duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-surface sm:p-4 ${
              selected
                ? 'border-accent bg-accent/[0.06] shadow-[inset_0_0_0_1px_var(--accent)]'
                : 'border-line bg-surface hover:border-fg/25'
            } ${off ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={choice.value}
              checked={selected}
              disabled={off}
              onChange={() => onChange(choice.value)}
              className="sr-only"
            />
            <span className="flex items-start justify-between gap-2">
              <span className="font-mono text-lg font-semibold tracking-tight sm:text-xl">
                {choice.label}
              </span>
              <span
                aria-hidden="true"
                className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border transition ${
                  selected ? 'border-accent bg-accent text-on-accent' : 'border-line'
                }`}
              >
                {selected && <Icon name="check" className="size-3" />}
              </span>
            </span>
            <span className="mt-1 text-xs leading-snug text-muted">{choice.hint}</span>
            {choice.recommended && (
              <span className="mt-2 hidden text-[11px] font-semibold tracking-wide text-accent uppercase sm:block">
                {t.options.recommended}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
