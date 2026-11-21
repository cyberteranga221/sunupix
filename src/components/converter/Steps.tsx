import { useT } from '../../i18n';
import { Icon } from '../Icon';

/** Parcours en 3 étapes visibles. `current` va de 1 à 3. */
export function Steps({ current }: { current: 1 | 2 | 3 }) {
  const t = useT();
  const steps = [t.steps.choose, t.steps.format, t.steps.download];
  return (
    <ol aria-label={t.steps.label} className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li
            key={label}
            aria-current={active ? 'step' : undefined}
            className={`flex items-center gap-2 rounded-xl px-2 py-2 transition sm:px-3 ${
              active ? 'bg-accent/10 text-fg' : 'text-muted'
            }`}
          >
            <span
              className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition ${
                done || active ? 'bg-accent text-on-accent' : 'border-line border'
              }`}
            >
              {done ? <Icon name="check" className="size-3.5" /> : n}
            </span>
            <span className={`leading-tight ${active ? 'font-medium' : ''}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
