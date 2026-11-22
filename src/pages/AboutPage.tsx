import { useT } from '../i18n';
import { PageShell, Sections } from './PageShell';

export function AboutPage() {
  const t = useT();
  return (
    <PageShell title={t.pages.aboutTitle} lead={t.pages.aboutLead}>
      <Sections items={t.pages.aboutSections} />
    </PageShell>
  );
}
