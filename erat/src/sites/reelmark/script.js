(function () {
  var VIDEO = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/04fd3d5f-99d7-476e-98a4-46c08518ffb3.mp4";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var N = 10, PITCH = 196, SPAN = N * PITCH;
  var rail = document.getElementById("rail"), frame = document.getElementById("frame");

  Array.prototype.slice.call(document.querySelectorAll('a[href="#"]')).forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* ---------- build the 10 cards ---------- */
  var cards = [], videos = [];
  for (var i = 0; i < N; i++) {
    var el = document.createElement("div");
    el.className = "card";
    var poster = document.createElement("div");
    poster.className = "tile poster";
    el.appendChild(poster);
    var v = null;
    if (!reduce) {
      v = document.createElement("video");
      v.className = "tile";
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "auto";
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.src = VIDEO;
      (function (vid) {
        vid.addEventListener("loadeddata", function () { vid.classList.add("ready"); }, { once: true });
        vid.addEventListener("playing", function () { vid.classList.add("ready"); }, { once: true });
      })(v);
      el.appendChild(v);
      videos.push(v);
    }
    var play = document.createElement("span");
    play.className = "play";
    play.innerHTML = '<svg viewBox="0 0 12 12" fill="currentColor"><path d="M2.5 1.5 10.5 6 2.5 10.5Z"/></svg>';
    el.appendChild(play);
    rail.appendChild(el);
    cards.push({ el: el, poster: poster, video: v, col: i % 5, row: Math.floor(i / 5) });
  }

  // start all ten videos and keep them on the same timestamp
  if (videos.length) {
    videos.forEach(function (v) { v.play().catch(function () {}); });
    setInterval(function () {
      var master = videos[0];
      if (!master || master.paused || !master.readyState) return;
      var t = master.currentTime;
      for (var k = 1; k < videos.length; k++) {
        if (Math.abs(videos[k].currentTime - t) > 0.12) {
          try { videos[k].currentTime = t; } catch (e) {}
        }
      }
    }, 1000);
  }

  /* ---------- rounded-quad clip path ---------- */
  function quadPath(w, yTL, yTR, yBR, yBL, r) {
    var topLen = Math.hypot(w, yTR - yTL), tdx = w / topLen, tdy = (yTR - yTL) / topLen;
    var botLen = Math.hypot(w, yBL - yBR), bdx = -w / botLen, bdy = (yBL - yBR) / botLen;
    var f = function (n) { return n.toFixed(1); };
    return "path('M " + f(tdx * r) + " " + f(yTL + tdy * r) +
      " L " + f(w - tdx * r) + " " + f(yTR - tdy * r) +
      " Q " + f(w) + " " + f(yTR) + " " + f(w) + " " + f(yTR + r) +
      " L " + f(w) + " " + f(yBR - r) +
      " Q " + f(w) + " " + f(yBR) + " " + f(w + bdx * r) + " " + f(yBR + bdy * r) +
      " L " + f(-bdx * r) + " " + f(yBL - bdy * r) +
      " Q 0 " + f(yBL) + " 0 " + f(yBL - r) +
      " L 0 " + f(yTL + r) +
      " Q 0 " + f(yTL) + " " + f(tdx * r) + " " + f(yTL + tdy * r) + " Z')";
  }

  /* ---------- clock + drag ---------- */
  var clock = document.documentElement.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 1e9, iterations: Infinity });
  var lastT = 0, offset = 0, vel = 0, down = false, lx = 0, uScale = 1;

  rail.addEventListener("pointerdown", function (e) {
    down = true;
    lx = e.clientX;
    vel = 0;
    rail.classList.add("down");
    rail.setPointerCapture(e.pointerId);
  });
  rail.addEventListener("pointermove", function (e) {
    if (!down) return;
    var dx = (e.clientX - lx) / (uScale || 1);
    lx = e.clientX;
    offset += dx;
    vel = dx * 60;
  });
  function endDrag() { down = false; rail.classList.remove("down"); }
  rail.addEventListener("pointerup", endDrag);
  rail.addEventListener("pointercancel", endDrag);

  /* ---------- frame loop ---------- */
  function edgeH(x) {
    var q = Math.abs(x - 720) / 706;
    return 280 + 92 * Math.pow(q, 2.6);
  }
  (function tick() {
    var now = (clock.currentTime || performance.now()) / 1000;
    var dt = Math.min(0.05, lastT ? now - lastT : 0.016);
    lastT = now;

    var phone = innerWidth <= 820;
    var rw = rail.clientWidth || innerWidth;
    var u = phone ? rw / 640 : frame.clientWidth / 1440;
    uScale = u;
    var cx = phone ? 320 : 720;
    var cyBase = phone ? (rail.clientHeight / u) * 0.52 : 687;

    if (!down) {
      if (!reduce) offset -= 50 * dt;
      offset += vel * dt;
      vel *= Math.pow(0.05, dt); // decays ~95% per second
    }
    offset = ((offset % SPAN) + SPAN) % SPAN;

    for (var i = 0; i < N; i++) {
      var c = cards[i];
      var t = ((i * PITCH + offset) % SPAN + SPAN) % SPAN - SPAN / 2;
      var x = 720 + t * (1 + 0.083 * Math.pow(t / 706, 2));
      var d = Math.abs(x - 720) / 706;
      if (d > 1.32) {
        c.el.style.visibility = "hidden";
        continue;
      }
      c.el.style.visibility = "visible";

      var w = 170 + 48 * d * d;
      var xL = x - w / 2, xR = x + w / 2;
      var hL = edgeH(xL), hR = edgeH(xR), h = Math.max(hL, hR);
      var cy = cyBase - 12 * d * d;

      var W = w * u, H = h * u;
      var left = (x - 720 + cx - w / 2) * u;
      var top = (cy - h / 2) * u;
      var yTL = ((h - hL) / 2) * u, yBL = ((h + hL) / 2) * u;
      var yTR = ((h - hR) / 2) * u, yBR = ((h + hR) / 2) * u;

      c.el.style.width = W.toFixed(1) + "px";
      c.el.style.height = H.toFixed(1) + "px";
      c.el.style.transform = "translate3d(" + left.toFixed(1) + "px," + top.toFixed(1) + "px,0)";
      c.el.style.clipPath = quadPath(W, yTL, yTR, yBR, yBL, 15 * u);

      // 5×2 tile crop (each tile is 384×540, aspect 0.7111)
      var tileH = Math.max(H, W / 0.7111);
      var tileW = tileH * 0.7111;
      var gW = (tileW * 5).toFixed(1) + "px";
      var gH = (tileH * 2).toFixed(1) + "px";
      var tx = -(c.col * tileW) - (tileW - W) / 2;
      var ty = -(c.row * tileH) - (tileH - H) / 2;
      var tr = "translate3d(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px,0)";
      c.poster.style.width = gW;
      c.poster.style.height = gH;
      c.poster.style.transform = tr;
      if (c.video) {
        c.video.style.width = gW;
        c.video.style.height = gH;
        c.video.style.transform = tr;
      }
    }
    requestAnimationFrame(tick);
  })();

  /* ---------- entrance (Web Animations) ---------- */
  if (reduce) return;
  var EASE = "cubic-bezier(.22,1,.36,1)";
  ["logo", "nav", "login", "signup"].forEach(function (id, i) {
    var el = document.getElementById(id);
    if (el) el.animate([{ transform: "translateY(-18px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 750, delay: i * 50, easing: EASE, fill: "backwards" });
  });
  document.getElementById("badge").animate([{ transform: "scale(.75)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 700, delay: 160, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" });
  Array.prototype.slice.call(document.querySelectorAll("#h1 span")).forEach(function (s, i) {
    s.animate([{ transform: "translateY(28px)", filter: "blur(10px)", opacity: 0 }, { transform: "none", filter: "blur(0)", opacity: 1 }], { duration: 900, delay: 240 + i * 110, easing: EASE, fill: "backwards" });
  });
  document.getElementById("sub").animate([{ transform: "translateY(18px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 850, delay: 460, easing: EASE, fill: "backwards" });
  rail.animate([{ transform: "translateY(36px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 1000, delay: 540, easing: EASE, fill: "backwards" });
  document.getElementById("cta").animate([{ transform: "scale(.82)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 750, delay: 720, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" });
  Array.prototype.slice.call(document.querySelectorAll(".stroke")).forEach(function (p, i) {
    var len = p.getTotalLength ? p.getTotalLength() : 160;
    p.style.strokeDasharray = len;
    p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 850, delay: 760 + i * 90, easing: EASE, fill: "backwards" });
  });
  ["nseen", "nzero"].forEach(function (id, i) {
    var el = document.getElementById(id);
    if (el) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 650, delay: 740 + i * 140, easing: "ease-out", fill: "backwards" });
  });
})();
