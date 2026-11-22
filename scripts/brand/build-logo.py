"""
Génère les fichiers SVG du logo SunuPix (symbole + nom vectorisé).

Le nom est dessiné avec Inter Display Bold (licence SIL OFL) puis converti en tracés,
pour s'afficher à l'identique partout, sans police à charger.
Usage : python3 scripts/brand/build-logo.py /chemin/vers/InterDisplay-Bold.otf
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

GREEN = '#0B6E3F'
YELLOW = '#F2C230'
INK = '#14161A'

# Symbole sur une grille de 64 : un « S » (Sunu) qui libère un pixel jaune (Pix).
S_PATH = ('M41.5 17.6C39 15.2 35.8 14 32 14c-7.2 0-12 3.9-12 9.4 0 12.2 24 6.8 24 18.4 '
          '0 5.6-5 9.2-12.2 9.2-5 0-9.4-2-11.8-5.8')
def mark(bg=GREEN, fg='#fff', px=YELLOW, rx=15):
    bgrect = f'<rect width="64" height="64" rx="{rx}" fill="{bg}"/>' if bg else ''
    return (bgrect + f'<path d="{S_PATH}" fill="none" stroke="{fg}" stroke-width="6.5" stroke-linecap="round"/>'
            f'<rect x="42.5" y="10" width="8.5" height="8.5" rx="2.2" fill="{px}"/>')

def wordmark(font_path, text='SunuPix', tracking=-0.03):
    font = TTFont(font_path)
    cmap = font.getBestCmap(); gs = font.getGlyphSet(); hmtx = font['hmtx']
    upm = font['head'].unitsPerEm; asc = font['hhea'].ascent
    pen = SVGPathPen(gs); x = 0
    for ch in text:
        g = cmap[ord(ch)]
        # Axe Y des polices vers le haut : on retourne et on décale sur la ligne de base.
        gs[g].draw(TransformPen(pen, (1, 0, 0, -1, x, asc)))
        x += hmtx[g][0] + tracking * upm
    cap = font['OS/2'].sCapHeight
    return pen.getCommands(), x - tracking * upm, upm, asc, cap

def main():
    font = sys.argv[1]
    out = Path(__file__).resolve().parents[2] / 'public' / 'brand'
    d, width, upm, asc, cap = wordmark(font)
    # Le nom fait la hauteur de capitale = 0,5 × hauteur du symbole, centré verticalement.
    H = 64; scale = (H * 0.5) / cap
    top = asc - cap  # haut des capitales dans le repère du glyphe
    ty = (H - cap * scale) / 2 - top * scale
    gap = 18; tx = H + gap
    total_w = tx + width * scale
    def logo(text_color, name, bg_mark=GREEN):
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_w:.1f} {H}" role="img" aria-label="SunuPix">'
               f'{mark(bg_mark)}<path transform="translate({tx} {ty:.2f}) scale({scale:.5f})" d="{d}" fill="{text_color}"/></svg>\n')
        (out / name).write_text(svg)
    logo(INK, 'sunupix-logo.svg')
    logo('#FFFFFF', 'sunupix-logo-blanc.svg')
    (out / 'sunupix-symbole.svg').write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="SunuPix">{mark()}</svg>\n')
    (out / 'sunupix-symbole-mono.svg').write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="SunuPix">{mark(bg=INK, px="#fff")}</svg>\n')
    # Symbole plein cadre (icônes PWA « maskable » et Apple : le système arrondit lui-même).
    (out / 'sunupix-symbole-plein.svg').write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        f'<rect width="64" height="64" fill="{GREEN}"/><g transform="translate(9.6 9.6) scale(.7)">{mark(bg=None)}</g></svg>\n')
    print('ok', total_w)

main()
