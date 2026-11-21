import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { extractJpegExif, hasGps, readOrientation } from '../../src/engine/exif';

const fixture = (name: string) => join(import.meta.dirname, '..', 'fixtures', name);

/** Lit les noms de fichiers d'un ZIP (répertoire central). */
function zipEntries(zip: Buffer): string[] {
  const names: string[] = [];
  for (let i = 0; i + 46 < zip.length; i++) {
    if (zip.readUInt32LE(i) !== 0x02014b50) continue;
    const nameLength = zip.readUInt16LE(i + 28);
    names.push(zip.subarray(i + 46, i + 46 + nameLength).toString('utf8'));
  }
  return names;
}

test('convertit HEIC, PNG et JPEG en JPG et gère les erreurs', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('photos iPhone');

  await page
    .getByTestId('file-input')
    .setInputFiles([
      fixture('sample.heic'),
      fixture('p3.heic'),
      fixture('sample.png'),
      fixture('rotated-6.jpg'),
      fixture('corrupt.heic'),
      fixture('not-an-image.jpg'),
    ]);
  const list = page.getByTestId('file-list');
  await expect(list.getByRole('listitem')).toHaveCount(6);

  await page.getByTestId('convert').click();
  const panel = page.getByTestId('download-panel');
  await expect(panel).toBeVisible({ timeout: 30_000 });
  await expect(panel).toContainText('4 photos converties, 2 en erreur');

  await expect(list.locator('[data-status="done"]')).toHaveCount(4);
  await expect(list.locator('[data-status="error"]')).toHaveCount(2);
  await expect(list).toContainText('sample.jpg');
  await expect(list).toContainText('sample (2).jpg');

  const downloadPromise = page.waitForEvent('download');
  await panel.getByRole('button', { name: 'Tout télécharger en ZIP' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^sunupix-\d{4}-\d{2}-\d{2}\.zip$/);
  const zip = await readFile((await download.path())!);
  expect(zipEntries(zip).sort()).toEqual([
    'p3.jpg',
    'rotated-6.jpg',
    'sample (2).jpg',
    'sample.jpg',
  ]);
  expect(errors).toEqual([]);
});

test('supprime toutes les métadonnées par défaut', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('file-input').setInputFiles([fixture('sample.jpg')]);
  await page.getByTestId('convert').click();
  const panel = page.getByTestId('download-panel');
  await expect(panel).toBeVisible({ timeout: 30_000 });
  const downloadPromise = page.waitForEvent('download');
  await panel.getByRole('button', { name: 'Télécharger' }).click();
  const jpeg = await readFile((await downloadPromise.then((d) => d.path()))!);
  expect(extractJpegExif(new Uint8Array(jpeg))).toBeNull();
});

test('respecte l’orientation EXIF et la taille demandée', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('file-input').setInputFiles([fixture('rotated-6.jpg')]);
  await page.getByTestId('convert').click();
  const panel = page.getByTestId('download-panel');
  await expect(panel).toBeVisible({ timeout: 30_000 });
  const downloadPromise = page.waitForEvent('download');
  await panel.getByRole('button', { name: 'Télécharger' }).click();
  const file = await readFile((await downloadPromise.then((d) => d.path()))!);
  // Lit la taille dans le JPEG produit (segment SOF0/SOF2).
  const size = await page.evaluate(async (bytes) => {
    const bitmap = await createImageBitmap(
      new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' }),
    );
    return [bitmap.width, bitmap.height];
  }, Array.from(file));
  // 64 × 48 orientée « 6 » → 48 × 64 une fois tournée.
  expect(size).toEqual([48, 64]);
});

test('conserve les métadonnées sans le GPS quand on le demande', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Garder, sauf la position GPS').click();
  await page.getByTestId('file-input').setInputFiles([fixture('sample.heic')]);
  await page.getByTestId('convert').click();
  const panel = page.getByTestId('download-panel');
  await expect(panel).toBeVisible({ timeout: 30_000 });
  const downloadPromise = page.waitForEvent('download');
  await panel.getByRole('button', { name: 'Télécharger' }).click();
  const jpeg = await readFile((await downloadPromise.then((d) => d.path()))!);
  const exif = extractJpegExif(new Uint8Array(jpeg));
  expect(exif).not.toBeNull();
  expect(Buffer.from(exif!).toString('latin1')).toContain('SunuPix Test');
  expect(readOrientation(exif!)).toBe(1);
  expect(hasGps(exif!)).toBe(false);

  // Le choix est mémorisé pour la prochaine visite.
  await page.reload();
  await expect(page.getByLabel('Garder, sauf la position GPS')).toBeChecked();
});

test('découpe en plusieurs ZIP au-delà de 100 photos', async ({ page }) => {
  await page.goto('/');
  const png = await readFile(fixture('sample.png'));
  const files = Array.from({ length: 101 }, (_, i) => ({
    name: `photo-${i}.png`,
    mimeType: 'image/png',
    buffer: png,
  }));
  await page.getByTestId('file-input').setInputFiles(files);
  await page.getByTestId('convert').click();
  const panel = page.getByTestId('download-panel');
  await expect(panel).toBeVisible({ timeout: 60_000 });
  await expect(panel.getByRole('button', { name: /ZIP 1 sur 2/ })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await panel.getByRole('button', { name: /ZIP 2 sur 2/ }).click();
  const zip = await readFile((await (await downloadPromise).path())!);
  expect(zipEntries(zip)).toEqual(['photo-100.jpg']);
});

test('enregistre directement dans un dossier (File System Access)', async ({ page }) => {
  // Simule le sélecteur de dossier avec le stockage privé du navigateur (OPFS).
  await page.addInitScript(() => {
    (
      window as unknown as { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }
    ).showDirectoryPicker = async () => {
      const root = await navigator.storage.getDirectory();
      return root.getDirectoryHandle('sortie', { create: true });
    };
  });
  await page.goto('/');
  await page.getByText('Directement dans un dossier').click();
  await page
    .getByTestId('file-input')
    .setInputFiles([fixture('sample.heic'), fixture('sample.png')]);
  await page.getByTestId('convert').click();
  const panel = page.getByTestId('download-panel');
  await expect(panel).toBeVisible({ timeout: 30_000 });
  await expect(panel).toContainText('« sortie »');
  const written = await page.evaluate(async () => {
    const dir = await (await navigator.storage.getDirectory()).getDirectoryHandle('sortie');
    const names: string[] = [];
    for await (const name of (dir as unknown as { keys(): AsyncIterable<string> }).keys())
      names.push(name);
    return names.sort();
  });
  expect(written).toEqual(['sample (2).jpg', 'sample.jpg']);
});
