// Builds every static SVG on the profile README into assets/, in a dark and a light version.
//   node scripts/build-svgs.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { THEMES, SANS, MONO, EASE, esc, textW, wrap, lines, brand, lucide, dotGrid, cardBase, beam, beamCss, chips, status, pulseCss, nudgeCss, reducedMotion, svg, rng, mix } from './lib.mjs';
import { HERO, NAV, HEADERS, ABOUT_TILES, STACK, FEATURE, CARDS, CTA, SOCIAL } from './profile.mjs';

const OUT = new URL('../assets/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const files = [];
const write = (name, T, content) => { writeFileSync(new URL(`${name}-${T.name}.svg`, OUT), content); files.push(`${name}-${T.name}.svg`); };

// LinkedIn's "in" mark is not in Lucide any more; this is the retired Lucide outline (ISC).
const LINKEDIN = '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>';
const icon = (name, x, y, size, color, width = 2) => name === 'linkedin-glyph'
  ? `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${LINKEDIN}</g>`
  : lucide(name, x, y, size, color, width);

// Icon in a soft rounded square (accent tinted).
const iconBox = (name, x, y, T, size = 44) => `<g transform="translate(${x} ${y})"><rect width="${size}" height="${size}" rx="${size * 0.28}" fill="${T.accent}" fill-opacity=".14" stroke="${T.accent}" stroke-opacity=".4"/>${icon(name, size * 0.227, size * 0.227, size * 0.545, T.accent)}</g>`;

// ------------------------------------------------------------------ hero
function hero(T) {
  const W = 1200, H = 420;
  const r = rng(11);
  const stars = Array.from({ length: 70 }, () => {
    const x = (r() * W).toFixed(1), y = (r() * H).toFixed(1), rad = (0.5 + r() * 1.1).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${rad}" class="star" style="animation-duration:${(3 + r() * 4).toFixed(2)}s;animation-delay:-${(r() * 6).toFixed(2)}s"/>`;
  }).join('');
  const nameSvg = `<g class="word" style="animation-delay:.1s"><text x="60" y="150" class="name">${esc(HERO.name)}</text></g>`;
  const n = HERO.phrases.length, per = 4, total = n * per;
  const phrases = HERO.phrases.map((p, i) => `<text x="60" y="250" class="phrase" style="animation-delay:${i * per}s">${esc(p)}</text>`).join('');
  const swapPct = (k) => ((k / per) * (100 / n)).toFixed(2);

  // Agent-loop illustration: a model at the centre, retrieval / tools / evals around it.
  const cx = 960, cy = 212, R = 118;
  const nodes = [
    { a: -90, icon: 'database-zap', label: 'retrieve' },
    { a: 30, icon: 'wrench', label: 'tools' },
    { a: 150, icon: 'flask-conical', label: 'evals' },
  ].map((o) => ({ ...o, x: cx + R * Math.cos((o.a * Math.PI) / 180), y: cy + R * Math.sin((o.a * Math.PI) / 180) }));
  const links = nodes.map((o, i) => `<line x1="${cx}" y1="${cy}" x2="${o.x.toFixed(1)}" y2="${o.y.toFixed(1)}" stroke="${T.lineHi}" stroke-width="1.5"/>
    <line x1="${cx}" y1="${cy}" x2="${o.x.toFixed(1)}" y2="${o.y.toFixed(1)}" stroke="${T.accent}" stroke-width="2" stroke-linecap="round" pathLength="100" stroke-dasharray="14 86" class="flow" style="animation-delay:${-i * 1.1}s"/>`).join('');
  const nodeSvg = nodes.map((o, i) => `<g class="float" style="animation-delay:${-i * 2.3}s">
    <rect x="${(o.x - 28).toFixed(1)}" y="${(o.y - 28).toFixed(1)}" width="56" height="56" rx="16" fill="${T.card}" stroke="${T.line}"/>
    ${icon(o.icon, o.x - 13, o.y - 13, 26, T.text, 1.8)}
    <text x="${o.x.toFixed(1)}" y="${(o.y + (o.a === -90 ? -40 : 50)).toFixed(1)}" text-anchor="middle" class="meta">${o.label}</text></g>`).join('');
  const centre = `<circle cx="${cx}" cy="${cy}" r="${R + 46}" fill="none" stroke="${T.line}" stroke-dasharray="3 9" class="spin" style="animation-duration:70s"/>
    <circle cx="${cx}" cy="${cy}" r="${R + 46}" fill="none" stroke="${T.accent}" stroke-opacity=".5" stroke-width="2" pathLength="100" stroke-dasharray="8 92" stroke-linecap="round" class="orbit"/>
    <circle cx="${cx}" cy="${cy}" r="58" fill="${T.accent}" fill-opacity=".08" class="breathe"/>
    <rect x="${cx - 38}" y="${cy - 38}" width="76" height="76" rx="22" fill="${T.card2}" stroke="${T.accent}" stroke-opacity=".6"/>
    ${icon('brain-circuit', cx - 19, cy - 19, 38, T.accent, 1.8)}
    <text x="${cx}" y="${cy + 66}" text-anchor="middle" class="meta" fill="${T.accent}">agent loop</text>`;

  return svg({
    w: W, h: H, title: HERO.name,
    desc: `${HERO.name}. ${HERO.lead} ${HERO.phrases.join(' ')} ${HERO.meta}. ${HERO.tagline}`,
    defs: `<radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${cx} ${cy}) scale(300 260)"><stop offset="0" stop-color="${T.accent}" stop-opacity=".14"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/></radialGradient>
      <clipPath id="hc"><rect width="${W}" height="${H}" rx="22"/></clipPath>`,
    style: `
  .star{fill:${T.muted};animation:twinkle ease-in-out infinite alternate}@keyframes twinkle{from{opacity:.1}to{opacity:.6}}
  .name{font:700 60px ${SANS};fill:${T.text};letter-spacing:-1.5px}
  .word{opacity:0;animation:rise .9s ${EASE} forwards}
  @keyframes rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
  .fade{opacity:0;animation:fade .8s ease-out .5s forwards}@keyframes fade{to{opacity:1}}
  .eyebrow{font:500 17px ${MONO};fill:${T.muted}}
  .cursor{fill:${T.accent};animation:blink 1.1s steps(2) infinite}@keyframes blink{to{opacity:0}}
  .lead{font:400 22px ${SANS};fill:${T.muted}}
  .phrase{font:600 30px ${SANS};fill:${T.text};letter-spacing:-.3px;opacity:0;animation:swap ${total}s ${EASE} infinite backwards}
  @keyframes swap{0%{opacity:0;transform:translateY(14px)}${swapPct(0.45)}%{opacity:1;transform:none}${swapPct(per - 0.5)}%{opacity:1;transform:none}${(100 / n).toFixed(2)}%{opacity:0;transform:translateY(-14px)}100%{opacity:0}}
  .meta{font:500 14px ${MONO};fill:${T.muted};letter-spacing:.5px}
  .tag{font:400 17px ${SANS};fill:${T.muted}}
  .dot{fill:${T.ok}}
  .spin{transform-origin:${cx}px ${cy}px;animation:spin linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
  .orbit{transform-origin:${cx}px ${cy}px;animation:orbit 12s linear infinite}@keyframes orbit{to{stroke-dashoffset:-100}}
  .flow{animation:flow 2.6s linear infinite}@keyframes flow{to{stroke-dashoffset:-100}}
  .float{animation:floaty 6s ease-in-out infinite}@keyframes floaty{50%{transform:translateY(-5px)}}
  .breathe{transform-origin:${cx}px ${cy}px;animation:breathe 4s ease-in-out infinite}@keyframes breathe{50%{transform:scale(1.18);opacity:.6}}
  ${pulseCss}
  ${reducedMotion('.word,.fade{opacity:1}.phrase{opacity:0}.phrase:first-of-type{opacity:1}')}`,
    body: `<g clip-path="url(#hc)">
  <rect width="${W}" height="${H}" fill="${T.bg === '#ffffff' ? T.card : T.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${stars}
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="22" fill="none" stroke="${T.line}"/>
<text x="60" y="78" class="eyebrow">${esc(HERO.eyebrow)}</text><rect x="${60 + textW(HERO.eyebrow + ' ', 17, { mono: true })}" y="64" width="9" height="18" class="cursor"/>
${nameSvg}
<g class="fade">
  <text x="60" y="206" class="lead">${esc(HERO.lead)}</text>
  <g><circle cx="66" cy="304" r="4.5" class="dot pulse"/><text x="82" y="309" class="meta">${esc(HERO.meta)}</text></g>
  <text x="60" y="346" class="tag">${esc(HERO.tagline)}</text>
</g>
${phrases}
${links}${centre}${nodeSvg}`,
  });
}

// ------------------------------------------------------------------ nav pills + headers
function nav(T, it) {
  const W = 150, H = 46;
  return svg({ w: W, h: H, title: it.label, desc: `Jump to ${it.label}`, style: '',
    body: `<rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="23" fill="${T.card}" stroke="${T.line}" stroke-width="1.5"/>
<text x="20" y="28" font-family="${MONO}" font-size="13" font-weight="600" letter-spacing="1" fill="${T.accent}">${it.n}</text>
<text x="50" y="29" font-family="${SANS}" font-size="16" font-weight="600" fill="${T.text}">${esc(it.label)}</text>
<path d="M124 19l4 4 4-4" stroke="${T.faint}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` });
}

function header(T, h) {
  const W = 1200, H = 92;
  return svg({ w: W, h: H, title: `${h.n} ${h.title}`, desc: h.sub,
    style: `.seg{animation:seg 1.2s ${EASE} .2s backwards;transform-origin:0 0}@keyframes seg{from{transform:scaleX(0)}}
  .t{opacity:0;animation:in .8s ${EASE} forwards}@keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  ${reducedMotion('.t{opacity:1}')}`,
    body: `<g class="t">
  <text x="0" y="52" font-family="${MONO}" font-size="16" font-weight="600" letter-spacing="2" fill="${T.accent}">${h.n}</text>
  <text x="44" y="54" font-family="${SANS}" font-size="34" font-weight="700" letter-spacing="-.7" fill="${T.text}">${esc(h.title)}</text>
  <text x="${W}" y="52" text-anchor="end" font-family="${MONO}" font-size="14" fill="${T.muted}">${esc(h.sub)}</text>
</g>
<rect x="0" y="78" width="${W}" height="1.5" fill="${T.line}"/>
<rect x="0" y="77.5" width="72" height="2.5" rx="1.25" fill="${T.accent}" class="seg"/>` });
}

// ------------------------------------------------------------------ about (bento)
function about(T) {
  const W = 1200, H = 460, gap = 20;
  const tile = (x, y, w, h, t, delay, bodySize, titleSize, wrapW, extra = '') => {
    const pad = 28;
    const bodyLines = wrap(t.body, bodySize, wrapW);
    return `<g class="tile" style="animation-delay:${delay}s">
  <rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="22" fill="${T.card}" stroke="${T.line}"/>
  <rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="22" fill="url(#dots)"/>
  ${beam(x + 0.5, y + 0.5, w - 1, h - 1, 22, T, 9 + delay * 6, -delay * 4)}
  ${iconBox(t.icon, x + pad, y + pad, T)}
  <text x="${x + pad}" y="${y + pad + 70}" class="eyebrow" fill="${T.accent}">${esc(t.eyebrow)}</text>
  <text x="${x + pad}" y="${y + pad + 70 + titleSize + 8}" class="h" font-size="${titleSize}">${esc(t.title)}</text>
  ${lines(bodyLines, x + pad, y + pad + 70 + titleSize + 8 + bodySize * 1.6, bodySize * 1.5, 'p', ` font-size="${bodySize}"`)}
  ${extra}
</g>`;
  };
  // Mini pipeline in the main tile: query -> router -> {docs, data} -> answer / human.
  const px = 28, py = 338;
  const box = (x, y, w, label, ic, on = false) => `<rect x="${x}" y="${y}" width="${w}" height="40" rx="12" fill="${on ? T.accent : T.card2}" fill-opacity="${on ? '.14' : '1'}" stroke="${on ? T.accent : T.line}" stroke-opacity="${on ? '.55' : '1'}"/>${icon(ic, x + 12, y + 11, 18, T.text, 1.8)}<text x="${x + 36}" y="${y + 25}" class="pill">${label}</text>`;
  const pipe = `<g>
  ${box(px, py, 92, 'query', 'message-square')}
  <line x1="${px + 92}" y1="${py + 20}" x2="${px + 118}" y2="${py + 20}" stroke="${T.lineHi}" stroke-width="1.5"/>
  ${box(px + 118, py, 96, 'router', 'route', true)}
  <path d="M${px + 214} ${py + 20}h12c8 0 8-18 16-18h10" fill="none" stroke="${T.lineHi}" stroke-width="1.5"/>
  <path d="M${px + 214} ${py + 20}h12c8 0 8 18 16 18h10" fill="none" stroke="${T.lineHi}" stroke-width="1.5"/>
  <path d="M${px + 92} ${py + 20}h26 M${px + 214} ${py + 20}h12c8 0 8-18 16-18h10" fill="none" stroke="${T.accent}" stroke-width="2" stroke-linecap="round" pathLength="100" stroke-dasharray="20 80" class="walk"/>
  ${box(px + 252, py - 32, 84, 'docs', 'file-text')}
  ${box(px + 252, py + 32, 84, 'data', 'database')}
  <path d="M${px + 336} ${py - 12}h10c8 0 8 32 16 32h10 M${px + 336} ${py + 52}h10c8 0 8-32 16-32h10" fill="none" stroke="${T.lineHi}" stroke-width="1.5"/>
  ${box(px + 372, py, 100, 'answer', 'circle-check')}
  <text x="${px}" y="${py + 74}" class="tiny">unsure? escalate to a human</text>
</g>`;
  const main = tile(0, 0, 560, H, ABOUT_TILES.main, 0.1, 19, 38, 500, pipe);
  const s0 = tile(580, 0, 300, 270, ABOUT_TILES.small[0], 0.25, 15, 22, 244);
  const s1 = tile(900, 0, 300, 270, ABOUT_TILES.small[1], 0.4, 15, 22, 244);
  const wide = tile(580, 290, 620, 170, ABOUT_TILES.wide, 0.55, 16, 22, 560);
  // Wide tile: title and body sit beside the icon instead of under it.
  const w = ABOUT_TILES.wide;
  const wideFixed = `<g class="tile" style="animation-delay:0.55s">
  <rect x="580.5" y="290.5" width="619" height="169" rx="22" fill="${T.card}" stroke="${T.line}"/>
  <rect x="580.5" y="290.5" width="619" height="169" rx="22" fill="url(#dots)"/>
  ${beam(580.5, 290.5, 619, 169, 22, T, 11, -3)}
  ${iconBox(w.icon, 608, 318, T)}
  <text x="672" y="334" class="eyebrow" fill="${T.accent}">${esc(w.eyebrow)}</text>
  <text x="672" y="364" class="h" font-size="22">${esc(w.title)}</text>
  ${lines(wrap(w.body, 16, 500), 672, 392, 24, 'p', ' font-size="16"')}
</g>`;
  void wide;
  return svg({ w: W, h: H, title: 'About me',
    desc: [ABOUT_TILES.main, ...ABOUT_TILES.small, ABOUT_TILES.wide].map((t) => `${t.eyebrow}: ${t.title}. ${t.body}`).join(' '),
    defs: dotGrid('dots', T),
    style: `${beamCss}
  .tile{opacity:0;animation:in .9s ${EASE} forwards}@keyframes in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  .eyebrow{font:600 13px ${MONO};letter-spacing:2.2px}
  .h{font-family:${SANS};font-weight:700;fill:${T.text};letter-spacing:-.6px}
  .p{font-family:${SANS};font-weight:400;fill:${T.muted}}
  .pill{font:600 13px ${MONO};fill:${T.text}}
  .tiny{font:500 12px ${MONO};fill:${T.faint}}
  .walk{animation:walk 3s linear infinite}@keyframes walk{to{stroke-dashoffset:-100}}
  ${reducedMotion('.tile{opacity:1}.beam{opacity:0}')}`,
    body: `${main}${s0}${s1}${wideFixed}` });
}

// ------------------------------------------------------------------ stack marquee
function stack(T) {
  const W = 1200, rowH = 48, rowGap = 22, top = 10;
  const H = top + STACK.length * (rowH + rowGap);
  const viewX = 190, viewW = W - viewX;
  let styles = '', body = '';
  STACK.forEach((row, ri) => {
    const y = top + ri * (rowH + rowGap);
    const pieces = row.items.map((it) => ({ ...it, w: Math.round(16 + 22 + 10 + textW(it.label, 16) + 18) }));
    const gap = 12;
    const total = pieces.reduce((s, p) => s + p.w + gap, 0);
    const one = pieces.map((p, i) => {
      const x = pieces.slice(0, i).reduce((s, q) => s + q.w + gap, 0);
      const ic = p.brand ? brand(p.brand, x + 16, y + 13, 22, T) : icon(p.icon, x + 16, y + 13, 22, T.accent, 1.8);
      return `<rect x="${x}" y="${y}" width="${p.w}" height="${rowH}" rx="24" fill="${T.card}" stroke="${T.line}"/>${ic}<text x="${x + 48}" y="${y + 30}" class="name">${esc(p.label)}</text>`;
    }).join('');
    const dur = (total / 38).toFixed(1);
    const rev = ri % 2 === 1;
    styles += `@keyframes r${ri}{from{transform:translateX(${rev ? -total : 0}px)}to{transform:translateX(${rev ? 0 : -total}px)}}.r${ri}{animation:r${ri} ${dur}s linear infinite}\n`;
    body += `<text x="0" y="${y + 30}" class="cat">${esc(row.cat.toUpperCase())}</text>
<g clip-path="url(#view)" mask="url(#fade)"><g transform="translate(${viewX} 0)"><g class="r${ri}">${one}<g transform="translate(${total} 0)">${one}</g><g transform="translate(${total * 2} 0)">${one}</g></g></g></g>\n`;
  });
  return svg({ w: W, h: H, title: 'Tech stack',
    desc: STACK.map((r) => `${r.cat}: ${r.items.map((i) => i.label).join(', ')}`).join('. '),
    defs: `<clipPath id="view"><rect x="${viewX}" y="0" width="${viewW}" height="${H}"/></clipPath>
  <linearGradient id="fg" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset=".06" stop-color="#fff"/><stop offset=".94" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
  <mask id="fade" maskUnits="userSpaceOnUse" x="${viewX}" y="0" width="${viewW}" height="${H}"><rect x="${viewX}" y="0" width="${viewW}" height="${H}" fill="url(#fg)"/></mask>`,
    style: `.cat{font:600 13px ${MONO};letter-spacing:2px;fill:${T.muted}}
  .name{font:500 16px ${SANS};fill:${T.text}}
  ${styles}${reducedMotion()}`,
    body: `<rect width="${W}" height="${H}" fill="${T.bg}"/>\n${body}` });
}

// ------------------------------------------------------------------ projects
function feature(T) {
  const W = 1200, H = 380, pad = 44, f = FEATURE;
  const bodyLines = wrap(f.body, 18, 660).slice(0, 4);
  const chipY = pad + 132 + bodyLines.length * 26 - 6;
  // Right panel: a terminal showing the pipeline stages completing in order.
  const stages = ['Read the product description', 'Write requirements', 'Split into tasks', 'Generate code', 'Run the tests', 'Open a reviewed pull request'];
  const tx = 760, ty = 44, tw = 396, th = 292;
  const term = `<g class="float">
  <rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="18" fill="${T.card2}" stroke="${T.line}"/>
  <circle cx="${tx + 22}" cy="${ty + 20}" r="5" fill="#ff5f57"/><circle cx="${tx + 40}" cy="${ty + 20}" r="5" fill="#febc2e"/><circle cx="${tx + 58}" cy="${ty + 20}" r="5" fill="#28c840"/>
  <text x="${tx + tw / 2}" y="${ty + 25}" text-anchor="middle" class="url">atelier run · spec.md</text>
  <line x1="${tx}" y1="${ty + 40}" x2="${tx + tw}" y2="${ty + 40}" stroke="${T.line}"/>
  ${stages.map((s, i) => {
    const y = ty + 70 + i * 38;
    return `<g class="stage" style="animation-delay:${(i * 1.4).toFixed(1)}s">
      <circle cx="${tx + 28}" cy="${y - 5}" r="8" fill="none" stroke="${T.lineHi}" stroke-width="1.6"/>
      <g class="tick" style="animation-delay:${(i * 1.4 + 0.9).toFixed(1)}s"><circle cx="${tx + 28}" cy="${y - 5}" r="8" fill="${T.ok}"/>${lucide('check', tx + 22, y - 11, 12, T.onAccent === '#ffffff' ? '#ffffff' : '#06202a', 3)}</g>
      <text x="${tx + 48}" y="${y}" class="mono">${esc(s)}</text></g>`;
  }).join('')}
</g>`;
  const chipRow = chips(f.chips, pad, chipY, T);
  const body = `<path d="M0 ${H}V26A26 26 0 0 1 26 0H${W - 26}A26 26 0 0 1 ${W} 26V${H}Z" fill="${T.card}"/>
<path d="M0 ${H}V26A26 26 0 0 1 26 0H${W - 26}A26 26 0 0 1 ${W} 26V${H}Z" fill="url(#dots)"/>
<path d="M0 ${H}V26A26 26 0 0 1 26 0H${W - 26}A26 26 0 0 1 ${W} 26V${H}Z" fill="url(#glow)"/>
<path d="M.5 ${H}V26A25.5 25.5 0 0 1 26 .5H${W - 26}A25.5 25.5 0 0 1 ${W - 0.5} 26V${H}" fill="none" stroke="${T.line}"/>
<text x="${pad}" y="${pad + 14}" class="k">${f.n}  ·  ${esc(f.kicker)}</text>
<text x="${pad}" y="${pad + 66}" class="title">${esc(f.title)}</text>
<text x="${pad}" y="${pad + 100}" class="tag">${esc(f.tag)}</text>
${lines(bodyLines, pad, pad + 132, 26, 'body')}
${chipRow.svg}
${status(f.status.label, pad, chipY + 44, T, { live: f.status.live, color: f.status.live ? T.ok : T.accent })}
${term}`;
  return svg({ w: W, h: H, title: `${f.title}: flagship project`, desc: `${f.tag} ${f.body} Built with ${f.chips.join(', ')}. Status: ${f.status.label}.`,
    defs: `${dotGrid('dots', T, 20)}<radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(960 200) scale(420 260)"><stop offset="0" stop-color="${T.accent}" stop-opacity=".12"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/></radialGradient>`,
    style: `.k{font:600 13px ${MONO};letter-spacing:2px;fill:${T.accent}}
  .title{font:700 46px ${SANS};fill:${T.text};letter-spacing:-1.2px}
  .tag{font:600 21px ${SANS};fill:${T.text}}
  .body{font:400 18px ${SANS};fill:${T.muted}}
  .url{font:500 12px ${MONO};fill:${T.muted}}
  .mono{font:500 14px ${MONO};fill:${T.text}}
  .stage{opacity:0;animation:stage 11s ${EASE} infinite backwards}@keyframes stage{0%{opacity:0;transform:translateX(8px)}5%,88%{opacity:1;transform:none}96%,100%{opacity:0}}
  .tick{opacity:0;animation:tick 11s ${EASE} infinite backwards}@keyframes tick{0%{opacity:0}4%,80%{opacity:1}88%,100%{opacity:0}}
  .float{animation:floaty 7s ease-in-out infinite}@keyframes floaty{50%{transform:translateY(-6px)}}
  ${pulseCss}${reducedMotion('.stage,.tick{opacity:1}.ring{opacity:0}')}`,
    body });
}

function featureLink(T, l, i, n) {
  const W = Math.round(1200 / n), H = 92;
  const rl = i === 0 ? 24 : 0, rr = i === n - 1 ? 24 : 0;
  const shape = `M0 0H${W}V${H - rr}${rr ? `A${rr} ${rr} 0 0 1 ${W - rr} ${H}` : ''}H${rl}${rl ? `A${rl} ${rl} 0 0 1 0 ${H - rl}` : ''}Z`;
  return svg({ w: W, h: H, title: l.label, desc: `${l.label}: ${l.sub}`, defs: dotGrid('dots', T, 20),
    style: `${nudgeCss}${reducedMotion()}`,
    body: `<path d="${shape}" fill="${T.card}"/><path d="${shape}" fill="url(#dots)"/>
<path d="${shape}" fill="none" stroke="${T.line}" transform="translate(.5 .5) scale(${(W - 1) / W} ${(H - 1) / H})"/>
<line x1="0" y1=".5" x2="${W}" y2=".5" stroke="${T.line}"/>
<rect x="28" y="22" width="48" height="48" rx="13" fill="${T.card2}" stroke="${T.line}"/>
${icon(l.icon, 40, 34, 24, T.accent, 1.8)}
<text x="92" y="42" font-family="${SANS}" font-size="18" font-weight="650" fill="${T.text}">${esc(l.label)}</text>
<text x="92" y="64" font-family="${MONO}" font-size="13" fill="${T.muted}">${esc(l.sub)}</text>
<g class="arrow">${lucide('arrow-up-right', W - 50, 34, 22, T.faint, 2.2)}</g>` });
}

function card(T, c) {
  const W = 540, H = 350, pad = 30;
  const bodyLines = wrap(c.body, 18, 480);
  const chipRow = chips(c.chips, pad, 240, T);
  const st = status(c.status.label, pad, 294, T, { live: c.status.live, color: c.status.live ? T.ok : T.accent });
  return svg({ w: W, h: H, title: `${c.title}: ${c.kicker.toLowerCase()}`, desc: `${c.body} Built with ${c.chips.join(', ')}. Status: ${c.status.label}.${c.href ? '' : ' Private repository.'}`,
    defs: `${dotGrid('dots', T, 20)}<clipPath id="clip"><rect width="${W}" height="${H}" rx="24"/></clipPath>`,
    style: `.n{font:600 13px ${MONO};letter-spacing:2px;fill:${T.accent}}
  .k{font:600 13px ${MONO};letter-spacing:2px;fill:${T.muted}}
  .title{font:700 34px ${SANS};fill:${T.text};letter-spacing:-.7px}
  .body{font:400 18px ${SANS};fill:${T.muted}}
  .wm{animation:wm 9s ease-in-out infinite;transform-origin:455px 83px}@keyframes wm{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-8px) rotate(4deg)}}
  .sheen{animation:sheen 7s ease-in-out infinite;animation-delay:${(parseInt(c.n, 10) * 0.7).toFixed(1)}s}@keyframes sheen{0%,70%{transform:translateX(-260px)}100%{transform:translateX(620px)}}
  ${pulseCss}${nudgeCss}${reducedMotion('.sheen,.ring{opacity:0}')}`,
    body: `<g clip-path="url(#clip)">
  <rect width="${W}" height="${H}" fill="${T.card}"/><rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect class="sheen" x="0" y="-40" width="70" height="430" fill="${T.text}" fill-opacity="0.035" transform="skewX(-18)"/>
  <g class="wm" opacity=".55">${icon(c.icon, 400, 28, 110, T.lineHi, 1.2)}</g>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="none" stroke="${T.line}"/>
<text x="${pad}" y="44" class="n">${c.n}</text><text x="${pad + 34}" y="44" class="k">${esc(c.kicker)}</text>
<text x="${pad}" y="86" class="title">${esc(c.title)}</text>
${lines(bodyLines.slice(0, 4), pad, 124, 26, 'body')}
${chipRow.svg}
${st}
${c.href ? `<g class="arrow">${lucide('arrow-up-right', W - 56, H - 56, 24, T.faint, 2.2)}</g>` : `<text x="${W - pad}" y="${H - 36}" text-anchor="end" class="k">PRIVATE</text>`}` });
}

// ------------------------------------------------------------------ contact
function cta(T) {
  const W = 1200, H = 176;
  const shape = `M0 ${H}V24A24 24 0 0 1 24 0H${W - 24}A24 24 0 0 1 ${W} 24V${H}Z`;
  const words = CTA.headline.map((w, i) => `<tspan class="word" style="animation-delay:${(0.15 + i * 0.09).toFixed(2)}s"${w === CTA.accentWord ? ` fill="${T.accent}"` : ''}>${esc(w)} </tspan>`).join('');
  const bw = 300, bx = W - 44 - bw, by = 58;
  return svg({ w: W, h: H, title: CTA.headline.join(' '), desc: `${CTA.pill}. ${CTA.sub}. ${CTA.button}.`,
    defs: `${dotGrid('dots', T)}<radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${bx + 150} 88) scale(320 160)"><stop offset="0" stop-color="${T.accent}" stop-opacity=".12"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/></radialGradient>
  <clipPath id="bc"><rect x="${bx}" y="${by}" width="${bw}" height="60" rx="30"/></clipPath>
  <linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`,
    style: `.h{font:700 38px ${SANS};fill:${T.text};letter-spacing:-1px}
  .s{font:400 18px ${SANS};fill:${T.muted}}
  .pill{font:600 13px ${MONO};fill:${T.ok};letter-spacing:1px}
  .word{opacity:0;animation:in .9s ${EASE} forwards}@keyframes in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  .sheen{animation:sh 5s ease-in-out infinite}@keyframes sh{0%,65%{transform:translateX(-120px)}100%{transform:translateX(360px)}}
  ${pulseCss}${nudgeCss}${reducedMotion('.word{opacity:1}.sheen{opacity:0}')}`,
    body: `<path d="${shape}" fill="${T.card}"/><path d="${shape}" fill="url(#dots)"/><path d="${shape}" fill="url(#glow)"/>
<path d="M.5 ${H}V24A23.5 23.5 0 0 1 24 .5H${W - 24}A23.5 23.5 0 0 1 ${W - 0.5} 24V${H}" fill="none" stroke="${T.line}"/>
<g transform="translate(44 34)"><rect width="${Math.round(textW(CTA.pill, 13, { mono: true }) + 46)}" height="28" rx="14" fill="${T.ok}" fill-opacity=".1" stroke="${T.ok}" stroke-opacity=".4"/>
  <circle cx="18" cy="14" r="4.5" fill="${T.ok}" class="pulse"/><text x="32" y="19" class="pill">${esc(CTA.pill)}</text></g>
<text x="44" y="106" class="h">${words}</text>
<text x="44" y="140" class="s">${esc(CTA.sub)}</text>
<g clip-path="url(#bc)"><rect x="${bx}" y="${by}" width="${bw}" height="60" fill="${T.accent}"/><rect class="sheen" x="${bx}" y="${by}" width="80" height="60" fill="url(#sh)"/></g>
${icon('linkedin-glyph', bx + 30, by + 18, 24, T.onAccent)}
<text x="${bx + 66}" y="${by + 36}" font-family="${SANS}" font-size="18" font-weight="650" fill="${T.onAccent}">${esc(CTA.button)}</text>
<g class="arrow">${lucide('arrow-up-right', bx + bw - 44, by + 20, 20, T.onAccent, 2.4)}</g>` });
}

function social(T, s, i, n) {
  const W = 300, H = 104;
  const rl = i === 0 ? 24 : 0, rr = i === n - 1 ? 24 : 0;
  const shape = `M0 0H${W}V${H - rr}${rr ? `A${rr} ${rr} 0 0 1 ${W - rr} ${H}` : ''}H${rl}${rl ? `A${rl} ${rl} 0 0 1 0 ${H - rl}` : ''}Z`;
  let col = s.color || T.accent;
  if (T.name === 'dark' && s.color) col = mix(s.color, '#ffffff', 0.2);
  const ic = s.icon === 'leetcode' ? brand('leetcode', 37, 37, 26, T) : icon(s.icon, 37, 37, 26, col, 2);
  return svg({ w: W, h: H, title: `${s.label}: ${s.sub}`, desc: `${s.label}: ${s.sub}`, defs: dotGrid('dots', T, 20),
    style: `${nudgeCss}${reducedMotion()}`,
    body: `<path d="${shape}" fill="${T.card}"/><path d="${shape}" fill="url(#dots)"/>
<path d="M0 0V${H - rl}${rl ? `A${rl} ${rl} 0 0 0 ${rl} ${H}` : ''}H${W - rr}${rr ? `A${rr} ${rr} 0 0 0 ${W} ${H - rr}` : ''}V0" fill="none" stroke="${T.line}" transform="translate(.5 0) scale(${(W - 1) / W} 1)"/>
<line x1="0" y1=".5" x2="${W}" y2=".5" stroke="${T.line}"/>
${i < n - 1 ? `<line x1="${W - 0.5}" y1="18" x2="${W - 0.5}" y2="86" stroke="${T.line}"/>` : ''}
<rect x="26" y="26" width="48" height="48" rx="13" fill="${T.card2}" stroke="${T.line}"/>
${ic}
<text x="90" y="46" font-family="${SANS}" font-size="18" font-weight="650" fill="${T.text}">${esc(s.label)}</text>
<text x="90" y="68" font-family="${MONO}" font-size="13" fill="${T.muted}">${esc(s.sub)}</text>
<g class="arrow">${lucide('arrow-up-right', 256, 41, 18, T.faint, 2.2)}</g>` });
}

// ------------------------------------------------------------------ build everything
for (const T of Object.values(THEMES)) {
  write('hero', T, hero(T));
  for (const it of NAV) write(`nav-${it.anchor}`, T, nav(T, it));
  for (const [k, h] of Object.entries(HEADERS)) write(`h-${k}`, T, header(T, h));
  write('about', T, about(T));
  write('stack', T, stack(T));
  write(`feature-${FEATURE.key}`, T, feature(T));
  FEATURE.links.forEach((l, i) => write(`link-${FEATURE.key}-${l.key}`, T, featureLink(T, l, i, FEATURE.links.length)));
  for (const c of CARDS) write(`card-${c.key}`, T, card(T, c));
  write('cta', T, cta(T));
  SOCIAL.forEach((s, i) => write(`social-${s.key}`, T, social(T, s, i, SOCIAL.length)));
}
console.log(`Wrote ${files.length} files to assets/`);
