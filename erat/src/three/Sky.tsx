import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { TONES, makeAureole, makeClouds, makeMotes, makeSkyDome, glowTexture, pearlMaterial, type Tone } from "./atmosphere";

/**
 * The Erathra sky — a live scene above a sea of clouds:
 * a vast aureole, an iridescent pearl held in an orrery, drifting light motes.
 * The camera rises out of the clouds on mount.
 */
export default function Sky({
  tone = "dawn",
  offset = 0,
  ascend = true,
  className = "",
  onReady,
}: {
  tone?: Tone;
  /** horizontal offset of the aureole (−1 … 1, fraction of half the view) */
  offset?: number;
  ascend?: boolean;
  className?: string;
  onReady?: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const ready = useRef(onReady);
  ready.current = onReady;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const mobile = window.innerWidth < 760;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !mobile, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });

    const T = TONES[tone];
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(T.fog, 24, 170);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;

    const sunDir = new THREE.Vector3(0.36, 0.06, -1);
    const dome = makeSkyDome(tone, sunDir);
    scene.add(dome);

    const camera = new THREE.PerspectiveCamera(mobile ? 56 : 38, 1, 0.1, 900);

    scene.add(new THREE.HemisphereLight("#ffffff", T.shade, 1.1));
    const sun = new THREE.DirectionalLight(T.sun, 2.2);
    sun.position.set(2, 3, -6);
    scene.add(sun);
    const front = new THREE.DirectionalLight("#ffffff", 0.9);
    front.position.set(-2, 3, 6);
    scene.add(front);

    // the sun, low behind the aureole
    const sunTex = glowTexture(T.sun, 256);
    const sunMat = new THREE.SpriteMaterial({ map: sunTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.42, depthWrite: false, fog: false });
    const sunSprite = new THREE.Sprite(sunMat);
    sunSprite.position.set(70, 4, -190);
    sunSprite.scale.setScalar(120);
    scene.add(sunSprite);

    // clouds: far banks, the main sea, and near wisps for parallax
    const far = makeClouds({ count: mobile ? 18 : 36, tone, box: { x: [-220, 220], y: [-4, 8], z: [-190, -130] }, scale: [36, 70], drift: 0.6, seed: 3 });
    const sea = makeClouds({ count: mobile ? 110 : 240, tone, box: { x: [-110, 110], y: [-2.6, 0.2], z: [-130, 4] }, scale: [9, 24], drift: 0.45, seed: 11 });
    const near = makeClouds({ count: mobile ? 12 : 26, tone, box: { x: [-30, 30], y: [-5.2, -3.0], z: [-16, 4] }, scale: [7, 12], drift: 0.25, seed: 29, opacity: 0.7 });
    scene.add(far.group, sea.group, near.group);

    // aureole + pearl + orrery
    const view = mobile ? 0 : offset;
    const center = new THREE.Vector3(view * 7.5, 3.1, -20);
    const halo = makeAureole(5.2, "#e9c98a");
    halo.group.position.copy(center);
    scene.add(halo.group);

    const pearlGeo = new THREE.SphereGeometry(1.25, 96, 64);
    const pearlMat = pearlMaterial();
    const pearl = new THREE.Mesh(pearlGeo, pearlMat);
    pearl.position.copy(center);
    scene.add(pearl);

    const orrery = new THREE.Group();
    orrery.position.copy(center);
    scene.add(orrery);
    const lineMat = new THREE.LineBasicMaterial({ color: "#14151b", transparent: true, opacity: 0.2 });
    const moonGeo = new THREE.SphereGeometry(0.075, 24, 16);
    const moonMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.4, emissive: "#fff3df", emissiveIntensity: 0.5 });
    const rings = [
      { a: 2.1, b: 0.62, rx: 1.25, rz: 0.18, sp: 0.42 },
      { a: 2.9, b: 0.95, rx: 1.12, rz: -0.32, sp: -0.28 },
      { a: 3.7, b: 1.25, rx: 1.38, rz: 0.52, sp: 0.18 },
    ].map((r) => {
      const curve = new THREE.EllipseCurve(0, 0, r.a, r.b, 0, Math.PI * 2, false, 0);
      const pts = curve.getPoints(160).map((p) => new THREE.Vector3(p.x, p.y, 0));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.LineLoop(geo, lineMat);
      const holder = new THREE.Group();
      holder.rotation.set(r.rx, 0, r.rz);
      const moon = new THREE.Mesh(moonGeo, moonMat);
      holder.add(line, moon);
      orrery.add(holder);
      return { ...r, geo, moon };
    });

    const motes = makeMotes(mobile ? 120 : 280, { x: [-14, 14], y: [-1, 9], z: [-26, 4] }, "#fff0d4", mobile ? 0.12 : 0.09);
    scene.add(motes.points);

    // sizing & visibility
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const clock = new THREE.Clock();
    let first = true;
    const look = new THREE.Vector3();
    renderer.setAnimationLoop(() => {
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.elapsedTime;
      mouse.sx += (mouse.x - mouse.sx) * 0.03;
      mouse.sy += (mouse.y - mouse.sy) * 0.03;

      // ascent out of the clouds
      const p = ascend ? Math.min(1, t / 4.2) : 1;
      const e = 1 - Math.pow(1 - p, 3);
      const camY = THREE.MathUtils.lerp(-2.2, 2.2, e) + Math.sin(t * 0.35) * 0.06;
      const camZ = THREE.MathUtils.lerp(11, 7, e);
      camera.position.set(mouse.sx * 1.4 + view * 1.5, camY + mouse.sy * 0.45, camZ);
      look.set(center.x * 0.55 + mouse.sx * 0.5, 2.7 + mouse.sy * 0.2, center.z);
      camera.lookAt(look);
      dome.position.copy(camera.position);

      // the aureole breathes and leans toward the cursor
      halo.group.rotation.y = Math.sin(t * 0.12) * 0.32 + mouse.sx * 0.18;
      halo.group.rotation.x = 0.06 - mouse.sy * 0.1;
      halo.fine.rotation.z = t * 0.05;
      pearl.position.y = center.y + Math.sin(t * 0.8) * 0.12;
      pearl.rotation.y = t * 0.15;
      orrery.position.y = pearl.position.y;
      rings.forEach((r, i) => {
        const a = t * r.sp + i * 2.1;
        r.moon.position.set(Math.cos(a) * r.a, Math.sin(a) * r.b, 0);
      });

      far.update(camera, dt);
      sea.update(camera, dt);
      near.update(camera, dt);
      motes.update(dt, t);
      renderer.render(scene, camera);
      if (first) {
        first = false;
        ready.current?.();
      }
    });

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      [far, sea, near, halo, motes].forEach((x) => x.dispose());
      rings.forEach((r) => r.geo.dispose());
      [pearlGeo, pearlMat, lineMat, moonGeo, moonMat, sunTex, sunMat, dome.geometry, dome.material as THREE.Material].forEach((d) => d.dispose());
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      el.removeChild(renderer.domElement);
    };
  }, [tone, offset, ascend]);

  if (failed) {
    return <div className={"absolute inset-0 bg-sky " + className} />;
  }
  return <div ref={host} className={"absolute inset-0 " + className} />;
}
