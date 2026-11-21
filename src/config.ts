/**
 * Configuration centrale de SunuPix.
 *
 * C'est le SEUL fichier à modifier pour changer le nom, les limites ou activer
 * les options (statistiques, publicité, dons). Les couleurs sont dans
 * `src/styles.css` (bloc `@theme`).
 */

export const APP = {
  name: 'SunuPix',
  /** URL publique de production (sans barre oblique finale), utilisée pour le SEO. */
  siteUrl: 'https://sunupix.vercel.app',
  repoUrl: 'https://github.com/cyberteranga221/sunupix',
  contactEmail: 'contact@sunupix.app',
} as const;

/** Limites du mode gros volume. */
export const LIMITS = {
  /** Nombre maximal de fichiers par lot. */
  maxFiles: 400,
  /** Taille maximale d'un fichier d'entrée, en octets. */
  maxFileBytes: 50 * 1024 * 1024,
  /** Découpage des ZIP : nombre maximal de photos par archive. */
  zipMaxFiles: 100,
  /** Découpage des ZIP : taille maximale d'une archive, en octets. */
  zipMaxBytes: 500 * 1024 * 1024,
  /** Bornes du nombre de conversions simultanées. */
  minConcurrency: 2,
  maxConcurrency: 4,
} as const;

/** Paramètres du moteur de conversion. */
export const ENGINE = {
  /**
   * Surface maximale d'un canvas (en pixels) sur iPhone / iPad.
   * Safari iOS refuse les canvas de plus de 16 777 216 px (4096 × 4096).
   */
  maxCanvasAreaIOS: 16_777_216,
  /**
   * Surface maximale ailleurs. Volontairement prudente (≈ 100 Mpx) pour
   * limiter la mémoire : une image RGBA de 100 Mpx occupe déjà 400 Mo.
   */
  maxCanvasAreaDefault: 100_000_000,
  /** Côté maximal d'un canvas, toutes plateformes. */
  maxCanvasSide: 16_384,
  /**
   * Un worker dont la mémoire WebAssembly dépasse ce seuil est recyclé
   * (la mémoire WASM ne rétrécit jamais d'elle-même).
   */
  workerRecycleHeapBytes: 512 * 1024 * 1024,
  /** Côté le plus long des miniatures, en pixels (affichées en 48 px, écrans Retina). */
  thumbnailSize: 96,
  /** Qualité par défaut pour JPEG et WebP (0 à 1). */
  defaultQuality: 0.9,
} as const;

/** Préréglages de redimensionnement : côté le plus long, en pixels. */
export const RESIZE_PRESETS = {
  original: null,
  '4k': 3840,
  '1080p': 1920,
  '720p': 1280,
} as const;

/** Options activables. Tout ce qui touche à l'argent est DÉSACTIVÉ par défaut. */
export const FEATURES = {
  /** Statistiques Vercel Web Analytics (sans cookies). L'utilisateur peut les refuser. */
  analytics: true,
  /** Emplacements publicitaires (AdSense). Nécessite un plan Vercel payant. */
  ads: false,
  adsenseClientId: '',
  /** Bouton de don. */
  donate: false,
  donateUrl: '',
} as const;
