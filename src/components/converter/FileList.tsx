import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useRef } from 'react';
import { LIMITS } from '../../config';
import { downloadBlob } from '../../engine/save';
import { useT } from '../../i18n';
import { formatBytes } from '../../i18n/format';
import type { BatchItem } from '../../state/batch';
import { getBatchStore } from '../../state/batch';
import { Icon } from '../Icon';

const ROW_HEIGHT = 68;

/** Liste virtualisée : seules les lignes visibles existent dans le DOM (fluide avec 400 photos). */
export function FileList({ items }: { items: readonly BatchItem[] }) {
  const t = useT();
  const parent = useRef<HTMLDivElement>(null);
  // La virtualisation n'est pas mémoïsable par le compilateur React : sans conséquence ici.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parent.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    getItemKey: (index) => items[index]?.id ?? index,
    // Rendu initial (et tests) : quelques lignes même avant la mesure du conteneur.
    initialRect: { width: 600, height: ROW_HEIGHT * 6 },
  });

  if (items.length === 0) return null;

  return (
    <div
      ref={parent}
      className="border-line bg-surface max-h-[28rem] overflow-y-auto overscroll-contain rounded-2xl border"
      role="list"
      aria-label={t.list.title(items.length)}
      data-testid="file-list"
    >
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((row) => {
          const item = items[row.index];
          if (!item) return null;
          return (
            <div
              key={row.key}
              role="listitem"
              className="absolute inset-x-0 top-0"
              style={{ height: ROW_HEIGHT, transform: `translateY(${row.start}px)` }}
            >
              <Row item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const statusStyle: Record<BatchItem['status'], string> = {
  pending: 'bg-surface-2 text-muted',
  processing: 'bg-accent/10 text-accent',
  done: 'bg-accent/10 text-accent',
  error: 'bg-danger/10 text-danger',
  cancelled: 'bg-surface-2 text-muted',
};

const Row = memo(function Row({ item }: { item: BatchItem }) {
  const t = useT();
  const store = getBatchStore();
  const maxMb = Math.round(LIMITS.maxFileBytes / 1024 / 1024);
  const errorText = item.error
    ? item.error === 'too-large'
      ? t.errors['too-large'](maxMb)
      : t.errors[item.error]
    : null;
  const warning = item.warnings[0] ? t.warnings[item.warnings[0]] : null;
  const detail = errorText ?? warning;
  const canRetry = item.status === 'error' && item.format !== null && item.error !== 'too-large';

  return (
    <div
      className="border-line/60 flex h-full items-center gap-3 border-b px-3 sm:px-4"
      data-status={item.status}
    >
      <div className="bg-surface-2 relative size-12 shrink-0 overflow-hidden rounded-lg">
        {item.thumbUrl ? (
          <img
            src={item.thumbUrl}
            alt=""
            className="size-full object-cover"
            decoding="async"
            loading="lazy"
          />
        ) : (
          <span className="text-muted flex size-full items-center justify-center text-[10px] font-semibold uppercase">
            {item.format ?? '?'}
          </span>
        )}
        {item.status === 'processing' && (
          <span className="bg-accent/20 absolute inset-x-0 bottom-0 h-1 overflow-hidden">
            <span className="animate-indeterminate bg-accent block h-full w-2/5" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" title={item.name}>
          {item.status === 'done' && item.outputName ? item.outputName : item.name}
        </p>
        <p
          className={`truncate text-xs ${errorText ? 'text-danger' : warning ? 'text-warn' : 'text-muted'}`}
        >
          {detail ??
            (item.outputSize !== undefined
              ? `${formatBytes(item.size, t)} → ${formatBytes(item.outputSize, t)}`
              : formatBytes(item.size, t))}
        </p>
      </div>
      <span
        className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:inline ${statusStyle[item.status]}`}
      >
        {item.saved ? t.list.saved : t.list.status[item.status]}
      </span>
      <div className="flex shrink-0 items-center">
        {item.output && item.outputName && (
          <RowButton
            label={`${t.actions.download} ${item.outputName}`}
            icon="download"
            onClick={() => item.output && downloadBlob(item.output, item.outputName ?? 'photo')}
          />
        )}
        {canRetry && (
          <RowButton label={t.actions.retry} icon="retry" onClick={() => store.retry(item.id)} />
        )}
        {item.status === 'done' && !item.output && item.saved && (
          <span className="text-accent p-2" aria-hidden="true">
            <Icon name="check" />
          </span>
        )}
        <RowButton
          label={`${item.status === 'processing' ? t.actions.cancel : t.actions.remove} ${item.name}`}
          icon="x"
          onClick={() => store.remove(item.id)}
        />
      </div>
    </div>
  );
});

function RowButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: 'download' | 'retry' | 'x';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="text-muted hover:bg-surface-2 hover:text-fg inline-flex size-10 items-center justify-center rounded-full transition"
    >
      <Icon name={icon} className="size-[18px]" />
    </button>
  );
}
