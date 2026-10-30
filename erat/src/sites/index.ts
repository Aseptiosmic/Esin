/* ================================================================
   ERATHRA SITES — every entry is a complete website design:
   a live, standalone build and the exact prompt that produced it.
   To add a site: create src/sites/<id>/{style.css, body.html, script.js, prompt.md}
   and register it below.
   ================================================================ */
import orvanteCss from "./orvante/style.css?raw";
import orvanteBody from "./orvante/body.html?raw";
import orvanteJs from "./orvante/script.js?raw";
import orvantePrompt from "./orvante/prompt.md?raw";
import veliaCss from "./velia/style.css?raw";
import veliaBody from "./velia/body.html?raw";
import veliaJs from "./velia/script.js?raw";
import veliaPrompt from "./velia/prompt.md?raw";
import vasariCss from "./vasari/style.css?raw";
import vasariBody from "./vasari/body.html?raw";
import vasariJs from "./vasari/script.js?raw";
import vasariPrompt from "./vasari/prompt.md?raw";
import reelmarkCss from "./reelmark/style.css?raw";
import reelmarkBody from "./reelmark/body.html?raw";
import reelmarkJs from "./reelmark/script.js?raw";
import reelmarkPrompt from "./reelmark/prompt.md?raw";
import jackCss from "./jack/style.css?raw";
import jackBody from "./jack/body.html?raw";
import jackJs from "./jack/script.js?raw";
import jackPrompt from "./jack/prompt.md?raw";
import wildCss from "./wild/style.css?raw";
import wildBody from "./wild/body.html?raw";
import wildJs from "./wild/script.js?raw";
import wildPrompt from "./wild/prompt.md?raw";
import melliCss from "./melli/style.css?raw";
import melliBody from "./melli/body.html?raw";
import melliJs from "./melli/script.js?raw";
import melliPrompt from "./melli/prompt.md?raw";
import axonCss from "./axon/style.css?raw";
import axonBody from "./axon/body.html?raw";
import axonJs from "./axon/script.js?raw";
import axonPrompt from "./axon/prompt.md?raw";
import facetCss from "./facet/style.css?raw";
import facetBody from "./facet/body.html?raw";
import facetJs from "./facet/script.js?raw";
import facetPrompt from "./facet/prompt.md?raw";

export type Site = {
  id: string;
  name: string;
  /** short descriptor shown under the name */
  title: string;
  category: string;
  year: number;
  tags: string[];
  summary: string;
  palette: string[];
  fonts: string[];
  sections: string[];
  /** a representative image for cards / fallbacks */
  cover: string;
  /** artboard background behind the preview */
  canvas: string;
  /** Google Fonts stylesheet for the standalone page */
  fontsHref: string;
  /** external scripts loaded right before the main script (CDN libraries) */
  scripts?: string[];
  /** optional desktop frame height for contained single-screen heroes (e.g. 1080 for 1440×1080) */
  desktopH?: number;
  /** ES module import map (injected in <head>) */
  importMap?: Record<string, string>;
  /** run the inline script as <script type="module"> */
  libs?: string[];
  module?: boolean;
  meta: { title: string; description: string };
  css: string;
  body: string;
  js: string;
  prompt: string;
};

