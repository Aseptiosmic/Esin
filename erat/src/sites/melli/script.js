import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const BEE_GLB = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261017_132918_e8364d8f-7df2-4788-a725-dec28ec19af8.glb";
const WING_TEX = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261017_132814_3a56ac14-47d8-4e49-a163-94234dea5639.png";

/* ---------- 5a. DOM scroll effects ---------- */
const sections = [...document.querySelectorAll("main > section")];
const speedEls = [...document.querySelectorAll("[data-speed]")];

const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
}, { threshold: 0.3 });
sections.forEach((s) => io.observe(s));

function updateDOM() {
  const vh = window.innerHeight || 1;
  speedEls.forEach((el) => {
    const sec = el.closest("section");
    if (!sec) return;
    const p = -sec.getBoundingClientRect().top / vh;
    const speed = parseFloat(el.dataset.speed || "0");
    const rot = parseFloat(el.dataset.rot || "0");
    el.style.transform = `translate3d(0,${(p * speed * vh).toFixed(1)}px,0) rotate(${(p * rot).toFixed(2)}deg)`;
  });
  const probeY = vh * 0.06;
  const hit = sections.find((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= probeY && r.bottom >= probeY;
  });
  document.body.classList.toggle("on-dark", !!(hit && hit.dataset.theme === "dark"));
}
window.addEventListener("scroll", updateDOM, { passive: true });
window.addEventListener("resize", updateDOM);
updateDOM();

/* ---------- 5b. Loader ---------- */
const loaderEl = document.getElementById("loader");
const canvas = document.getElementById("bee");
function doneLoading() {
  loaderEl.classList.add("done");
  document.body.classList.add("loaded");
}
setTimeout(doneLoading, 2500);

/* ---------- 5c. three.js scene ---------- */
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (e) {
  doneLoading();
}

