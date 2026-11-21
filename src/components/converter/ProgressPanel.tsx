import type { BatchSnapshot } from '../../state/batch';
import { getBatchStore } from '../../state/batch';
import { useT } from '../../i18n';
import { formatDuration } from '../../i18n/format';
import { Icon } from '../Icon';

/** Barre de progression globale, temps restant estimé, pause / reprise / annulation. */
export function ProgressPanel({ snapshot }: { snapshot: BatchSnapshot }) {
  const t = useT();
  const store = getBatchStore();
  const run = snapshot.run;
  if (!run || !snapshot.running) return null;

  const percent = run.total > 0 ? Math.round((run.finished / run.total) * 100) : 0;
  let eta = t.progress.estimating;
  if (snapshot.paused) eta = t.progress.paused;
  else if (run.etaMs !== null)
    eta =
      run.etaMs < 5000
        ? t.progress.remainingSoon
        : t.progress.remaining(formatDuration(run.etaMs, t));

  return (
    <div
      className="animate-fade-in border-line bg-surface space-y-3 rounded-2xl border p-4"
      data-testid="progress"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="font-medium tabular-nums">
          {t.progress.count(run.finished, run.total)}
        </span>
        <span className="text-muted" aria-live="polite">
          {eta}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={t.progress.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="bg-surface-2 h-2 overflow-hidden rounded-full"
      >
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex gap-2">
        {snapshot.paused ? (
          <button type="button" onClick={() => store.resume()} className="btn-secondary">
            <Icon name="play" className="size-4" />
            {t.actions.resume}
          </button>
        ) : (
          <button type="button" onClick={() => store.pause()} className="btn-secondary">
            <Icon name="pause" className="size-4" />
            {t.actions.pause}
          </button>
        )}
        <button type="button" onClick={() => store.cancelAll()} className="btn-ghost">
          {t.actions.cancelAll}
        </button>
      </div>
    </div>
  );
}