export const SITES: Site[] = [
  {
    id: "orvante",
    name: "Orvante",
    title: "Branding agency · three sections",
    category: "Agency",
    year: 2026,
    tags: ["monochrome", "editorial", "agency", "scroll-fill", "glass", "counters"],
    summary:
      "A strict monochrome editorial landing page: a grey hero with a black-and-white portrait seen from behind, a manifesto whose words fill from grey to white as you scroll, and a bordered “Trusted by” panel with stat cards.",
    palette: ["#dadada", "#cdcdcd", "#111111", "#6f6f6f", "#f4f4f4", "#000000"],
    fonts: ["Archivo (wdth 62–125)", "Inter Tight"],
    sections: ["Hero", "Bar", "Statement", "Trust panel"],
    cover: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/7dc8b8f3-4ccb-4599-8ce4-7f7c7881bad9.webp",
    canvas: "#dadada",
    fontsHref: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@100..900&family=Archivo:wdth,wght@62..125,100..900&display=swap",
    meta: { title: "Orvante — Pure Design", description: "Orvante is a branding agency building strategy-led brands and websites that every brand deserves." },
    css: orvanteCss,
    body: orvanteBody,
    js: orvanteJs,
    prompt: orvantePrompt,
  },
  {
    id: "velia",
    name: "Velia",
    title: "AI creative direction · four sections",
    category: "AI / SaaS",
    year: 2026,
    tags: ["warm", "glass", "video", "lenis", "typing", "bento", "parallax"],
    summary:
      "A premium AI creative-direction landing page in warm paper tones: a video hero with a frosted chat studio that types its own replies, a glass bento over moving water, a production stage with a parallax hand, and a video CTA with a full footer.",
    palette: ["#f6f0e7", "#ece3d7", "#2a1a12", "#3b2116", "#f2c94c", "#c9dcef"],
    fonts: ["Inter Tight"],
    sections: ["Hero", "Bento", "Production", "CTA + Footer"],
    cover: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093821_db49f268-cd69-4ac0-b92b-e0b8a7062322.png",
    canvas: "#f6f0e7",
    fontsHref: "https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap",
    scripts: ["https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"],
    meta: { title: "Velia — Creative AI, Redesigned", description: "Shape ideas into polished creative pathways." },
    css: veliaCss,
    body: veliaBody,
    js: veliaJs,
    prompt: veliaPrompt,
  },
  {
    id: "vasari",
    name: "Leon Vasari",
    title: "VHS filmography shelf · 3D hero",
    category: "Film / Archive",
    year: 2026,
    tags: ["3d", "vhs", "filmography", "japanese", "ink-reveal", "cobalt", "cursor"],
    summary:
      "An endless 3D shelf of twelve worn VHS boxes on warm paper: the active tape turns out to show its screen-printed cover, captions slide through masks in English and Japanese, and clicking opens a detail sheet whose poster bleeds in like ink.",
    palette: ["#EDEBE6", "#F4F2ED", "#141414", "#6D6A63", "#1F3FB0"],
    fonts: ["Newsreader", "Inter Tight", "Noto Sans JP", "Noto Serif SC"],
    sections: ["Top bar", "Decade tabs", "3D VHS shelf", "Caption", "Ink detail sheet"],
    cover: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/63303cbc-878a-4b30-8b74-beb58e9d69f1.webp",
    canvas: "#EDEBE6",
    fontsHref: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Inter+Tight:wght@500;600&family=Noto+Sans+JP:wght@500&family=Noto+Serif+SC:wght@700&display=swap",
    meta: { title: "Leon Vasari — Filmography 1958–1989", description: "Twelve films on VHS by Leon Vasari." },
    css: vasariCss,
    body: vasariBody,
    js: vasariJs,
    prompt: vasariPrompt,
  },
  {
    id: "reelmark",
    name: "Reelmark",
    title: "Creator marketplace · curved reel hero",
    category: "Creator / SaaS",
    year: 2026,
    tags: ["mint", "video", "carousel", "curved", "hand-drawn", "creators"],
    summary:
      "A soft-mint hero on a 1440×1080 frame: a bold headline, hand-drawn forest-green notes and arrows that draw themselves in, and a draggable arched carousel of ten tall cards playing different clips from a single 5×2 video grid.",
    palette: ["#F5F8EF", "#DAE7C7", "#08482D", "#101410", "#5E5E61", "#FFFFFF"],
    fonts: ["Inter Tight", "Inter", "Caveat"],
    sections: ["Top bar", "Headline + notes", "Curved 10-card video carousel", "Make a Reel CTA"],
    cover: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/b7ebb74a-8c8a-4f7e-8f80-55e2d74ecd05.webp",
    canvas: "#F5F8EF",
    desktopH: 1080,
    fontsHref: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700&family=Inter:wght@400;500&family=Caveat:wght@600&display=swap",
    meta: { title: "Reelmark — Captivate Crowds with Snackable Reels", description: "Grow your brand with short, snappy product clips by handpicked video makers." },
    css: reelmarkCss,
    body: reelmarkBody,
    js: reelmarkJs,
    prompt: reelmarkPrompt,
  },
  {
    id: "jack",
    name: "Jack",
    title: "3D creator portfolio · five sections",
    category: "Portfolio / 3D",
    year: 2026,
    tags: ["dark", "3d", "portfolio", "marquee", "sticky-cards", "magnetic", "kanit"],
    summary:
      "A dark 3D creator portfolio in Kanit: a giant metallic headline with a magnetic portrait, two counter-scrolling rows of 21 motion previews, a character-by-character scroll bio surrounded by floating 3D icons, a white services sheet, and three sticky-stacking project cards.",
    palette: ["#0C0C0C", "#D7E2EA", "#646973", "#BBCCD7", "#B600A8", "#FFFFFF"],
    fonts: ["Kanit"],
    sections: ["Hero", "Marquee (21 previews)", "About", "Services", "Sticky Projects"],
    cover: "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png",
    canvas: "#0C0C0C",
    fontsHref: "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap",
    meta: { title: "Jack — 3D Creator", description: "A 3D creator driven by crafting striking and unforgettable projects." },
    css: jackCss,
    body: jackBody,
    js: jackJs,
    prompt: jackPrompt,
  },
  {
    id: "wild",
    name: "Wild",
    title: "Travel rental · stadium pill hero",
    category: "Travel / Brand",
    year: 2026,
    tags: ["minimal", "video", "pill", "typography", "web-animations", "travel"],
    summary:
      "The word WILD opens from a grey hairline between I and L into a slit, a circle, and a wide stadium pill containing a looping floating-island waterfall scene — while flowing white S-curves fade in on warm paper, the nav drops and the footer rises.",
    palette: ["#FFFFFF", "#F2F2F1", "#D8D3CF", "#A9A9A6", "#1D1D1D"],
    fonts: ["Inter (400–800)"],
    sections: ["Top nav", "WILD + stadium video pill", "Drop-cap footer + replay CTA"],
    cover: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/726b168c-da47-4682-a255-cc3e02f89bae.jpg",
    canvas: "#f2f2f1",
    fontsHref: "https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;650;800&display=swap",
    meta: { title: "Wild — Let’s Get Wild", description: "Embark on a wild ride around the world with our travel rental service." },
    css: wildCss,
    body: wildBody,
    js: wildJs,
    prompt: wildPrompt,
  },
  {
    id: "melli",
    name: "Melli",
    title: "3D motion academy · scroll bee story",
    category: "3D / Education",
    year: 2026,
    tags: ["three.js", "gltf", "scroll", "lavender", "bee", "parallax", "poppins"],
    summary:
      "A five-screen lavender scroll story where a photoreal 3D bumblebee with procedural iridescent wings dives and banks from flower to flower across each chapter — cosmos, hanging cosmos, deep-violet iris, passion flower and footer.",
    palette: ["#E7E3FB", "#CFC6F6", "#5B3BD1", "#3A1F8C", "#0D0B1A", "#FFFFFF"],
    fonts: ["Poppins (300–800)"],
    sections: ["Hero + cosmos", "01 Universe of 3D Motion", "02 Claim Early Invite (dark)", "03 Study and Build", "Footer CTA"],
    cover: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261016_130303_301c35dd-e2d1-4b40-a396-2b53f884d787.png",
    canvas: "#e7e3fb",
    fontsHref: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap",
    meta: { title: "Melli — Master 3D Artistry", description: "Master 3D animation in just three days with our newest program." },
    importMap: {
      three: "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/",
    },
    module: true,
    css: melliCss,
    body: melliBody,
    js: melliJs,
    prompt: melliPrompt,
  },
  {
    id: "axon",
    name: "AXON",
    title: "Motion research · 262k GPU particles + fluid",
    category: "WebGL / Research",
    year: 2026,
    tags: ["webgl", "particles", "fluid", "sdf", "shaders", "monospace", "dark"],
    summary:
      "A full-viewport black logbook where 262,144 GPU particles swirl onto a signed-surface ring and are stirred by a 2D Navier–Stokes cursor fluid — framed by an additive monospace UI and a column of four looping study reels.",
    palette: ["#000000", "#1C1C1C", "#2A2A2A", "#8A8A8A", "#DDDDDD", "#AA88FF"],
    fonts: ["SF Mono / Menlo / Consolas"],
    sections: ["GPU particle + fluid canvas", "Tag chips + 4 study reels", "[info] [aims] [exploring] [connect]"],
    cover: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 600'><defs><radialGradient id='g' cx='56%25' cy='50%25' r='42%25'><stop offset='0%25' stop-color='%23000'/><stop offset='42%25' stop-color='%23d8d4ee' stop-opacity='.85'/><stop offset='64%25' stop-color='%23aa88ff' stop-opacity='.45'/><stop offset='100%25' stop-color='%23000' stop-opacity='0'/></radialGradient></defs><rect width='960' height='600' fill='%23000'/><ellipse cx='540' cy='300' rx='290' ry='220' fill='url(%23g)' transform='rotate(-22 540 300)'/><ellipse cx='540' cy='300' rx='115' ry='85' fill='%23000' transform='rotate(-22 540 300)'/><text x='48' y='64' fill='%23fff' font-family='monospace' font-size='22'>AXON</text><text x='680' y='240' fill='%23aa88ff' font-family='monospace' font-size='14'>[AIMS]</text></svg>",
    canvas: "#000000",
    fontsHref: "",
    libs: ["https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js"],
    meta: { title: "AXON..", description: "AXON is a motion research studio: an open logbook of real-time rendering studies in particles, fluids and signed surfaces." },
    css: axonCss,
    body: axonBody,
    js: axonJs,
    prompt: axonPrompt,
  },
  {
    id: "facet",
    name: "Facet",
    title: "Real-time material studio · smoked-glass shards",
    category: "WebGL / Studio",
    year: 2026,
    tags: ["three.js", "glass", "iridescence", "shatter", "shaders", "dark", "interactive"],
    summary:
      "A dark hero cut into five breathing smoked-glass shards and a nav slab: each shard carries its slice of the printed typography, lifts and tips on a spring with iridescent sheen and lavender cursor glow, and shatters in 3D when you open the five-terms paper.",
    palette: ["#050507", "#17171B", "#BDBDC3", "#DCDCE0", "#B9ABFF", "#36D67E"],
    fonts: ["Inter (400–650)"],
    sections: ["Smoked-glass shard hero", "Shatter transition", "Five-terms paper + 3D Back sliver"],
    cover: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 600'><rect width='960' height='600' fill='%23050507'/><g fill='%2317171b' stroke='%234a4663' stroke-width='1.5'><rect x='56' y='46' width='848' height='54' rx='12'/><polygon points='56,114 238,114 374,442 338,554 56,554'/><polygon points='250,114 486,114 456,392 386,434'/><polygon points='498,114 762,114 656,322 468,384'/><polygon points='386,448 466,398 656,334 782,554 352,554'/><polygon points='774,114 904,114 904,554 796,554 668,326'/></g><text x='96' y='268' fill='%23dcdce0' font-family='Inter,sans-serif' font-weight='500' font-size='64' letter-spacing='-3'>Designed</text><text x='96' y='332' fill='%23bdbdc3' font-family='Inter,sans-serif' font-weight='500' font-size='64' letter-spacing='-3'>in glass.</text><rect x='96' y='406' width='112' height='36' rx='6' fill='%2336d67e'/></svg>",
    canvas: "#050507",
    fontsHref: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;650&display=swap",
    meta: { title: "Facet — Designed in glass.", description: "Author dispersion, transmission, and refraction in the browser. Live previews, real materials." },
    importMap: {
      three: "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/",
    },
    module: true,
    css: facetCss,
    body: facetBody,
    js: facetJs,
    prompt: facetPrompt,
  },
];

