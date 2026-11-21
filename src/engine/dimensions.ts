export interface TargetSize {
  width: number;
  height: number;
  /** Vrai si l'image a dû être réduite à cause des limites de l'appareil (canvas). */
  limitedByDevice: boolean;
}

/**
 * Calcule la taille de sortie :
 *  - `maxSide` : côté le plus long voulu par l'utilisateur (null = taille d'origine) ;
 *  - `maxArea` / `maxCanvasSide` : limites techniques du navigateur.
 * L'image n'est jamais agrandie et ses proportions sont conservées.
 */
export function computeTargetSize(
  width: number,
  height: number,
  maxSide: number | null,
  maxArea: number,
  maxCanvasSide: number,
): TargetSize {
  let scale = 1;
  const longest = Math.max(width, height);
  if (maxSide && longest > maxSide) scale = maxSide / longest;

  let limitedByDevice = false;
  const sideScale = maxCanvasSide / Math.max(width * scale, height * scale);
  if (sideScale < 1) {
    scale *= sideScale;
    limitedByDevice = true;
  }
  const area = width * scale * (height * scale);
  if (area > maxArea) {
    scale *= Math.sqrt(maxArea / area);
    limitedByDevice = true;
  }
  return {
    width: Math.max(1, Math.floor(width * scale)),
    height: Math.max(1, Math.floor(height * scale)),
    limitedByDevice,
  };
}
