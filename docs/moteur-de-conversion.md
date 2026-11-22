# Le moteur de conversion

Lecture : 10 minutes. Ce document suit une photo de bout en bout et explique les choix faits pour
tenir 400 photos sans faire planter le navigateur.

## 1. Ajout et détection

`BatchStore.addFiles` (`src/state/batch.ts`) reçoit les fichiers (glisser-déposer, sélection, ou
dossier parcouru récursivement par `collect-files.ts`). Pour chacun :

- au-delà de `LIMITS.maxFiles`, le fichier est refusé (message « 400 photos maximum ») ;
- au-delà de `LIMITS.maxFileBytes`, il est marqué en erreur `too-large` ;
- sinon, `detectFormat` lit **les 64 premiers octets** et reconnaît le vrai format (« nombres
  magiques »), même si l'extension ment. Une extension d'image avec des octets inconnus donne
  `corrupt`, sinon `unsupported`.

Aucune image n'est décodée à ce stade : ajouter 400 photos est instantané.

## 2. File d'attente

`TaskQueue` (`src/engine/queue.ts`) lance au plus N conversions à la fois. N vient de
`computeConcurrency` (`device.ts`) : la moitié des cœurs, entre 2 et 4 ; **2 sur iPhone/iPad et
sur les appareils de 4 Go de RAM ou moins**. Une tâche qui échoue n'arrête jamais les autres.

- **Pause** : les conversions en cours se terminent, aucune nouvelle ne démarre.
- **Annulation** : une tâche en attente est retirée ; une tâche en cours reçoit un `AbortSignal`,
  et le pool **termine son worker** (la mémoire est libérée immédiatement).

## 3. Pool de workers

`WorkerPool` (`worker-pool.ts`) garde jusqu'à N workers (`convert.worker.ts`, module ES). Après
chaque photo, le worker renvoie la taille de sa mémoire WebAssembly : **au-delà de 512 Mo, il est
recyclé**, car la mémoire WASM ne rétrécit jamais (une photo de 48 Mpx en occupe des centaines).
Un worker qui plante est remplacé et la photo passe en erreur `out-of-memory`.

S'il n'y a pas de `Worker` ou d'`OffscreenCanvas` (très vieux navigateurs), la conversion se fait
sur le fil principal, une photo à la fois, avec le même code.

## 4. Conversion d'une image (`pipeline.ts`)

### Décodage

- **HEIC** : le fichier entier est lu, puis `decoders/heic.ts` charge libheif **à la première
  utilisation** (le `.wasm` de 1,4 Mo est téléchargé une seule fois puis mis en cache). libheif
  décode l'image principale (pour une Live Photo ou une rafale, seulement la principale) et
  applique lui-même la rotation stockée dans le fichier. `heif.ts` lit l'espace colorimétrique :
  les iPhone produisent du **Display P3**, conservé si le navigateur sait créer un canvas P3.
- **Autres formats** : `createImageBitmap(file)`, décodage natif du navigateur, rapide.

### Orientation

Les navigateurs modernes appliquent l'orientation EXIF au décodage. `orientation.ts` le vérifie
une fois avec une image de 2 × 1 px marquée « orientation 6 » ; si le navigateur ne le fait pas,
on lit l'orientation dans l'EXIF et on tourne l'image sur le canvas.

### Taille et limites des canvas

`computeTargetSize` (`dimensions.ts`) calcule la taille de sortie : réglage de l'utilisateur
(jamais d'agrandissement), puis limites du navigateur :

| Plateforme             | Surface maximale (`config.ts → ENGINE`)        |
| ---------------------- | ---------------------------------------------- |
| iPhone / iPad (Safari) | 16 777 216 px (≈ 16,7 Mpx)                     |
| Autres                 | 100 000 000 px (choix prudent pour la mémoire) |

Une photo de 48 Mpx est donc réduite à ≈ 16,7 Mpx sur iPhone, avec un avertissement sur la ligne.
Si malgré tout le navigateur refuse le canvas (contexte nul, encodage vide), `render` **réessaie
en réduisant de 30 % de côté**, jusqu'à 3 fois.

### Encodage

`OffscreenCanvas.convertToBlob` produit le JPG, PNG ou WebP. Pour le JPG, le fond est blanc (pas
de transparence). Si le navigateur renvoie un autre type que celui demandé (Safari ne sait pas
créer de WebP), la photo passe en erreur `encode-unsupported`.

### Métadonnées (`exif.ts`)

Par défaut, rien n'est copié : le canvas produit une image sans métadonnées. Si l'utilisateur
veut les garder (JPG uniquement), on extrait le bloc EXIF de l'original (segment APP1 du JPEG, ou
élément `Exif` du HEIC), on remet **l'orientation à 1** (les pixels sont déjà tournés), on met à
jour les dimensions, on supprime la vignette intégrée et, en mode « sauf GPS », on **efface
l'IFD GPS**. Le bloc est ensuite réinséré dans le JPEG.

### Miniature

Une miniature JPEG de 96 px est tirée du canvas final, pour la liste.

## 5. Mémoire

Chaque ressource lourde est libérée dans un `finally`, même en cas d'erreur :

- `ImageBitmap.close()` après dessin ;
- canvas ramenés à 0 × 0 après encodage ;
- pixels HEIC relâchés dès le dessin terminé ;
- `URL.revokeObjectURL` pour chaque miniature retirée de la liste ;
- les fichiers convertis sont gardés en mémoire (Blob) **sauf** en mode « dossier », où chaque
  photo est écrite sur le disque puis oubliée.

Sur iPhone et appareils à 4 Go ou moins, un message conseille de convertir par paquets de 100 au
delà de 100 photos.

## 6. Téléchargement (`save.ts`, `zip-batches.ts`)

- Une photo : téléchargement direct.
- Plusieurs : `splitIntoBatches` découpe en ZIP de **100 photos ou 500 Mo maximum**, créés par
  client-zip **sans compression** (les images sont déjà compressées : c'est instantané).
- Chrome et Edge : `showDirectoryPicker` permet d'écrire chaque photo dans un dossier au fil de
  l'eau, sans jamais écraser un fichier existant (« IMG_1 (2).jpg »).

Les noms de sortie gardent le nom d'origine avec la nouvelle extension ; les doublons sont
numérotés sans tenir compte de la casse (`filenames.ts`).

## 7. Erreurs

Toutes les erreurs deviennent un code (`types.ts → ErrorCode`) traduit en message clair dans
`src/i18n/fr.ts → errors` : fichier corrompu, format non supporté, trop lourd, mémoire
insuffisante, photo trop grande, format de sortie non supporté, décodeur indisponible (hors ligne
avant le premier HEIC), écriture impossible dans le dossier.