export const SITE_BY_ID: Record<string, Site> = Object.fromEntries(SITES.map((s) => [s.id, s]));

/* "</" + "script>" is split so the inlined app bundle never contains a closing script tag. */
const CLOSE_SCRIPT = "</" + "script>";

/** Assembles a site into one standalone HTML document. */
export function buildHtml(s: Site, opts: { rec?: boolean } = {}) {
  const ext = [...(s.scripts || []), ...(s.libs || [])];
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${s.meta.title}</title>`,
    `<meta name="description" content="${s.meta.description}" />`,
    ...(s.fontsHref
      ? [
          '<link rel="preconnect" href="https://fonts.googleapis.com" />',
          '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
          `<link href="${s.fontsHref}" rel="stylesheet" />`,
        ]
      : []),
    s.importMap
      ? `<script type="importmap">${JSON.stringify({ imports: s.importMap })}${CLOSE_SCRIPT}`
      : "",
    `<style>\n${s.css}\n</style>`,
    "</head>",
    "<body>",
    s.body,
    opts.rec ? `<script>window.name = "rec";${CLOSE_SCRIPT}` : "",
    ...ext.map((src) => `<script src="${src}">${CLOSE_SCRIPT}`),
    `<script${s.module ? ' type="module"' : ""}>\n${s.js}\n${CLOSE_SCRIPT}`,
    "</body>",
    "</html>",
  ].join("\n");
}

export function siteStats(s: Site) {
  const html = buildHtml(s);
  const words = s.prompt.split(/\s+/).filter(Boolean).length;
  const kb = new Blob([html]).size / 1024;
  return { words, kb, lines: html.split("\n").length };
}
