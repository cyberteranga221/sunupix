/**
 * Textes en français (langue par défaut).
 * Toute clé ajoutée ici doit aussi exister dans en.ts : TypeScript le vérifie.
 */
export const fr = {
  locale: 'fr-FR',
  langName: 'Français',
  common: {
    appName: 'SunuPix',
    slogan: 'Convertis tes photos iPhone en JPG ou PNG. Gratuit, sans upload.',
    skipToContent: 'Aller au contenu',
    close: 'Fermer',
  },
  nav: {
    home: 'Convertisseur',
    faq: 'FAQ',
    about: 'À propos',
    privacy: 'Confidentialité',
    contact: 'Contact',
    menu: 'Menu',
    themeLight: 'Passer en mode clair',
    themeDark: 'Passer en mode sombre',
    switchLanguage: 'English',
    switchLanguageLabel: 'Switch to English',
  },
  hero: {
    title: 'Convertis tes photos iPhone en JPG ou PNG',
    subtitle:
      'Gratuit, sans inscription et sans upload : tes photos restent sur ton appareil. Jusqu’à 400 photos d’un coup.',
    badgePrivate: '100 % privé',
    badgeFree: 'Gratuit',
    badgeOffline: 'Marche hors ligne',
  },
  steps: {
    label: 'Étapes',
    choose: 'Choisis tes photos',
    format: 'Choisis le format',
    download: 'Télécharge',
  },
  dropzone: {
    title: 'Glisse tes photos ici',
    titleTouch: 'Ajoute tes photos',
    titleActive: 'Lâche tes photos pour les ajouter',
    or: 'ou',
    pickFiles: 'Choisir des photos',
    pickFolder: 'Choisir un dossier',
    hint: (maxFiles: number, maxMb: number) =>
      `HEIC, HEIF, JPEG, PNG, WebP, AVIF, GIF, BMP · ${maxFiles} photos max · ${maxMb} Mo max par photo`,
    addMore: 'Ajouter des photos',
  },
  options: {
    title: 'Réglages',
    format: 'Format de sortie',
    formatJpegHint: 'Le plus compatible, fichiers légers',
    formatPngHint: 'Sans perte, fichiers lourds',
    formatWebpHint: 'Moderne et léger',
    webpUnsupported: 'Ton navigateur ne sait pas créer de WebP (Safari). Choisis JPG ou PNG.',
    quality: 'Qualité',
    qualityHint: 'Entre 80 et 92 %, la différence est invisible et le fichier plus léger.',
    resize: 'Taille',
    resizeOriginal: 'Originale',
    resize4k: '4K (3840 px)',
    resize1080: 'Full HD (1920 px)',
    resize720: 'HD (1280 px)',
    resizeCustom: 'Personnalisée',
    customSide: 'Côté le plus long (px)',
    metadata: 'Métadonnées (EXIF)',
    metadataStrip: 'Tout supprimer',
    metadataStripHint: 'Recommandé : date, appareil et position GPS sont effacés.',
    metadataKeepNoGps: 'Garder, sauf la position GPS',
    metadataKeepNoGpsHint: 'Garde la date et l’appareil, retire le lieu.',
    metadataKeep: 'Tout garder',
    metadataKeepHint: 'Attention : la position GPS de la photo est conservée.',
    metadataJpegOnly: 'Les métadonnées ne sont conservées qu’en JPG.',
    destination: 'Enregistrement',
    destinationZip: 'Télécharger (ZIP)',
    destinationFolder: 'Directement dans un dossier',
    destinationFolderHint: 'Chaque photo est écrite dès qu’elle est prête. Idéal pour 400 photos.',
  },
  actions: {
    convert: (n: number) => (n > 1 ? `Convertir ${n} photos` : 'Convertir la photo'),
    reconvert: 'Reconvertir avec ces réglages',
    pause: 'Pause',
    resume: 'Reprendre',
    cancelAll: 'Tout annuler',
    clear: 'Vider la liste',
    retry: 'Réessayer',
    remove: 'Retirer',
    cancel: 'Annuler',
    download: 'Télécharger',
    downloadAll: 'Tout télécharger en ZIP',
    downloadPart: (i: number, total: number) => `ZIP ${i} sur ${total}`,
    preparingZip: 'Préparation du ZIP…',
  },
  progress: {
    label: 'Progression',
    count: (done: number, total: number) => `${done} sur ${total}`,
    remaining: (time: string) => `environ ${time} restantes`,
    remainingSoon: 'presque terminé',
    estimating: 'estimation du temps…',
    paused: 'En pause',
    finished: (ok: number, failed: number) =>
      failed > 0
        ? `${ok} photo${ok > 1 ? 's' : ''} convertie${ok > 1 ? 's' : ''}, ${failed} en erreur`
        : `${ok} photo${ok > 1 ? 's' : ''} convertie${ok > 1 ? 's' : ''}`,
    savedTo: (folder: string) => `Enregistrées dans le dossier « ${folder} »`,
    seconds: (n: number) => `${n} s`,
    minutes: (n: number) => `${n} min`,
  },
  list: {
    title: (n: number) => `${n} photo${n > 1 ? 's' : ''}`,
    empty: 'Aucune photo pour l’instant.',
    original: 'Originale',
    converted: 'Convertie',
    status: {
      pending: 'En attente',
      processing: 'En cours',
      done: 'Terminé',
      error: 'Erreur',
      cancelled: 'Annulé',
    },
    saved: 'Enregistrée',
  },
  errors: {
    unsupported: 'Format non supporté. Formats acceptés : HEIC, JPEG, PNG, WebP, AVIF, GIF, BMP.',
    corrupt: 'Fichier illisible ou abîmé.',
    'too-large': (maxMb: number) => `Fichier trop lourd (plus de ${maxMb} Mo).`,
    'out-of-memory':
      'Mémoire insuffisante. Ferme d’autres onglets ou convertis moins de photos à la fois.',
    'canvas-too-large': 'Photo trop grande pour ce navigateur, même après réduction.',
    'encode-unsupported': 'Ton navigateur ne sait pas créer ce format. Essaie JPG ou PNG.',
    'decoder-unavailable':
      'Le décodeur HEIC n’a pas pu être chargé. Vérifie ta connexion puis réessaie.',
    'save-failed': 'Impossible d’écrire dans le dossier. Tu peux télécharger la photo ici.',
    unknown: 'Erreur inattendue pendant la conversion.',
  },
  warnings: {
    'downscaled-for-device': 'Réduite automatiquement : trop grande pour ce navigateur.',
    'metadata-not-kept': 'Métadonnées non conservées dans ce format.',
  },
  notices: {
    overflow: (n: number, max: number) =>
      `${n} photo${n > 1 ? 's' : ''} non ajoutée${n > 1 ? 's' : ''} : ${max} photos maximum par lot.`,
    lowMemory:
      'Ton appareil semble limité en mémoire. Pour un gros lot, convertis par paquets de 100 photos et télécharge au fur et à mesure.',
    privacy: 'Tes photos ne quittent jamais ton appareil.',
  },
  units: {
    bytes: ['o', 'Ko', 'Mo', 'Go'],
  },
};

/** Forme du dictionnaire : chaque langue doit la respecter. */
export type Dictionary = typeof fr;
