/**
 * Orientation EXIF.
 *
 * Les navigateurs modernes appliquent eux-mêmes l'orientation EXIF lors du décodage
 * (`createImageBitmap`). On le vérifie une fois avec une image de 2 × 1 px marquée
 * « orientation 6 » : si le navigateur la rend en 1 × 2, il oriente déjà les photos.
 * Sinon, on applique la rotation nous-mêmes sur le canvas.
 */

const PROBE_JPEG =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAABAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDFoooryz7w/9k=';

let probe: Promise<boolean> | null = null;

/** Vrai si `createImageBitmap` applique déjà l'orientation EXIF (résultat mis en cache). */
export function browserAppliesOrientation(): Promise<boolean> {
  probe ??= (async () => {
    const bytes = Uint8Array.from(atob(PROBE_JPEG), (c) => c.charCodeAt(0));
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }));
    const applied = bitmap.width === 1 && bitmap.height === 2;
    bitmap.close();
    return applied;
  })().catch(() => true);
  return probe;
}

/** Vrai si l'orientation échange largeur et hauteur (rotation de 90°). */
export const swapsDimensions = (orientation: number) => orientation >= 5 && orientation <= 8;

type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/**
 * Prépare le contexte pour dessiner une image brute (`width` × `height`, non orientée)
 * de façon à ce qu'elle apparaisse correctement orientée.
 */
export function applyOrientation(ctx: Ctx2D, orientation: number, width: number, height: number) {
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default:
      break;
  }
}
