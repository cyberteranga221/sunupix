import { useSyncExternalStore } from 'react';
import { analyticsConsent, setAnalyticsConsent, subscribeAnalytics } from '../analytics';
import { FEATURES } from '../config';
import { useT } from '../i18n';
import { PageShell, Sections } from './PageShell';

export function PrivacyPage() {
  const t = useT();
  const consent = useSyncExternalStore(subscribeAnalytics, analyticsConsent, () => true);
  return (
    <PageShell title={t.pages.privacyTitle} lead={t.pages.privacyLead}>
      <Sections items={t.pages.privacySections} />
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
        <div>
          <p className="font-medium">{t.pages.analyticsLabel}</p>
          <p className="text-sm text-muted" aria-live="polite">
            {FEATURES.analytics
              ? consent
                ? t.pages.analyticsOn
                : t.pages.analyticsOff
              : t.pages.analyticsDisabled}
          </p>
        </div>
        {FEATURES.analytics && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setAnalyticsConsent(!consent)}
          >
            {consent ? t.pages.analyticsToggleOff : t.pages.analyticsToggleOn}
          </button>
        )}
      </div>
    </PageShell>
  );
}
