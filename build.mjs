// Génère assets/bento-dark.svg et assets/bento-light.svg. Modifier un texte ou un chiffre ici, puis : node build.mjs
import { writeFileSync } from 'node:fs';

const SANS = `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`;
const MONO = `ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`;

const THEMES = {
  dark: { tile:'#121724', ts:'#232B3F', tx:'#EEF1F8', mu:'#8C96AD', ac:'#6C93FF', chip:'#1D2538', track:'#252E44',
          inFill:'#0F1528', ia:'#FFB84D', sa:'#4FD6C0' },
  light:{ tile:'#F6F8FA', ts:'#D8DEE4', tx:'#1F2328', mu:'#59636E', ac:'#2F5BEA', chip:'#E6EAEF', track:'#D8DEE4',
          inFill:'#0F1528', ia:'#B26A00', sa:'#0B7F6F' },
};

const R = 18, CR = 11;

function chips(list, x, y, maxW) {
  let cx = x, cy = y, out = '';
  for (const t of list) {
    const w = Math.round(t.length * 6.7 + 16);
    if (cx + w > x + maxW) { cx = x; cy += 30; }
    out += `<g transform="translate(${cx},${cy})"><rect class="chip" width="${w}" height="22" rx="${CR}"/><text class="chiptx" x="${w / 2}" y="15" text-anchor="middle">${t}</text></g>`;
    cx += w + 6;
  }
  return out;
}
const tile = (x, y, w, h, cls, inner) =>
  `<g transform="translate(${x},${y})" class="${cls}"><rect class="tbg" width="${w}" height="${h}" rx="${R}"/>${inner}</g>`;

