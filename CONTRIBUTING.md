# Contribuer à SunuPix

Merci de vouloir améliorer SunuPix ! Ce guide explique comment proposer une correction ou une
nouveauté. _English speakers: issues and pull requests in English are welcome too._

## Avant de commencer

- Lis le [code de conduite](CODE_OF_CONDUCT.md).
- Pour une faille de sécurité, **n'ouvre pas d'issue publique** : suis [SECURITY.md](SECURITY.md).
- Pour une grosse modification, ouvre d'abord une issue pour en discuter.
- Pour comprendre le code en 15 minutes : [`docs/architecture.md`](docs/architecture.md).

## Installer le projet

```bash
corepack enable          # active pnpm (fourni avec Node.js 24)
pnpm install
pnpm exec playwright install chromium   # navigateur des tests de bout en bout
pnpm dev
```

## Règles du code

- **TypeScript strict**, pas de `any`. Commentaires en **français**.
- **Aucun envoi de données** : SunuPix ne doit jamais envoyer une photo ou une métadonnée sur
  Internet. Toute requête réseau nouvelle doit être justifiée et ajoutée à la CSP de `vercel.json`.
- **Performance d'abord** : rien de lourd sur le fil principal ; le JavaScript initial reste sous
  150 Ko gzip (le build échoue sinon). Libère la mémoire (`URL.revokeObjectURL`, `bitmap.close()`).
- **Textes** : jamais de texte en dur dans les composants ; ajoute-le dans `src/i18n/fr.ts` **et**
  `src/i18n/en.ts` (TypeScript signale une clé manquante). Respecte le ton de la
  [charte graphique](docs/charte-graphique.md).
- **Accessibilité** : utilisable au clavier, contrastes AA, libellés pour les lecteurs d'écran.

## Avant d'ouvrir une pull request

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Le hook de pré-commit (husky + lint-staged) formate automatiquement les fichiers modifiés.

**Messages de commit** au format conventionnel, en français :
`feat(moteur): …`, `fix(interface): …`, `docs: …`, `test: …`, `chore(deps): …`.

Pense à mettre à jour `CHANGELOG.md` (section « Non publié ») et, si tu ajoutes une dépendance,
lance `node scripts/third-party.mjs` et vérifie que sa licence est compatible.

## Licence de tes contributions

SunuPix est publié sous licence PolyForm Noncommercial 1.0.0. **En proposant une contribution
(pull request, correctif, texte, image), tu confirmes que tu en es l'auteur et tu accordes au
mainteneur du projet (cyberteranga221) une licence perpétuelle, mondiale, gratuite et irrévocable
pour utiliser, modifier, distribuer et sous-licencier ta contribution, y compris à des fins
commerciales, et pour la publier sous la licence du projet ou sous une autre licence.** Cette
clause permet au projet de rester cohérent si sa licence évolue. Tu restes propriétaire de ton
travail et tu gardes le droit de l'utiliser ailleurs.
