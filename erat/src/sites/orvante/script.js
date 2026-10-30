(function () {
  var rec = /[?&]rec=1/.test(location.search) || window.name === "rec";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(.2,.8,.2,1)";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var CDN = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";

  /* ---------- partner marks (fictional) ---------- */
  var MARKS = [
    ["Halcyon", '<circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" stroke-width="1.4"/>'],
    ["Ostra", '<path d="M5 1 9 9H1Z" fill="currentColor"/>'],
    ["Fenwick", '<rect x="2" y="2" width="6" height="6" transform="rotate(45 5 5)" fill="currentColor"/>'],
    ["Monolo", '<rect x="1" y="1" width="3" height="8" fill="currentColor"/><rect x="6" y="1" width="3" height="8" fill="currentColor"/>'],
    ["Kitefly", '<path d="M5 0 9 4 5 10 1 4Z" fill="none" stroke="currentColor" stroke-width="1.3"/>'],
    ["Arbor", '<path d="M1 9A4 4 0 0 1 9 9" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="5" cy="3" r="1.6" fill="currentColor"/>']
  ];
  $("#marks").innerHTML = MARKS.map(function (m) {
    return '<span class="mark"><svg viewBox="0 0 10 10">' + m[1] + "</svg>" + m[0] + "</span>";
  }).join("");

  /* ---------- avatars ---------- */
  var AV = ["300f41b1-3de5-4153-afde-06e15e753ad0", "bfff4cdf-4fda-4491-ada6-62f3b6236492", "943b121e-fe72-479f-93ae-aa8cd1650f69", "c673306f-2b81-4c3d-a7d2-3df61d481abb",
    "2e4fcf11-d0fc-4f31-8f7a-dfe751777141", "ab458fcd-4c2c-426f-8213-21cc3c7274be", "c1fcd833-5ac9-41e9-9352-fead7e64fa24", "4c2b3307-e555-4633-949c-efd3b7e09d82"];
  $("#av").innerHTML = AV.map(function (id, i) {
    return '<img src="' + CDN + id + '.webp" alt="Collaborator ' + (i + 1) + '" loading="lazy" />';
  }).join("");

  /* ---------- laurel badge ---------- */
  (function () {
    var cx = 66, cy = 70, R = 50, out = "";
    for (var s = -1; s <= 1; s += 2) {
      for (var i = 0; i < 9; i++) {
        var a = (112 + i * 17) * Math.PI / 180;
        var x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
        var rot = (112 + i * 17) + 90 - 28;
        if (s > 0) { x = 2 * cx - x; rot = 180 - rot; }
        out += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="3.2" ry="8" transform="rotate(' + rot.toFixed(1) + " " + x.toFixed(1) + " " + y.toFixed(1) + ')" fill="#f4f4f4" opacity="' + (0.55 + i * 0.05).toFixed(2) + '"/>';
      }
    }
    out += '<path d="M42 118 Q66 128 90 118" fill="none" stroke="#f4f4f4" stroke-width="1.2"/>';
    out += '<text x="66" y="58" text-anchor="middle" fill="#f4f4f4" font-family="Archivo" font-size="8.5" font-weight="700" letter-spacing="1.2" style="font-stretch:125%">BEST</text>';
    out += '<text x="66" y="71" text-anchor="middle" fill="#f4f4f4" font-family="Archivo" font-size="8.5" font-weight="700" letter-spacing="1.2" style="font-stretch:125%">GROWTH</text>';
    out += '<text x="66" y="84" text-anchor="middle" fill="#f4f4f4" font-family="Archivo" font-size="8.5" font-weight="700" letter-spacing="1.2" style="font-stretch:125%">PARTNER</text>';
    out += '<text x="66" y="100" text-anchor="middle" fill="#9d9d9d" font-family="Inter Tight" font-size="8" font-weight="600" letter-spacing="1.5">2026</text>';
    $("#badge").innerHTML = out;
  })();

  /* ---------- statement words ---------- */
  var LINES = ["We believe the strongest brands are", "built through strategy, not just", "aesthetics. Every campaign is designed", "to capture attention, inspire action, and", "create lasting business growth."];
  var big = $("#big");
  big.innerHTML = LINES.map(function (l) {
    return '<span class="l">' + l.split(" ").map(function (w) { return '<span class="w" aria-hidden="true">' + w + "</span>"; }).join(" ") + "</span>";
  }).join(" ");
  var words = $$(".w", big);
  var EDGE = 3;
  function paint(pos) {
    for (var i = 0; i < words.length; i++) {
      var k = Math.max(0, Math.min(1, (pos - i) / EDGE));
      var c = Math.round(111 + (244 - 111) * k);
      words[i].style.color = "rgb(" + c + "," + c + "," + c + ")";
    }
  }
  var FULL = words.length + EDGE;

  /* ---------- nav pill ---------- */
  var nav = $("#nav"), pill = $("#pill"), links = $$("a", nav), active = $("a.on", nav);
  function moveTo(a) {
    pill.style.width = a.offsetWidth + "px";
    pill.style.transform = "translateX(" + (a.offsetLeft - 0) + "px)";
    links.forEach(function (l) { l.classList.toggle("lit", l === a); });
  }
  links.forEach(function (a) {
    a.addEventListener("mouseenter", function () { moveTo(a); });
    a.addEventListener("focus", function () { moveTo(a); });
    a.addEventListener("click", function (e) { e.preventDefault(); active.classList.remove("on"); active = a; a.classList.add("on"); moveTo(a); });
  });
  nav.addEventListener("mouseleave", function () { moveTo(active); });
  function placePill() { pill.style.transition = "none"; moveTo(active); void pill.offsetWidth; pill.style.transition = ""; }
  placePill();
  window.addEventListener("resize", placePill);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placePill);

  $$('a[href="#"]').forEach(function (a) { if (!nav.contains(a)) a.addEventListener("click", function (e) { e.preventDefault(); }); });
  $("#down").addEventListener("click", function () { $("#stmt").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- count up ---------- */
  function count(el, dur) {
    var to = +el.dataset.count, suf = el.dataset.suffix || "";
    if (reduce) { el.textContent = to + suf; return; }
    var t0 = performance.now();
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  var popped = false;
  function trustIn() {
    if (popped) return;
    popped = true;
    $$("[data-late]").forEach(function (el) { count(el, 1400); });
    $$("#av img").forEach(function (img, i) {
      if (reduce) return;
      img.animate([{ transform: "scale(.4)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 700, delay: i * 70, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" });
    });
  }

  /* ---------- reduced motion: show everything finished ---------- */
  if (reduce) {
    paint(FULL);
    $$("[data-count]").forEach(function (el) { count(el, 0); });
    return;
  }

  /* ---------- load sequence ---------- */
  $$("#title .ln > span").forEach(function (s, i) {
    s.animate([{ transform: "translateY(105%)" }, { transform: "translateY(0)" }], { duration: 1000, delay: 120 + i * 110, easing: EASE, fill: "backwards" });
  });
  $("#photo").animate([{ transform: "translateY(40px)", filter: "blur(14px)", opacity: 0 }, { transform: "none", filter: "blur(0)", opacity: 1 }], { duration: 1300, easing: EASE, fill: "backwards" });
  nav.animate([{ transform: "translateY(-18px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 900, delay: 100, easing: EASE, fill: "backwards" });
  $$(".rise").forEach(function (el, i) {
    el.animate([{ transform: "translateY(14px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 800, delay: 260 + i * 55, easing: EASE, fill: "backwards" });
  });
  $("#prog").animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 1400, delay: 900, easing: EASE, fill: "backwards" });
  $$("[data-late]").forEach(function (el) { el.textContent = "0" + el.dataset.suffix; });
  $$("[data-count]:not([data-late])").forEach(function (el) {
    el.textContent = "0" + el.dataset.suffix;
    setTimeout(function () { count(el, 1400); }, 450);
  });

  var drift = $("#drift");
  var panel = $("#panel");
  var stmt = $("#stmt");

  /* ---------- recorder: the whole page is one frame, so run scroll parts on a clock ---------- */
  if (rec) {
    paint(0);
    var t0 = performance.now();
    (function tick(now) {
      var t = (now - t0) / 1000;
      var p = Math.max(0, Math.min(1, (t - 1.3) / (4.2 - 1.3)));
      paint(p * FULL);
      drift.style.transform = "translateY(" + (t * 6).toFixed(1) + "px)";
      if (t >= 3.5) trustIn();
      if (t >= 5.3) $("#cb").classList.add("lift");
      if (t < 30) requestAnimationFrame(tick);
    })(t0);
    return;
  }

  /* ---------- scroll ---------- */
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || document.documentElement.scrollTop;
    drift.style.transform = "translateY(" + (y * 0.12).toFixed(1) + "px)";
    var r = stmt.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.82 - r.top) / (r.height * 0.72);
    paint(Math.max(0, Math.min(1, p)) * FULL);
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { trustIn(); io.disconnect(); } });
    }, { threshold: 0.12 });
    io.observe(panel);
  } else trustIn();
})();
