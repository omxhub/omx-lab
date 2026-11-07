import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/**
 * Renders public/favicon.ico (32x32, PNG payload) from public/favicon.svg —
 * the canonical closed-O Folded Signature (brand-system §1, 2026-09-13).
 *
 * Without this file, a browser's default /favicon.ico request on omxhub.com
 * falls through the worker's catch-all 301 to tools.omxhub.com. With it, the
 * Workers asset layer (run_worker_first:false) serves it directly.
 *
 * PNG-in-ICO payload matches the convention already live on Tools.
 */
const ROOT = dirname(fileURLToPath(import.meta.url)) + "/..";
const svgPath = join(ROOT, "public", "favicon.svg");
const icoPath = join(ROOT, "public", "favicon.ico");

if (!existsSync(svgPath)) {
  console.error(`favicon.svg not found at ${svgPath}`);
  process.exit(1);
}

const svg = readFileSync(svgPath);
const png = await sharp(svg, { density: 300 })
  .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // count: 1 image
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette count
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // color planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png.length, 14); // payload size
header.writeUInt32LE(22, 18); // payload offset

const ico = Buffer.concat([header, png]);
writeFileSync(icoPath, ico);
console.log(`favicon.ico: ${ico.length} bytes (32x32 PNG payload) rendered from favicon.svg`);
