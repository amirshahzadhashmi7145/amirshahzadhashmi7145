// Shared look for every generated SVG: colours, fonts, icons and drawing helpers.
// Everything on the profile is built from these so the cards read as one system.
import { readFileSync } from 'node:fs';

// Palette. One accent (signal cyan) with a violet companion used only inside gradients.
// `ok` is GitHub's green and only ever means "live" or "available".
export const THEMES = {
  dark: {
    bg: '#0a0e14', card: '#10161f', card2: '#161e2a', line: '#1f2a38', lineHi: '#2b3a4c',
    text: '#e6edf3', muted: '#8b949e', faint: '#5b6673', dot: '#16202c',
    accent: '#22d3ee', accent2: '#a78bfa', ok: '#3fb950', onAccent: '#06202a', mono: '#c9d1d9',
    name: 'dark',
  },
  light: {
    bg: '#ffffff', card: '#f8fafc', card2: '#eef2f6', line: '#e2e8f0', lineHi: '#cbd5e1',
    text: '#0f172a', muted: '#526071', faint: '#8a97a6', dot: '#e4e9ee',
    accent: '#0e7490', accent2: '#6d28d9', ok: '#1a7f37', onAccent: '#ffffff', mono: '#334155',
    name: 'light',
  },
};

export const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";
export const MONO = "ui-monospace, SFMono-Regular, 'Cascadia Code', Consolas, 'Liberation Mono', monospace";
export const EASE = 'cubic-bezier(.22,1,.36,1)';

export const ICONS = JSON.parse(readFileSync(new URL('./icons.json', import.meta.url)));

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Rough text width for system fonts. Generous on purpose: boxes are sized from this.
export const textW = (s, size, { mono = false, bold = false } = {}) => s.length * size * (mono ? 0.62 : bold ? 0.58 : 0.54);

// Greedy word wrap into lines that fit `width` px.
export function wrap(text, size, width, opts) {
  const lines = [];
  let cur = '';
  for (const w of text.split(' ')) {
    const next = cur ? `${cur} ${w}` : w;
    if (textW(next, size, opts) > width && cur) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

export const lines = (arr, x, y, lh, cls, extra = '') => arr.map((l, i) => `<text x="${x}" y="${y + i * lh}" class="${cls}"${extra}>${esc(l)}</text>`).join('');

// ---- colour maths (for keeping brand logos readable on dark cards)
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => {
  const [r, g, b] = rgb(h).map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
export const mix = (a, b, t) => '#' + rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');

// A brand logo (Simple Icons, 24x24) at (x, y). Keeps its brand colour, nudged toward the
// text colour until it reaches 3:1 against the card so nothing disappears in either theme.
export function brand(slug, x, y, size, T) {
  const b = ICONS.brands[slug];
  if (!b) throw new Error(`No brand icon "${slug}" in icons.json`);
  let fill = ['000000', '181717', 'FFFFFF'].includes(b.hex) ? T.mono : `#${b.hex.toLowerCase()}`;
  for (let k = 0; k < 12 && contrast(fill, T.card) < 3; k++) fill = mix(fill, T.text, 0.15);
  return `<path transform="translate(${x} ${y}) scale(${size / 24})" d="${b.path}" fill="${fill}"/>`;
}

// A Lucide outline icon (24x24, stroked).
export function lucide(name, x, y, size, color, width = 2) {
  const body = ICONS.lucide[name];
  if (!body) throw new Error(`No lucide icon "${name}" in icons.json`);
  return `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
}

// Dot-grid texture for card backgrounds.
export const dotGrid = (id, T, gap = 22) => `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.3" fill="${T.dot}"/></pattern>`;

// Rounded card base: fill, dots, hairline border.
export function cardBase(w, h, r, T, { dots = true, id = 'dots' } = {}) {
  return `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="${T.card}"/>` +
    (dots ? `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="url(#${id})"/>` : '') +
    `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="none" stroke="${T.line}"/>`;
}

// A light beam travelling around a rounded rectangle's border.
let beamN = 0;
export function beam(x, y, w, h, r, T, dur = 9, delay = 0, width = 1.6) {
  const id = `beam${beamN++}`;
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${T.accent}"/><stop offset=".7" stop-color="${T.accent2}"/><stop offset="1" stop-color="${T.accent2}" stop-opacity="0"/></linearGradient></defs>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="url(#${id})" stroke-width="${width}" pathLength="100" stroke-dasharray="16 84" stroke-linecap="round" class="beam" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`;
}
export const beamCss = `.beam{animation:beam linear infinite}@keyframes beam{to{stroke-dashoffset:-100}}`;

// Pill chip with centred mono text. Returns {svg, width}.
export function chip(label, x, y, T, { h = 30, size = 14, pad = 14, fill, stroke, color } = {}) {
  const w = Math.round(textW(label, size, { mono: true }) + pad * 2);
  return {
    width: w,
    svg: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill || T.card2}" stroke="${stroke || T.line}"/><text x="${x + w / 2}" y="${y + h / 2 + size * 0.36}" text-anchor="middle" font-family="${MONO}" font-size="${size}" font-weight="500" fill="${color || T.text}">${esc(label)}</text>`,
  };
}

// Row of chips starting at x; wraps to a new row if it runs past maxX.
export function chips(labels, x, y, T, { maxX = Infinity, gap = 8, rowGap = 10, ...opts } = {}) {
  let cx = x, cy = y, out = '';
  for (const l of labels) {
    const c = chip(l, cx, cy, T, opts);
    if (cx + c.width > maxX && cx !== x) { cx = x; cy += (opts.h || 30) + rowGap; }
    const c2 = chip(l, cx, cy, T, opts);
    out += c2.svg;
    cx += c2.width + gap;
  }
  return { svg: out, bottom: cy + (opts.h || 30) };
}

// Status pill with a pulsing dot (and an expanding ring when `live`).
export function status(label, x, y, T, { color, live = false, size = 14 } = {}) {
  const c = color || T.accent;
  const w = Math.round(textW(label, size, { mono: true }) + 44);
  return `<g><rect x="${x}" y="${y}" width="${w}" height="32" rx="16" fill="${T.card2}" stroke="${T.line}"/>
  ${live ? `<circle cx="${x + 16}" cy="${y + 16}" r="4.5" fill="${c}" class="ring" style="transform-origin:${x + 16}px ${y + 16}px"/>` : ''}
  <circle cx="${x + 16}" cy="${y + 16}" r="4.5" fill="${c}" class="pulse"/>
  <text x="${x + 28}" y="${y + 21}" font-family="${MONO}" font-size="${size}" font-weight="600" fill="${T.text}">${esc(label)}</text></g>`;
}

export const pulseCss = `.pulse{animation:pulse 2s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
.ring{animation:ring 2s ease-out infinite}@keyframes ring{0%{transform:scale(.6);opacity:.7}100%{transform:scale(2.4);opacity:0}}`;

export const nudgeCss = `.arrow{animation:nudge 2.4s ${EASE} infinite}@keyframes nudge{0%,60%,100%{transform:none}75%{transform:translate(3px,-3px)}}`;

export const reducedMotion = (extra = '') => `@media (prefers-reduced-motion: reduce){*{animation:none!important}${extra}}`;

export function svg({ w, h, title, desc, body, style = '', defs = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<defs>${defs}</defs>
<style>
${style}
</style>
${body}
</svg>
`;
}

// Deterministic pseudo-random so rebuilds don't churn the diff.
export function rng(seed = 7) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
