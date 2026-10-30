(function () {
  /* ---------- 1. marquee data ---------- */
  var GIFS = [
    "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
    "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
    "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
    "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
    "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
    "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
    "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
    "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
    "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
    "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
    "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
    "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
    "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
    "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
    "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
    "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
    "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
    "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
    "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
  ];
  var r1 = GIFS.slice(0, 11), r2 = GIFS.slice(11);
  function fillRow(id, arr) {
    var trip = arr.concat(arr, arr);
    document.getElementById(id).innerHTML = trip.map(function (u) {
      return '<img src="' + u + '" alt="" loading="lazy" />';
    }).join("");
  }
  fillRow("row1", r1);
  fillRow("row2", r2);

  /* ---------- 2. services ---------- */
  var SERVICES = [
    ["01", "3D Modeling", "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations."],
    ["02", "Rendering", "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life."],
    ["03", "Motion Design", "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences."],
    ["04", "Branding", "Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence."],
    ["05", "Web Design", "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience."]
  ];
  document.getElementById("slist").innerHTML = SERVICES.map(function (s, i) {
    return '<div class="sitem fi" style="--fy:30px;--fdel:' + (i * 0.1).toFixed(2) + 's">' +
      '<span class="snum">' + s[0] + "</span>" +
      '<div class="sbody"><h3 class="sname">' + s[1] + '</h3><p class="sdesc">' + s[2] + "</p></div>" +
      "</div>";
  }).join("");

  /* ---------- 3. projects ---------- */
  var PROJECTS = [
    {
      num: "01", cat: "Client", name: "Nextlevel Studio",
      a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      c: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
    },
    {
      num: "02", cat: "Personal", name: "Aura Brand Identity",
      a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      c: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
    },
    {
      num: "03", cat: "Client", name: "Solaris Digital",
      a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      c: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
    }
  ];
  var EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';
  document.getElementById("pstack").innerHTML = PROJECTS.map(function (p, i) {
    return '<div class="pslot" data-i="' + i + '">' +
      '<article class="pcard" style="--off:' + (i * 28) + 'px">' +
      '<div class="ptop">' +
      '<div class="pleft"><span class="pnum">' + p.num + '</span><div class="pmeta"><span class="pcat">' + p.cat + '</span><h3 class="pname">' + p.name + "</h3></div></div>" +
      '<a href="#top" class="btn-live">Live Project ' + EXT + "</a>" +
      "</div>" +
      '<div class="pgrid">' +
      '<div class="pcol1"><img class="pimg a" src="' + p.a + '" alt="' + p.name + '" loading="lazy"/><img class="pimg b" src="' + p.b + '" alt="" loading="lazy"/></div>' +
      '<div><img class="pimg c" src="' + p.c + '" alt="" loading="lazy"/></div>' +
      "</div>" +
      "</article></div>";
  }).join("");

  /* ---------- 4. AnimatedText (character by character) ---------- */
  var ap = document.getElementById("anim-p");
  var raw = ap.textContent;
  ap.setAttribute("aria-label", raw);
  ap.innerHTML = Array.prototype.map.call(raw, function (ch) {
    if (ch === " ") return " ";
    var esc = ch.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    return '<span class="ch" aria-hidden="true"><span class="g">' + esc + '</span><span class="a">' + esc + "</span></span>";
  }).join("");
  var chars = Array.prototype.slice.call(ap.querySelectorAll(".ch .a"));

  /* ---------- 5. Magnet (padding 150, strength 3) ---------- */
  var mag = document.getElementById("magnet"), magActive = false;
  window.addEventListener("pointermove", function (e) {
    var r = mag.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var inside = e.clientX >= r.left - 150 && e.clientX <= r.right + 150 && e.clientY >= r.top - 150 && e.clientY <= r.bottom + 150;
    if (inside) {
      if (!magActive) { magActive = true; mag.style.transition = "transform 0.3s ease-out"; }
      var dx = (e.clientX - cx) / 3, dy = (e.clientY - cy) / 3;
      mag.style.transform = "translate3d(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px,0)";
    } else if (magActive) {
      magActive = false;
      mag.style.transition = "transform 0.6s ease-in-out";
      mag.style.transform = "translate3d(0,0,0)";
    }
  }, { passive: true });

  /* ---------- 6. FadeIn observer ---------- */
  var fis = Array.prototype.slice.call(document.querySelectorAll(".fi"));
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "50px", threshold: 0 });
  fis.forEach(function (el) { io.observe(el); });

  /* ---------- 7. scroll: marquee + char reveal + card stack ---------- */
  var marquee = document.getElementById("marquee"), row1 = document.getElementById("row1"), row2 = document.getElementById("row2");
  var slots = Array.prototype.slice.call(document.querySelectorAll(".pslot"));
  var total = slots.length;
  function onScroll() {
    var sy = window.scrollY || document.documentElement.scrollTop;
    var vh = window.innerHeight;

    // marquee
    var mTop = marquee.getBoundingClientRect().top + sy;
    var off = (sy - mTop + vh) * 0.3 - 200;
    row1.style.transform = "translate3d(" + off.toFixed(1) + "px,0,0)";
    row2.style.transform = "translate3d(" + (-off).toFixed(1) + "px,0,0)";

    // character reveal: offset ['start 0.8', 'end 0.2']
    var pr = ap.getBoundingClientRect();
    var start = vh * 0.8, end = vh * 0.2;
    var prog = (start - pr.top) / (start - end + pr.height);
    var n = chars.length;
    for (var i = 0; i < n; i++) {
      var s0 = i / n, e0 = (i + 1) / n;
      var k = Math.max(0, Math.min(1, (prog - s0) / (e0 - s0)));
      chars[i].style.opacity = (0.2 + 0.8 * k).toFixed(3);
    }

    // sticky-stacking cards: targetScale = 1 - (total - 1 - index) * 0.03
    slots.forEach(function (slot, idx) {
      var card = slot.firstElementChild;
      var r = slot.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
      var target = 1 - (total - 1 - idx) * 0.03;
      var sc = 1 - (1 - target) * p;
      card.style.transform = "scale(" + sc.toFixed(4) + ")";
    });
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = document.querySelector(a.getAttribute("href"));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
    });
  });
})();
