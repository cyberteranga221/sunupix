import { Icon } from '../components/Icon';
import { APP } from '../config';
import { useT } from '../i18n';
import { PageShell } from './PageShell';

export function ContactPage() {
  const t = useT();
  return (
    <PageShell title={t.pages.contactTitle} lead={t.pages.contactLead}>
      <div className="space-y-3">
        <a
          href={`${APP.repoUrl}/issues/new/choose`}
          rel="noopener"
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:border-fg/25"
        >
          <Icon name="github" className="size-6 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block font-medium">{t.pages.contactIssue}</span>
            <span className="block text-sm text-muted">{t.pages.contactIssueHint}</span>
          </span>
          <Icon name="arrow" className="size-4 shrink-0 text-muted" />
        </a>
        {APP.contactEmail && (
          <a
            href={`mailto:${APP.contactEmail}`}
            className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:border-fg/25"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{t.pages.contactEmail}</span>
              <span className="block font-mono text-sm text-muted">{APP.contactEmail}</span>
            </span>
            <Icon name="arrow" className="size-4 shrink-0 text-muted" />
          </a>
        )}
      </div>
      <p className="mt-8 flex gap-3 text-sm leading-relaxed text-muted">
        <Icon name="lock" className="mt-0.5 size-4 shrink-0" />
        {t.pages.contactTip}
      </p>
    </PageShell>
  );
}
