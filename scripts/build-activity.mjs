// Builds the live GitHub activity card and the snake spotlight card from real contribution data.
// Runs in GitHub Actions (see .github/workflows/snake.yml) after Platane/snk has written
// dist/snake.svg and dist/snake-dark.svg, and writes:
//   dist/activity-dark.svg, dist/activity-light.svg, dist/snake-card-dark.svg, dist/snake-card-light.svg
//
//   GITHUB_TOKEN=... GH_USER=amirshahzadhashmi7145 node scripts/build-activity.mjs --out dist
//   node scripts/build-activity.mjs --demo --out dist     (made-up numbers, to preview the design)
//
// The default Actions token only sees public contributions. To count private ones too, add a
// fine-grained token as the repository secret ACTIVITY_TOKEN and enable "Include private
// contributions on my profile" in GitHub settings.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { THEMES, SANS, MONO, EASE, esc, dotGrid, pulseCss, reducedMotion, svg, rng } from './lib.mjs';
import { USER as DEFAULT_USER } from './profile.mjs';

const USER = process.env.GH_USER || DEFAULT_USER;
const argv = process.argv;
const OUT = argv.includes('--out') ? argv[argv.indexOf('--out') + 1] : 'dist';
const DEMO = argv.includes('--demo');

async function gql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-activity-card' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GitHub API ${res.status}: ${JSON.stringify(json.errors || json.message)}`);
  return json.data;
}