// respiration : sinusoïde de période 44, pause plate entre x=200 et x=288
function wave() {
  let d = '';
  for (let x = 24; x <= 410; x += 2) {
    const y = x >= 200 && x <= 288 ? 142 : 142 - 14 * Math.sin((2 * Math.PI * (x - 24)) / 44);
    d += `${x === 24 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
  }
  return d.trim();
}
function slots() { // créneaux d'une journée, un seul peut être pris à la fois
  let o = '';
  for (let i = 0; i < 8; i++) o += `<rect class="${i === 3 ? 'seg' : 'segbg'}" x="${24 + i * 30}" y="146" width="25" height="12" rx="4"/>`;
  return o;
}
function deadlines() { // délais de signalement du Cyber Resilience Act
  let o = '<path class="gl" d="M24 140 H258"/>';
  [[24, '24 h', 'start'], [141, '72 h', 'middle'], [258, '14 j', 'end']].forEach(([x, l, a]) => {
    o += `<circle class="gd" cx="${x}" cy="140" r="4"/><text class="tiny" x="${x}" y="161" text-anchor="${a}">${l}</text>`;
  });
  return o;
}

function bento(t) {
  const css = `
text{font-family:${SANS};fill:${t.tx}}
.tbg{fill:${t.tile};stroke:${t.ts}}
.in .tbg{fill:${t.inFill}}
.in text{fill:#FFFFFF}.in .lab,.in .sub{fill:#A9B4CC}
.lab{font-family:${MONO};font-size:11px;letter-spacing:1.2px;fill:${t.mu}}
.num{font-weight:700;font-size:42px}
.big{font-weight:700;font-size:34px;letter-spacing:-.5px}
.sub{font-size:13px;fill:${t.mu}}
.lead{font-size:15px;font-weight:600}
.h2{font-size:19px;font-weight:700}
.h3{font-size:17px;font-weight:700}
.tiny{font-family:${MONO};font-size:10px;fill:${t.mu}}
.chip{fill:${t.chip}}
.chiptx{font-family:${MONO};font-size:11px}
.track{fill:none;stroke:${t.track};stroke-width:9}
.ring{fill:none;stroke:${t.ia};stroke-width:9;stroke-linecap:round}
.ringnum{font-weight:700;font-size:22px}
.wave{fill:none;stroke:${t.sa};stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.seg{fill:${t.ac}}.segbg{fill:${t.track}}
.gl{fill:none;stroke:${t.ac};stroke-width:2;stroke-linecap:round}
.gd{fill:${t.tile};stroke:${t.ac};stroke-width:2}
@keyframes draw92{from{stroke-dashoffset:92}}
@keyframes draw1{from{stroke-dashoffset:1}}
@keyframes grow{from{transform:scaleX(0)}}
@media (prefers-reduced-motion:no-preference){
.ring{animation:draw92 1.6s cubic-bezier(.2,.7,.2,1) .2s backwards}
.wave{animation:draw1 2.6s ease-out .2s backwards}
.prod .seg{transform-box:fill-box;transform-origin:left center;animation:grow 1.2s cubic-bezier(.2,.7,.2,1) .2s backwards}
}`;
  const intro =
    `<g clip-path="url(#c)"><ellipse cx="500" cy="10" rx="300" ry="190" fill="url(#g1)" opacity=".6"/><ellipse cx="120" cy="250" rx="220" ry="110" fill="url(#g2)" opacity=".6"/></g>` +
    `<text class="lab" x="28" y="42">AYOUB TOUGANI · NANCY</text>` +
    `<text class="big" x="28" y="110">Développeur fullstack.</text>` +
    `<text class="big" x="28" y="150">IA &amp; santé réglementée.</text>` +
    `<text class="sub" x="28" y="182">Du besoin métier au logiciel en production</text>`;
  const prod =
    `<text class="lab" x="24" y="42">EN PRODUCTION</text>` +
    `<text class="num" x="24" y="98">4 ans ½</text>` +
    `<text class="sub" x="24" y="120">de code en production</text>` +
    `<text class="tiny" x="24" y="150">2021</text><text class="tiny" x="193" y="150">2025</text>` +
    `<rect class="segbg" x="24" y="158" width="248" height="8" rx="4"/>` +
    `<rect class="seg" x="24" y="158" width="149" height="8" rx="4"/>` +
    `<rect class="seg" x="193" y="158" width="79" height="8" rx="4"/>` +
    `<text class="tiny" x="24" y="184">alternance</text><text class="tiny" x="193" y="184">CDI</text>`;
  const ia =
    `<text class="lab" x="24" y="38">INTELLIGENCE ARTIFICIELLE</text>` +
    `<circle class="track" cx="76" cy="112" r="44"/>` +
    `<circle class="ring" cx="76" cy="112" r="44" pathLength="100" stroke-dasharray="92 100" transform="rotate(-90 76 112)"/>` +
    `<text class="ringnum" x="76" y="120" text-anchor="middle">92 %</text>` +
    `<text class="lead" x="144" y="86">Un assistant documentaire</text>` +
    `<text class="lead" x="144" y="106">qui cite ses sources</text>` +
    `<text class="sub" x="144" y="128">La bonne source dans les 3 premiers</text>` +
    `<text class="sub" x="144" y="146">résultats, 92 % du temps</text>` +
    chips(['Ticket → merge request', 'Doc auto-entretenue · 4 dépôts'], 24, 178, 390);
  const sa =
    `<text class="lab" x="24" y="38">SANTÉ RÉGLEMENTÉE</text>` +
    `<text class="h2" x="24" y="76">Suivi patient, utilisé chaque jour</text>` +
    `<text class="sub" x="24" y="100">par des médecins et des prestataires de santé à domicile</text>` +
    `<path class="wave" pathLength="1" stroke-dasharray="1" d="${wave()}"/>` +
    chips(['MDR (UE) 2017/745', 'ISO 13485', 'IEC 62304', 'RGPD'], 24, 178, 390);
  const sb =
    `<text class="lab" x="24" y="34">SO BARBERS · EN PRODUCTION</text>` +
    `<text class="h3" x="24" y="68">Un salon réel prend ses</text>` +
    `<text class="h3" x="24" y="90">rendez-vous en ligne.</text>` +
    `<text class="sub" x="24" y="114">sobarbers.com</text>` + slots();
  const pb =
    `<text class="lab" x="24" y="34">PROBENTA · SAAS CONFORMITÉ</text>` +
    `<text class="h3" x="24" y="68">Signaler une faille aux</text>` +
    `<text class="h3" x="24" y="90">autorités dans les délais.</text>` +
    `<text class="sub" x="24" y="114">Règlement Cyber Resilience Act</text>` + deadlines();
  const st =
    `<text class="lab" x="24" y="34">STACK</text>` +
    chips(['Next.js', 'React', 'TypeScript', 'NestJS', 'Laravel', 'GraphQL', 'PostgreSQL', 'Docker'], 24, 54, 240);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 882 634" role="img" aria-labelledby="t"><title id="t">Ayoub Tougani, développeur fullstack. IA et santé réglementée.</title><style>${css}</style>` +
    `<defs><clipPath id="c"><rect width="572" height="208" rx="${R}"/></clipPath>` +
    `<radialGradient id="g1"><stop offset="0" stop-color="#3D6BFF" stop-opacity=".9"/><stop offset="1" stop-color="#3D6BFF" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="g2"><stop offset="0" stop-color="#4FD6C0" stop-opacity=".45"/><stop offset="1" stop-color="#4FD6C0" stop-opacity="0"/></radialGradient></defs>` +
    tile(0, 0, 572, 208, 'in', intro) + tile(584, 0, 296, 208, 'prod', prod) +
    tile(0, 220, 434, 220, '', ia) + tile(446, 220, 434, 220, '', sa) +
    tile(0, 452, 286, 180, '', sb) + tile(298, 452, 284, 180, '', pb) + tile(594, 452, 286, 180, '', st) +
    `</svg>\n`;
}

for (const [name, t] of Object.entries(THEMES)) writeFileSync(new URL(`assets/bento-${name}.svg`, import.meta.url), bento(t));
