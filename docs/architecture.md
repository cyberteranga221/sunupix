# Architecture de SunuPix

Lecture : 5 minutes. Ensuite, [`moteur-de-conversion.md`](moteur-de-conversion.md).

## Principe

SunuPix est un **site 100 % statique**. Le navigateur télécharge le site une fois, puis fait tout
le travail : décodage, redimensionnement, encodage, ZIP. Il n'y a **aucun backend** : pas de
serveur de conversion, pas de base de données, pas de compte. C'est ce qui garantit que les
photos ne quittent jamais l'appareil, et que le site supporte des milliers de visiteurs
simultanés (le CDN de Vercel ne sert que des fichiers).

## Pile technique

| Rôle                      | Outil                                                               |
| ------------------------- | ------------------------------------------------------------------- |
| Interface                 | React 19, TypeScript strict, Tailwind CSS 4                         |
| Routage                   | react-router 8 (mode déclaratif)                                    |
| Build                     | Vite 8                                                              |
| Pré-rendu des pages (SEO) | `scripts/prerender.mjs` (≈ 80 lignes, `react-dom/static`)           |
| Décodage HEIC             | libheif-js (WebAssembly, LGPL), chargé à la demande                 |
| Liste de 400 lignes       | @tanstack/react-virtual                                             |
| ZIP en streaming          | client-zip                                                          |
| Hors ligne                | Workbox (`workbox-build`), service worker généré après le pré-rendu |
| Tests                     | Vitest (logique), Playwright (bout en bout)                         |

## Organisation du code

```
src/
├─ config.ts            ← TOUT ce qui se règle : nom, URL, limites, options (pub, dons, stats)
├─ engine/              ← moteur de conversion, sans React (testable seul)
│  ├─ detect.ts         ← reconnaît le format par les premiers octets
│  ├─ queue.ts          ← file d'attente : parallélisme, pause, reprise, annulation
│  ├─ worker-pool.ts    ← pool de Web Workers, recyclage mémoire
│  ├─ convert.worker.ts ← point d'entrée d'un worker
│  ├─ pipeline.ts       ← conversion d'UNE image (décodage → canvas → encodage → EXIF)
│  ├─ decoders/heic.ts  ← libheif (chargé au premier HEIC)
│  ├─ exif.ts, heif.ts  ← lecture/écriture minimale des métadonnées
│  ├─ dimensions.ts     ← taille de sortie, limites de canvas
│  ├─ filenames.ts      ← noms de sortie et doublons
│  ├─ zip-batches.ts    ← découpage des ZIP
│  └─ save.ts           ← téléchargement, ZIP, écriture dans un dossier
├─ state/
│  ├─ batch.ts          ← état du lot (liste, statuts, progression) + orchestration
│  └─ options.ts        ← réglages mémorisés (stockage local)
├─ components/          ← interface (converter/ = le convertisseur)
├─ pages/               ← une page par route
├─ routes.tsx           ← LISTE UNIQUE des pages : routeur, pré-rendu, SEO, sitemap
├─ seo/head.ts          ← <title>, description, Open Graph, JSON-LD
└─ i18n/                ← textes : fr.ts (par défaut) et en.ts (chargé à la demande)
scripts/
├─ prerender.mjs        ← pages HTML, sitemap, robots, service worker
├─ serve.mjs            ← serveur local qui imite Vercel (404, en-têtes)
├─ check-size.mjs       ← budget de 150 Ko gzip pour le JavaScript initial
├─ third-party.mjs      ← liste des licences des dépendances
└─ brand/               ← génération du logo et des icônes
```

## Le build en 4 temps

`pnpm build` enchaîne :

1. `tsc -b` : vérification des types ;
2. `vite build` : le site (client) dans `dist/` ;
3. `vite build --ssr` + `scripts/prerender.mjs` : chaque route de `routes.tsx` est rendue en HTML
   (en français) avec ses balises `<head>`, puis `sitemap.xml`, `robots.txt`, `404.html` et le
   service worker `sw.js` ;
4. `scripts/check-size.mjs` : échec si le JavaScript initial dépasse 150 Ko gzip.

Au chargement, React « hydrate » le HTML pré-rendu. La langue mémorisée (anglais) est appliquée
juste après.

## Flux de données

```
Fichiers ──▶ BatchStore.addFiles ──▶ détection du format (64 octets)
                                         │
                            Convertir ──▶ TaskQueue (2 à 4 à la fois)
                                         │
                                         ▼
                                   WorkerPool ──▶ convert.worker ──▶ pipeline.convertImage
                                         │                               (OffscreenCanvas)
                                         ▼
                      Blob converti + miniature ──▶ BatchStore ──▶ interface (useBatch)
                                         │
                           ZIP / téléchargement / dossier (save.ts)
```

L'interface s'abonne au `BatchStore` avec `useSyncExternalStore` ; les mises à jour sont
regroupées une fois par image affichée pour rester fluide avec 400 photos.

## Où modifier quoi

- Ajouter une page : un composant dans `src/pages/`, une entrée dans `routes.tsx`, ses textes et
  son titre SEO dans `src/i18n/fr.ts` et `en.ts`.
- Ajouter un format : [`ajouter-un-format.md`](ajouter-un-format.md).
- Changer les en-têtes de sécurité ou le cache : `vercel.json` (testé par `pnpm test:e2e`).
