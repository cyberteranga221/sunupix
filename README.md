<p align="center">
  <img src="public/brand/sunupix-logo.svg" alt="SunuPix" width="240" />
</p>

<p align="center"><strong>Des centaines de photos converties. Aucune envoyée.</strong></p>

<p align="center">
  <a href="https://sunupix.vercel.app">sunupix.vercel.app</a> ·
  <a href="#english">English</a>
</p>

---

SunuPix est un convertisseur d'images gratuit, rapide et privé. Il transforme les photos HEIC/HEIF
(iPhone), PNG, WebP, AVIF, GIF ou BMP en **JPG, PNG ou WebP**, **directement dans le navigateur** :
aucune photo n'est envoyée sur Internet.

Pensé au Sénégal pour les photographes qui convertissent des centaines de photos par jour, et pour
tous ceux qui partagent des images sur ordinateur ou sur téléphone, même avec une connexion lente.

## Fonctionnalités

- Glisser-déposer, choix de photos (galerie iPhone/Android) ou d'un dossier entier
- Entrée : HEIC, HEIF, JPEG, PNG, WebP, AVIF, GIF, BMP · Sortie : JPG, PNG, WebP
- Qualité réglable, redimensionnement (4K, Full HD, HD, personnalisé)
- Métadonnées : tout supprimer (par défaut), garder sauf la position GPS, ou tout garder
- **Gros volumes** : jusqu'à 400 photos par lot, 50 Mo par photo, 2 à 4 conversions en parallèle
- Pause, reprise, annulation ; une erreur n'arrête jamais les autres conversions
- Téléchargement individuel, ZIP découpés automatiquement (100 photos ou 500 Mo), ou
  enregistrement direct dans un dossier (Chrome et Edge)
- Orientation toujours correcte, couleurs Display P3 conservées quand c'est possible
- Fonctionne hors ligne après la première visite (PWA installable)
- Français et anglais, thème clair et sombre, accessible au clavier (WCAG AA)

## Démarrage rapide

Prérequis : **Node.js 24** (voir `.nvmrc`) et **pnpm 10** (activé par Corepack, fourni avec Node).

```bash
corepack enable
pnpm install
pnpm dev
```

Le site s'ouvre sur http://localhost:5173.

