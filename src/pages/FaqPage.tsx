import { useT } from '../i18n';
import { FaqList, PageShell } from './PageShell';

export function FaqPage() {
  const t = useT();
  return (
    <PageShell title={t.home.faqTitle} lead={t.pages.faqIntro}>
      <FaqList items={[...t.home.faq, ...t.pages.faqMore]} />
    </PageShell>
  );
}
