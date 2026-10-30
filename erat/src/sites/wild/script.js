(function () {
  var rec = /[?&]rec=1/.test(location.search) || window.name === "rec";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  var pill = $("pill"), hero = $("hero"), hair = $("hair"), bg = $("bg"), nav = $("nav"), foot = $("foot"), rule = $("rule");
  var icl = $("icl"), icr = $("icr"), vid = $("vid"), cta = $("cta");

  Array.prototype.slice.call(document.querySelectorAll('a[href="#"]')).forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* ---------- 15 flowing white S-curves on the paper ---------- */
  (function () {
    var out = "";
    for (var i = 0; i < 15; i++) {
      var y0 = 1040 - i * 68;
      var c1x = 320 + (i % 3) * 90, c1y = y0 - 260;
      var c2x = 980 - (i % 4) * 70, c2y = y0 - 40;
      var y1 = y0 - 340;
      var sw = (1.2 + (i % 5) * 0.67).toFixed(2);
      var op = (0.55 + (i % 4) * 0.095).toFixed(2);
      out += '<path d="M -80 ' + y0 + " C " + c1x + " " + c1y + ", " + c2x + " " + c2y + ", 1520 " + y1 +
        '" fill="none" stroke="#ffffff" stroke-width="' + sw + '" opacity="' + op + '" stroke-linecap="round"/>';
    }
    $("bgsvg").innerHTML = out;
  })();

  icr.addEventListener("click", function () { icr.classList.toggle("muted"); });

  window.__recVideo = function (t) {
    var d = vid.duration || 4.25;
    var time = (t % d) + 1 / 120;
    try { vid.currentTime = time; } catch (e) {}
    return time;
  };

  if (reduce) {
    bg.style.opacity = "1";
    hair.style.opacity = "0";
    vid.pause();
    return;
  }
  vid.play().catch(function () {});

  var anims = [], busy = false;
  function clearAnims() {
    anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
    anims = [];
  }

  function buildTimeline(dir) {
    clearAnims();
    var phone = innerWidth <= 720;
    var fs = parseFloat(getComputedStyle($("stage")).fontSize) || 120;
    var DUR = 2100;
    var opts = { duration: DUR, fill: "both", direction: dir || "normal" };
    var E1 = "cubic-bezier(.5,0,.3,1)", E2 = "cubic-bezier(.45,0,.3,1)", E3 = "cubic-bezier(.4,0,.2,1)", EO = "cubic-bezier(.2,.8,.2,1)";

    if (phone) {
      var W = innerWidth - 40, H = W / 1.85;
      pill.style.width = W + "px";
      anims.push(pill.animate([
        { height: "1.5px", clipPath: "inset(0 50%)", offset: 0, easing: E1 },
        { height: "1.5px", clipPath: "inset(0 0%)", offset: 0.14, easing: E1 },
        { height: (H * 0.10).toFixed(1) + "px", clipPath: "inset(0 0%)", offset: 0.30, easing: E2 },
        { height: (H * 0.55).toFixed(1) + "px", clipPath: "inset(0 0%)", offset: 0.58, easing: E3 },
        { height: H.toFixed(1) + "px", clipPath: "inset(0 0%)", offset: 1 }
      ], opts));
      anims.push(hero.animate([
        { gap: (0.03 * fs).toFixed(1) + "px", offset: 0 },
        { gap: (0.03 * fs).toFixed(1) + "px", offset: 0.14, easing: E2 },
        { gap: (0.10 * fs).toFixed(1) + "px", offset: 1 }
      ], opts));
    } else {
      pill.style.height = (1.81 * fs).toFixed(1) + "px";
      anims.push(pill.animate([
        { width: (0.012 * fs).toFixed(2) + "px", clipPath: "inset(50% 0)", offset: 0, easing: E1 },
        { width: (0.012 * fs).toFixed(2) + "px", clipPath: "inset(0% 0)", offset: 0.14, easing: E1 },
        { width: (0.16 * fs).toFixed(1) + "px", clipPath: "inset(0% 0)", offset: 0.30, easing: E2 },
        { width: (1.81 * fs).toFixed(1) + "px", clipPath: "inset(0% 0)", offset: 0.58, easing: E3 },
        { width: (3.62 * fs).toFixed(1) + "px", clipPath: "inset(0% 0)", offset: 1 }
      ], opts));
      anims.push(hero.animate([
        { gap: (0.026 * fs).toFixed(2) + "px", offset: 0 },
        { gap: (0.026 * fs).toFixed(2) + "px", offset: 0.14, easing: E2 },
        { gap: (0.05 * fs).toFixed(2) + "px", offset: 0.58, easing: E3 },
        { gap: (0.085 * fs).toFixed(2) + "px", offset: 1 }
      ], opts));
    }

    anims.push(hair.animate([
      { opacity: 1, offset: 0 },
      { opacity: 1, offset: 0.14 },
      { opacity: 0, offset: 0.30 },
      { opacity: 0, offset: 1 }
    ], opts));

    anims.push(bg.animate([
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: 0.45 },
      { opacity: 1, offset: 0.78 },
      { opacity: 1, offset: 1 }
    ], opts));

    anims.push(nav.animate([
      { transform: "translateY(-140%)", offset: 0 },
      { transform: "translateY(-140%)", offset: 0.50, easing: EO },
      { transform: "translateY(0%)", offset: 0.86 },
      { transform: "translateY(0%)", offset: 1 }
    ], opts));

    anims.push(foot.animate([
      { transform: "translateY(160%)", offset: 0 },
      { transform: "translateY(160%)", offset: 0.52, easing: EO },
      { transform: "translateY(0%)", offset: 0.90 },
      { transform: "translateY(0%)", offset: 1 }
    ], opts));

    anims.push(rule.animate([
      { transform: "scaleX(0)", offset: 0 },
      { transform: "scaleX(0)", offset: 0.40, easing: EO },
      { transform: "scaleX(1)", offset: 0.95 },
      { transform: "scaleX(1)", offset: 1 }
    ], opts));

    [icl, icr].forEach(function (ic) {
      anims.push(ic.animate([
        { opacity: 0, offset: 0 },
        { opacity: 0, offset: 0.80 },
        { opacity: 0.85, offset: 1 }
      ], opts));
    });

    return anims[0];
  }

  cta.addEventListener("click", function () {
    if (busy) return;
    busy = true;
    var back = buildTimeline("reverse");
    back.onfinish = function () {
      var fwd = buildTimeline("normal");
      fwd.onfinish = function () { busy = false; };
    };
  });

  window.addEventListener("resize", function () {
    anims.forEach(function (a) { try { a.finish(); } catch (e) {} });
    clearAnims();
    pill.style.width = "";
    pill.style.height = "";
    pill.style.clipPath = "";
    hero.style.gap = "";
    bg.style.opacity = "1";
    hair.style.opacity = "0";
    nav.style.transform = "";
    foot.style.transform = "";
    rule.style.transform = "";
    icl.style.opacity = "0.85";
    icr.style.opacity = "0.85";
  });

  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(function () {
    buildTimeline("normal");
    if (rec) {
      setTimeout(function () { buildTimeline("reverse"); }, 4900);
    }
  });
})();
