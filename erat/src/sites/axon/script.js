(function () {
  var THREE = window.THREE;
  Array.prototype.slice.call(document.querySelectorAll('a[href="#"]')).forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });
  var chips = Array.prototype.slice.call(document.querySelectorAll("#tags .chip"));
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      chips.forEach(function (x) { x.classList.toggle("on", x === c); });
    });
  });
  Array.prototype.slice.call(document.querySelectorAll("video")).forEach(function (v) {
    v.play().catch(function () {});
  });
  if (!THREE) return;

  var canvas = document.getElementById("bg");
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, powerPreference: "high-performance" });
  } catch (e) { return; }
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 1);
  renderer.autoClear = false;

  var isFloat = renderer.capabilities.isWebGL2 || !!renderer.extensions.get("OES_texture_float");
  var isHalf = renderer.capabilities.isWebGL2 || !!renderer.extensions.get("OES_texture_half_float");
  var floatType = isFloat ? THREE.FloatType : (isHalf ? THREE.HalfFloatType : THREE.UnsignedByteType);
  var halfType = isHalf ? THREE.HalfFloatType : floatType;

  /* ---------- 64×64 soft spherical matcap ---------- */
  function makeMatcap() {
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var x = c.getContext("2d");
    var g = x.createRadialGradient(24, 22, 2, 32, 32, 32);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.35, "#cfcfd6");
    g.addColorStop(0.75, "#5c5c66");
    g.addColorStop(1, "#141418");
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    var t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }
  var matcap = makeMatcap();

  /* ---------- fullscreen pass helper ---------- */
  var fsScene = new THREE.Scene();
  var fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  var fsQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial());
  fsScene.add(fsQuad);
  function runPass(mat, target) {
    fsQuad.material = mat;
    renderer.setRenderTarget(target);
    renderer.render(fsScene, fsCam);
  }
  function makeRT(w, h, type, filter) {
    return new THREE.WebGLRenderTarget(w, h, {
      minFilter: filter || THREE.LinearFilter,
      magFilter: filter || THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: type,
      depthBuffer: false,
      stencilBuffer: false,
    });
  }
  function makeFBO(w, h, type, filter) {
    return {
      read: makeRT(w, h, type, filter),
      write: makeRT(w, h, type, filter),
      swap: function () { var t = this.read; this.read = this.write; this.write = t; },
    };
  }

  var QUAD_VERT = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";

  /* ---------- 8. Fluid simulation ---------- */
  var SIM = 256, DYE = 512;
  var texelSim = new THREE.Vector2(1 / SIM, 1 / SIM);
  var texelDye = new THREE.Vector2(1 / DYE, 1 / DYE);
  var velocity = makeFBO(SIM, SIM, halfType, THREE.LinearFilter);
  var density = makeFBO(DYE, DYE, halfType, THREE.LinearFilter);
  var pressure = makeFBO(SIM, SIM, halfType, THREE.NearestFilter);
  var divRT = makeRT(SIM, SIM, halfType, THREE.NearestFilter);
  var curlRT = makeRT(SIM, SIM, halfType, THREE.NearestFilter);

  var splatMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    uniforms: {
      uTarget: { value: null }, uA: { value: new THREE.Vector2(0.5, 0.5) }, uB: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: new THREE.Vector3() }, uRadius: { value: 0.05 }, uAspect: { value: 1 }, uDiss: { value: 1 },
    },
    fragmentShader: [
      "precision highp float; varying vec2 vUv;",
      "uniform sampler2D uTarget; uniform vec2 uA, uB; uniform vec3 uColor; uniform float uRadius, uAspect, uDiss;",
      "void main(){",
      "  vec4 base = texture2D(uTarget, vUv) * uDiss;",
      "  vec2 pa = vUv - uA, ba = uB - uA;",
      "  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);",
      "  vec2 d = pa - ba * h; d.x *= uAspect;",
      "  float s = exp(-dot(d, d) / max(uRadius * uRadius, 1e-6));",
      "  gl_FragColor = vec4(base.rgb + uColor * s, 1.0);",
      "}",
    ].join("\n"),
  });

  var curlMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    uniforms: { uVel: { value: null }, texel: { value: texelSim } },
    fragmentShader: [
      "precision highp float; varying vec2 vUv; uniform sampler2D uVel; uniform vec2 texel;",
      "void main(){",
      "  float L = texture2D(uVel, vUv - vec2(texel.x, 0.0)).y;",
      "  float R = texture2D(uVel, vUv + vec2(texel.x, 0.0)).y;",
      "  float T = texture2D(uVel, vUv + vec2(0.0, texel.y)).x;",
      "  float B = texture2D(uVel, vUv - vec2(0.0, texel.y)).x;",
      "  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);",
      "}",
    ].join("\n"),
  });

  var vortMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    uniforms: { uVel: { value: null }, uCurl: { value: null }, texel: { value: texelSim }, curl: { value: 30 }, dt: { value: 1 / 60 } },
    fragmentShader: [
      "precision highp float; varying vec2 vUv; uniform sampler2D uVel, uCurl; uniform vec2 texel; uniform float curl, dt;",
      "void main(){",
      "  float L = texture2D(uCurl, vUv - vec2(texel.x, 0.0)).x;",
      "  float R = texture2D(uCurl, vUv + vec2(texel.x, 0.0)).x;",
      "  float T = texture2D(uCurl, vUv + vec2(0.0, texel.y)).x;",
      "  float B = texture2D(uCurl, vUv - vec2(0.0, texel.y)).x;",
      "  float C = texture2D(uCurl, vUv).x;",
      "  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));",
      "  f /= length(f) + 0.0001; f *= curl * C; f.y *= -1.0;",
      "  vec2 v = texture2D(uVel, vUv).xy;",
      "  gl_FragColor = vec4(v + f * dt, 0.0, 1.0);",
      "}",
    ].join("\n"),
  });

  var divMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    uniforms: { uVel: { value: null }, texel: { value: texelSim } },
    fragmentShader: [
      "precision highp float; varying vec2 vUv; uniform sampler2D uVel; uniform vec2 texel;",
      "void main(){",
      "  float L = texture2D(uVel, vUv - vec2(texel.x, 0.0)).x;",
      "  float R = texture2D(uVel, vUv + vec2(texel.x, 0.0)).x;",
      "  float T = texture2D(uVel, vUv + vec2(0.0, texel.y)).y;",
      "  float B = texture2D(uVel, vUv - vec2(0.0, texel.y)).y;",
      "  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);",
      "}",
    ].join("\n"),
  });

  var clearMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    uniforms: { uTex: { value: null }, diss: { value: 0.95 } },
    fragmentShader: "precision highp float; varying vec2 vUv; uniform sampler2D uTex; uniform float diss; void main(){ gl_FragColor = texture2D(uTex, vUv) * diss; }",
  });

  var pressMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    uniforms: { uPress: { value: null }, uDiv: { value: null }, texel: { value: texelSim } },
    fragmentShader: [
      "precision highp float; varying vec2 vUv; uniform sampler2D uPress, uDiv; uniform vec2 texel;",
      "void main(){",
      "  float L = texture2D(uPress, vUv - vec2(texel.x, 0.0)).x;",
      "  float R = texture2D(uPress, vUv + vec2(texel.x, 0.0)).x;",
      "  float T = texture2D(uPress, vUv + vec2(0.0, texel.y)).x;",
      "  float B = texture2D(uPress, vUv - vec2(0.0, texel.y)).x;",
      "  float d = texture2D(uDiv, vUv).x;",
      "  gl_FragColor = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);",
      "}",
    ].join("\n"),
  });

  var gradMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    uniforms: { uPress: { value: null }, uVel: { value: null }, texel: { value: texelSim } },
    fragmentShader: [
      "precision highp float; varying vec2 vUv; uniform sampler2D uPress, uVel; uniform vec2 texel;",
      "void main(){",
      "  float L = texture2D(uPress, vUv - vec2(texel.x, 0.0)).x;",
      "  float R = texture2D(uPress, vUv + vec2(texel.x, 0.0)).x;",
      "  float T = texture2D(uPress, vUv + vec2(0.0, texel.y)).x;",
      "  float B = texture2D(uPress, vUv - vec2(0.0, texel.y)).x;",
      "  vec2 v = texture2D(uVel, vUv).xy - vec2(R - L, T - B);",
      "  gl_FragColor = vec4(v, 0.0, 1.0);",
      "}",
    ].join("\n"),
  });

  var advectMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    uniforms: { uVel: { value: null }, uSrc: { value: null }, texel: { value: texelSim }, dt: { value: 1 / 60 }, diss: { value: 0.98 } },
    fragmentShader: [
      "precision highp float; varying vec2 vUv; uniform sampler2D uVel, uSrc; uniform vec2 texel; uniform float dt, diss;",
      "void main(){",
      "  vec2 coord = vUv - dt * texture2D(uVel, vUv).xy * texel;",
      "  gl_FragColor = diss * texture2D(uSrc, coord);",
      "}",
    ].join("\n"),
  });

  var pointer = { x: 0, y: 0, px: 0, py: 0, nx: 0, ny: 0, lastT: 0, moved: false };
  function onPointer(cx, cy) {
    var now = performance.now();
    var w = window.innerWidth, h = window.innerHeight;
    var ux = cx / w, uy = 1 - cy / h;
    if (now - pointer.lastT > 50) { pointer.px = cx; pointer.py = cy; }
    else { pointer.px = pointer.x; pointer.py = pointer.y; }
    pointer.x = cx; pointer.y = cy;
    pointer.nx = (cx / w) * 2 - 1;
    pointer.ny = (cy / h) * 2 - 1;
    pointer.lastT = now;
    pointer.moved = true;
    void ux; void uy;
  }
  window.addEventListener("pointermove", function (e) { onPointer(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener("touchstart", function (e) { if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  window.addEventListener("touchmove", function (e) { if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });

  function stepFluid() {
    var w = window.innerWidth, h = window.innerHeight;
    var aspect = w / Math.max(1, h);
    if (pointer.moved) {
      pointer.moved = false;
      var dx = pointer.x - pointer.px, dy = pointer.y - pointer.py;
      var len = Math.hypot(dx, dy);
      if (len > 0.01) {
        var mob = w < 760 ? 0.8 : 1.0;
        var radPx = Math.min(1, len / 5) * 60 * 0.6 * mob;
        var mult = Math.min(1, len / 15) * 10;
        var a = new THREE.Vector2(pointer.px / w, 1 - pointer.py / h);
        var b = new THREE.Vector2(pointer.x / w, 1 - pointer.y / h);
        splatMat.uniforms.uA.value.copy(a);
        splatMat.uniforms.uB.value.copy(b);
        splatMat.uniforms.uRadius.value = Math.max(0.008, radPx / 200);
        splatMat.uniforms.uAspect.value = aspect;
        splatMat.uniforms.uDiss.value = 1.0;

        splatMat.uniforms.uTarget.value = velocity.read.texture;
        splatMat.uniforms.uColor.value.set((dx / w) * mult * 60, (-dy / h) * mult * 60, 0);
        runPass(splatMat, velocity.write);
        velocity.swap();

        splatMat.uniforms.uTarget.value = density.read.texture;
        splatMat.uniforms.uColor.value.set(1, 1, 1);
        runPass(splatMat, density.write);
        density.swap();
      }
    }

    curlMat.uniforms.uVel.value = velocity.read.texture;
    runPass(curlMat, curlRT);

    vortMat.uniforms.uVel.value = velocity.read.texture;
    vortMat.uniforms.uCurl.value = curlRT.texture;
    runPass(vortMat, velocity.write);
    velocity.swap();

    divMat.uniforms.uVel.value = velocity.read.texture;
    runPass(divMat, divRT);

    clearMat.uniforms.uTex.value = pressure.read.texture;
    clearMat.uniforms.diss.value = 0.95;
    runPass(clearMat, pressure.write);
    pressure.swap();

    pressMat.uniforms.uDiv.value = divRT.texture;
    for (var i = 0; i < 5; i++) {
      pressMat.uniforms.uPress.value = pressure.read.texture;
      runPass(pressMat, pressure.write);
      pressure.swap();
    }

    gradMat.uniforms.uPress.value = pressure.read.texture;
    gradMat.uniforms.uVel.value = velocity.read.texture;
    runPass(gradMat, velocity.write);
    velocity.swap();

    advectMat.uniforms.uVel.value = velocity.read.texture;
    advectMat.uniforms.uSrc.value = velocity.read.texture;
    advectMat.uniforms.texel.value = texelSim;
    advectMat.uniforms.diss.value = 0.98;
    runPass(advectMat, velocity.write);
    velocity.swap();

    advectMat.uniforms.uSrc.value = density.read.texture;
    advectMat.uniforms.texel.value = texelDye;
    advectMat.uniforms.diss.value = 0.97;
    runPass(advectMat, density.write);
    density.swap();
  }

  /* ---------- 7. Particle system ---------- */
  var mobile = window.innerWidth < 760;
  var PSIZE = (mobile || !isFloat) ? 128 : 512;
  var COUNT = PSIZE * PSIZE;

  function seedTex() {
    var data = new Float32Array(COUNT * 4);
    var s = 1337;
    var rnd = function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    for (var i = 0; i < COUNT; i++) {
      // points near a twisted ring so initial settle is fast and dense
      var a = rnd() * Math.PI * 2;
      var b = rnd() * Math.PI * 2;
      var R = 0.34 + (rnd() - 0.5) * 0.16;
      var r = 0.13 + (rnd() - 0.5) * 0.1;
      data[i * 4] = (R + r * Math.cos(b)) * Math.cos(a) + (rnd() - 0.5) * 0.25;
      data[i * 4 + 1] = (R + r * Math.cos(b)) * Math.sin(a) + (rnd() - 0.5) * 0.25;
      data[i * 4 + 2] = r * Math.sin(b) + 0.08 * Math.sin(2 * a) + (rnd() - 0.5) * 0.25;
      data[i * 4 + 3] = 1;
    }
    var t = new THREE.DataTexture(data, PSIZE, PSIZE, THREE.RGBAFormat, THREE.FloatType);
    t.needsUpdate = true;
    return t;
  }

  var originTex = seedTex();
  var posFBO = makeFBO(PSIZE, PSIZE, floatType, THREE.NearestFilter);
  // copy origin into both targets
  var initMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    uniforms: { uTex: { value: originTex } },
    fragmentShader: "precision highp float; varying vec2 vUv; uniform sampler2D uTex; void main(){ gl_FragColor = texture2D(uTex, vUv); }",
  });
  runPass(initMat, posFBO.read);
  runPass(initMat, posFBO.write);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, window.innerWidth / Math.max(1, window.innerHeight), 0.1, 1000);
  var baseCam = new THREE.Vector3(-1.17, 0, 6);
  camera.position.copy(baseCam);
  camera.lookAt(0, 0, 0);

  var group = new THREE.Group();
  var DEG = Math.PI / 180;
  group.position.set(0.343, 0.16, -1);
  group.rotation.set(-28.4 * DEG, 390 * DEG, 4.92 * DEG);
  group.scale.set(5, 5, 6);
  scene.add(group);
  group.updateMatrixWorld(true);

  var projView = new THREE.Matrix4();
  var camRot = new THREE.Matrix3();

  var simMat = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    uniforms: {
      uPos: { value: posFBO.read.texture },
      uOrigin: { value: originTex },
      uVel: { value: velocity.read.texture },
      uDens: { value: density.read.texture },
      uTime: { value: 0 },
      uHZ: { value: 1 },
      uProjView: { value: projView },
      uModel: { value: group.matrixWorld },
      uCamRot: { value: camRot },
    },
    fragmentShader: [
      "precision highp float; varying vec2 vUv;",
      "uniform sampler2D uPos, uOrigin, uVel, uDens;",
      "uniform float uTime, uHZ;",
      "uniform mat4 uProjView, uModel;",
      "uniform mat3 uCamRot;",
      "vec3 qrot(vec3 v, vec4 q){ return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }",
      "float sdfShape(vec3 p){",
      "  p.z = sqrt(p.z * p.z + 0.0215) - sqrt(0.012);",
      "  p = qrot(p, vec4(0.5, 0.5, 0.5, 0.5));",
      "  float len = length(p);",
      "  if (len > 0.85) return len - 0.7;",
      "  float ang = atan(p.y, p.x);",
      "  float R = 0.34 + 0.055 * sin(2.0 * ang) + 0.03 * cos(3.0 * ang);",
      "  vec2 d = vec2(length(p.xy) - R, p.z - 0.045 * sin(2.0 * ang));",
      "  float r = 0.135 + 0.03 * cos(ang - 1.1);",
      "  float g = sin(p.x * 7.5) * cos(p.y * 7.5) * sin(p.z * 7.5) * 0.018;",
      "  return length(d) - r + g;",
      "}",
      "vec3 sdfNormal(vec3 p){",
      "  float e = 0.001;",
      "  return normalize(vec3(",
      "    sdfShape(p + vec3(e,0,0)) - sdfShape(p - vec3(e,0,0)),",
      "    sdfShape(p + vec3(0,e,0)) - sdfShape(p - vec3(0,e,0)),",
      "    sdfShape(p + vec3(0,0,e)) - sdfShape(p - vec3(0,0,e))",
      "  ));",
      "}",
      "vec3 pot(vec3 p){",
      "  return vec3(",
      "    sin(p.y * 6.0 + p.z * 4.0) + cos(p.z * 5.0 - p.x * 3.0),",
      "    sin(p.z * 6.0 + p.x * 4.0) + cos(p.x * 5.0 - p.y * 3.0),",
      "    sin(p.x * 6.0 + p.y * 4.0) + cos(p.y * 5.0 - p.z * 3.0)",
      "  );",
      "}",
      "vec3 curlNoise(vec3 p){",
      "  float e = 0.01;",
      "  vec3 dx = pot(p + vec3(e,0,0)) - pot(p - vec3(e,0,0));",
      "  vec3 dy = pot(p + vec3(0,e,0)) - pot(p - vec3(0,e,0));",
      "  vec3 dz = pot(p + vec3(0,0,e)) - pot(p - vec3(0,0,e));",
      "  return normalize(vec3(dy.z - dz.y, dz.x - dx.z, dx.y - dy.x) + 1e-5);",
      "}",
      "void main(){",
      "  vec3 pos = texture2D(uPos, vUv).xyz;",
      "  vec3 origin = texture2D(uOrigin, vUv).xyz;",
      "  if (length(pos) > 0.7) pos *= 0.5;",
      "  pos += curlNoise(pos * 0.1 + uTime * 0.05) * 0.0002 * uHZ;",
      "  vec3 grad = sdfNormal(pos);",
      "  float sdf = sdfShape(pos);",
      "  pos += cross(normalize(pos + 1e-5), grad) * 0.0005;",
      "  pos += -grad * sdf * 0.5;",
      "  pos += (origin - pos) * 0.0002 * uHZ;",
      "  vec4 clip = uProjView * (uModel * vec4(pos, 1.0));",
      "  vec2 suv = (clip.xy / max(clip.w, 1e-4)) * 0.5 + 0.5;",
      "  vec2 fv = texture2D(uVel, suv).xy;",
      "  float fd = texture2D(uDens, suv).r;",
      "  vec3 flow = uCamRot * vec3(fv, 0.0);",
      "  pos += flow * 0.004 * uHZ * 0.4 * fd;",
      "  gl_FragColor = vec4(pos, 1.0);",
      "}",
    ].join("\n"),
  });

  // point geometry
  var pGeo = new THREE.BufferGeometry();
  var uvs = new Float32Array(COUNT * 3);
  var rndA = new Float32Array(COUNT * 4);
  var s2 = 4242;
  var r2 = function () { s2 = (s2 * 16807) % 2147483647; return (s2 - 1) / 2147483646; };
  for (var i = 0; i < COUNT; i++) {
    uvs[i * 3] = ((i % PSIZE) + 0.5) / PSIZE;
    uvs[i * 3 + 1] = (Math.floor(i / PSIZE) + 0.5) / PSIZE;
    uvs[i * 3 + 2] = 0;
    rndA[i * 4] = r2();
    rndA[i * 4 + 1] = r2();
    rndA[i * 4 + 2] = r2();
    rndA[i * 4 + 3] = r2();
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(uvs, 3));
  pGeo.setAttribute("random", new THREE.BufferAttribute(rndA, 4));

  var pMat = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPos: { value: posFBO.read.texture },
      uMatcap: { value: matcap },
      uTime: { value: 0 },
      uDPR: { value: DPR },
    },
    vertexShader: [
      "precision highp float;",
      "attribute vec4 random;",
      "uniform sampler2D uPos;",
      "uniform float uTime, uDPR;",
      "varying vec4 vRnd;",
      "varying float vScale;",
      "void main(){",
      "  vRnd = random;",
      "  vec3 pos = texture2D(uPos, position.xy).xyz;",
      "  pos *= mix(1.0, 1.5, pow(random.y, 150.0));",
      "  vec4 mv = modelViewMatrix * vec4(pos, 1.0);",
      "  float dist = -mv.z;",
      "  vScale = smoothstep(3.0, 15.0, dist) * mix(0.5, 1.0, random.z);",
      "  gl_PointSize = 0.04 * uDPR * 2.0 * vScale * (1000.0 / max(dist, 0.1));",
      "  gl_Position = projectionMatrix * mv;",
      "}",
    ].join("\n"),
    fragmentShader: [
      "precision highp float;",
      "uniform sampler2D uMatcap;",
      "uniform float uTime;",
      "varying vec4 vRnd;",
      "varying float vScale;",
      "void main(){",
      "  if (vScale < 0.1) discard;",
      "  vec2 c = gl_PointCoord - 0.5;",
      "  if (dot(c, c) > 0.25) discard;",
      "  float a = sin(uTime + vRnd.z * 20.0) * 0.5 + 1.0;",
      "  float cs = cos(a), sn = sin(a);",
      "  vec2 ruv = vec2(cs * c.x - sn * c.y, sn * c.x + cs * c.y) + 0.5;",
      "  vec3 mc = texture2D(uMatcap, ruv).rgb;",
      "  vec3 base = vec3(mix(0.04, 0.22, vRnd.x));",
      "  base = mix(base, vec3(0.6, 0.45, 1.0), pow(vRnd.z, 100.0));",
      "  float sp = 0.5 + (0.4 + sin(uTime * 4.0 + vRnd.y * 20.0)) * pow(vRnd.z, 10.0) * 2.5;",
      "  vec3 sl = (1.0 - 2.0 * mc) * base * base + 2.0 * mc * base;",
      "  vec3 ov = mix(2.0 * base * mc, 1.0 - 2.0 * (1.0 - base) * (1.0 - mc), step(0.5, base));",
      "  vec3 col = (mix(base, sl, 0.8) * 0.8 + ov * 0.2) * sp;",
      "  gl_FragColor = vec4(col, 1.0);",
      "}",
    ].join("\n"),
  });

  var points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false;
  group.add(points);

  window.addEventListener("resize", function () {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
    camera.updateProjectionMatrix();
  });

  /* ---------- main loop ---------- */
  var last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    var dt = Math.min(0.05, (now - last) / 1000) || 1 / 60;
    last = now;
    var t = now / 1000;

    // gaze camera
    var tx = baseCam.x + pointer.nx * -1.0;
    var ty = baseCam.y + pointer.ny * 2.0;
    camera.position.x += (tx - camera.position.x) * 0.05;
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();

    projView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    camRot.setFromMatrix4(camera.matrixWorld);

    stepFluid();

    simMat.uniforms.uPos.value = posFBO.read.texture;
    simMat.uniforms.uVel.value = velocity.read.texture;
    simMat.uniforms.uDens.value = density.read.texture;
    simMat.uniforms.uTime.value = t;
    simMat.uniforms.uHZ.value = dt * 60;
    runPass(simMat, posFBO.write);
    posFBO.swap();

    pMat.uniforms.uPos.value = posFBO.read.texture;
    pMat.uniforms.uTime.value = t;

    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(scene, camera);
  })(last);
})();