if (renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  scene.add(new THREE.HemisphereLight(0xf2eeff, 0x7a62c9, 1.3));
  const dir1 = new THREE.DirectionalLight(0xfff1d6, 2.6);
  dir1.position.set(3, 5, 6);
  const dir2 = new THREE.DirectionalLight(0xc8b8ff, 2.2);
  dir2.position.set(-5, 2, -4);
  scene.add(dir1, dir2);

  const flight = new THREE.Group();
  const beeRoot = new THREE.Group();
  flight.add(beeRoot);
  scene.add(flight);

  /* ---------- 5e. Procedural wings ---------- */
  const flaps = [];
  const wingCanvas = document.createElement("canvas");
  wingCanvas.width = 1024;
  wingCanvas.height = 576;
  const wingTex = new THREE.CanvasTexture(wingCanvas);
  wingTex.colorSpace = THREE.SRGBColorSpace;

  const wingImg = new Image();
  wingImg.crossOrigin = "anonymous";
  wingImg.onload = () => {
    const ctx = wingCanvas.getContext("2d");
    ctx.drawImage(wingImg, 0, 0, 1024, 576);
    const img = ctx.getImageData(0, 0, 1024, 576);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const l = (r * 0.3 + g * 0.59 + b * 0.11) / 255;
      const a = Math.max(0, Math.min(1, (l - 0.035) * 4.2)) * 255;
      d[i] = Math.min(255, r * 1.5 + 30);
      d[i + 1] = Math.min(255, g * 1.5 + 30);
      d[i + 2] = Math.min(255, b * 1.5 + 40);
      d[i + 3] = a;
    }
    ctx.putImageData(img, 0, 0);
    wingTex.needsUpdate = true;
  };
  wingImg.src = WING_TEX;

  function wingGeo(span) {
    const g = new THREE.PlaneGeometry(span, span * 9 / 16);
    g.translate(span / 2 - span * 0.03, 0, 0);
    g.rotateX(-Math.PI / 2);
    g.rotateY(-Math.PI / 2);
    return g;
  }
  function buildWingSet() {
    const side = new THREE.Group();
    const specs = [
      { span: 0.72, sweep: -0.42, phase: 0, lift: 0.02 },
      { span: 0.52, sweep: -0.95, phase: -0.5, lift: -0.01 },
    ];
    const copies = [[0, 0.95], [0.55, 0.28], [-0.55, 0.28]];
    specs.forEach((w) => {
      const sweepG = new THREE.Group();
      sweepG.rotation.y = w.sweep;
      sweepG.position.y = w.lift;
      const geo = wingGeo(w.span);
      copies.forEach(([off, op]) => {
        const mat = new THREE.MeshBasicMaterial({
          map: wingTex, transparent: true, opacity: op, side: THREE.DoubleSide,
          depthWrite: false, color: 0xffffff, blending: THREE.NormalBlending,
        });
        const fg = new THREE.Group();
        fg.add(new THREE.Mesh(geo, mat));
        sweepG.add(fg);
        flaps.push({ group: fg, phase: w.phase + off });
      });
      side.add(sweepG);
    });
    return side;
  }

  /* ---------- 5d. Model load and normalisation ---------- */
  let loaded = false;
  new GLTFLoader().load(
    BEE_GLB,
    (gltf) => {
      const model = gltf.scene;
      model.traverse((o) => {
        if (o.isMesh) {
          o.frustumCulled = false;
          if (o.material) o.material.envMapIntensity = 0.7;
        }
      });
      const holder = new THREE.Group();
      holder.add(model);
      model.rotation.set(0, Math.PI / 2, 0);
      let box = new THREE.Box3().setFromObject(holder);
      const sz = box.getSize(new THREE.Vector3());
      model.scale.setScalar(1 / Math.max(sz.x, sz.y, sz.z));
      box = new THREE.Box3().setFromObject(holder);
      model.position.sub(box.getCenter(new THREE.Vector3()));
      box = new THREE.Box3().setFromObject(holder);
      beeRoot.add(holder);

      const ax = box.min.x + (box.max.x - box.min.x) * 0.66;
      const ay = box.max.y * 0.86;
      const az = (box.max.z - box.min.z) * 0.05;
      const rightW = buildWingSet();
      rightW.position.set(ax, ay, az);
      const leftW = buildWingSet();
      leftW.position.set(ax, ay, -az);
      leftW.scale.z = -1;
      beeRoot.add(rightW, leftW);

      loaded = true;
      doneLoading();
      canvas.classList.add("ready");
    },
    undefined,
    () => doneLoading()
  );

  /* ---------- 5f. Scroll-driven flight path ---------- */
  const DESK = [
    { x: -0.03, y: -0.12, s: 1.00, yaw: 150, pitch: 6, roll: -4 },
    { x: -0.30, y: -0.04, s: 1.00, yaw: 125, pitch: 10, roll: 6 },
    { x: 0.22, y: -0.30, s: 1.00, yaw: 40, pitch: -6, roll: -8 },
    { x: -0.22, y: 0.02, s: 0.96, yaw: 160, pitch: 8, roll: 4 },
    { x: 0.02, y: -0.08, s: 0.92, yaw: 105, pitch: 4, roll: 0 },
  ];
  const MOB = [
    { x: 0.05, y: -0.02, s: 0.75, yaw: 150, pitch: 6, roll: -4 },
    { x: 0.10, y: 0.12, s: 0.80, yaw: 125, pitch: 10, roll: 6 },
    { x: 0.15, y: -0.20, s: 0.75, yaw: 40, pitch: -6, roll: -8 },
    { x: 0.25, y: 0.20, s: 0.72, yaw: 160, pitch: 8, roll: 4 },
    { x: 0.00, y: 0.10, s: 0.70, yaw: 105, pitch: 4, roll: 0 },
  ];
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerpAngle = (a, b, t) => a + ((((b - a + 540) % 360) - 180) * t);

  function targetAt(p) {
    const K = window.innerWidth < 760 ? MOB : DESK;
    if (!Number.isFinite(p)) p = 0;
    p = clamp(p, 0, K.length - 1);
    const i = Math.min(K.length - 2, Math.floor(p));
    const f = p - i;
    const t = ease(clamp((f - 0.12) / 0.76, 0, 1));
    const A = K[i], B = K[i + 1];
    const sin = Math.sin(t * Math.PI);
    const dive = sin * -0.22;
    return {
      x: lerp(A.x, B.x, t),
      y: lerp(A.y, B.y, t) + dive,
      s: lerp(A.s, B.s, t) * (1 + sin * 0.12),
      yaw: lerpAngle(A.yaw, B.yaw, t),
      pitch: lerp(A.pitch, B.pitch, t),
      roll: lerp(A.roll, B.roll, t),
      moving: sin,
    };
  }

  /* ---------- 5g. Animation loop ---------- */
  const cur = targetAt(0);
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  const clock = new THREE.Clock();
  const DEG = Math.PI / 180;
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05) || 0.016;
    const t = clock.elapsedTime;
    const p = (window.scrollY || 0) / Math.max(1, window.innerHeight);
    const tgt = targetAt(p);

    const k = 1 - Math.exp(-dt * 3.2);
    const ky = 1 - Math.exp(-dt * 2.6);
    const km = 1 - Math.exp(-dt * 2.0);
    const px = cur.x, py = cur.y;
    cur.x = lerp(cur.x, tgt.x, k);
    cur.y = lerp(cur.y, tgt.y, k);
    cur.s = lerp(cur.s, tgt.s, k);
    cur.pitch = lerp(cur.pitch, tgt.pitch, k);
    cur.roll = lerp(cur.roll, tgt.roll, k);
    cur.yaw = lerpAngle(cur.yaw, tgt.yaw, ky);
    const vx = (cur.x - px) / dt;
    const vy = (cur.y - py) / dt;
    mouse.sx = lerp(mouse.sx, mouse.x, km);
    mouse.sy = lerp(mouse.sy, mouse.y, km);

    const halfH = Math.tan((camera.fov * DEG) / 2) * camera.position.z;
    const halfW = halfH * camera.aspect;
    const hover = Math.sin(t * 2.1) * 0.045 + Math.sin(t * 3.7) * 0.015;
    flight.position.set(
      cur.x * halfW + Math.sin(t * 1.3) * 0.04 + mouse.sx * 0.12,
      cur.y * halfH + hover * halfH * 0.5 + mouse.sy * 0.08,
      Math.sin(t * 0.9) * 0.15
    );
    flight.scale.setScalar(halfH * 2 * 0.30 * cur.s);
    flight.rotation.set(0, -(cur.yaw + mouse.sx * 12) * DEG, 0);

    const pitch = cur.pitch - clamp(vy * 22, -28, 28) + Math.sin(t * 2.1 + 1) * 3 + mouse.sy * 6;
    const roll = cur.roll + clamp(vx * 18, -30, 30) + Math.sin(t * 1.7) * 4;
    beeRoot.rotation.set(roll * DEG, 0, pitch * DEG, "YZX");

    const freq = Math.PI * 2 * (17 + tgt.moving * 5);
    for (let i = 0; i < flaps.length; i++) {
      const fl = flaps[i];
      const a = Math.sin(t * freq + fl.phase);
      fl.group.rotation.x = -0.25 + a * 0.95;
      fl.group.rotation.y = a * 0.18;
    }

    if (loaded) renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}
