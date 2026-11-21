import { useMemo, useState } from 'react';
import { LIMITS } from '../../config';
import { buildZip, downloadBlob } from '../../engine/save';
import { splitIntoBatches, zipName } from '../../engine/zip-batches';
import { useT } from '../../i18n';
import type { BatchSnapshot } from '../../state/batch';
import { Icon } from '../Icon';

/**
 * Étape 3 : téléchargement. Un seul fichier → téléchargement direct.
 * Plusieurs → ZIP, découpés automatiquement (100 photos ou 500 Mo maximum par ZIP).
 */
export function DownloadPanel({ snapshot }: { snapshot: BatchSnapshot }) {
  const t = useT();
  const [busy, setBusy] = useState<number | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());

  const ready = useMemo(
    () =>
      snapshot.items.flatMap((i) =>
        i.output && i.outputName
          ? [{ name: i.outputName, blob: i.output, size: i.output.size }]
          : [],
      ),
    [snapshot.items],
  );
  const batches = useMemo(
    () => splitIntoBatches(ready, LIMITS.zipMaxFiles, LIMITS.zipMaxBytes),
    [ready],
  );
  const ok = snapshot.items.filter((i) => i.status === 'done').length;
  const failed = snapshot.items.filter((i) => i.status === 'error').length;
  const saved = snapshot.items.filter((i) => i.saved).length;

  if (snapshot.running || ok === 0) return null;

  const download = async (index: number) => {
    const batch = batches[index];
    if (!batch || busy !== null) return;
    setBusy(index);
    try {
      const zip = await buildZip(batch);
      downloadBlob(zip, zipName(new Date(), index, batches.length));
      setDone((prev) => new Set(prev).add(index));
    } finally {
      setBusy(null);
    }
  };

  const single = ready.length === 1 ? ready[0] : undefined;

  return (
    <div
      className="animate-fade-in space-y-3 rounded-2xl border border-accent/30 bg-accent/5 p-4"
      data-testid="download-panel"
    >
      <p className="flex items-center gap-2 font-medium" role="status">
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent text-on-accent">
          <Icon name="check" className="size-4" />
        </span>
        {t.progress.finished(ok, failed)}
      </p>
      {saved > 0 && snapshot.destination && (
        <p className="text-sm text-muted">{t.progress.savedTo(snapshot.destination)}</p>
      )}
      {single && (
        <button
          type="button"
          className="btn-primary w-full sm:w-auto"
          onClick={() => downloadBlob(single.blob, single.name)}
        >
          <Icon name="download" />
          {t.actions.download}
        </button>
      )}
      {!single && batches.length === 1 && (
        <button
          type="button"
          className="btn-primary w-full sm:w-auto"
          disabled={busy !== null}
          onClick={() => void download(0)}
        >
          <Icon name="download" />
          {busy === 0 ? t.actions.preparingZip : t.actions.downloadAll}
        </button>
      )}
      {batches.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {batches.map((batch, i) => (
            <button
              key={i}
              type="button"
              className={done.has(i) ? 'btn-secondary' : 'btn-primary'}
              disabled={busy !== null}
              onClick={() => void download(i)}
              aria-label={`${t.actions.downloadPart(i + 1, batches.length)} (${batch.length})`}
            >
              {done.has(i) ? <Icon name="check" /> : <Icon name="download" />}
              {busy === i ? t.actions.preparingZip : t.actions.downloadPart(i + 1, batches.length)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
