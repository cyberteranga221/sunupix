# Licences des composants tiers

_Fichier généré par `node scripts/third-party.mjs`. Ne pas modifier à la main._

SunuPix est distribué sous licence PolyForm Noncommercial 1.0.0 (voir `LICENSE`). Il s'appuie
sur les composants ci-dessous, qui gardent chacun leur propre licence.

## Compatibilité

- **MIT, Apache-2.0, ISC, BSD** : licences permissives, compatibles avec la licence de SunuPix
  (avis de copyright conservés dans les fichiers distribués).
- **libheif-js (LGPL-3.0)** : bibliothèque de décodage HEIC. Elle est utilisée **sans
  modification**, chargée à part (fichiers `libheif-*.js` et `libheif-*.wasm` du dossier
  `assets`) uniquement quand un fichier HEIC est converti. La LGPL autorise cet usage par un
  logiciel sous une autre licence. Son code source est disponible sur
  https://github.com/catdad-experiments/libheif-js (et libheif sur https://github.com/strukturag/libheif).
  Le texte complet de sa licence est publié avec le site : `/licenses/third-party.txt`.
  Tu peux remplacer cette bibliothèque par une autre version compatible en modifiant
  `package.json` puis en reconstruisant le site.
- **Inter Display (SIL Open Font License 1.1)** : police utilisée pour dessiner le nom du logo
  (converti en tracés dans `public/brand/`). Elle n'est pas distribuée avec le site.

## Dépendances utilisées par le site

| Paquet                                                                | Version | Licence  |
| --------------------------------------------------------------------- | ------- | -------- |
| [@tanstack/react-virtual](https://tanstack.com/virtual)               | 3.14.26 | MIT      |
| [@vercel/analytics](https://github.com/vercel/analytics)              | 2.0.1   | MIT      |
| [client-zip](https://github.com/Touffy/client-zip)                    | 2.5.1   | MIT      |
| [libheif-js](https://github.com/catdad-experiments/libheif-js#readme) | 1.23.5  | LGPL-3.0 |
| [react](https://react.dev/)                                           | 19.3.1  | MIT      |
| [react-dom](https://react.dev/)                                       | 19.3.1  | MIT      |
| [react-router](https://github.com/remix-run/react-router)             | 8.5.2   | MIT      |

## Outils de développement (non distribués)

| Paquet                                                                                                     | Version | Licence    |
| ---------------------------------------------------------------------------------------------------------- | ------- | ---------- |
| [@eslint/js](https://eslint.org)                                                                           | 10.0.1  | MIT        |
| [@playwright/test](https://playwright.dev)                                                                 | 1.65.1  | Apache-2.0 |
| [@tailwindcss/vite](https://tailwindcss.com)                                                               | 4.3.5   | MIT        |
| [@testing-library/dom](https://github.com/testing-library/dom-testing-library#readme)                      | 10.4.2  | MIT        |
| [@testing-library/react](https://github.com/testing-library/react-testing-library#readme)                  | 16.3.3  | MIT        |
| [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node)                   | 26.6.6  | MIT        |
| [@types/react](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)                 | 19.3.0  | MIT        |
| [@types/react-dom](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom)         | 19.3.0  | MIT        |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#readme) | 6.3.0   | MIT        |
| [eslint](https://eslint.org)                                                                               | 10.15.0 | MIT        |
| [eslint-plugin-react-hooks](https://react.dev/)                                                            | 7.1.1   | MIT        |
| [eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)                  | 0.5.8   | MIT        |
| [globals](sindresorhus/globals)                                                                            | 17.14.0 | MIT        |
| [husky](https://github.com/typicode/husky)                                                                 | 9.1.7   | MIT        |
| [jsdom](https://github.com/jsdom/jsdom)                                                                    | 31.0.1  | MIT        |
| [lint-staged](https://github.com/lint-staged/lint-staged#readme)                                           | 17.6.1  | MIT        |
| [prettier](https://prettier.io)                                                                            | 3.10.1  | MIT        |
| [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)                 | 0.8.1   | MIT        |
| [tailwindcss](https://tailwindcss.com)                                                                     | 4.3.5   | MIT        |
| [typescript](https://www.typescriptlang.org/)                                                              | 6.0.3   | Apache-2.0 |
| [typescript-eslint](https://typescript-eslint.io/packages/typescript-eslint)                               | 8.73.0  | MIT        |
| [vite](https://vite.dev)                                                                                   | 8.3.8   | MIT        |
| [vitest](https://vitest.dev)                                                                               | 5.1.1   | MIT        |
| [workbox-build](https://github.com/GoogleChrome/workbox)                                                   | 7.4.1   | MIT        |
