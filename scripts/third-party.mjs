/**
 * Génère THIRD_PARTY_LICENSES.md : chaque dépendance directe (package.json) et sa licence,
 * lues dans node_modules. À relancer après chaque ajout ou mise à jour de dépendance :
 *   node scripts/third-party.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));

async function info(name) {
  const meta = JSON.parse(await readFile(join(root, 'node_modules', name, 'package.json'), 'utf8'));
  const repo = typeof meta.repository === 'string' ? meta.repository : (meta.repository?.url ?? '');
  const url = (meta.homepage || repo || `https://www.npmjs.com/package/${name}`)
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
    .replace(/^github:/, 'https://github.com/')
    .replace(/^(ssh:\/\/git@|git:\/\/)github\.com/, 'https://github.com');
  return { name, version: meta.version, license: meta.license ?? 'inconnue', url };
}

const table = async (deps) => {
  const rows = await Promise.all(Object.keys(deps).sort().map(info));
  return [
    '| Paquet | Version | Licence |',
    '| --- | --- | --- |',
    ...rows.map((r) => `| [${r.name}](${r.url}) | ${r.version} | ${r.license} |`),
  ].join('\n');
};

const md = `# Licences des composants tiers

_Fichier généré par \`node scripts/third-party.mjs\`. Ne pas modifier à la main._

SunuPix est distribué sous licence PolyForm Noncommercial 1.0.0 (voir \`LICENSE\`). Il s'appuie
sur les composants ci-dessous, qui gardent chacun leur propre licence.

## Compatibilité

- **MIT, Apache-2.0, ISC, BSD** : licences permissives, compatibles avec la licence de SunuPix
  (avis de copyright conservés dans les fichiers distribués).
- **libheif-js (LGPL-3.0)** : bibliothèque de décodage HEIC. Elle est utilisée **sans
  modification**, chargée à part (fichiers \`libheif-*.js\` et \`libheif-*.wasm\` du dossier
  \`assets\`) uniquement quand un fichier HEIC est converti. La LGPL autorise cet usage par un
  logiciel sous une autre licence. Son code source est disponible sur
  https://github.com/catdad-experiments/libheif-js (et libheif sur https://github.com/strukturag/libheif).
  Le texte complet de sa licence est publié avec le site : \`/licenses/third-party.txt\`.
  Tu peux remplacer cette bibliothèque par une autre version compatible en modifiant
  \`package.json\` puis en reconstruisant le site.
- **Inter Display (SIL Open Font License 1.1)** : police utilisée pour dessiner le nom du logo
  (converti en tracés dans \`public/brand/\`). Elle n'est pas distribuée avec le site.

## Dépendances utilisées par le site

${await table(pkg.dependencies)}

## Outils de développement (non distribués)

${await table(pkg.devDependencies)}
`;
await writeFile(join(root, 'THIRD_PARTY_LICENSES.md'), md);
console.log('THIRD_PARTY_LICENSES.md généré');

// Textes complets des licences de tout ce qui est livré aux visiteurs (dépendances de production
// et leurs propres dépendances), publiés sur le site : /licenses/third-party.txt.
const prod = JSON.parse(
  execFileSync('pnpm', ['licenses', 'list', '--prod', '--json'], { cwd: root, encoding: 'utf8' }),
);
const blocks = [];
for (const [license, packages] of Object.entries(prod)) {
  for (const p of packages) {
    const dir = p.paths?.[0];
    if (!dir) continue;
    const files = (await readdir(dir)).filter((f) => /^(licen[cs]e|copying)/i.test(f));
    const texts = await Promise.all(files.map((f) => readFile(join(dir, f), 'utf8')));
    // libheif : la LGPL exige aussi le texte de la GPL, fourni dans libheif-wasm/LICENSE.
    if (p.name === 'libheif-js')
      texts.push(await readFile(join(dir, 'libheif-wasm', 'LICENSE'), 'utf8'));
    blocks.push(
      `${'='.repeat(72)}\n${p.name} ${p.versions.join(', ')} (${license})\n${'='.repeat(72)}\n\n${texts.join('\n') || `Licence ${license}`}`,
    );
  }
}
await mkdir(join(root, 'public', 'licenses'), { recursive: true });
await writeFile(
  join(root, 'public', 'licenses', 'third-party.txt'),
  `Licences des composants tiers livrés avec SunuPix\n\n${blocks.join('\n\n')}\n`,
);
console.log(`public/licenses/third-party.txt généré (${blocks.length} paquets)`);
