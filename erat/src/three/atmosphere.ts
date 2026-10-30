import * as THREE from "three";

/* ================================================================
   ERATHRA ATMOSPHERE — sky dome, cloud sea, aureole, light motes.
   Shared by the home sky, the correspondence page and the library.
   ================================================================ */

export type Tone = "dawn" | "dusk" | "day";

export const TONES: Record<Tone, { zenith: string; horizon: string; sun: string; fog: string; lit: string; shade: string }> = {
  dawn: { zenith: "#c6d5e6", horizon: "#f5e7dd", sun: "#ffe6c8", fog: "#efe6df", lit: "#ffffff", shade: "#e4e8ef" },
  dusk: { zenith: "#aebbd6", horizon: "#f1d3c6", sun: "#ffcfae", fog: "#e7d8d3", lit: "#fff5ef", shade: "#eadfe2" },
  day: { zenith: "#c2d5ea", horizon: "#eef1f3", sun: "#fff6e6", fog: "#e8eef3", lit: "#ffffff", shade: "#e3e9f0" },
};

export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ---------- sky dome ---------- */
export function makeSkyDome(tone: Tone, sunDir = new THREE.Vector3(0, 0.12, -1)) {
  const c = TONES[tone];
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uZenith: { value: new THREE.Color(c.zenith) },
      uHorizon: { value: new THREE.Color(c.horizon) },
      uSun: { value: new THREE.Color(c.sun) },
      uSunDir: { value: sunDir.clone().normalize() },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uSun; uniform vec3 uSunDir;
      varying vec3 vDir;
      void main(){
        vec3 d = normalize(vDir);
        float t = pow(smoothstep(-0.04, 0.8, d.y), 0.85);
        vec3 col = mix(uHorizon, uZenith, t);
        float s = max(dot(d, normalize(uSunDir)), 0.0);
        col += uSun * (pow(s, 28.0) * 0.32 + pow(s, 5.0) * 0.1);
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(400, 48, 24), mat);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return mesh;
}