| Commande         | Rôle                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`       | Serveur de développement avec rechargement automatique                                                            |
| `pnpm build`     | Build de production dans `dist/` : vérification des types, pré-rendu des pages, service worker, contrôle du poids |
| `pnpm preview`   | Sert `dist/` comme Vercel (pages, 404, en-têtes de sécurité) sur http://localhost:4173                            |
| `pnpm lint`      | ESLint + Prettier                                                                                                 |
| `pnpm typecheck` | TypeScript strict                                                                                                 |
| `pnpm test`      | Tests unitaires (Vitest)                                                                                          |
| `pnpm test:e2e`  | Tests de bout en bout (Playwright, après `pnpm build`)                                                            |

La première fois, installe le navigateur des tests de bout en bout :

```bash
pnpm exec playwright install chromium
```

## Personnaliser

| Je veux changer…                                              | Fichier                                                                    |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Le nom, l'URL du site, le dépôt, l'e-mail de contact          | `src/config.ts` → `APP`                                                    |
| Les limites (400 photos, 50 Mo, taille des ZIP, parallélisme) | `src/config.ts` → `LIMITS` et `ENGINE`                                     |
| Statistiques, publicité, bouton de don                        | `src/config.ts` → `FEATURES` (tout est désactivé par défaut)               |
| Les couleurs                                                  | `src/styles.css` → blocs `@theme`, `:root` et `[data-theme='dark']`        |
| Les textes (français / anglais)                               | `src/i18n/fr.ts` et `src/i18n/en.ts`                                       |
| Le logo et les icônes                                         | `public/brand/`, puis `node scripts/brand/render-png.mjs` (voir la charte) |

L'identité visuelle (logo, couleurs, typographie, ton) est décrite dans
[`docs/charte-graphique.md`](docs/charte-graphique.md).

## Déployer sur Vercel

Le site est 100 % statique : aucun serveur, aucune fonction, aucune base de données.

1. Sur [vercel.com](https://vercel.com), **Add New → Project**, puis importe le dépôt GitHub.
2. Les réglages sont lus dans `vercel.json` : framework Vite, `pnpm build`, dossier `dist`.
   Choisis **Node.js 24.x** dans _Settings → General_.
3. Chaque push sur `main` met à jour le site en production ; chaque autre branche crée une
   prévisualisation.

`vercel.json` ajoute les en-têtes de sécurité (CSP compatible WebAssembly, `nosniff`,
`Referrer-Policy`, `Permissions-Policy`, HSTS) et le cache long des fichiers versionnés. Il n'y a
pas de réécriture d'URL : chaque page est pré-rendue en HTML et les adresses inconnues servent
`404.html`.

**Statistiques :** pour activer Vercel Web Analytics (sans cookie), passe `FEATURES.analytics` à
`true` et active _Analytics_ dans le tableau de bord Vercel. Les visiteurs peuvent refuser depuis
la page Confidentialité.

> **Attention : usage commercial.** Le plan gratuit (Hobby) de Vercel est réservé à un usage
> **non commercial**. Si tu actives la publicité, les dons ou toute autre monétisation, passe à un
> plan payant (Pro) ou héberge le site ailleurs (Netlify, Cloudflare Pages, GitHub Pages… le
> dossier `dist/` est statique). Pense aussi à mettre à jour la page Confidentialité et la CSP.

## Comment ça marche

Les conversions se font dans des **Web Workers** (2 à 4 en parallèle), jamais sur le fil
principal. Le décodeur HEIC (libheif, WebAssembly) n'est téléchargé qu'au premier fichier HEIC.
Pour comprendre le moteur en 15 minutes :

- [`docs/architecture.md`](docs/architecture.md) : vue d'ensemble et organisation du code
- [`docs/moteur-de-conversion.md`](docs/moteur-de-conversion.md) : le trajet d'une photo, la mémoire, les limites des navigateurs
- [`docs/ajouter-un-format.md`](docs/ajouter-un-format.md) : ajouter un format d'entrée ou de sortie

## Contribuer

Les contributions sont les bienvenues : lis [`CONTRIBUTING.md`](CONTRIBUTING.md) et le
[code de conduite](CODE_OF_CONDUCT.md). Pour une faille de sécurité, suis
[`SECURITY.md`](SECURITY.md).

## Licence

Le code est **public** et sous licence [**PolyForm Noncommercial 1.0.0**](LICENSE) : tu peux le
lire, l'utiliser, le modifier et le partager **pour un usage non commercial**. Toute utilisation
commerciale (vente, service payant, publicité…) nécessite l'autorisation écrite de l'auteur.

Le nom **SunuPix** et le logo sont des marques : voir [`TRADEMARKS.md`](TRADEMARKS.md). Les
composants tiers gardent leur propre licence : voir
[`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md).

Les versions publiées avant le 22 novembre 2026 étaient sous licence MIT.

---

## English

SunuPix is a free, fast and private image converter. It turns HEIC/HEIF (iPhone), PNG, WebP,
AVIF, GIF or BMP photos into **JPG, PNG or WebP**, **right in the browser**: no photo is ever
uploaded. Up to 400 photos per batch, works offline, French and English interface.

### Quick start

Requirements: **Node.js 24** (see `.nvmrc`) and **pnpm 10** (via Corepack).

```bash
corepack enable
pnpm install
pnpm dev        # http://localhost:5173
```

Other commands: `pnpm build` (production build in `dist/`), `pnpm preview` (serves `dist/` like
Vercel), `pnpm lint`, `pnpm typecheck`, `pnpm test` (Vitest), `pnpm test:e2e` (Playwright, after
`pnpm build`).

### Customise

Name, URL, limits and optional features live in `src/config.ts`; colours in `src/styles.css`;
texts in `src/i18n/fr.ts` and `src/i18n/en.ts`. Brand guidelines: `docs/charte-graphique.md`
(French).

### Deploy on Vercel

Import the repository in Vercel; settings are read from `vercel.json` (Vite, `pnpm build`,
`dist`). Select Node.js 24.x. The site is fully static. **Vercel's free Hobby plan is for
non-commercial use only**: if you enable ads, donations or any monetisation, upgrade to a paid
plan or host the static `dist/` folder elsewhere.

### Licence

Public source code under the [PolyForm Noncommercial 1.0.0](LICENSE) licence: free to use, modify
and share for **non-commercial purposes**. Commercial use requires written permission. "SunuPix"
and its logo are trademarks (see `TRADEMARKS.md`). Third-party components keep their own licences
(see `THIRD_PARTY_LICENSES.md`).
