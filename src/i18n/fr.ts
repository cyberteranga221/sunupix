/**
 * Textes en français (langue par défaut).
 * Toute clé ajoutée ici doit aussi exister dans en.ts : TypeScript le vérifie.
 */
export const fr = {
  locale: 'fr-FR',
  langName: 'Français',
  common: {
    appName: 'SunuPix',
    slogan: 'Des centaines de photos converties. Aucune envoyée.',
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
    title: 'Des centaines de photos converties. Aucune envoyée.',
    subtitle:
      'Passe tes photos HEIC, PNG ou WebP en JPG ou PNG, jusqu’à 400 à la fois. Gratuit, et tout se fait sur ton appareil : tes images ne partent jamais sur Internet.',
    sampleName: 'IMG_4821',
    facts: [
      'Qualité et orientation préservées',
      'Jusqu’à 400 photos par lot',
      'Gratuit, sans compte ni filigrane',
    ],
  },
  steps: {
    label: 'Étapes',
    choose: 'Tes photos',
    format: 'Format de sortie',
    download: 'Convertis et télécharge',
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
    formatJpegHint: 'Compatible partout',
    formatPngHint: 'Sans perte, plus lourd',
    formatWebpHint: 'Léger, pour le web',
    recommended: 'Recommandé',
    advanced: 'Réglages avancés',
    summaryQuality: (n: number) => `Qualité ${n} %`,
    summaryMetadata: {
      strip: 'métadonnées supprimées',
      'keep-no-gps': 'métadonnées sans GPS',
      keep: 'toutes les métadonnées',
    },
    webpUnsupported: 'Non disponible sur Safari',
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
    convert: (n: number, format: string) =>
      n > 1 ? `Convertir ${n} photos en ${format}` : `Convertir la photo en ${format}`,
    convertEmpty: 'Ajoute des photos pour commencer',
    reconvert: 'Reconvertir avec ces réglages',
    pause: 'Pause',
    resume: 'Reprendre',
    cancelAll: 'Tout annuler',
    clear: 'Vider la liste',
    retry: 'Réessayer',
    remove: 'Retirer',
    cancel: 'Annuler',
    download: 'Télécharger',
    downloadAll: 'Télécharger le ZIP',
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
  home: {
    howTitle: 'Comment ça marche',
    how: [
      {
        title: 'Ajoute tes photos',
        text: 'Glisse un dossier entier depuis ton ordinateur, ou choisis tes photos dans la galerie de ton téléphone.',
      },
      {
        title: 'Choisis le format',
        text: 'JPG pour partager partout, PNG pour garder chaque pixel. Tes réglages sont mémorisés pour la prochaine fois.',
      },
      {
        title: 'Télécharge',
        text: 'Un ZIP pour tout récupérer d’un coup, découpé automatiquement pour les gros lots. Sur Chrome et Edge, enregistre directement dans un dossier.',
      },
    ],
    privacyTitle: 'Tes photos restent chez toi',
    privacyText:
      'La plupart des convertisseurs en ligne envoient tes photos sur leurs serveurs. SunuPix fait tout le travail dans ton navigateur, sur ton propre appareil. Personne d’autre ne voit tes images.',
    privacyPoints: [
      'Conversion locale, sans serveur ni stockage en ligne',
      'Position GPS et autres métadonnées supprimées par défaut',
      'Code source public et vérifiable par tous',
    ],
    faqTitle: 'Questions fréquentes',
    faq: [
      {
        q: 'Qu’est-ce qu’un fichier HEIC ?',
        a: 'C’est le format photo par défaut des iPhone. Il prend moins de place que le JPG, mais beaucoup d’ordinateurs, de sites et d’applications ne savent pas l’ouvrir. SunuPix le convertit en JPG ou PNG, lisibles partout.',
      },
      {
        q: 'Est-ce vraiment gratuit ?',
        a: 'Oui. Pas de compte, pas de limite cachée, pas de filigrane. Son code source est public et peut être vérifié par tous.',
      },
      {
        q: 'La qualité de mes photos est-elle conservée ?',
        a: 'Oui. À 90 % de qualité en JPG, la différence avec l’original est invisible à l’œil nu. Choisis PNG si tu veux une conversion sans aucune perte.',
      },
      {
        q: 'Ça marche sur téléphone ?',
        a: 'Oui, sur iPhone comme sur Android. Sur iPhone, les très grandes photos (48 Mpx) sont réduites automatiquement à environ 16 Mpx, car Safari limite la taille des images qu’il peut traiter.',
      },
    ],
  },
  footer: {
    tagline: 'Convertisseur d’images gratuit, pensé pour le Sénégal et l’Afrique de l’Ouest.',
    license: 'Code source public · usage commercial interdit',
  },
  units: {
    bytes: ['o', 'Ko', 'Mo', 'Go'],
  },
};

/** Forme du dictionnaire : chaque langue doit la respecter. */
export type Dictionary = typeof fr;
