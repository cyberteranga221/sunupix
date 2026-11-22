# Charte graphique SunuPix

Ce document fixe l'identité visuelle de SunuPix : logo, couleurs, typographie, ton et règles
d'usage. Les fichiers sources sont dans `public/brand/`. Le nom et le logo sont des marques
protégées (voir `TRADEMARKS.md`).

## 1. L'idée

**« Sunu »** veut dire « notre » en wolof : _nos photos, chez nous_. **« Pix »** désigne les
pixels, les images.

Le symbole traduit exactement ça : **un « S » qui libère un pixel jaune**. Le S est le geste de
conversion, d'un seul trait continu. Le pixel est le résultat, petit et lumineux. Le vert et le
jaune viennent du drapeau du Sénégal, sans le copier.

Ce que la marque doit inspirer : **la confiance d'un outil professionnel**, sobre et précis,
qui respecte les photos et la vie privée de chacun.

## 2. Le logo

| Fichier                                                                                | Usage                                                                      |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `public/brand/sunupix-logo.svg`                                                        | Logo complet (symbole + nom) sur fond clair                                |
| `public/brand/sunupix-logo-blanc.svg`                                                  | Logo complet sur fond sombre ou photo                                      |
| `public/brand/sunupix-symbole.svg`                                                     | Symbole seul : favicon, avatar, petits formats                             |
| `public/brand/sunupix-symbole-plein.svg`                                               | Symbole plein cadre : icônes d'application (le système arrondit les coins) |
| `public/brand/sunupix-symbole-mono.svg`                                                | Version une couleur : impression noir et blanc, tampons                    |
| `public/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | Icônes PWA et écran d'accueil                                              |
| `public/og-image.png`                                                                  | Image de partage (WhatsApp, Facebook, X, LinkedIn)                         |

Le nom « SunuPix » du logo est dessiné en **Inter Display Bold**, approche −3 %, puis vectorisé :
il s'affiche à l'identique partout, sans police à charger.

**Règles :**

- **Zone de protection :** laisser autour du logo un espace vide au moins égal à la hauteur du
  pixel jaune × 2 (soit ¼ de la hauteur du symbole).
- **Taille minimale :** symbole 16 px à l'écran (favicon), logo complet 96 px de large.
- **Écriture du nom :** toujours **SunuPix** (S et P majuscules, en un mot). Jamais « Sunupix »,
  « SUNUPIX » ni « Sunu Pix ».
- **Interdit :** déformer, incliner ou recolorer le logo ; ajouter une ombre ou un contour ;
  placer le logo vert sur un fond vert ou chargé ; changer la position ou la couleur du pixel ;
  remplacer le nom par une autre police.

## 3. Couleurs

### Couleurs de marque (fixes)

| Nom             | Hex       | Rôle                                                              |
| --------------- | --------- | ----------------------------------------------------------------- |
| **Vert Sunu**   | `#0B6E3F` | Couleur principale : symbole, boutons principaux, éléments actifs |
| **Jaune Pixel** | `#F2C230` | Accent rare : uniquement le pixel du logo et de petits détails    |
| **Encre**       | `#14161A` | Texte principal, logo sur fond clair                              |
| **Papier**      | `#F6F6F3` | Fond des pages                                                    |

Le **rouge du drapeau** (`#E31B23`) n'apparaît que dans la fine bande tricolore en haut des
pages. On ne l'utilise jamais pour un bouton ou un texte, pour qu'il ne soit pas confondu avec une
erreur.

### Couleurs de l'interface (claires / sombres)

Définies une seule fois dans `src/styles.css`. Tous les couples texte/fond respectent le niveau
**WCAG AA** (4,5:1 minimum pour le texte courant).

