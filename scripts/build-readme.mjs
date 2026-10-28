// Writes README.md from the content in profile.mjs. Run after build-svgs.mjs.
//   node scripts/build-readme.mjs
import { writeFileSync } from 'node:fs';
import { HERO, NAV, HEADERS, ABOUT_INTRO, ABOUT_TILES, STACK, FEATURE, CARDS, CTA, SOCIAL, USER } from './profile.mjs';

const RAW = `https://raw.githubusercontent.com/${USER}/${USER}/output`;
const q = (s) => s.replace(/"/g, '&quot;');
const pic = (name, alt, attrs = 'width="100%"', dir = 'assets') =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="${dir}/${name}-dark.svg"><source media="(prefers-color-scheme: light)" srcset="${dir}/${name}-light.svg"><img alt="${q(alt)}" src="${dir}/${name}-dark.svg" ${attrs}></picture>`;
const link = (href, inner) => (href ? `<a href="${href}">${inner}</a>` : inner);
const h = (k) => `<a name="${k}"></a>\n${pic(`h-${k}`, `${HEADERS[k].n} ${HEADERS[k].title}`)}`;
const live = (name, alt) => `<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${RAW}/${name}-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="${RAW}/${name}-light.svg">
    <img alt="${q(alt)}" src="${RAW}/${name}-dark.svg" width="100%">
  </picture>
</p>`;

const rows = [];
for (let i = 0; i < CARDS.length; i += 2) {
  rows.push(`<p align="center">\n  ${CARDS.slice(i, i + 2).map((c) => link(c.href, pic(`card-${c.key}`, `${c.title}: ${c.body} Status: ${c.status.label}.`, 'width="49%"'))).join('\n  ')}\n</p>`);
}

const md = `${pic('hero', `${HERO.name}. ${HERO.lead} ${HERO.phrases.join(' ')} ${HERO.meta}. ${HERO.tagline}`)}

<p align="center">
  ${NAV.map((n) => `<a href="#${n.anchor}">${pic(`nav-${n.anchor}`, n.label, 'height="38"')}</a>`).join('\n  ')}
</p>

${h('about')}

${ABOUT_INTRO}

${pic('about', [ABOUT_TILES.main, ...ABOUT_TILES.small, ABOUT_TILES.wide].map((t) => `${t.eyebrow}: ${t.title}. ${t.body}`).join(' '))}

${h('stack')}

${pic('stack', STACK.map((r) => `${r.cat}: ${r.items.map((i) => i.label).join(', ')}.`).join(' '))}

${h('projects')}

<p align="center">
${link(FEATURE.repo, pic(`feature-${FEATURE.key}`, `${FEATURE.title}, my flagship project: ${FEATURE.tag} ${FEATURE.body} Status: ${FEATURE.status.label}.`))}<br>${FEATURE.links.map((l) => link(l.href, pic(`link-${FEATURE.key}-${l.key}`, `${l.label}: ${l.sub}`, `width="${(100 / FEATURE.links.length).toFixed(2)}%"`))).join('')}
</p>

${rows.join('\n\n')}

${h('activity')}

${live('activity', 'My GitHub activity: total contributions, this month, longest streak and contributions per week for the last 16 weeks. Rebuilt every 12 hours.')}

${live('snake-card', 'An animated snake eating my contribution graph for the last 12 months, with last-year totals, best day and longest streak.')}

${h('contact')}

<p align="center">
${link(CTA.href, pic('cta', `${CTA.pill}. ${CTA.headline.join(' ')} ${CTA.sub}. ${CTA.button}.`))}<br>${SOCIAL.map((s) => link(s.href, pic(`social-${s.key}`, `${s.label}: ${s.sub}`, 'width="25%"'))).join('')}
</p>

<!--
  Everything above is generated. Edit scripts/profile.mjs, then run:
    node scripts/build-svgs.mjs && node scripts/build-readme.mjs
  The activity and snake cards are rebuilt by .github/workflows/snake.yml and served from the output branch.
  Icons: Simple Icons (CC0) and Lucide (ISC); licenses in scripts/.
-->
`;
writeFileSync(new URL('../README.md', import.meta.url), md);
console.log('README.md written');
