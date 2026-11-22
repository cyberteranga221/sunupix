# Journal des modifications

Toutes les modifications notables de SunuPix sont notées ici. Format inspiré de
[Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions selon
[SemVer](https://semver.org/lang/fr/).

## [Non publié]

## [0.1.0] - 2026-11-22

Première version publique.

### Ajouté

- Conversion 100 % locale dans le navigateur : HEIC, HEIF, JPEG, PNG, WebP, AVIF, GIF, BMP vers
  JPG, PNG ou WebP. Aucune photo envoyée.
- Mode gros volume : 400 photos par lot, 50 Mo par photo, file d'attente avec 2 à 4 conversions
  en parallèle (Web Workers), pause, reprise et annulation.
- Décodeur HEIC (libheif, WebAssembly) chargé uniquement au premier fichier HEIC.
- Qualité, redimensionnement, métadonnées (tout supprimer, garder sauf GPS, tout garder).
- Orientation EXIF respectée, couleurs Display P3 conservées quand le navigateur le permet,
  réduction automatique si la photo dépasse la limite de canvas (Safari iOS).
- Liste virtualisée avec miniatures, progression et temps restant estimé.
- Téléchargement individuel, ZIP découpés (100 photos ou 500 Mo), écriture directe dans un dossier
  (Chrome, Edge).
- Interface en 3 étapes, français et anglais, thème clair et sombre, accessibilité WCAG AA.
- Pages dédiées (HEIC en JPG, HEIC en PNG, PNG en JPG, JPG en PNG, WebP en JPG), FAQ,
  Confidentialité, À propos, Contact, 404, toutes pré-rendues pour le référencement.
- PWA installable et utilisable hors ligne.
- En-têtes de sécurité Vercel (CSP compatible WebAssembly), statistiques respectueuses de la vie
  privée (désactivées par défaut), emplacements de publicité et de don désactivés.
- Logo et charte graphique.

### Modifié

- Licence : passage de MIT à PolyForm Noncommercial 1.0.0 (usage commercial soumis à
  autorisation) et politique de marque (`TRADEMARKS.md`).