| Rôle                    | Mode clair | Mode sombre | Contraste       |
| ----------------------- | ---------- | ----------- | --------------- |
| Fond                    | `#F6F6F3`  | `#0E1110`   | —               |
| Surface (cartes)        | `#FFFFFF`  | `#161A18`   | —               |
| Texte                   | `#14161A`  | `#EEF0EE`   | 18,1:1 / 16,6:1 |
| Texte secondaire        | `#5A6068`  | `#A1A8A3`   | 6,3:1 / 7,2:1   |
| Accent (boutons, liens) | `#0B6E3F`  | `#4CC38A`   | 6,3:1 / 7,9:1   |
| Texte sur accent        | `#FFFFFF`  | `#06140C`   | 6,3:1 / 8,5:1   |
| Avertissement           | `#8A5300`  | `#F3C94D`   | 6,3:1 / 11,1:1  |
| Erreur                  | `#B4141B`  | `#FF7B7F`   | 6,9:1 / 7,0:1   |

En mode sombre, l'accent passe à un vert plus clair (`#4CC38A`) pour rester lisible. Le logo,
lui, garde toujours ses couleurs de marque.

**Règle d'or :** une couleur = un sens. Le vert signifie « action » ou « réussi ». Le jaune foncé
signifie « attention ». Le rouge signifie « erreur ». On ne les utilise pas pour décorer.

## 4. Typographie

| Usage                                          | Police                                                                      | Pourquoi                                                                                 |
| ---------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Interface et textes du site                    | Police système (SF Pro sur Apple, Segoe UI sur Windows, Roboto sur Android) | Zéro téléchargement, rendu parfait sur chaque appareil, idéal pour les connexions lentes |
| Noms de fichiers, formats, chiffres techniques | Police mono système (SF Mono, Menlo, Consolas)                              | Rappelle l'outil photo : `IMG_4821.HEIC → .JPG`                                          |
| Logo, affiches, réseaux sociaux                | Inter Display Bold (licence SIL OFL)                                        | Proche de la police système, avec plus de caractère en grand                             |

**Échelle :** titre principal 40 à 60 px, gras (700), approche −3,5 %, interligne 1,02. Titres de
section 24 à 30 px, demi-gras. Texte courant 15 à 18 px, interligne 1,6. Jamais de graisse fine
(Light, Thin) pour du texte de moins de 18 px.

## 5. Formes et composants

- **Arrondis :** 28 px pour le bloc du convertisseur, 16 px pour les cartes, boutons en pilule.
- **Bordures :** 1 px, couleur `--border`. Pas d'ombre sauf sur le bloc principal (ombre douce
  et longue).
- **Icônes :** trait de 1,8 px, bouts arrondis, 20 px par défaut, dessinées en SVG dans
  `src/components/Icon.tsx`. Une seule famille d'icônes.
- **Mouvement :** un seul moment animé (l'extension du fichier qui change dans l'accroche), des
  transitions de 150 à 300 ms ailleurs. Tout mouvement est coupé si l'appareil demande moins
  d'animations.

## 6. Ton et écriture

- **Tutoiement**, phrases courtes, mots simples. On parle comme un ami photographe, pas comme
  une notice.
- **Concret :** des chiffres vrais (« 400 photos », « 50 Mo ») plutôt que des superlatifs.
- **Honnête :** on n'annonce que ce qui marche vraiment. Pas de « révolutionnaire », pas de
  « meilleur du monde ».
- **Boutons :** un verbe qui dit ce qui va se passer : « Convertir 12 photos en JPG »,
  « Télécharger le ZIP ».
- **Erreurs :** ce qui s'est passé et quoi faire, sans s'excuser : « Fichier trop lourd (plus de
  50 Mo). »
- **Typographie française :** espace insécable avant « : ; ! ? », guillemets « », apostrophe
  typographique ’.

**Accroche officielle :** « Des centaines de photos converties. Aucune envoyée. »
**En anglais :** "Hundreds of photos converted. None uploaded."

## 7. Régénérer les fichiers

```bash
python3 scripts/brand/build-logo.py /chemin/vers/InterDisplay-Bold.otf
node scripts/brand/render-png.mjs
```

Le premier script produit les SVG (il faut `pip install fonttools` et la police Inter Display,
licence SIL OFL). Le second produit les PNG avec Chromium (Playwright).
