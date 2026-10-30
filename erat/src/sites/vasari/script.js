(function () {
  var CDN = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";
  var FILMS = [
    { id: "valley", title: "The Silent Valley", rom: "SHIZUKANA TANI", jp: "静かな谷", year: 1958, genre: "Drama", min: 104, syn: "A schoolteacher returns to the mountain village that exiled her father, and finds the valley has kept every one of its secrets.", sp: "4d86c57b-d104-4aa1-81ef-b0465e53e456", cv: "ee7bf218-e76b-4f0b-8018-5c7673167134" },
    { id: "bluehour", title: "The Blue Hour", rom: "AO NO TOKI", jp: "青の刻", year: 1962, genre: "Romance", min: 97, syn: "Over one long evening in a harbour town, a widow and a stranger trade small lies until the light runs out.", sp: "436573a0-e67c-4a98-a455-63c2f3b12b56", cv: "b38f6ceb-5669-460e-a79f-44aac10cf0b9" },
    { id: "river", title: "River of Salt", rom: "SHIO NO KAWA", jp: "塩の川", year: 1964, genre: "Drama", min: 121, syn: "Two brothers drag a salt barge downriver to a city that no longer wants anything they carry.", sp: "78cc6281-fa26-4c4b-a56e-4051d98f5e53", cv: "46c9dc27-40b4-4f46-b317-d418493d1144" },
    { id: "summer", title: "The Last Summer", rom: "SAIGO NO NATSU", jp: "最後の夏", year: 1966, genre: "Drama", min: 109, syn: "The summer before the dam floods their village, three friends set fire to everything they cannot take with them.", sp: "4cb4b0e3-f66e-4018-80da-bf27194d9df7", cv: "807cf564-8e33-4d07-9710-6c4057617027" },
    { id: "green", title: "The Green Road", rom: "MIDORI NO MICHI", jp: "緑の道", year: 1969, genre: "Mystery", min: 101, syn: "A surveyor mapping a forest road keeps finding the same footprints, always one day ahead of him.", sp: "92ea5e03-079f-40b5-831e-3920de452ac4", cv: "b098397a-25a0-40a2-8c0c-853e704d12af" },
    { id: "noon", title: "Noon in Ashes", rom: "HAI NO SHOGO", jp: "灰の正午", year: 1971, genre: "Western", min: 112, syn: "A rider crosses a white desert to settle an old debt, and learns too late who sent him.", sp: "bf8411e5-96a0-4e15-9e5b-9424af3a4af0", cv: "63303cbc-878a-4b30-8b74-beb58e9d69f1" },
    { id: "observer", title: "The Observer", rom: "KANSATSUSHA", jp: "観察者", year: 1973, genre: "Thriller", min: 96, syn: "A night watchman begins to suspect that the building he guards has started watching him back.", sp: "5427a8a9-6ee9-4109-b87a-0a56a57b7f31", cv: "5f4e47f7-73d4-4b2e-9309-b121918c07cd" },
    { id: "birds", title: "The Fallen Birds", rom: "OCHITA TORI", jp: "落ちた鳥", year: 1975, genre: "Drama", min: 118, syn: "When the birds stop singing over a frontier town, the mayor’s daughter is the only one who goes looking for the reason.", sp: "0aac8386-a8e6-4d88-af36-4fc28f72e3ed", cv: "1891c942-91da-4122-bc2a-a6eda1e47647" },
    { id: "storm", title: "Light in the Storm", rom: "ARASHI NO HI", jp: "嵐の灯", year: 1978, genre: "Drama", min: 127, syn: "A lighthouse keeper and his son wait out a three-day storm with a shipwrecked sailor who will not give his name.", sp: "577349f6-7e98-44de-8d49-e31a6a24bea9", cv: "85da8829-ec22-4ea6-afea-5030db9a4501" },
    { id: "tide", title: "The Long Tide", rom: "NAGAI SHIO", jp: "長い潮", year: 1981, genre: "Drama", min: 99, syn: "A fisherman’s wife counts the tides on the harbour wall while her husband’s boat fails to come home.", sp: "e6854198-b0f0-4954-a40e-54b96ff9e95f", cv: "1097505b-b8a6-4a9b-ae55-d0bdda9e4b0b" },
    { id: "war", title: "A Quiet War", rom: "SHIZUKANA SENSO", jp: "静かな戦争", year: 1985, genre: "Comedy", min: 103, syn: "Two neighbours fight a silent war over a garden wall for thirty years, and neither will say how it began.", sp: "813ee4f0-93cd-4a6e-ad4e-6215e32b973e", cv: "daf21539-a532-47d2-93ef-2f0b25253a7a" },
    { id: "door", title: "Red Door", rom: "AKAI TOBIRA", jp: "赤い扉", year: 1989, genre: "Thriller", min: 114, syn: "A projectionist follows a reel of unknown film through the corridors of a cinema on its final night.", sp: "300603f2-d1bd-4e11-bc74-7cf8ec680f6a", cv: "16cedd91-cac5-45a8-b8e2-3b0edf680cc6" }
  ];
  var N = FILMS.length, M = N * 3;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(.2,.8,.2,1)";
  var $ = function (id) { return document.getElementById(id); };

  // preload all 12 covers
  FILMS.forEach(function (f) { var im = new Image(); im.src = CDN + f.cv + ".webp"; });

  /* ---------- build 36 tapes ---------- */
  var stage = $("stage"), tapes = [];
  for (var v = 0; v < M; v++) {
    var f = FILMS[v % N];
    var el = document.createElement("div");
    el.className = "tape";
    el.dataset.v = v;
    var sp = document.createElement("div");
    sp.className = "sp";
    sp.style.backgroundImage = "url(" + CDN + f.sp + ".webp)";
    var cv = document.createElement("div");
    cv.className = "cv";
    cv.style.backgroundImage = "url(" + CDN + f.cv + ".webp)";
    el.appendChild(sp);
    el.appendChild(cv);
    stage.appendChild(el);
    tapes.push({ el: el, sp: sp, cv: cv, lift: 0, r: 0 });
  }

  /* ---------- geometry ---------- */
  var probe = $("probe"), play = $("play");
  var W = innerWidth, VH = innerHeight, H = 300, ws = 50, d = 160, gap = 9;
  function measure() {
    W = innerWidth;
    VH = innerHeight;
    H = probe.getBoundingClientRect().height || Math.min(VH * 0.46, W * 0.31);
    ws = H * 142 / 840;
    d = H * 474 / 900;
    gap = H * 0.03;
    stage.style.setProperty("--ws", ws + "px");
    stage.style.setProperty("--d", d + "px");
    play.style.left = (W / 2 - 0.5 * d - 6) + "px";
    play.style.top = (VH / 2 + 0.36 * H) + "px";
    placeDecade(FILMS[active].year);
  }

  /* ---------- state ---------- */
  var s = 17, T = 17, hover = -1, active = 5;
  var mx = W / 2, my = VH / 2, cx = W / 2, cy = VH / 2;
  var tiltX = 0, tiltY = 0, onCover = false, overBtn = false, isOpen = false;
  var dragging = false, moved = false, dragX = 0, dragT = 0;

  tapes.forEach(function (t, idx) {
    t.el.addEventListener("pointerenter", function () { hover = idx; });
    t.el.addEventListener("pointerleave", function () { if (hover === idx) hover = -1; });
    t.el.addEventListener("click", function () {
      if (moved || isOpen) return;
      if (Math.abs(t.r) < 0.5) openDetail();
      else T = Math.round(T + t.r);
    });
  });

  /* ---------- decade indicator + caption ---------- */
  var tabs = $("tabs"), ind = $("ind");
  var tabBtns = Array.prototype.slice.call(tabs.querySelectorAll("button"));
  function placeDecade(year) {
    var dec = String(Math.floor(year / 10) * 10);
    tabBtns.forEach(function (b) {
      var on = b.dataset.dec === dec;
      b.classList.toggle("on", on);
      if (on) {
        ind.style.width = b.offsetWidth + "px";
        ind.style.transform = "translateX(" + b.offsetLeft + "px)";
      }
    });
  }
  tabBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var dec = b.dataset.dec;
      var idx = dec === "all" ? 0 : FILMS.findIndex(function (f) { return Math.floor(f.year / 10) * 10 === +dec; });
      if (idx < 0) return;
      var cur = ((Math.round(T) % N) + N) % N;
      var diff = ((idx - cur + N + N / 2) % N) - N / 2;
      T = Math.round(T) + diff;
    });
  });

  function swapMask(box, text, dir) {
    if (reduce) { box.innerHTML = "<span>" + text + "</span>"; return; }
    var old = Array.prototype.slice.call(box.querySelectorAll("span:not([data-out])"));
    var sp = document.createElement("span");
    sp.textContent = text;
    box.appendChild(sp);
    sp.animate([{ transform: "translateY(" + (dir * 105) + "%)" }, { transform: "translateY(0)" }], { duration: 650, easing: EASE, fill: "both" });
    old.forEach(function (o) {
      o.dataset.out = "1";
      var cur = getComputedStyle(o).transform;
      var a = o.animate([{ transform: cur === "none" ? "translateY(0)" : cur }, { transform: "translateY(" + (-dir * 105) + "%)" }], { duration: 650, easing: EASE, fill: "both" });
      a.onfinish = function () { if (o.parentNode) o.parentNode.removeChild(o); };
    });
  }
  function setActive(idx, dir) {
    active = idx;
    var f = FILMS[idx];
    swapMask($("ctitle"), f.title, dir);
    swapMask($("csub"), f.rom + " / " + f.jp, dir);
    swapMask($("cyear"), String(f.year), dir);
    placeDecade(f.year);
  }

  /* ---------- controls ---------- */
  $("prev").addEventListener("click", function () { T = Math.round(T) - 1; });
  $("next").addEventListener("click", function () { T = Math.round(T) + 1; });
  play.addEventListener("click", function () { if (!isOpen) openDetail(); });
  $("back").addEventListener("click", function (e) { e.preventDefault(); if (isOpen) closeDetail(); else T = 17; });
  Array.prototype.slice.call(document.querySelectorAll(".foot a")).forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); }); });

  var wheelTimer = 0;
  window.addEventListener("wheel", function (e) {
    if (isOpen) return;
    var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    T += (delta / (ws + gap)) * 0.5;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { T = Math.round(T); }, 160);
  }, { passive: true });

  var shelf = $("shelf");
  shelf.addEventListener("pointerdown", function (e) {
    if (isOpen) return;
    dragging = true;
    moved = false;
    dragX = e.clientX;
    dragT = T;
  });
  window.addEventListener("pointermove", function (e) {
    mx = e.clientX;
    my = e.clientY;
    var t = e.target;
    overBtn = !!(t && t.closest && t.closest("button,a") && !shelf.contains(t));
    if (!dragging) return;
    var dx = e.clientX - dragX;
    if (Math.abs(dx) > 5) moved = true;
    if (moved) T = dragT - dx / (ws + gap);
  }, { passive: true });
  window.addEventListener("pointerup", function () {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      T = Math.round(T);
      setTimeout(function () { moved = false; }, 40);
    }
  });

  window.addEventListener("keydown", function (e) {
    if (isOpen) { if (e.key === "Escape") closeDetail(); return; }
    if (e.key === "ArrowRight") T = Math.round(T) + 1;
    else if (e.key === "ArrowLeft") T = Math.round(T) - 1;
    else if (e.key === "Enter" && document.activeElement === document.body) openDetail();
  });

  /* ---------- detail sheet & ink reveal ---------- */
  var detail = $("detail"), pimg = $("pimg");
  var blobs = Array.prototype.slice.call(document.querySelectorAll("#blobs circle"));
  var BLOB_DELAY = [0, 120, 220, 300, 360, 420, 180];
  var dlines = Array.prototype.slice.call(document.querySelectorAll(".dleft .dline > *"));
  var sheetAnim = null, lineAnims = [], inkRaf = 0;

  function coverRect() {
    var best = tapes[0], br = 999;
    tapes.forEach(function (t) { if (Math.abs(t.r) < br) { br = Math.abs(t.r); best = t; } });
    var r = best.cv.getBoundingClientRect();
    return r.width > 10 ? r : { left: W / 2 - d / 2, top: VH / 2 - H / 2, right: W / 2 + d / 2, bottom: VH / 2 + H / 2, width: d, height: H };
  }
  function openDetail() {
    if (isOpen) return;
    isOpen = true;
    T = Math.round(T);
    s = T;
    var f = FILMS[((T % N) + N) % N];
    $("dsub").textContent = f.rom + " / " + f.jp;
    $("dtitle").textContent = f.title;
    $("dmeta").textContent = f.year + " / " + f.genre.toUpperCase() + " / " + f.min + " MIN";
    $("dsyn").textContent = f.syn;
    pimg.setAttribute("href", CDN + f.cv + ".webp");
    blobs.forEach(function (c) { c.setAttribute("r", "0"); });

    var r = coverRect();
    var inset = "inset(" + r.top.toFixed(1) + "px " + (W - r.right).toFixed(1) + "px " + (VH - r.bottom).toFixed(1) + "px " + r.left.toFixed(1) + "px round 3px)";
    detail.style.transformOrigin = (r.left + r.width / 2).toFixed(1) + "px " + (r.top + r.height / 2).toFixed(1) + "px";
    detail.style.visibility = "visible";

    if (sheetAnim) sheetAnim.cancel();
    sheetAnim = detail.animate(
      [{ clipPath: inset, transform: "rotate(-4.5deg)" }, { clipPath: "inset(0px 0px 0px 0px round 0px)", transform: "rotate(0deg)" }],
      { duration: reduce ? 1 : 1050, easing: "cubic-bezier(.76,0,.18,1)", fill: "both" }
    );
    lineAnims.forEach(function (a) { a.cancel(); });
    lineAnims = dlines.map(function (el, i) {
      return el.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], { duration: reduce ? 1 : 900, delay: reduce ? 0 : 620 + i * 75, easing: EASE, fill: "both" });
    });

    cancelAnimationFrame(inkRaf);
    var t0 = performance.now() + (reduce ? -5000 : 520);
    (function bleed(now) {
      var elapsed = now - t0;
      blobs.forEach(function (c, i) {
        var p = Math.max(0, Math.min(1, (elapsed - BLOB_DELAY[i]) / 1250));
        var e = 1 - Math.pow(1 - p, 3);
        c.setAttribute("r", (e * 720).toFixed(1));
      });
      if (elapsed < 2400) inkRaf = requestAnimationFrame(bleed);
    })(performance.now());
  }

  function closeDetail() {
    if (!isOpen) return;
    isOpen = false;
    cancelAnimationFrame(inkRaf);
    var r = coverRect();
    var inset = "inset(" + r.top.toFixed(1) + "px " + (W - r.right).toFixed(1) + "px " + (VH - r.bottom).toFixed(1) + "px " + r.left.toFixed(1) + "px round 3px)";
    detail.style.transformOrigin = (r.left + r.width / 2).toFixed(1) + "px " + (r.top + r.height / 2).toFixed(1) + "px";
    if (sheetAnim) sheetAnim.cancel();
    sheetAnim = detail.animate(
      [{ clipPath: "inset(0px 0px 0px 0px round 0px)", transform: "rotate(0deg)" }, { clipPath: inset, transform: "rotate(-4.5deg)" }],
      { duration: reduce ? 1 : 850, easing: "cubic-bezier(.76,0,.18,1)", fill: "both" }
    );
    sheetAnim.onfinish = function () {
      if (!isOpen) {
        detail.style.visibility = "hidden";
        sheetAnim.cancel();
        lineAnims.forEach(function (a) { a.cancel(); });
      }
    };
  }
  $("close").addEventListener("click", closeDetail);

  /* ---------- helpers ---------- */
  function ss(x) { return x * x * (3 - 2 * x); }
  function B(r) {
    if (r <= -1) return -0.5;
    if (r >= 1) return 0.5;
    return (r + Math.sin(Math.PI * r) / Math.PI) / 2;
  }
  function F(r) { return r * (ws + gap) + (d - ws + 1.6 * gap) * B(r); }

  /* ---------- main loop ---------- */
  var curEl = $("cur"), last = performance.now();
  measure();
  window.addEventListener("resize", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  (function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // scroll spring
    var k = reduce ? 1 : (1 - Math.exp(-(dragging ? 18 : 5.2) * dt));
    s += (T - s) * k;
    if (Math.abs(T - s) < 1e-4) s = T;
    if (Math.abs(s) > M * 4) {
      var shift = Math.trunc(s / M) * M;
      s -= shift;
      T -= shift;
    }

    // caption film
    var idx = ((Math.round(s) % N) + N) % N;
    if (idx !== active) setActive(idx, T >= s ? 1 : -1);

    // tilt towards cursor
    var settled = Math.abs(T - s) < 0.3;
    onCover = !isOpen && settled && Math.abs(mx - W / 2) < 0.55 * d && Math.abs(my - VH / 2) < 0.55 * H;
    var tyT = onCover ? ((mx - W / 2) / (0.55 * d)) * 9 : ((mx - W / 2) / W) * 5;
    var txT = onCover ? -((my - VH / 2) / (H / 2)) * 6 : 0;
    var kt = reduce ? 1 : (1 - Math.exp(-7 * dt));
    tiltY += (tyT - tiltY) * kt;
    tiltX += (txT - tiltX) * kt;

    // tapes
    var kl = reduce ? 1 : (1 - Math.exp(-12 * dt));
    var cull = W / 2 + 1.5 * d;
    for (var v = 0; v < M; v++) {
      var t = tapes[v];
      var r = ((v - s) % M + M + M / 2) % M - M / 2;
      t.r = r;
      var x = F(r);
      if (Math.abs(x) > cull) {
        t.el.style.visibility = "hidden";
        continue;
      }
      t.el.style.visibility = "visible";
      var o = ss(Math.max(0, 1 - Math.abs(r)));
      var lt = (hover === v && Math.abs(r) > 0.5 && !isOpen) ? 1 : 0;
      t.lift += (lt - t.lift) * kl;
      var y = -o * 0.025 * H - t.lift * 0.045 * H;
      var z = o * 0.2 * H;
      var rz = -4.5 * o;
      var rx = tiltX * o;
      var ry = -90 * o + tiltY * o;
      t.el.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px," + z.toFixed(2) + "px) rotateZ(" + rz.toFixed(2) + "deg) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      t.el.style.zIndex = String(Math.round(100 - Math.abs(r) * 4));
      t.sp.style.setProperty("--shade", (o * 0.55).toFixed(3));
      t.cv.style.setProperty("--shade", ((1 - o) * 0.5).toFixed(3));
    }

    // play ring
    var ps = isOpen ? 0 : ss(Math.max(0, 1 - Math.abs(T - s) * 3));
    play.style.transform = "scale(" + ps.toFixed(3) + ")";

    // custom cursor
    var kc = 1 - Math.exp(-16 * dt);
    cx += (mx - cx) * kc;
    cy += (my - cy) * kc;
    curEl.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
    var state = "";
    if (!isOpen) {
      if (onCover) state = "open";
      else if (hover >= 0 && Math.abs(tapes[hover].r) > 0.5) state = "spine";
      else if (overBtn) state = "btn";
    } else if (overBtn) state = "btn";
    curEl.className = "cur" + (state ? " " + state : "");

    requestAnimationFrame(loop);
  })(last);
})();