// Every contribution day since the account was created, oldest first.
async function fetchDays() {
  const { user } = await gql('query($u:String!){user(login:$u){createdAt}}', { u: USER });
  const now = new Date();
  const byDate = new Map();
  for (let from = new Date(user.createdAt); from < now; ) {
    const to = new Date(Math.min(new Date(from).setFullYear(from.getFullYear() + 1) - 1000, now.getTime()));
    const d = await gql(
      'query($u:String!,$f:DateTime!,$t:DateTime!){user(login:$u){contributionsCollection(from:$f,to:$t){contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}',
      { u: USER, f: from.toISOString(), t: to.toISOString() },
    );
    for (const w of d.user.contributionsCollection.contributionCalendar.weeks) for (const day of w.contributionDays) byDate.set(day.date, { date: day.date, count: day.contributionCount });
    from = new Date(to.getTime() + 1000);
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function demoDays() {
  const r = rng(5);
  const days = [];
  for (let t = new Date('2024-01-07T00:00:00Z'); t <= new Date(); t = new Date(t.getTime() + 864e5)) {
    const m = t.toISOString().slice(0, 7);
    const [busy, peak] = m >= '2026-09' ? [0.9, 30] : m >= '2026-06' ? [0.6, 12] : [0.3, 6];
    days.push({ date: t.toISOString().slice(0, 10), count: r() < busy ? Math.floor(r() * peak) + 1 : 0 });
  }
  return days;
}

const utc = (d) => new Date(`${d}T00:00:00Z`);
const fmt = (d, o) => utc(d).toLocaleString('en', { ...o, timeZone: 'UTC' });

function stats(days) {
  const total = days.reduce((s, d) => s + d.count, 0);
  let longest = 0, run = 0, current = 0;
  for (const d of days) { run = d.count ? run + 1 : 0; longest = Math.max(longest, run); }
  // Current streak: today may still be empty, so start counting from yesterday if needed.
  for (let i = days.length - 1 - (days[days.length - 1].count ? 0 : 1); i >= 0 && days[i].count; i--) current++;
  const last = days[days.length - 1].date;
  const year = days.filter((d) => utc(d.date) > new Date(utc(last).getTime() - 365 * 864e5));
  const yearTotal = year.reduce((s, d) => s + d.count, 0);
  const activeDays = year.filter((d) => d.count).length;
  const best = days.reduce((a, d) => (d.count > a.count ? d : a), { count: 0, date: last });
  const month = days.filter((d) => d.date.startsWith(last.slice(0, 7))).reduce((s, d) => s + d.count, 0);
  const dow = [0, 0, 0, 0, 0, 0, 0];
  for (const d of year) dow[utc(d.date).getUTCDay()] += d.count;
  const busiest = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'][dow.indexOf(Math.max(...dow))];
  // Last 16 weeks (Sunday to Saturday), oldest first.
  const weeks = new Map();
  for (const d of days) {
    const t = utc(d.date);
    const key = new Date(t.getTime() - t.getUTCDay() * 864e5).toISOString().slice(0, 10);
    weeks.set(key, (weeks.get(key) || 0) + d.count);
  }
  const recent = [...weeks.keys()].sort().slice(-16).map((k) => ({ label: fmt(k, { month: 'short', day: 'numeric' }), count: weeks.get(k) }));
  return { total, yearTotal, activeDays, longest, current, best, month, monthName: fmt(last, { month: 'long' }), busiest, since: fmt(days[0].date, { month: 'short', year: 'numeric' }), updated: last, recent };
}

// A number whose digits roll into place like an odometer.
function odometer(value, x, y, size, color, delay) {
  const s = value.toLocaleString('en'), lh = size * 1.1, cw = size * 0.6;
  let cx = x, out = '';
  [...s].forEach((ch, i) => {
    if (!/\d/.test(ch)) { out += `<text x="${cx + cw * 0.25}" y="${y}" text-anchor="middle" class="num" fill="${color}">${ch}</text>`; cx += cw * 0.5; return; }
    const d = +ch;
    const col = Array.from({ length: 11 + d }, (_, k) => `<text x="${cx + cw / 2}" y="${y + k * lh}" text-anchor="middle" class="num" fill="${color}">${k % 10}</text>`).join('');
    out += `<g class="roll" style="animation-delay:${(delay + i * 0.08).toFixed(2)}s;transform:translateY(${-(10 + d) * lh}px)">${col}</g>`;
    cx += cw;
  });
  return { svg: out, width: cx - x, lh };
}

function activityCard(st, T) {
  const W = 1200, H = 360, pad = 36;
  const blocks = [
    { label: 'Total contributions', sub: `since ${st.since}`, value: st.total, color: T.text },
    { label: `In ${st.monthName}`, sub: 'this month so far', value: st.month, color: T.accent },
    { label: 'Longest streak', sub: `days in a row · current ${st.current}`, value: st.longest, color: T.text },
  ];
  let defs = '';
  const blockSvg = blocks.map((b, i) => {
    const x = pad + i * 205, y = 150;
    const o = odometer(b.value, x, y, 56, b.color, 0.3 + i * 0.25);
    defs += `<clipPath id="c${i}"><rect x="${x - 4}" y="${y - 56}" width="200" height="${o.lh + 6}"/></clipPath>`;
    return `<g clip-path="url(#c${i})">${o.svg}</g><text x="${x}" y="${y + 40}" class="lbl">${esc(b.label)}</text><text x="${x}" y="${y + 64}" class="sub">${esc(b.sub)}</text>`;
  }).join('');
  const n = st.recent.length, bx = 690, gap = 8, bw = (470 - gap * (n - 1)) / n, base = 262, maxH = 150;
  const max = Math.max(1, ...st.recent.map((w) => w.count));
  const bars = st.recent.map((w, i) => {
    const h = w.count ? Math.max(6, Math.sqrt(w.count / max) * maxH) : 3;
    const x = bx + i * (bw + gap), last = i === n - 1, peak = w.count === max;
    return `<rect x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="5" fill="${last ? T.accent : T.lineHi}" class="bar" style="transform-origin:${x}px ${base}px;animation-delay:${(0.3 + i * 0.04).toFixed(2)}s"/>
      ${i % 4 === 0 ? `<text x="${x.toFixed(1)}" y="${base + 24}" class="m">${w.label}</text>` : ''}
      ${peak || last ? `<text x="${(x + bw / 2).toFixed(1)}" y="${(base - h - 10).toFixed(1)}" text-anchor="middle" class="peak"${last ? ` fill="${T.accent}"` : ''}>${w.count}</text>` : ''}`;
  }).join('');
  return svg({ w: W, h: H, title: `GitHub activity for ${USER}`,
    desc: `${st.total} contributions since ${st.since}, ${st.yearTotal} in the last year on ${st.activeDays} active days. Current streak ${st.current} days, longest ${st.longest}. ${st.month} in ${st.monthName}. Most active on ${st.busiest}. Last 16 weeks: ${st.recent.map((w) => `week of ${w.label}: ${w.count}`).join(', ')}.`,
    defs: `${dotGrid('dots', T)}${defs}`,
    style: `.num{font:700 56px ${SANS};font-variant-numeric:tabular-nums}
  .roll{animation:roll 1.6s ${EASE} backwards}@keyframes roll{from{transform:translateY(0)}}
  .lbl{font:600 16px ${SANS};fill:${T.text}} .sub{font:400 14px ${SANS};fill:${T.muted}}
  .eyebrow{font:600 13px ${MONO};letter-spacing:2.2px;fill:${T.muted}} .note{font:400 15px ${SANS};fill:${T.muted}}
  .m{font:500 12px ${MONO};fill:${T.faint}} .peak{font:600 13px ${MONO};fill:${T.text}}
  .bar{animation:grow 14s ${EASE} infinite backwards}@keyframes grow{0%{transform:scaleY(0)}8%,92%{transform:scaleY(1)}100%{transform:scaleY(0)}}
  ${pulseCss}${reducedMotion()}`,
    body: `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="${T.card}" stroke="${T.line}"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="url(#dots)"/>
<circle cx="${pad + 5}" cy="${pad + 10}" r="5" fill="${T.ok}" class="pulse"/>
<text x="${pad + 20}" y="${pad + 15}" class="eyebrow">LIVE FROM GITHUB · UPDATED ${st.updated}</text>
${blockSvg}
<text x="${pad}" y="${H - 34}" class="note">${st.yearTotal.toLocaleString('en')} contributions in the last year on ${st.activeDays} days · most active on ${esc(st.busiest)}</text>
<line x1="650" y1="62" x2="650" y2="${H - 40}" stroke="${T.line}"/>
<text x="${bx}" y="${pad + 15}" class="eyebrow">LAST 16 WEEKS</text>
<line x1="${bx}" y1="${base + 0.5}" x2="${bx + 470}" y2="${base + 0.5}" stroke="${T.line}"/>
${bars}` });
}

// Frames Platane/snk's animated snake inside a card with a caption and last-year totals.
function snakeCard(st, T, snake) {
  const W = 1200, H = 350, pad = 36;
  const m = snake.match(/viewBox="([^"]+)"/);
  const inner = snake.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const sw = 1200 - pad * 2, sh = Math.round((sw * 192) / 880);
  const facts = [
    ['LAST YEAR', `${st.yearTotal.toLocaleString('en')} contributions`],
    ['BEST DAY', `${st.best.count} on ${fmt(st.best.date, { month: 'short', day: 'numeric' })}`],
    ['LONGEST STREAK', `${st.longest} days`],
  ];
  return svg({ w: W, h: H, title: 'Contribution snake',
    desc: `A snake eats the last year of my contribution graph. ${facts.map((f) => `${f[0].toLowerCase()}: ${f[1]}`).join(', ')}.`,
    defs: dotGrid('dots', T),
    style: `.eyebrow{font:600 13px ${MONO};letter-spacing:2.2px;fill:${T.muted}} .k{font:600 12px ${MONO};letter-spacing:1.5px;fill:${T.faint}} .v{font:600 15px ${SANS};fill:${T.text}}
  ${reducedMotion()}`,
    body: `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="${T.card}" stroke="${T.line}"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="url(#dots)"/>
<text x="${pad}" y="${pad + 10}" class="eyebrow">CONTRIBUTION SNAKE · LAST 12 MONTHS</text>
${facts.map((f, i) => `<text x="${W - pad - (2 - i) * 230}" y="${pad + 2}" text-anchor="end" class="k">${f[0]}</text><text x="${W - pad - (2 - i) * 230}" y="${pad + 24}" text-anchor="end" class="v">${esc(f[1])}</text>`).join('')}
<svg x="${pad}" y="${pad + 44}" width="${sw}" height="${sh}" viewBox="${m ? m[1] : '-16 -32 880 192'}" preserveAspectRatio="xMidYMid meet">${inner}</svg>` });
}

const days = DEMO ? demoDays() : await fetchDays();
const st = stats(days);
mkdirSync(OUT, { recursive: true });
for (const [name, T] of Object.entries(THEMES)) {
  writeFileSync(`${OUT}/activity-${name}.svg`, activityCard(st, T));
  const snakePath = `${OUT}/${name === 'dark' ? 'snake-dark' : 'snake'}.svg`;
  if (existsSync(snakePath)) writeFileSync(`${OUT}/snake-card-${name}.svg`, snakeCard(st, T, readFileSync(snakePath, 'utf8')));
  else console.warn(`No ${snakePath}; skipping the snake card for ${name}`);
}
console.log(`Activity cards written to ${OUT}/ (${st.total} contributions, ${st.current}-day streak)`);
