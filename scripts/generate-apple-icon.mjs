import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Renders public/apple-touch-icon.png (180x180) from the canonical closed-O
 * Folded Signature geometry (brand-system §1, 2026-09-13 revision).
 *
 * iOS composites apple-touch-icon onto black, so the tile is authored opaque:
 * porcelain ink on a rounded Carbon tile — the same app-icon treatment OMX
 * Clinical ships (src/app/icon.svg) and the same markTileSvg geometry OMX
 * Tools generates in scripts/generate-brand-assets.mjs.
 *
 * The mark is sized to 46% of the tile WIDTH (the signature is 3.1:1) and
 * centred, so it never overflows the square and sits inside the iOS
 * inscribed-circle crop.
 */
const ROOT = dirname(fileURLToPath(import.meta.url)) + "/..";
const outPath = join(ROOT, "public", "apple-touch-icon.png");

const SIZE = 180;
const INK = "#EDF2FB";
const TILE = "#141E30";
const TILE_RADIUS = 7.2 / 32; // same fraction as the favicon tiles

// Canonical closed-O geometry — must match src/brand.ts `mark` exactly.
const PATHS = [
  "M34.5 20A15 15 0 1 1 4.5 20A15 15 0 1 1 34.5 20Z",
  "M45 35V5L62 24 79 5V35",
  "M91 5 119 35M119 5 108 17M102 23 91 35",
];

const markWidth = SIZE * 0.46;
const markHeight = +((markWidth * 40) / 124).toFixed(2);
const x = +((SIZE - markWidth) / 2).toFixed(2);
const y = +((SIZE - markHeight) / 2).toFixed(2);
const scale = (markWidth / 124).toFixed(5);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" fill="none">
  <rect width="${SIZE}" height="${SIZE}" rx="${+(SIZE * TILE_RADIUS).toFixed(2)}" fill="${TILE}"/>
  <g transform="translate(${x}, ${y}) scale(${scale})" stroke="${INK}" stroke-width="6" stroke-linejoin="bevel">
    ${PATHS.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
</svg>\n`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(outPath, png);
console.log(`apple-touch-icon.png: ${png.length} bytes (${SIZE}x${SIZE}) rendered from canonical closed-O geometry`);
