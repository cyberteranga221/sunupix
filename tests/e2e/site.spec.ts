import { expect, test } from '@playwright/test';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..', '..');
const fixture = (name: string) => join(root, 'tests', 'fixtures', name);

test('chaque page pré-rendue a un titre, une description et un H1 uniques', async ({ page }) => {
  const paths = [
    '/',
    '/heic-en-jpg',
    '/heic-en-png',
    '/png-en-jpg',
    '/jpg-en-png',
    '/webp-en-jpg',
    '/faq',
    '/confidentialite',
    '/a-propos',
    '/contact',
  ];
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of paths) {
    // HTML brut, tel que le voit un moteur de recherche (sans JavaScript).
    const html = await (await page.request.get(path)).text();
    const title = /<title>([^<]+)<\/title>/.exec(html)?.[1] ?? '';
    const description = /<meta name="description" content="([^"]+)"/.exec(html)?.[1] ?? '';
    expect(title, path).not.toBe('');
    expect(html, path).toMatch(/<h1[^>]*>/);
    expect(html, path).toContain(`<link rel="canonical" href="https://sunupix.vercel.app${path}"`);
    titles.add(title);
    descriptions.add(description);
  }
  expect(titles.size).toBe(paths.length);
  expect(descriptions.size).toBe(paths.length);
});

test('données structurées, sitemap et robots.txt', async ({ page }) => {
  const home = await (await page.request.get('/')).text();
  const blocks = [...home.matchAll(/<script type="application\/ld\+json">(.+?)<\/script>/g)].map(
    (m) => JSON.parse(m[1]!),
  );
  expect(blocks.map((b) => b['@type'])).toEqual(['WebApplication', 'FAQPage']);
  const sitemap = await (await page.request.get('/sitemap.xml')).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(10);
  expect(await (await page.request.get('/robots.txt')).text()).toContain(
    'Sitemap: https://sunupix.vercel.app/sitemap.xml',
  );
});

test('page dédiée : le format est pré-réglé', async ({ page }) => {
  await page.goto('/heic-en-png');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Convertir HEIC en PNG');
  await page.getByTestId('file-input').setInputFiles([fixture('sample.heic')]);
  await expect(page.getByTestId('convert')).toHaveText(/en PNG/);
});

test('navigation : liens du pied de page et page 404', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('contentinfo').getByRole('link', { name: 'FAQ' }).click();
  await expect(page).toHaveURL(/\/faq$/);
  await expect(page).toHaveTitle('Questions fréquentes — SunuPix');
  const response = await page.goto('/cette-page-nexiste-pas');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
  expect(response?.status()).toBe(404);
});

test('la conversion HEIC fonctionne avec la politique de sécurité (CSP) de vercel.json', async ({
  page,
}) => {
  // Le serveur de test (scripts/serve.mjs) applique les en-têtes de vercel.json.
  const response = await page.goto('/');
  expect(response?.headers()['content-security-policy']).toContain("'wasm-unsafe-eval'");
  const violations: string[] = [];
  page.on('console', (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text());
  });
  page.on('worker', (w) =>
    w.on('console', (m) => {
      if (/Content Security Policy|Refused to/i.test(m.text()))
        violations.push(`worker: ${m.text()}`);
    }),
  );
  await page
    .getByTestId('file-input')
    .setInputFiles([fixture('sample.heic'), fixture('sample.png')]);
  await page.getByTestId('convert').click();
  await expect(page.getByTestId('download-panel')).toContainText('2 photos converties', {
    timeout: 30_000,
  });
  expect(violations).toEqual([]);
});

test('hors ligne après la première visite (service worker)', async ({ page, context }) => {
  await page.goto('/');
  // Première conversion HEIC : le décodeur est mis en cache.
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.getByTestId('file-input').setInputFiles([fixture('sample.heic')]);
  await page.getByTestId('convert').click();
  await expect(page.getByTestId('download-panel')).toBeVisible({ timeout: 30_000 });

  await context.setOffline(true);
  await page.goto('/faq');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Questions fréquentes');
  await page.goto('/');
  await page.getByTestId('file-input').setInputFiles([fixture('p3.heic')]);
  await page.getByTestId('convert').click();
  await expect(page.getByTestId('download-panel')).toContainText('1 photo convertie', {
    timeout: 30_000,
  });
  await context.setOffline(false);
});