/* ---------- textures ---------- */
const hexA = (hex: string, a: number) => {
  const c = new THREE.Color(hex);
  return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`;
};

export function glowTexture(color = "#ffffff", size = 128) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const x = cv.getContext("2d")!;
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, hexA(color, 1));
  g.addColorStop(0.25, hexA(color, 0.5));
  g.addColorStop(0.6, hexA(color, 0.12));
  g.addColorStop(1, hexA(color, 0));
  x.fillStyle = g;
  x.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function cloudTexture(seed: number, lit: string, shade: string) {
  const W = 256, H = 160;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const x = cv.getContext("2d")!;
  const r = rng(seed * 977 + 13);
  const blob = (cx: number, cy: number, rad: number, col: string, a: number) => {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, rad);
    g.addColorStop(0, hexA(col, a));
    g.addColorStop(0.55, hexA(col, a * 0.55));
    g.addColorStop(1, hexA(col, 0));
    x.fillStyle = g;
    x.beginPath();
    x.arc(cx, cy, rad, 0, Math.PI * 2);
    x.fill();
  };
  // shaded base, then lit crowns
  for (let i = 0; i < 26; i++) {
    const cx = 34 + r() * (W - 68);
    const edge = 1 - Math.abs(cx - W / 2) / (W / 2);
    blob(cx, 96 + r() * 30, 16 + r() * 34 * (0.4 + edge), shade, 0.6);
  }
  for (let i = 0; i < 30; i++) {
    const cx = 40 + r() * (W - 80);
    const edge = 1 - Math.abs(cx - W / 2) / (W / 2);
    blob(cx, 78 + r() * 26 - edge * 14, 14 + r() * 34 * (0.35 + edge), lit, 0.9);
  }
  // soften the base
  x.globalCompositeOperation = "destination-in";
  const fade = x.createLinearGradient(0, 0, 0, H);
  fade.addColorStop(0, "rgba(0,0,0,1)");
  fade.addColorStop(0.72, "rgba(0,0,0,1)");
  fade.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = fade;
  x.fillRect(0, 0, W, H);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- cloud field (billboarded, instanced, depth-sorted) ---------- */
export type Box = { x: [number, number]; y: [number, number]; z: [number, number] };

export function makeClouds(opts: {
  count: number;
  tone: Tone;
  box: Box;
  scale: [number, number];
  opacity?: number;
  drift?: number;
  seed?: number;
}) {
  const c = TONES[opts.tone];
  const r = rng(opts.seed ?? 7);
  const group = new THREE.Group();
  const VARIANTS = 3;
  const geo = new THREE.PlaneGeometry(1, 0.625);
  const meshes: THREE.InstancedMesh[] = [];
  const items: { m: number; i: number; p: THREE.Vector3; s: number; v: number }[] = [];
  const disposables: { dispose: () => void }[] = [geo];
  const per = Math.ceil(opts.count / VARIANTS);
  for (let v = 0; v < VARIANTS; v++) {
    const tex = cloudTexture((opts.seed ?? 7) * 10 + v, c.lit, c.shade);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: opts.opacity ?? 1, fog: true });
    const mesh = new THREE.InstancedMesh(geo, mat, per);
    mesh.frustumCulled = false;
    meshes.push(mesh);
    group.add(mesh);
    disposables.push(tex, mat);
    for (let i = 0; i < per; i++) {
      const p = new THREE.Vector3(
        opts.box.x[0] + r() * (opts.box.x[1] - opts.box.x[0]),
        opts.box.y[0] + r() * (opts.box.y[1] - opts.box.y[0]),
        opts.box.z[0] + r() * (opts.box.z[1] - opts.box.z[0])
      );
      items.push({ m: v, i, p, s: opts.scale[0] + r() * (opts.scale[1] - opts.scale[0]), v: (0.4 + r() * 0.8) * (opts.drift ?? 0.6) });
    }
  }
  const dummy = new THREE.Object3D();
  const width = opts.box.x[1] - opts.box.x[0];
  let frame = 0;
  const order = new Map<number, typeof items>();

  const update = (camera: THREE.Camera, dt: number) => {
    for (const it of items) {
      it.p.x += it.v * dt;
      if (it.p.x > opts.box.x[1]) it.p.x -= width;
    }
    // sort back-to-front every few frames (per variant mesh)
    if (frame++ % 20 === 0) {
      order.clear();
      for (let v = 0; v < VARIANTS; v++) order.set(v, items.filter((x) => x.m === v));
      order.forEach((list) => list.sort((a, b) => b.p.distanceToSquared(camera.position) - a.p.distanceToSquared(camera.position)));
    }
    order.forEach((list, v) => {
      const mesh = meshes[v];
      list.forEach((it, k) => {
        dummy.position.copy(it.p);
        dummy.quaternion.copy(camera.quaternion);
        dummy.scale.set(it.s, it.s, it.s);
        dummy.updateMatrix();
        mesh.setMatrixAt(k, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });
  };
  return { group, update, dispose: () => disposables.forEach((d) => d.dispose()) };
}

/* ---------- aureole (the halo) ---------- */
export function makeAureole(radius: number, color = "#fff2dc") {
  const group = new THREE.Group();
  const ringMat = new THREE.MeshBasicMaterial({ color, toneMapped: false, fog: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, radius * 0.0085, 16, 256), ringMat);
  const fineMat = new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true, opacity: 0.45, fog: false });
  const fine = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.1, radius * 0.0022, 8, 256), fineMat);
  const glowTex = glowTexture(color);
  const glowMat = new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.2, depthWrite: false, fog: false });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.setScalar(radius * 3.4);
  glow.position.z = -0.5;
  group.add(glow, ring, fine);
  return {
    group,
    ring,
    fine,
    dispose: () => {
      ring.geometry.dispose();
      fine.geometry.dispose();
      ringMat.dispose();
      fineMat.dispose();
      glowTex.dispose();
      glowMat.dispose();
    },
  };
}

/* ---------- pearl ---------- */
export function pearlMaterial(color = "#f6efe9") {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    iridescence: 1,
    iridescenceIOR: 1.55,
    iridescenceThicknessRange: [200, 760],
    sheen: 0.5,
    sheenColor: new THREE.Color("#ffe3d4"),
  });
}

/* ---------- light motes ---------- */
export function makeMotes(count: number, box: Box, color = "#fff1d6", size = 0.09) {
  const r = rng(91);
  const pos = new Float32Array(count * 3);
  const speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = box.x[0] + r() * (box.x[1] - box.x[0]);
    pos[i * 3 + 1] = box.y[0] + r() * (box.y[1] - box.y[0]);
    pos[i * 3 + 2] = box.z[0] + r() * (box.z[1] - box.z[0]);
    speed[i] = 0.08 + r() * 0.25;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const tex = glowTexture(color, 64);
  const mat = new THREE.PointsMaterial({ size, map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color, sizeAttenuation: true, opacity: 0.9 });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const update = (dt: number, t: number, yOffset = 0) => {
    const a = geo.attributes.position as THREE.BufferAttribute;
    const lo = box.y[0] + yOffset, hi = box.y[1] + yOffset;
    for (let i = 0; i < count; i++) {
      let y = a.getY(i) + speed[i] * dt;
      if (y > hi) y = lo;
      if (y < lo) y = lo + r() * (hi - lo);
      a.setY(i, y);
      a.setX(i, a.getX(i) + Math.sin(t * 0.4 + i) * 0.002);
    }
    a.needsUpdate = true;
  };
  return { points, update, dispose: () => (geo.dispose(), mat.dispose(), tex.dispose()) };
}

/** canvas card texture for any text-only piece */
export function labelTexture(lines: { text: string; font: string; color: string; y: number }[], bg: string, w = 600, h = 800) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const x = cv.getContext("2d")!;
  x.fillStyle = bg;
  x.fillRect(0, 0, w, h);
  lines.forEach((l) => {
    x.fillStyle = l.color;
    x.font = l.font;
    x.fillText(l.text, 36, l.y);
  });
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
