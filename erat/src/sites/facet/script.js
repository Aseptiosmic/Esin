import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("gl");
let renderer = null;
if (!reduce) {
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) { renderer = null; }
}
if (!renderer) {
  document.body.classList.add("static");
  const fb = document.getElementById("fbpaper"), defs = document.getElementById("defs");
  if (fb) fb.addEventListener("click", () => defs.classList.add("on"));
  document.getElementById("back").addEventListener("click", () => defs.classList.remove("on"));
} else {
  runFacet(renderer);
}

function runFacet(renderer) {
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x050507, 1);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  if ("environmentIntensity" in scene) scene.environmentIntensity = 0.42;

  const keyLight = new THREE.DirectionalLight(0xeef4ff, 2.2);
  keyLight.position.set(-600, 700, 900);
  const rimLight = new THREE.DirectionalLight(0xc9d4ff, 1.1);
  rimLight.position.set(700, -400, 600);
  scene.add(keyLight, rimLight, new THREE.AmbientLight(0x20222c, 0.7));

  const camera = new THREE.PerspectiveCamera(30, 1, 10, 10000);
  const block = new THREE.Group();
  scene.add(block);

  /* ---------- layout metrics ---------- */
  let W = window.innerWidth, H = window.innerHeight;
  let blockW = 1200, blockH = 760, navH = 82, gap = 14, panelH = 664, S = 1, portrait = false;
  function computeMetrics() {
    W = window.innerWidth;
    H = window.innerHeight;
    portrait = W < H * 0.88;
    const phone = W <= 760;
    const mx = phone ? 16 : W * 0.055;
    const my = phone ? 16 : H * 0.085;
    blockW = Math.max(280, W - mx * 2);
    blockH = Math.max(360, H - my * 2);
    S = blockW / 1730;
    navH = blockH * 0.108;
    gap = 14;
    panelH = blockH - navH - gap;
    const fovRad = (camera.fov * Math.PI) / 180;
    const camZ = (H / 2) / Math.tan(fovRad / 2);
    camera.aspect = W / Math.max(1, H);
    camera.position.set(0, 0, camZ);
    camera.near = Math.max(10, camZ * 0.05);
    camera.far = camZ * 8;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H, false);
  }
  computeMetrics();

  /* ---------- glass material + lavender cursor glow ---------- */
  const glowUniforms = {
    uPointer: { value: new THREE.Vector3(0, 0, 0) },
    uGlow: { value: 0 },
    uRadius: { value: 300 },
  };
  function makeGlassMat(withGlow, irid) {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x17171b),
      roughness: 0.36,
      metalness: 0.05,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
      specularIntensity: 0.7,
      iridescence: irid,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [250, 650],
      envMapIntensity: 1.0,
    });
    if (withGlow) {
      m.onBeforeCompile = (sh) => {
        sh.uniforms.uPointer = glowUniforms.uPointer;
        sh.uniforms.uGlow = glowUniforms.uGlow;
        sh.uniforms.uRadius = glowUniforms.uRadius;
        sh.vertexShader = "varying vec3 vWorldPos;\n" + sh.vertexShader.replace(
          "#include <worldpos_vertex>",
          "#include <worldpos_vertex>\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;"
        );
        sh.fragmentShader = "uniform vec3 uPointer; uniform float uGlow, uRadius; varying vec3 vWorldPos;\n" + sh.fragmentShader.replace(
          "#include <dithering_fragment>",
          "float gd = length(vWorldPos.xy - uPointer.xy) / max(uRadius, 1.0);\ngl_FragColor.rgb += vec3(0.42, 0.37, 0.62) * 0.16 * uGlow * exp(-1.6 * gd * gd);\n#include <dithering_fragment>"
        );
      };
    }
    return m;
  }

  /* ---------- 2D polygon inset & rounded shape ---------- */
  function signedArea(pts) {
    let a = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      a += p.x * q.y - q.x * p.y;
    }
    return a * 0.5;
  }
  function insetPolygon(pts, inset) {
    const ccw = signedArea(pts) > 0;
    const sign = ccw ? 1 : -1;
    const n = pts.length;
    const out = [];
    for (let i = 0; i < n; i++) {
      const prev = pts[(i - 1 + n) % n];
      const cur = pts[i];
      const next = pts[(i + 1) % n];
      let e1x = cur.x - prev.x, e1y = cur.y - prev.y;
      let e2x = next.x - cur.x, e2y = next.y - cur.y;
      const l1 = Math.hypot(e1x, e1y) || 1, l2 = Math.hypot(e2x, e2y) || 1;
      e1x /= l1; e1y /= l1; e2x /= l2; e2y /= l2;
      const n1x = -e1y * sign, n1y = e1x * sign;
      const n2x = -e2y * sign, n2y = e2x * sign;
      let bx = n1x + n2x, by = n1y + n2y;
      const bl = Math.hypot(bx, by) || 1;
      bx /= bl; by /= bl;
      const cos = Math.max(0.35, n1x * bx + n1y * by);
      const d = inset / cos;
      out.push({ x: cur.x + bx * d, y: cur.y + by * d });
    }
    return out;
  }
  function roundedShape(pts, radius) {
    const shape = new THREE.Shape();
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const prev = pts[(i - 1 + n) % n];
      const cur = pts[i];
      const next = pts[(i + 1) % n];
      const v1x = prev.x - cur.x, v1y = prev.y - cur.y;
      const v2x = next.x - cur.x, v2y = next.y - cur.y;
      const l1 = Math.hypot(v1x, v1y) || 1, l2 = Math.hypot(v2x, v2y) || 1;
      const r = Math.min(radius, l1 * 0.42, l2 * 0.42);
      const p1x = cur.x + (v1x / l1) * r, p1y = cur.y + (v1y / l1) * r;
      const p2x = cur.x + (v2x / l2) * r, p2y = cur.y + (v2y / l2) * r;
      if (i === 0) shape.moveTo(p1x, p1y);
      else shape.lineTo(p1x, p1y);
      shape.quadraticCurveTo(cur.x, cur.y, p2x, p2y);
    }
    shape.closePath();
    return shape;
  }

  /* ---------- printed content textures (panel + nav) ---------- */
  const panelCanvas = document.createElement("canvas");
  const navCanvas = document.createElement("canvas");
  const panelTex = new THREE.CanvasTexture(panelCanvas);
  const navTex = new THREE.CanvasTexture(navCanvas);
  panelTex.colorSpace = THREE.SRGBColorSpace;
  navTex.colorSpace = THREE.SRGBColorSpace;
  panelTex.minFilter = THREE.LinearFilter;
  navTex.minFilter = THREE.LinearFilter;

  let ctaHover = false, paperHover = false, navHover = -1;
  let ctaRect = { x: 0, y: 0, w: 0, h: 0 }, paperRect = { x: 0, y: 0, w: 0, h: 0 };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawTextures() {
    const dpr = Math.max(1.5, DPR);
    // panel
    panelCanvas.width = Math.max(2, Math.round(blockW * dpr));
    panelCanvas.height = Math.max(2, Math.round(panelH * dpr));
    const ctx = panelCanvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, blockW, panelH);

    const padX = Math.max(24, 58 * S);
    const eyY = panelH * 0.135;
    ctx.font = `500 ${Math.max(9.5, 11 * S)}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.38)";
    ctx.letterSpacing = `${(0.2 * 11 * S).toFixed(2)}px`;
    ctx.fillText("REAL-TIME MATERIAL STUDIO", padX, eyY);
    ctx.letterSpacing = "0px";

    const hSize = Math.min(blockW * 0.078, panelH * 0.20);
    const lead = hSize * 0.97;
    const hY1 = eyY + hSize * 1.05;
    const hY2 = hY1 + lead;
    ctx.font = `500 ${hSize.toFixed(1)}px Inter, system-ui, sans-serif`;
    ctx.letterSpacing = `${(-0.045 * hSize).toFixed(2)}px`;
    const grad = ctx.createLinearGradient(0, hY1 - hSize, 0, hY2 + 10);
    grad.addColorStop(0, "#dcdce0");
    grad.addColorStop(1, "#bdbdc3");
    ctx.fillStyle = grad;
    ctx.fillText("Designed", padX, hY1);
    ctx.fillText("in glass.", padX, hY2);
    ctx.letterSpacing = "0px";

    const subSize = Math.max(12, 16.5 * S);
    const subY = hY2 + Math.max(26, 40 * S);
    ctx.font = `400 ${subSize.toFixed(1)}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("Author dispersion, transmission, and refraction in the browser. Live", padX, subY);
    ctx.fillText("previews, real materials.", padX, subY + subSize * 1.5);

    const btnW = Math.max(98, 116 * S), btnH = Math.max(34, 40 * S);
    const btnX = padX, btnY = subY + subSize * 1.5 + Math.max(22, 34 * S);
    ctaRect = { x: btnX, y: btnY, w: btnW, h: btnH };
    ctx.fillStyle = ctaHover ? "#36d67e" : "#e9e9ee";
    roundRect(ctx, btnX, btnY, btnW, btnH, Math.max(5, 6 * S));
    ctx.fill();
    ctx.fillStyle = "#0b0b0f";
    ctx.font = `500 ${Math.max(11.5, 13.5 * S).toFixed(1)}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Open studio", btnX + btnW / 2, btnY + btnH / 2 + 0.5);

    const pX = btnX + btnW + Math.max(18, 26 * S), pY = btnY + btnH / 2;
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    const pTxt = "Read paper →";
    ctx.fillText(pTxt, pX, pY + 0.5);
    const pW = ctx.measureText(pTxt).width;
    paperRect = { x: pX - 6, y: btnY, w: pW + 12, h: btnH };
    if (paperHover) {
      ctx.fillRect(pX, pY + Math.max(7, 9 * S), pW, 1.2);
    }

    ctx.textBaseline = "alphabetic";
    const footY = panelH - Math.max(18, 28 * S);
    ctx.font = `400 ${Math.max(9.5, 11 * S).toFixed(1)}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.34)";
    ctx.fillText("© Facet Lab", padX, footY);
    ctx.textAlign = "right";
    ctx.fillText("KHR_materials_dispersion", blockW - padX, footY);
    ctx.textAlign = "left";
    panelTex.needsUpdate = true;

    // nav
    navCanvas.width = Math.max(2, Math.round(blockW * dpr));
    navCanvas.height = Math.max(2, Math.round(navH * dpr));
    const nctx = navCanvas.getContext("2d");
    nctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nctx.clearRect(0, 0, blockW, navH);
    const ny = navH / 2;
    const sq = Math.max(13, 16 * S);
    nctx.strokeStyle = "#ffffff";
    nctx.lineWidth = Math.max(1.3, 1.6 * S);
    nctx.strokeRect(padX, ny - sq / 2, sq, sq);
    nctx.fillStyle = "#ffffff";
    nctx.font = `600 ${Math.max(13, 16 * S).toFixed(1)}px Inter, system-ui, sans-serif`;
    nctx.textBaseline = "middle";
    nctx.fillText("Facet", padX + sq + Math.max(9, 12 * S), ny + 0.5);

    const items = ["Studio", "Materials", "Pricing"];
    nctx.font = `400 ${Math.max(11.5, 14 * S).toFixed(1)}px Inter, system-ui, sans-serif`;
    const gapN = Math.max(22, 38 * S);
    let totalW = 0;
    const ws = items.map((t) => { const w = nctx.measureText(t).width; totalW += w; return w; });
    totalW += gapN * (items.length - 1);
    let cx = (blockW - totalW) / 2;
    items.forEach((t, i) => {
      nctx.fillStyle = navHover === i ? "#ffffff" : "rgba(255,255,255,0.6)";
      nctx.fillText(t, cx, ny + 0.5);
      cx += ws[i] + gapN;
    });
    nctx.textAlign = "right";
    nctx.fillStyle = navHover === 3 ? "#ffffff" : "rgba(255,255,255,0.78)";
    nctx.fillText("Sign in", blockW - padX, ny + 0.5);
    nctx.textAlign = "left";
    navTex.needsUpdate = true;

    layoutDomOverlay(padX, eyY, hSize, hY1, lead, subSize, subY);
  }

  /* ---------- DOM overlay (selectable text + real buttons) ---------- */
  const domEl = document.getElementById("dom");
  const dnav = document.getElementById("dnav");
  const dpanel = document.getElementById("dpanel");
  const dcta = document.getElementById("dcta");
  const dpaper = document.getElementById("dpaper");
  function layoutDomOverlay(padX, eyY, hSize, hY1, lead, subSize, subY) {
    domEl.style.width = blockW + "px";
    domEl.style.height = blockH + "px";
    dnav.style.height = navH + "px";
    dnav.style.padding = `0 ${padX}px`;
    dnav.style.fontSize = `${Math.max(11.5, 14 * S)}px`;
    document.getElementById("dlinks").style.gap = `${Math.max(22, 38 * S)}px`;
    dpanel.style.top = (navH + gap) + "px";
    dpanel.style.height = panelH + "px";
    const ey = document.getElementById("deyebrow");
    ey.style.position = "absolute";
    ey.style.left = padX + "px";
    ey.style.top = (eyY - 12 * S) + "px";
    ey.style.fontSize = `${Math.max(9.5, 11 * S)}px`;
    ey.style.letterSpacing = "0.2em";
    const dh1 = document.getElementById("dh1");
    dh1.style.position = "absolute";
    dh1.style.left = padX + "px";
    dh1.style.top = (hY1 - hSize * 0.88) + "px";
    dh1.style.fontSize = hSize + "px";
    dh1.style.lineHeight = (lead / hSize).toFixed(3);
    dh1.style.letterSpacing = "-0.045em";
    const ds = document.getElementById("dsub");
    ds.style.position = "absolute";
    ds.style.left = padX + "px";
    ds.style.top = (subY - subSize * 0.85) + "px";
    ds.style.fontSize = subSize + "px";
    ds.style.lineHeight = "1.5";
    dcta.style.left = ctaRect.x + "px";
    dcta.style.top = ctaRect.y + "px";
    dcta.style.width = ctaRect.w + "px";
    dcta.style.height = ctaRect.h + "px";
    dpaper.style.left = paperRect.x + "px";
    dpaper.style.top = paperRect.y + "px";
    dpaper.style.width = paperRect.w + "px";
    dpaper.style.height = paperRect.h + "px";
    const dc = document.getElementById("dcopy"), de = document.getElementById("dext");
    dc.style.position = de.style.position = "absolute";
    dc.style.left = padX + "px";
    de.style.right = padX + "px";
    dc.style.bottom = de.style.bottom = Math.max(14, 22 * S) + "px";
    dc.style.fontSize = de.style.fontSize = `${Math.max(9.5, 11 * S)}px`;
  }

  dcta.addEventListener("pointerenter", () => { ctaHover = true; drawTextures(); });
  dcta.addEventListener("pointerleave", () => { ctaHover = false; drawTextures(); });
  dpaper.addEventListener("pointerenter", () => { paperHover = true; drawTextures(); });
  dpaper.addEventListener("pointerleave", () => { paperHover = false; drawTextures(); });
  document.querySelectorAll("[data-nav]").forEach((el) => {
    const idx = +el.dataset.nav;
    el.addEventListener("pointerenter", () => { navHover = idx; drawTextures(); });
    el.addEventListener("pointerleave", () => { navHover = -1; drawTextures(); });
    el.addEventListener("click", (e) => e.preventDefault());
  });
  document.getElementById("dbrand").addEventListener("click", (e) => e.preventDefault());

  /* ---------- homography (4-corner CSS matrix3d) ---------- */
  function solveLinear(A, b) {
    const n = b.length;
    for (let i = 0; i < n; i++) {
      let max = i;
      for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[max][i])) max = r;
      [A[i], A[max]] = [A[max], A[i]];
      [b[i], b[max]] = [b[max], b[i]];
      const piv = A[i][i] || 1e-12;
      for (let j = i; j < n; j++) A[i][j] /= piv;
      b[i] /= piv;
      for (let r = 0; r < n; r++) {
        if (r === i) continue;
        const f = A[r][i];
        for (let j = i; j < n; j++) A[r][j] -= f * A[i][j];
        b[r] -= f * b[i];
      }
    }
    return b;
  }
  function updateDomHomography() {
    const hw = blockW / 2, hh = blockH / 2;
    const corners = [
      new THREE.Vector3(-hw, hh, 0),
      new THREE.Vector3(hw, hh, 0),
      new THREE.Vector3(hw, -hh, 0),
      new THREE.Vector3(-hw, -hh, 0),
    ].map((v) => {
      v.applyMatrix4(block.matrixWorld);
      v.project(camera);
      return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
    });
    const src = [
      { x: 0, y: 0 },
      { x: blockW, y: 0 },
      { x: blockW, y: blockH },
      { x: 0, y: blockH },
    ];
    const A = [], B = [];
    for (let i = 0; i < 4; i++) {
      const s = src[i], d = corners[i];
      A.push([s.x, s.y, 1, 0, 0, 0, -s.x * d.x, -s.y * d.x]);
      B.push(d.x);
      A.push([0, 0, 0, s.x, s.y, 1, -s.x * d.y, -s.y * d.y]);
      B.push(d.y);
    }
    const h = solveLinear(A, B);
    const H3 = [
      h[0], h[3], 0, h[6],
      h[1], h[4], 0, h[7],
      0,    0,    1, 0,
      h[2], h[5], 0, 1,
    ];
    domEl.style.transform = `matrix3d(${H3.map((n) => n.toFixed(6)).join(",")})`;
  }

  /* ---------- pieces: nav (0) + 5 cells (1..5) ---------- */
  const pieces = [];
  for (let i = 0; i < 6; i++) {
    const isNav = i === 0;
    const glassMat = makeGlassMat(true, 0.55);
    const glassMesh = new THREE.Mesh(new THREE.BufferGeometry(), glassMat);
    const printMat = new THREE.MeshBasicMaterial({
      map: isNav ? navTex : panelTex,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    const printMesh = new THREE.Mesh(new THREE.BufferGeometry(), printMat);
    const grp = new THREE.Group();
    grp.add(glassMesh, printMesh);
    glassMesh.userData.pieceIndex = i;
    printMesh.userData.pieceIndex = i;
    block.add(grp);
    pieces.push({
      index: i, isNav, group: grp, glassMesh, printMesh, glassMat, printMat,
      center: new THREE.Vector2(),
      z: 0, vz: 0, rx: 0, vrx: 0, ry: 0, vry: 0,
      shatterVel: new THREE.Vector3(),
      shatterAxis: new THREE.Vector3(1, 0, 0),
      shatterAngle: 2.6,
    });
  }

  /* ---------- cut pattern (5 cells + drift + cursor push) ---------- */
  const BASE = {
    tAB: { x: 0.22, y: 0 }, tBC: { x: 0.515, y: 0 }, tCE: { x: 0.84, y: 0 },
    bAD: { x: 0.34, y: 1 }, bDE: { x: 0.865, y: 1 },
    J0: { x: 0.385, y: 0.72 }, J1: { x: 0.48, y: 0.62 }, J2: { x: 0.716, y: 0.49 },
  };
  const DRIFT = {
    tAB: [0.52, 1.1, 0], tBC: [0.44, 2.4, 0], tCE: [0.38, 4.0, 0],
    bAD: [0.47, 5.1, 0], bDE: [0.36, 0.7, 0],
    J0: [0.58, 1.8, 0.42, 3.3], J1: [0.49, 4.5, 0.55, 0.9], J2: [0.41, 2.9, 0.46, 5.4],
  };

  let pointerNorm = { x: 0.5, y: 0.5, inside: false };
  function computeCutPoints(t) {
    const pts = {};
    Object.keys(BASE).forEach((k) => {
      const b = BASE[k], d = DRIFT[k];
      let x = b.x + Math.sin(t * d[0] + d[1]) * 0.03;
      let y = b.y + (d.length > 3 ? Math.sin(t * d[2] + d[3]) * 0.05 : 0);
      let px = portrait ? y : x;
      let py = portrait ? x : y;
      if (pointerNorm.inside) {
        const dx = px - pointerNorm.x, dy = py - pointerNorm.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.6 && dist > 1e-4) {
          const push = (1 - dist / 0.6) * 0.05;
          if (portrait) {
            if (b.x > 0 && b.x < 1) py = Math.max(0.08, Math.min(0.92, py + (dy / dist) * push));
            px = Math.max(0.08, Math.min(0.92, px + (dx / dist) * push));
          } else {
            px = Math.max(0.08, Math.min(0.92, px + (dx / dist) * push));
            if (b.y > 0 && b.y < 1) py = Math.max(0.08, Math.min(0.92, py + (dy / dist) * push));
          }
        }
      }
      pts[k] = { x: px, y: py };
    });
    pts.TL = portrait ? { x: 0, y: 0 } : { x: 0, y: 0 };
    pts.TR = portrait ? { x: 0, y: 1 } : { x: 1, y: 0 };
    pts.BR = portrait ? { x: 1, y: 1 } : { x: 1, y: 1 };
    pts.BL = portrait ? { x: 1, y: 0 } : { x: 0, y: 1 };
    return [
      [pts.TL, pts.tAB, pts.J0, pts.bAD, pts.BL],
      [pts.tAB, pts.tBC, pts.J1, pts.J0],
      [pts.tBC, pts.tCE, pts.J2, pts.J1],
      [pts.J0, pts.J1, pts.J2, pts.bDE, pts.bAD],
      [pts.tCE, pts.TR, pts.BR, pts.bDE, pts.J2],
    ];
  }

  function applyPanelUVs(geo, ox, oy) {
    const pos = geo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    const panelTopY = blockH / 2 - navH - gap;
    for (let i = 0; i < pos.count; i++) {
      const wx = pos.getX(i) + ox;
      const wy = pos.getY(i) + oy;
      uvs[i * 2] = (wx + blockW / 2) / blockW;
      uvs[i * 2 + 1] = 1 - (panelTopY - wy) / panelH;
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  }
  function applyNavUVs(geo, ox, oy) {
    const pos = geo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    const navTopY = blockH / 2;
    for (let i = 0; i < pos.count; i++) {
      const wx = pos.getX(i) + ox;
      const wy = pos.getY(i) + oy;
      uvs[i * 2] = (wx + blockW / 2) / blockW;
      uvs[i * 2 + 1] = 1 - (navTopY - wy) / navH;
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  }

  function buildPieceGeometry(piece, worldPts) {
    let cx = 0, cy = 0;
    worldPts.forEach((p) => { cx += p.x; cy += p.y; });
    cx /= worldPts.length; cy /= worldPts.length;
    piece.center.set(cx, cy);

    const local = worldPts.map((p) => ({ x: p.x - cx, y: p.y - cy }));
    if (signedArea(local) < 0) local.reverse();
    const inset = insetPolygon(local, 7 * S);
    const shape = roundedShape(inset, 20 * S);
    const depth = 13 * S, bevel = 2.6 * S;
    const extGeo = new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 8,
    });
    extGeo.translate(0, 0, -depth / 2);

    const topGeo = new THREE.ShapeGeometry(shape, 8);
    topGeo.translate(0, 0, depth / 2 + bevel + 0.6);
    if (piece.isNav) applyNavUVs(topGeo, cx, cy);
    else applyPanelUVs(topGeo, cx, cy);

    piece.glassMesh.geometry.dispose();
    piece.printMesh.geometry.dispose();
    piece.glassMesh.geometry = extGeo;
    piece.printMesh.geometry = topGeo;
  }

  function rebuildNav() {
    const hw = blockW / 2;
    const topY = blockH / 2, botY = topY - navH;
    buildPieceGeometry(pieces[0], [
      { x: -hw, y: topY }, { x: hw, y: topY }, { x: hw, y: botY }, { x: -hw, y: botY },
    ]);
  }
  function rebuildCells(t) {
    const cells = computeCutPoints(t);
    const panelTopY = blockH / 2 - navH - gap;
    const hw = blockW / 2;
    for (let i = 0; i < 5; i++) {
      const worldPts = cells[i].map((p) => ({
        x: -hw + p.x * blockW,
        y: panelTopY - p.y * panelH,
      }));
      buildPieceGeometry(pieces[i + 1], worldPts);
    }
  }

  /* ---------- "← Back" sliver shard ---------- */
  const sliverMat = makeGlassMat(false, 0.35);
  const sliverMesh = new THREE.Mesh(new THREE.BufferGeometry(), sliverMat);
  const sliverGroup = new THREE.Group();
  sliverGroup.add(sliverMesh);
  sliverGroup.visible = false;
  scene.add(sliverGroup);
  let sliverCenter = new THREE.Vector2();
  let sliverScale = 0, sliverTarget = 0, sliverHover = false;

  function rebuildSliver() {
    const k = W / 1918;
    const raw = [
      { x: 0.147, y: 0.243 },
      { x: 0.252, y: 0.169 },
      { x: 0.287, y: 0.277 },
      { x: 0.151, y: 0.258 },
    ].map((p) => ({ x: (p.x - 0.5) * W, y: (0.5 - p.y) * H }));
    let cx = 0, cy = 0;
    raw.forEach((p) => { cx += p.x; cy += p.y; });
    cx /= 4; cy /= 4;
    sliverCenter.set(cx, cy);
    const local = raw.map((p) => ({ x: p.x - cx, y: p.y - cy }));
    if (signedArea(local) < 0) local.reverse();
    const shape = roundedShape(local, 10 * k);
    const depth = 11 * k, bevel = 2.4 * k;
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 8,
    });
    geo.translate(0, 0, -depth / 2);
    sliverMesh.geometry.dispose();
    sliverMesh.geometry = geo;
    sliverGroup.position.set(cx, cy, 40);
  }

  /* ---------- shatter / reassemble state ---------- */
  const defsEl = document.getElementById("defs");
  const backBtn = document.getElementById("back");
  let mode = "intro"; // "intro" | " intact" | "shattering" | "shattered" | "assembling"
  let modeT0 = performance.now() / 1000;

  function seedShatterVectors() {
    pieces.forEach((p, i) => {
      const dirX = p.center.x / Math.max(1, blockW / 2);
      const dirY = p.center.y / Math.max(1, blockH / 2);
      p.shatterVel.set(
        (dirX * 520 + (i % 2 ? 140 : -140)) * S,
        (dirY * 320 - 260) * S,
        (460 + (i * 63) % 340) * S
      );
      p.shatterAxis.set(Math.sin(i * 2.1 + 0.4), Math.cos(i * 1.7 - 0.3), Math.sin(i * 3.3)).normalize();
      p.shatterAngle = 2.1 + (i % 4) * 0.45;
    });
  }

  function triggerShatter() {
    if (mode === "shattering" || mode === "shattered") return;
    seedShatterVectors();
    mode = "shattering";
    modeT0 = performance.now() / 1000;
    domEl.style.pointerEvents = "none";
    domEl.style.visibility = "hidden";
    setTimeout(() => {
      if (mode === "shattering" || mode === "shattered") {
        defsEl.classList.remove("closing");
        defsEl.classList.add("on");
        defsEl.setAttribute("aria-hidden", "false");
        sliverGroup.visible = true;
        sliverTarget = 1;
      }
    }, 280);
  }

  function triggerAssemble() {
    if (mode !== "shattered" && mode !== "shattering") return;
    defsEl.classList.add("closing");
    defsEl.classList.remove("on");
    defsEl.setAttribute("aria-hidden", "true");
    sliverTarget = 0;
    mode = "assembling";
    modeT0 = performance.now() / 1000;
  }

  dpaper.addEventListener("click", triggerShatter);
  backBtn.addEventListener("click", triggerAssemble);
  backBtn.addEventListener("pointerenter", () => { sliverHover = true; backBtn.classList.add("hov"); });
  backBtn.addEventListener("pointerleave", () => { sliverHover = false; backBtn.classList.remove("hov"); });

  /* ---------- pointer & raycast ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const worldHit = new THREE.Vector3();
  let ptrX = 0, ptrY = 0, ptrIn = false;
  let hoveredPiece = -1;

  window.addEventListener("pointermove", (e) => {
    ptrIn = true;
    ptrX = (e.clientX / W) * 2 - 1;
    ptrY = (e.clientY / H) * 2 - 1;
    ndc.set(ptrX, -ptrY);
    ray.setFromCamera(ndc, camera);
    ray.ray.intersectPlane(planeZ, worldHit);
    glowUniforms.uPointer.value.copy(worldHit);

    const panelTopY = blockH / 2 - navH - gap;
    pointerNorm.x = (worldHit.x + blockW / 2) / blockW;
    pointerNorm.y = (panelTopY - worldHit.y) / panelH;
    pointerNorm.inside = pointerNorm.x >= 0 && pointerNorm.x <= 1 && pointerNorm.y >= 0 && pointerNorm.y <= 1 && mode === "intact";

    if (mode === "intact") {
      const hits = ray.intersectObjects(pieces.map((p) => p.glassMesh), false);
      hoveredPiece = hits.length ? hits[0].object.userData.pieceIndex : -1;
    } else {
      hoveredPiece = -1;
      if (sliverGroup.visible) {
        const sh = ray.intersectObject(sliverMesh, false);
        sliverHover = sh.length > 0;
        backBtn.classList.toggle("hov", sliverHover);
      }
    }
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    ptrIn = false;
    pointerNorm.inside = false;
    hoveredPiece = -1;
  });

  window.addEventListener("resize", () => {
    computeMetrics();
    drawTextures();
    rebuildNav();
    rebuildCells(performance.now() / 1000);
    rebuildSliver();
  });

  /* ---------- initial build + fly-in ---------- */
  drawTextures();
  rebuildNav();
  rebuildCells(0);
  rebuildSliver();
  seedShatterVectors();

  let rotX = 0.8 * (Math.PI / 180), rotY = -1.2 * (Math.PI / 180);
  let lastRebuild = 0;
  let last = performance.now() / 1000;

  function easeInCubic(t) { return t * t * t; }
  function easeOutBack(t) {
    const c1 = 1.45, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  (function animate() {
    requestAnimationFrame(animate);
    const now = performance.now() / 1000;
    const dt = Math.min(0.05, now - last) || 1 / 60;
    last = now;

    glowUniforms.uRadius.value = 300 * S;
    const glowTgt = ptrIn && mode === "intact" ? 1 : 0;
    glowUniforms.uGlow.value += (glowTgt - glowUniforms.uGlow.value) * Math.min(1, dt * 8);

    // global block tilt (0.3s exponential smoothing)
    const DEG = Math.PI / 180;
    const tx = ptrIn && mode === "intact" ? (-ptrY * 5.5 + 0.8) * DEG : 0.8 * DEG;
    const ty = ptrIn && mode === "intact" ? (ptrX * 7.0 - 1.2) * DEG : -1.2 * DEG;
    const kt = 1 - Math.exp(-dt / 0.3);
    rotX += (tx - rotX) * kt;
    rotY += (ty - rotY) * kt;
    block.rotation.set(rotX, rotY, 0);
    block.updateMatrixWorld();

    // rebuild cut pattern ~45×/s while visible
    if ((mode === "intact" || mode === "intro") && now - lastRebuild > 1 / 45) {
      lastRebuild = now;
      rebuildCells(now);
    }

    // piece motion
    pieces.forEach((p, i) => {
      const hov = hoveredPiece === i && mode === "intact";
      const iridT = hov ? 1.0 : 0.55;
      const envT = hov ? 1.9 : 1.0;
      p.glassMat.iridescence += (iridT - p.glassMat.iridescence) * Math.min(1, dt * 10);
      p.glassMat.envMapIntensity += (envT - p.glassMat.envMapIntensity) * Math.min(1, dt * 10);

      let tz = 0, trx = 0, tryy = 0;
      if (hov) {
        tz = (p.isNav ? 32 : 50) * S;
        const dx = (worldHit.x - p.center.x) / Math.max(80, 260 * S);
        const dy = (worldHit.y - p.center.y) / Math.max(80, 220 * S);
        // edge nearest pointer dips away
        tryy = Math.max(-0.24, Math.min(0.24, dx * 0.24));
        trx = Math.max(-0.24, Math.min(0.24, -dy * 0.24));
      }
      // spring k=170, c=19
      const k = 170, c = 19;
      p.vz += ((tz - p.z) * k - p.vz * c) * dt;
      p.z += p.vz * dt;
      p.vrx += ((trx - p.rx) * k - p.vrx * c) * dt;
      p.rx += p.vrx * dt;
      p.vry += ((tryy - p.ry) * k - p.vry * c) * dt;
      p.ry += p.vry * dt;

      if (mode === "intact") {
        p.group.visible = true;
        p.group.position.set(p.center.x, p.center.y, p.z);
        p.group.rotation.set(p.rx, p.ry, 0);
      } else if (mode === "shattering") {
        const stag = i * 0.032;
        const u = Math.max(0, Math.min(1, (now - modeT0 - stag) / 0.72));
        const e = easeInCubic(u);
        const grav = 0.5 * -980 * S * e * e;
        p.group.position.set(
          p.center.x + p.shatterVel.x * e,
          p.center.y + p.shatterVel.y * e + grav,
          p.z + p.shatterVel.z * e
        );
        p.group.setRotationFromAxisAngle(p.shatterAxis, p.shatterAngle * e);
        p.group.visible = u < 1;
        if (i === pieces.length - 1 && u >= 1) mode = "shattered";
      } else if (mode === "shattered") {
        p.group.visible = false;
      } else if (mode === "assembling" || mode === "intro") {
        const stag = i * 0.03;
        const u = Math.max(0, Math.min(1, (now - modeT0 - stag) / 0.72));
        const e = 1 - easeOutBack(u);
        const grav = 0.5 * -980 * S * e * e;
        p.group.visible = true;
        p.group.position.set(
          p.center.x + p.shatterVel.x * e,
          p.center.y + p.shatterVel.y * e + grav,
          p.shatterVel.z * e
        );
        p.group.setRotationFromAxisAngle(p.shatterAxis, p.shatterAngle * e);
        if (i === pieces.length - 1 && u >= 1) {
          mode = "intact";
          domEl.style.visibility = "visible";
          domEl.style.pointerEvents = "auto";
        }
      }
    });

    if (mode === "intact") updateDomHomography();

    // sliver shard
    sliverScale += (sliverTarget - sliverScale) * Math.min(1, dt * 9);
    if (sliverScale < 0.01 && sliverTarget === 0) {
      sliverGroup.visible = false;
    } else {
      sliverGroup.scale.setScalar(Math.max(0.001, sliverScale));
      const wobX = Math.sin(now * 6.0) * 0.032;
      const wobY = Math.cos(now * 5.2) * 0.036;
      const tipX = sliverHover ? -ptrY * 0.14 : 0;
      const tipY = sliverHover ? ptrX * 0.14 : 0;
      sliverGroup.rotation.set(0.08 + wobX + tipX, -0.16 + wobY + tipY, 0);
    }

    renderer.render(scene, camera);
  })();
}
