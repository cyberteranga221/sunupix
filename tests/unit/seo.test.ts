import { describe, expect, it } from 'vitest';
import { fr } from '../../src/i18n/fr';
import { routes } from '../../src/routes';
import { faqPageLd, renderHead } from '../../src/seo/head';

describe('SEO', () => {
  it('échappe le HTML et neutralise « < » dans le JSON-LD', () => {
    const head = renderHead({
      title: 'A & B <script>',
      description: 'x "y"',
      path: '/test',
      jsonLd: [faqPageLd([{ q: '</script><b>', a: 'ok' }])],
    });
    expect(head).toContain('<title>A &amp; B &lt;script&gt;</title>');
    expect(head).toContain('content="x &quot;y&quot;"');
    expect(head).not.toContain('</script><b>');
    expect(head).toContain('\\u003c/script>');
  });

  it('chaque page a un titre et une description uniques', () => {
    const metas = routes.map((r) => r.meta(fr));
    expect(new Set(metas.map((m) => m.title)).size).toBe(routes.length);
    expect(new Set(metas.map((m) => m.description)).size).toBe(routes.length);
    for (const m of metas) {
      expect(m.description.length).toBeGreaterThan(50);
      expect(m.description.length).toBeLessThanOrEqual(170);
    }
  });

  it('la 404 n’est pas indexée', () => {
    const notFound = routes.find((r) => r.path === '*')!;
    expect(notFound.meta(fr).noindex).toBe(true);
    expect(notFound.sitemap).toBe(false);
  });
});
