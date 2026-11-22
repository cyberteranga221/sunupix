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
    converters: 'Conversions',
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
  seo: {
    siteName: 'SunuPix',
    home: {
      title: 'SunuPix — Convertir HEIC en JPG ou PNG, gratuit et sans upload',
      description:
        'Convertis des centaines de photos HEIC (iPhone) en JPG ou PNG, gratuitement. Aucune photo envoyée : tout se fait dans ton navigateur.',
    },
    faq: {
      title: 'Questions fréquentes — SunuPix',
      description:
        'HEIC, qualité, confidentialité, gros volumes, iPhone et Android : toutes les réponses sur la conversion de photos avec SunuPix.',
    },
    privacy: {
      title: 'Confidentialité — SunuPix',
      description:
        'SunuPix ne reçoit jamais tes photos : la conversion se fait sur ton appareil. Ce que nous stockons (presque rien) et pourquoi.',
    },
    about: {
      title: 'À propos — SunuPix',
      description:
        'SunuPix est un convertisseur d’images gratuit pensé au Sénégal pour les photographes et pour tous ceux qui partagent des photos.',
    },
    contact: {
      title: 'Contact — SunuPix',
      description: 'Une question, un bug, une idée ? Voici comment contacter l’équipe SunuPix.',
    },
    notFound: {
      title: 'Page introuvable — SunuPix',
      description: 'Cette page n’existe pas. Retourne au convertisseur SunuPix.',
    },
  },
  converters: {
    otherTitle: 'Autres conversions',
    items: {
      'heic-en-jpg': {
        label: 'HEIC en JPG',
        title: 'Convertir HEIC en JPG — gratuit, sans upload | SunuPix',
        description:
          'Convertis tes photos HEIC d’iPhone en JPG en quelques secondes, jusqu’à 400 à la fois. Gratuit et privé : rien n’est envoyé sur Internet.',
        h1: 'Convertir HEIC en JPG',
        intro:
          'Transforme tes photos HEIC en JPG lisibles partout : Windows, WhatsApp, réseaux sociaux, impression. Jusqu’à 400 photos à la fois, sans les envoyer nulle part.',
        body: [
          'Le HEIC est le format photo par défaut des iPhone depuis 2017. Il est léger, mais beaucoup d’ordinateurs, de sites et d’imprimeurs ne savent pas l’ouvrir. Le JPG, lui, fonctionne partout.',
          'SunuPix décode chaque photo directement dans ton navigateur, la remet dans le bon sens et l’enregistre en JPG. À 90 % de qualité, la différence avec l’original est invisible, et le fichier reste raisonnablement léger.',
          'Astuce photographe : pour un gros lot, choisis « Directement dans un dossier » dans les réglages avancés (Chrome et Edge). Chaque photo est écrite sur ton disque dès qu’elle est prête.',
        ],
      },
      'heic-en-png': {
        label: 'HEIC en PNG',
        title: 'Convertir HEIC en PNG — sans perte, gratuit | SunuPix',
        description:
          'Convertis tes photos HEIC en PNG sans perte de qualité, directement dans ton navigateur. Gratuit, sans inscription et sans upload.',
        h1: 'Convertir HEIC en PNG',
        intro:
          'Passe tes photos HEIC en PNG, sans aucune perte de qualité. Idéal pour retoucher une image ou l’archiver. Tout se fait sur ton appareil.',
        body: [
          'Le PNG est un format sans perte : chaque pixel de la photo d’origine est conservé. C’est le bon choix pour une retouche dans Photoshop, Lightroom ou GIMP, ou pour un document où la netteté compte.',
          'Contrepartie : un PNG est plusieurs fois plus lourd qu’un JPG. Pour partager sur WhatsApp ou les réseaux sociaux, préfère le JPG.',
        ],
      },
      'png-en-jpg': {
        label: 'PNG en JPG',
        title: 'Convertir PNG en JPG — gratuit, sans upload | SunuPix',
        description:
          'Convertis tes images PNG en JPG plus légères, par lots de 400. Les zones transparentes deviennent blanches. Gratuit et privé.',
        h1: 'Convertir PNG en JPG',
        intro:
          'Allège tes images PNG en les convertissant en JPG : souvent 5 à 10 fois plus léger, parfait pour envoyer ou publier.',
        body: [
          'Les captures d’écran et les images exportées sont souvent en PNG, un format lourd. Le JPG les rend bien plus légères, avec une qualité visuellement identique pour les photos.',
          'Le JPG ne gère pas la transparence : les zones transparentes deviennent blanches. Pour garder la transparence, choisis WebP ou garde le PNG.',
        ],
      },
      'jpg-en-png': {
        label: 'JPG en PNG',
        title: 'Convertir JPG en PNG — gratuit, sans upload | SunuPix',
        description:
          'Convertis tes images JPG en PNG directement dans ton navigateur, sans les envoyer sur Internet. Gratuit, rapide, jusqu’à 400 images.',
        h1: 'Convertir JPG en PNG',
        intro:
          'Convertis tes JPG en PNG, par exemple pour un logiciel ou un site qui n’accepte que ce format. Rapide, gratuit et sans upload.',
        body: [
          'Convertir un JPG en PNG ne lui rend pas la qualité déjà perdue lors de la compression JPG, mais garantit qu’aucune perte supplémentaire ne sera ajoutée lors des prochaines retouches.',
          'Le fichier PNG obtenu sera plus lourd que le JPG d’origine : c’est normal.',
        ],
      },
      'webp-en-jpg': {
        label: 'WebP en JPG',
        title: 'Convertir WebP en JPG — gratuit, sans upload | SunuPix',
        description:
          'Convertis tes images WebP téléchargées sur Internet en JPG compatibles partout. Gratuit, privé, directement dans ton navigateur.',
        h1: 'Convertir WebP en JPG',
        intro:
          'Une image WebP enregistrée depuis un site ne s’ouvre pas partout ? Convertis-la en JPG, compatible avec tous les logiciels et appareils.',
        body: [
          'Le WebP est un format moderne utilisé par de nombreux sites pour aller plus vite. Mais certains logiciels anciens, imprimeurs ou formulaires en ligne ne l’acceptent pas encore.',
          'SunuPix convertit tes WebP en JPG sans rien envoyer : l’image reste sur ton appareil du début à la fin.',
        ],
      },
    },
  },
  pages: {
    faqIntro: 'Tout ce qu’il faut savoir pour convertir tes photos avec SunuPix.',
    faqMore: [
      {
        q: 'Mes photos sont-elles envoyées sur un serveur ?',
        a: 'Non, jamais. La conversion se fait dans ton navigateur, sur ton appareil. SunuPix n’a pas de serveur de conversion : il n’existe aucun endroit où tes photos pourraient être stockées.',
      },
      {
        q: 'Combien de photos puis-je convertir d’un coup ?',
        a: 'Jusqu’à 400 photos par lot, et 50 Mo maximum par photo. Pour les gros lots, SunuPix crée automatiquement plusieurs ZIP de 100 photos (ou 500 Mo) au maximum.',
      },
      {
        q: 'Mes photos seront-elles dans le bon sens ?',
        a: 'Oui. SunuPix lit l’orientation enregistrée par l’appareil photo et tourne l’image correctement avant de la convertir.',
      },
      {
        q: 'Que deviennent la date et la position GPS de mes photos ?',
        a: 'Par défaut, toutes les métadonnées sont supprimées, y compris la position GPS. Dans les réglages avancés, tu peux garder la date et l’appareil en retirant seulement le GPS, ou tout garder (en JPG uniquement).',
      },
      {
        q: 'Pourquoi le WebP n’est-il pas proposé sur Safari ?',
        a: 'Safari sait afficher le WebP mais pas en créer. Sur Mac et iPhone, utilise le JPG ou le PNG, ou ouvre SunuPix dans Chrome, Edge ou Firefox pour le WebP.',
      },
      {
        q: 'Est-ce que ça marche sans connexion ?',
        a: 'Oui, après une première visite. SunuPix s’installe dans ton navigateur et reste disponible hors ligne. Le décodeur HEIC est gardé en mémoire dès ta première conversion de photo HEIC.',
      },
      {
        q: 'Puis-je installer SunuPix comme une application ?',
        a: 'Oui. Sur iPhone : bouton Partager, puis « Sur l’écran d’accueil ». Sur Android et sur ordinateur avec Chrome ou Edge : icône d’installation dans la barre d’adresse.',
      },
    ],
    privacyTitle: 'Confidentialité',
    privacyLead:
      'SunuPix a été conçu pour que tes photos restent chez toi. Voici, sans jargon, ce qui se passe quand tu utilises le site.',
    privacySections: [
      {
        title: 'Tes photos',
        text: 'Elles ne quittent jamais ton appareil. Le site est téléchargé une fois, puis la conversion se fait entièrement dans ton navigateur. Aucun serveur ne reçoit, ne voit ni ne stocke tes images. Quand tu fermes l’onglet, tout est effacé de la mémoire.',
      },
      {
        title: 'Ce qui est enregistré sur ton appareil',
        text: 'Trois préférences seulement, dans le stockage local de ton navigateur : tes réglages de conversion, le thème clair ou sombre, et la langue. Elles ne sont jamais envoyées nulle part. Le site est aussi gardé en cache pour fonctionner hors ligne.',
      },
      {
        title: 'Statistiques de visite',
        text: 'Si elles sont activées, SunuPix utilise Vercel Web Analytics : un simple comptage des pages vues, sans cookie, sans identifiant personnel et sans suivi d’une visite à l’autre. Tu peux les refuser ci-dessous.',
      },
      {
        title: 'Hébergement',
        text: 'Le site est hébergé par Vercel. Comme tout hébergeur, Vercel traite techniquement ton adresse IP pour t’envoyer les pages ; elle n’est pas utilisée par SunuPix.',
      },
      {
        title: 'Publicité',
        text: 'Il n’y a aucune publicité sur SunuPix. Si cela changeait un jour, cette page serait mise à jour avant.',
      },
    ],
    analyticsLabel: 'Statistiques de visite anonymes',
    analyticsOn: 'Activées pour ce navigateur',
    analyticsOff: 'Refusées pour ce navigateur',
    analyticsDisabled: 'Les statistiques sont actuellement désactivées sur ce site.',
    analyticsToggleOff: 'Refuser',
    analyticsToggleOn: 'Accepter',
    aboutTitle: 'À propos',
    aboutLead:
      'SunuPix est né d’un besoin simple : convertir chaque jour des centaines de photos d’iPhone sans les confier à un site inconnu.',
    aboutSections: [
      {
        title: 'Pourquoi SunuPix',
        text: 'Les convertisseurs en ligne limitent le nombre de fichiers, ajoutent de la publicité et, surtout, envoient tes photos sur leurs serveurs. Pour un photographe qui travaille avec les images de ses clients, ce n’est pas acceptable. SunuPix fait tout sur ton appareil, gratuitement.',
      },
      {
        title: 'Pour qui',
        text: '« Sunu » veut dire « notre » en wolof. SunuPix est pensé pour le Sénégal et l’Afrique de l’Ouest : il fonctionne sur ordinateur comme sur téléphone, reste léger sur les connexions lentes et marche même hors ligne.',
      },
      {
        title: 'Comment ça marche',
        text: 'SunuPix utilise WebAssembly pour décoder le HEIC directement dans ton navigateur, et plusieurs « workers » pour convertir plusieurs photos en parallèle sans bloquer la page. Le code source est public sur GitHub.',
      },
      {
        title: 'Licence',
        text: 'Le code est public et réutilisable pour un usage non commercial (licence PolyForm Noncommercial 1.0.0). Le nom et le logo SunuPix sont des marques protégées.',
      },
    ],
    contactTitle: 'Contact',
    contactLead:
      'Une question, un bug, une idée d’amélioration ? Le plus simple est de passer par GitHub.',
    contactIssue: 'Signaler un problème ou proposer une idée',
    contactIssueHint: 'Ouvre une « issue » sur GitHub (compte gratuit nécessaire).',
    contactEmail: 'Écrire un e-mail',
    contactTip:
      'Pour un problème de conversion, indique ton navigateur, ton appareil et le type de fichier. N’envoie jamais tes photos privées.',
    notFoundTitle: 'Page introuvable',
    notFoundText: 'Cette page n’existe pas ou a été déplacée.',
    notFoundCta: 'Retour au convertisseur',
  },
  footer: {
    tagline: 'Convertisseur d’images gratuit, pensé pour le Sénégal et l’Afrique de l’Ouest.',
    license: 'Code source public · usage commercial interdit',
    thirdParty: 'Licences des composants tiers',
  },
  units: {
    bytes: ['o', 'Ko', 'Mo', 'Go'],
  },
};

/** Forme du dictionnaire : chaque langue doit la respecter. */
export type Dictionary = typeof fr;
