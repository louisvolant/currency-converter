// scripts/generate-icons.mjs
/**
 * Generates the PWA favicon and logo assets from a single vector master.
 *
 * The design is a blue -> purple gradient rounded square (matching the app
 * header) featuring a bold white Euro glyph. Every icon variant (browser
 * favicon, web manifest icons, Apple touch icon and Android maskable icons)
 * is derived from the same SVG template so the brand stays consistent.
 *
 * Usage: npm run icons
 */

import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(repoRoot, 'public');
const iconsDir = join(publicDir, 'icons');
mkdirSync(iconsDir, { recursive: true });

/**
 * White Euro glyph drawn with strokes only, so it has no font dependency.
 * Coordinates are relative to a 512x512 viewBox.
 */
const EURO_GLYPH = `
  <path d="M 378.9 342 A 150 150 0 1 1 378.9 170" fill="none" stroke="#FFFFFF" stroke-width="46" stroke-linecap="round"/>
  <path d="M 100 218 L 415 218" fill="none" stroke="#FFFFFF" stroke-width="46" stroke-linecap="round"/>
  <path d="M 100 294 L 415 294" fill="none" stroke="#FFFFFF" stroke-width="46" stroke-linecap="round"/>
`;

/**
 * Builds the master SVG.
 *
 * @param {{ bleed?: boolean }} options When true, the gradient fills the whole
 *   canvas (Apple touch icon / Android maskable). Otherwise it is a rounded
 *   square with transparent corners (classic app icon / favicon).
 */
function svgMaster({ bleed = false } = {}) {
  const background = bleed
    ? '<rect width="512" height="512" fill="url(#brandGradient)"/>'
    : '<rect x="24" y="24" width="464" height="464" rx="112" fill="url(#brandGradient)"/>';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="Currency Converter logo">
  <defs>
    <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2563EB"/>
      <stop offset="1" stop-color="#9333EA"/>
    </linearGradient>
  </defs>
  ${background}
  ${EURO_GLYPH}
</svg>`;
}

/** Renders an SVG to a PNG buffer at the requested square size. */
async function renderPng(svg, size) {
  return sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toBuffer();
}

/**
 * Bundles PNG buffers into a Windows ICO container (.ico favicon).
 *
 * @param {{ size: number, buffer: Buffer }[]} icons
 */
function buildIco(icons) {
  const count = icons.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16; // 6-byte header + 16 bytes per directory entry
  const entries = [];
  const payloads = [];

  for (const { size, buffer } of icons) {
    const entry = Buffer.alloc(16);
    // Width/height byte: 0 means 256, otherwise the actual dimension.
    const dim = size >= 256 ? 0 : size;
    entry.writeUInt8(dim, 0); // width
    entry.writeUInt8(dim, 1); // height
    entry.writeUInt8(0, 2); // palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // data size
    entry.writeUInt32LE(offset, 12); // data offset
    entries.push(entry);
    offset += buffer.length;
    payloads.push(buffer);
  }

  // All directory entries first, then the PNG payloads, matching the offsets.
  return Buffer.concat([header, ...entries, ...payloads]);
}

/** Writes a PNG buffer to a file path, logging a single line per asset. */
function writePng(filePath, buffer) {
  writeFileSync(filePath, buffer);
  console.log(`generated ${filePath.replace(repoRoot + '/', '')}`);
}

async function main() {
  const rounded = svgMaster();
  const fullBleed = svgMaster({ bleed: true });

  // 1. Master vector used as the scalable favicon and design source of truth.
  writeFileSync(join(publicDir, 'icon.svg'), rounded);
  console.log('generated public/icon.svg');

  // 2. Classic .ico favicon containing 16x16, 32x32 and 48x48.
  const icoEntries = [];
  for (const size of [16, 32, 48]) {
    icoEntries.push({ size, buffer: await renderPng(rounded, size) });
  }
  writePng(join(publicDir, 'favicon.ico'), buildIco(icoEntries));

  // 3. Header logo + legacy browser favicon (rounded square, 512px).
  writePng(join(publicDir, 'icon-currency.png'), await renderPng(rounded, 512));

  // 4. Apple touch icon (iOS home screen): opaque full-bleed, 180px.
  writePng(join(publicDir, 'apple-touch-icon.png'), await renderPng(fullBleed, 180));

  // 5. Web App Manifest icons (rounded, "any" purpose).
  writePng(join(iconsDir, 'icon-192.png'), await renderPng(rounded, 192));
  writePng(join(iconsDir, 'icon-512.png'), await renderPng(rounded, 512));

  // 6. Maskable icons (Android adaptive icons, full-bleed background).
  writePng(join(iconsDir, 'icon-maskable-192.png'), await renderPng(fullBleed, 192));
  writePng(join(iconsDir, 'icon-maskable-512.png'), await renderPng(fullBleed, 512));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});