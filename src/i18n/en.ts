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
    converters: 'Conversions',
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
  seo: {
    siteName: 'SunuPix',
    home: {
      title: 'SunuPix — Convert HEIC to JPG or PNG, free and without upload',
      description:
        'Convert hundreds of HEIC (iPhone) photos to JPG or PNG for free. No photo is uploaded: everything happens in your browser.',
    },
    faq: {
      title: 'FAQ — SunuPix',
      description:
        'HEIC, quality, privacy, large batches, iPhone and Android: every answer about converting photos with SunuPix.',
    },
    privacy: {
      title: 'Privacy — SunuPix',
      description:
        'SunuPix never receives your photos: conversion happens on your device. What we store (almost nothing) and why.',
    },
    about: {
      title: 'About — SunuPix',
      description:
        'SunuPix is a free image converter designed in Senegal for photographers and everyone who shares photos.',
    },
    contact: {
      title: 'Contact — SunuPix',
      description: 'A question, a bug, an idea? Here is how to reach the SunuPix team.',
    },
    notFound: {
      title: 'Page not found — SunuPix',
      description: 'This page does not exist. Go back to the SunuPix converter.',
    },
  },
  converters: {
    otherTitle: 'Other conversions',
    items: {
      'heic-en-jpg': {
        label: 'HEIC to JPG',
        title: 'Convert HEIC to JPG — free, no upload | SunuPix',
        description:
          'Convert iPhone HEIC photos to JPG in seconds, up to 400 at a time. Free and private: nothing is sent over the Internet.',
        h1: 'Convert HEIC to JPG',
        intro:
          'Turn HEIC photos into JPG files that open everywhere: Windows, WhatsApp, social media, printing. Up to 400 photos at once, without sending them anywhere.',
        body: [
          'HEIC has been the default iPhone photo format since 2017. It is light, but many computers, websites and printers cannot open it. JPG works everywhere.',
          'SunuPix decodes each photo right in your browser, turns it the right way up and saves it as JPG. At 90% quality the difference from the original is invisible, and the file stays reasonably small.',
          'Photographer tip: for a large batch, choose “Straight into a folder” in the advanced settings (Chrome and Edge). Each photo is written to your disk as soon as it is ready.',
        ],
      },
      'heic-en-png': {
        label: 'HEIC to PNG',
        title: 'Convert HEIC to PNG — lossless, free | SunuPix',
        description:
          'Convert HEIC photos to PNG with no quality loss, right in your browser. Free, no sign-up, no upload.',
        h1: 'Convert HEIC to PNG',
        intro:
          'Turn HEIC photos into PNG with no loss of quality. Ideal for editing or archiving. Everything happens on your device.',
        body: [
          'PNG is a lossless format: every pixel of the original photo is kept. It is the right choice for editing in Photoshop, Lightroom or GIMP, or for documents where sharpness matters.',
          'The trade-off: a PNG is several times heavier than a JPG. To share on WhatsApp or social media, prefer JPG.',
        ],
      },
      'png-en-jpg': {
        label: 'PNG to JPG',
        title: 'Convert PNG to JPG — free, no upload | SunuPix',
        description:
          'Convert PNG images to lighter JPG files, in batches of 400. Transparent areas become white. Free and private.',
        h1: 'Convert PNG to JPG',
        intro:
          'Make PNG images lighter by converting them to JPG: often 5 to 10 times smaller, perfect for sending or publishing.',
        body: [
          'Screenshots and exported images are often PNG, a heavy format. JPG makes them much lighter, with visually identical quality for photos.',
          'JPG does not support transparency: transparent areas become white. To keep transparency, choose WebP or keep the PNG.',
        ],
      },
      'jpg-en-png': {
        label: 'JPG to PNG',
        title: 'Convert JPG to PNG — free, no upload | SunuPix',
        description:
          'Convert JPG images to PNG right in your browser, without uploading them. Free, fast, up to 400 images.',
        h1: 'Convert JPG to PNG',
        intro:
          'Convert JPG files to PNG, for example for software or a website that only accepts that format. Fast, free and no upload.',
        body: [
          'Converting a JPG to PNG does not restore quality already lost to JPG compression, but it guarantees no further loss in later edits.',
          'The resulting PNG will be heavier than the original JPG: that is normal.',
        ],
      },
      'webp-en-jpg': {
        label: 'WebP to JPG',
        title: 'Convert WebP to JPG — free, no upload | SunuPix',
        description:
          'Convert WebP images saved from the web to JPG that works everywhere. Free, private, right in your browser.',
        h1: 'Convert WebP to JPG',
        intro:
          'A WebP image saved from a website will not open everywhere? Convert it to JPG, compatible with every app and device.',
        body: [
          'WebP is a modern format many websites use to load faster. But some older software, printers and online forms do not accept it yet.',
          'SunuPix converts WebP to JPG without sending anything: the image stays on your device from start to finish.',
        ],
      },
    },
  },
  pages: {
    faqIntro: 'Everything you need to know to convert your photos with SunuPix.',
    faqMore: [
      {
        q: 'Are my photos sent to a server?',
        a: 'No, never. Conversion happens in your browser, on your device. SunuPix has no conversion server: there is nowhere your photos could be stored.',
      },
      {
        q: 'How many photos can I convert at once?',
        a: 'Up to 400 photos per batch, and 50 MB per photo. For large batches, SunuPix automatically creates several ZIP files of at most 100 photos (or 500 MB).',
      },
      {
        q: 'Will my photos be the right way up?',
        a: 'Yes. SunuPix reads the orientation saved by the camera and rotates the image correctly before converting it.',
      },
      {
        q: 'What happens to the date and GPS location of my photos?',
        a: 'By default, all metadata is removed, including GPS location. In the advanced settings you can keep the date and camera while removing only GPS, or keep everything (JPG only).',
      },
      {
        q: 'Why is WebP not available on Safari?',
        a: 'Safari can display WebP but cannot create it. On Mac and iPhone, use JPG or PNG, or open SunuPix in Chrome, Edge or Firefox for WebP.',
      },
      {
        q: 'Does it work offline?',
        a: 'Yes, after a first visit. SunuPix installs itself in your browser and stays available offline. The HEIC decoder is kept from your first HEIC conversion.',
      },
      {
        q: 'Can I install SunuPix like an app?',
        a: 'Yes. On iPhone: Share button, then “Add to Home Screen”. On Android and on desktop with Chrome or Edge: the install icon in the address bar.',
      },
    ],
    privacyTitle: 'Privacy',
    privacyLead:
      'SunuPix was designed so your photos stay with you. Here is, without jargon, what happens when you use the site.',
    privacySections: [
      {
        title: 'Your photos',
        text: 'They never leave your device. The site is downloaded once, then conversion happens entirely in your browser. No server receives, sees or stores your images. When you close the tab, everything is cleared from memory.',
      },
      {
        title: 'What is saved on your device',
        text: 'Only three preferences, in your browser’s local storage: your conversion settings, the light or dark theme, and the language. They are never sent anywhere. The site is also cached so it works offline.',
      },
      {
        title: 'Visit statistics',
        text: 'When enabled, SunuPix uses Vercel Web Analytics: a simple page-view count, with no cookies, no personal identifier and no tracking across visits. You can opt out below.',
      },
      {
        title: 'Hosting',
        text: 'The site is hosted by Vercel. Like any host, Vercel technically processes your IP address to send you pages; SunuPix does not use it.',
      },
      {
        title: 'Advertising',
        text: 'There is no advertising on SunuPix. If that ever changed, this page would be updated first.',
      },
    ],
    analyticsLabel: 'Anonymous visit statistics',
    analyticsOn: 'Allowed in this browser',
    analyticsOff: 'Refused in this browser',
    analyticsDisabled: 'Statistics are currently disabled on this site.',
    analyticsToggleOff: 'Refuse',
    analyticsToggleOn: 'Allow',
    aboutTitle: 'About',
    aboutLead:
      'SunuPix was born from a simple need: converting hundreds of iPhone photos every day without handing them to an unknown website.',
    aboutSections: [
      {
        title: 'Why SunuPix',
        text: 'Online converters limit the number of files, add advertising and, above all, upload your photos to their servers. For a photographer working with clients’ images, that is not acceptable. SunuPix does everything on your device, for free.',
      },
      {
        title: 'Who it is for',
        text: '“Sunu” means “our” in Wolof. SunuPix is designed for Senegal and West Africa: it works on computers and phones, stays light on slow connections and even works offline.',
      },
      {
        title: 'How it works',
        text: 'SunuPix uses WebAssembly to decode HEIC right in your browser, and several workers to convert photos in parallel without freezing the page. The source code is public on GitHub.',
      },
      {
        title: 'Licence',
        text: 'The code is public and reusable for non-commercial purposes (PolyForm Noncommercial 1.0.0 licence). The SunuPix name and logo are protected trademarks.',
      },
    ],
    contactTitle: 'Contact',
    contactLead: 'A question, a bug, an idea? The simplest way is through GitHub.',
    contactIssue: 'Report a problem or suggest an idea',
    contactIssueHint: 'Open an issue on GitHub (free account required).',
    contactEmail: 'Send an email',
    contactTip:
      'For a conversion problem, mention your browser, device and file type. Never send your private photos.',
    notFoundTitle: 'Page not found',
    notFoundText: 'This page does not exist or has moved.',
    notFoundCta: 'Back to the converter',
  },
  footer: {
    tagline: 'Free image converter, designed for Senegal and West Africa.',
    license: 'Public source code · no commercial use',
    thirdParty: 'Third-party licences',
    madeBy: 'Designed and built by',
  },
  units: {
    bytes: ['B', 'KB', 'MB', 'GB'],
  },
};
