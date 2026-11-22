# Ajouter un format

## Format d'entrée décodable par le navigateur (ex. TIFF sur Safari)

1. `src/engine/types.ts` : ajoute le format à `InputFormat`.
2. `src/engine/detect.ts` : reconnais ses premiers octets dans `detectFormat`, ajoute son
   extension dans `EXTENSIONS` et dans `ACCEPT_ATTRIBUTE`.
3. `tests/unit/detect.test.ts` : un test avec un petit fichier dans `tests/fixtures/` (créé par
   toi, libre de droits, sans données personnelles).
4. Textes : liste des formats dans `src/i18n/fr.ts` et `en.ts` (`dropzone.hint`,
   `errors.unsupported`).

`pipeline.ts` le décodera avec `createImageBitmap`, comme le JPEG ou le PNG. Si un navigateur ne
sait pas le décoder, l'utilisateur verra « Fichier illisible ou abîmé ».

## Format d'entrée nécessitant un décodeur (comme le HEIC)

Comme ci-dessus, plus :

1. Un module `src/engine/decoders/<format>.ts` qui **charge sa bibliothèque à la demande**
   (`import()` dynamique), décode en `ImageData` et libère sa mémoire.
2. Dans `pipeline.ts → convertImage`, une branche qui l'utilise, sur le modèle de `heicSource`.
3. Vérifie la licence de la bibliothèque (compatible avec PolyForm Noncommercial, la LGPL l'est
   si la bibliothèque reste non modifiée et chargée à part), relance
   `node scripts/third-party.mjs`, et vérifie que le budget de 150 Ko n'est pas touché
   (`pnpm build`).
4. Si la bibliothèque utilise WebAssembly ou des requêtes réseau, vérifie la CSP de `vercel.json`
   (le test `tests/e2e/site.spec.ts` convertit sous la vraie CSP).

## Format de sortie (ex. AVIF)

1. `types.ts` : ajoute-le à `OutputFormat`, `MIME` et `EXTENSION`.
2. `state/options.ts` : ajoute-le à la liste `FORMATS`.
3. `components/converter/FormatPicker.tsx` : une carte de plus, et la détection de prise en
   charge (comme `canEncodeWebp` dans `state/options.ts`).
4. Textes de la carte dans `src/i18n/fr.ts` et `en.ts`.

Le contrôle « le navigateur a-t-il vraiment produit ce format ? » de `pipeline.ts` protège déjà
contre les navigateurs qui ne savent pas l'encoder.
