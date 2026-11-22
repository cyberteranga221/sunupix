import type { Dictionary } from './fr';

/** English texts. Must match the shape of fr.ts (checked by TypeScript). */
export const en: Dictionary = {
  locale: 'en-GB',
  langName: 'English',
  common: {
    appName: 'SunuPix',
    slogan: 'Hundreds of photos converted. None uploaded.',
    skipToContent: 'Skip to content',
    close: 'Close',
  },
  nav: {
    home: 'Converter',
    faq: 'FAQ',
    about: 'About',
    privacy: 'Privacy',
    contact: 'Contact',
    menu: 'Menu',
    themeLight: 'Switch to light mode',
    themeDark: 'Switch to dark mode',
    switchLanguage: 'Français',
    switchLanguageLabel: 'Passer en français',
  },
  hero: {
    title: 'Hundreds of photos converted. None uploaded.',
    subtitle:
      'Turn HEIC, PNG or WebP photos into JPG or PNG, up to 400 at a time. Free, and everything happens on your device: your images never go online.',
    sampleName: 'IMG_4821',
    facts: [
      'Quality and orientation preserved',
      'Up to 400 photos per batch',
      'Free, no account, no watermark',
    ],
  },
  steps: {
    label: 'Steps',
    choose: 'Your photos',
    format: 'Output format',
    download: 'Convert and download',
  },
  dropzone: {
    title: 'Drop your photos here',
    titleTouch: 'Add your photos',
    titleActive: 'Release to add your photos',
    or: 'or',
    pickFiles: 'Choose photos',
    pickFolder: 'Choose a folder',
    hint: (maxFiles: number, maxMb: number) =>
      `HEIC, HEIF, JPEG, PNG, WebP, AVIF, GIF, BMP · up to ${maxFiles} photos · ${maxMb} MB max each`,
    addMore: 'Add photos',
  },
  options: {
    title: 'Settings',
    format: 'Output format',
    formatJpegHint: 'Works everywhere',
    formatPngHint: 'Lossless, heavier',
    formatWebpHint: 'Light, for the web',
    recommended: 'Recommended',
    advanced: 'Advanced settings',
    summaryQuality: (n: number) => `Quality ${n}%`,
    summaryMetadata: {
      strip: 'metadata removed',
      'keep-no-gps': 'metadata without GPS',
      keep: 'all metadata',
    },
    webpUnsupported: 'Not available on Safari',
    quality: 'Quality',
    qualityHint: 'Between 80 and 92%, the difference is invisible and files are smaller.',
    resize: 'Size',
    resizeOriginal: 'Original',
    resize4k: '4K (3840 px)',
    resize1080: 'Full HD (1920 px)',
    resize720: 'HD (1280 px)',
    resizeCustom: 'Custom',
    customSide: 'Longest side (px)',
    metadata: 'Metadata (EXIF)',
    metadataStrip: 'Remove everything',
    metadataStripHint: 'Recommended: date, camera and GPS location are removed.',
    metadataKeepNoGps: 'Keep, except GPS location',
    metadataKeepNoGpsHint: 'Keeps date and camera, removes the place.',
    metadataKeep: 'Keep everything',
    metadataKeepHint: 'Careful: the photo’s GPS location is kept.',
    metadataJpegOnly: 'Metadata is only kept in JPG.',
    destination: 'Saving',
    destinationZip: 'Download (ZIP)',
    destinationFolder: 'Straight into a folder',
    destinationFolderHint: 'Each photo is written as soon as it is ready. Ideal for 400 photos.',
  },
  actions: {
    convert: (n: number, format: string) =>
      n > 1 ? `Convert ${n} photos to ${format}` : `Convert the photo to ${format}`,
    convertEmpty: 'Add photos to get started',
    reconvert: 'Convert again with these settings',
    pause: 'Pause',
    resume: 'Resume',
    cancelAll: 'Cancel all',
    clear: 'Clear list',
    retry: 'Retry',
    remove: 'Remove',
    cancel: 'Cancel',
    download: 'Download',
    downloadAll: 'Download the ZIP',
    downloadPart: (i: number, total: number) => `ZIP ${i} of ${total}`,
    preparingZip: 'Preparing ZIP…',
  },
  progress: {
    label: 'Progress',
    count: (done: number, total: number) => `${done} of ${total}`,
    remaining: (time: string) => `about ${time} left`,
    remainingSoon: 'almost done',
    estimating: 'estimating time…',
    paused: 'Paused',
    finished: (ok: number, failed: number) =>
      failed > 0
        ? `${ok} photo${ok > 1 ? 's' : ''} converted, ${failed} failed`
        : `${ok} photo${ok > 1 ? 's' : ''} converted`,
    savedTo: (folder: string) => `Saved in the “${folder}” folder`,
    seconds: (n: number) => `${n} s`,
    minutes: (n: number) => `${n} min`,
  },
  list: {
    title: (n: number) => `${n} photo${n > 1 ? 's' : ''}`,
    empty: 'No photos yet.',
    original: 'Original',
    converted: 'Converted',
    status: {
      pending: 'Waiting',
      processing: 'Converting',
      done: 'Done',
      error: 'Error',
      cancelled: 'Cancelled',
    },
    saved: 'Saved',
  },
  errors: {
    unsupported: 'Unsupported format. Accepted: HEIC, JPEG, PNG, WebP, AVIF, GIF, BMP.',
    corrupt: 'Unreadable or damaged file.',
    'too-large': (maxMb: number) => `File too large (over ${maxMb} MB).`,
    'out-of-memory': 'Not enough memory. Close other tabs or convert fewer photos at once.',
    'canvas-too-large': 'Photo too large for this browser, even after resizing.',
    'encode-unsupported': 'Your browser cannot create this format. Try JPG or PNG.',
    'decoder-unavailable': 'The HEIC decoder could not be loaded. Check your connection and retry.',
    'save-failed': 'Could not write to the folder. You can download the photo here.',
    unknown: 'Unexpected error during conversion.',
  },
  warnings: {
    'downscaled-for-device': 'Automatically reduced: too large for this browser.',
    'metadata-not-kept': 'Metadata not kept in this format.',
  },
  notices: {
    overflow: (n: number, max: number) =>
      `${n} photo${n > 1 ? 's' : ''} not added: ${max} photos max per batch.`,
    lowMemory:
      'Your device seems short on memory. For a large batch, convert 100 photos at a time and download as you go.',
    privacy: 'Your photos never leave your device.',
  },
  home: {
    howTitle: 'How it works',
    how: [
      {
        title: 'Add your photos',
        text: 'Drop a whole folder from your computer, or pick photos from your phone’s gallery.',
      },
      {
        title: 'Pick the format',
        text: 'JPG to share anywhere, PNG to keep every pixel. Your settings are remembered for next time.',
      },
      {
        title: 'Download',
        text: 'One ZIP to get everything at once, split automatically for large batches. On Chrome and Edge, save straight into a folder.',
      },
    ],
    privacyTitle: 'Your photos stay with you',
    privacyText:
      'Most online converters upload your photos to their servers. SunuPix does all the work in your browser, on your own device. Nobody else sees your pictures.',
    privacyPoints: [
      'Local conversion, no server, no online storage',
      'GPS location and other metadata removed by default',
      'Public source code anyone can check',
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        q: 'What is a HEIC file?',
        a: 'It is the default photo format on iPhone. It takes less space than JPG, but many computers, websites and apps cannot open it. SunuPix converts it to JPG or PNG, readable everywhere.',
      },
      {
        q: 'Is it really free?',
        a: 'Yes. No account, no hidden limit, no watermark. Its source code is public and anyone can check it.',
      },
      {
        q: 'Is my photo quality preserved?',
        a: 'Yes. At 90% JPG quality, the difference from the original is invisible to the naked eye. Choose PNG for a fully lossless conversion.',
      },
      {
        q: 'Does it work on a phone?',
        a: 'Yes, on iPhone and Android. On iPhone, very large photos (48 MP) are automatically reduced to about 16 MP, because Safari limits the size of images it can process.',
      },
    ],
  },
  footer: {
    tagline: 'Free image converter, designed for Senegal and West Africa.',
    license: 'Public source code · no commercial use',
  },
  units: {
    bytes: ['B', 'KB', 'MB', 'GB'],
  },
};
