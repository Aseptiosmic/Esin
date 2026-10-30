import { useEffect, useState } from "react";
import type { Dict, LangCode } from "../i18n";
import { LANGS } from "../i18n";
import { SITES } from "../sites";
import { Logo } from "./Chrome";

const LETTERS = ["E", "R", "A", "T", "H", "R", "A"];
const R = 150;
const pt = (i: number, r = R) => {
  const a = -Math.PI / 2 + (i / 7) * Math.PI * 2;
  return [Math.cos(a) * r, Math.sin(a) * r] as const;
};
// heptagram {7/3}
const STAR_ORDER = [0, 3, 6, 2, 5, 1, 4, 0];
const STAR_PATH = STAR_ORDER.map((i, k) => `${k ? "L" : "M"}${pt(i)[0].toFixed(2)},${pt(i)[1].toFixed(2)}`).join(" ");

export default function Loader({
  t,
  lang,
  setLang,
  onEnter,
  onDone,
}: {
  t: Dict;
  lang: LangCode;
  setLang: (l: LangCode) => void;
  onEnter: (withSound: boolean) => void;
  onDone: () => void;
}) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const ready = pct >= 100;

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 3400;
    const loop = () => {
      const p = Math.min(1, (performance.now() - start) / dur);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setPct(e * 100);
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const enter = (sound: boolean) => {
    if (leaving) return;
    setLeaving(true);
    onEnter(sound);
    window.setTimeout(onDone, 1350);
  };

  const p = pct / 100;
  const alt = Math.round(p * 10000);
  const C = 2 * Math.PI * R;

  return (
    <div className={"fixed inset-0 z-[160] overflow-hidden bg-vellum text-ink " + (leaving ? "hide-circle" : "")}>
      <div className="pointer-events-none absolute inset-[8px] border border-ink/15 md:inset-[14px]" />

      <div className="absolute inset-x-[8px] top-[8px] flex h-[60px] items-center justify-between px-4 md:inset-x-[14px] md:top-[14px] md:h-[66px] md:px-6">
        <Logo />
        <div className="hidden gap-3 sm:flex">
          {LANGS.map((l) => (
            <button key={l.code} onClick={() => setLang(l.code)} className={"mono text-[10px] transition-opacity " + (lang === l.code ? "opacity-100" : "opacity-35 hover:opacity-80")}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <svg viewBox="-200 -200 400 400" className="w-[min(78vw,54vh,460px)] overflow-visible" aria-hidden>
          {/* astrolabe dial */}
          <g className="orbit-slow" style={{ transformOrigin: "0 0", animationDuration: "60s" }}>
            {Array.from({ length: 120 }, (_, i) => {
              const a = (i / 120) * Math.PI * 2;
              const r1 = 178, r2 = i % 10 === 0 ? 190 : i % 5 === 0 ? 186 : 182;
              return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke="currentColor" strokeWidth="0.6" opacity={0.35} />;
            })}
          </g>
          {/* the aureole draws itself */}
          <circle r={R} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform="rotate(-90)" />
          <circle r={R - 14} fill="none" stroke="currentColor" strokeWidth="0.5" opacity={0.25 * p} />
          {/* heptagram constellation */}
          <path d={STAR_PATH} fill="none" stroke="#c9a45e" strokeWidth="0.9" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, (p - 0.15) / 0.85)} />
          {LETTERS.map((l, i) => {
            const on = p > (i + 1) / 8;
            const [x, y] = pt(i);
            const [lx, ly] = pt(i, R + 30);
            return (
              <g key={i} style={{ transition: "opacity .6s" }} opacity={on ? 1 : 0.15}>
                <circle cx={x} cy={y} r={on ? 3.4 : 2} fill="currentColor" />
                {on && <circle cx={x} cy={y} r={9} fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />}
                <text x={lx} y={ly + 4} textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="12" letterSpacing="1" fill="currentColor">
                  {l}
                </text>
              </g>
            );
          })}
          {/* altitude */}
          <text y="-30" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9.5" letterSpacing="1.6" fill="currentColor" opacity="0.6">
            {(ready ? t.y.loader.ready : t.y.loader.ascending).toUpperCase()}
          </text>
          <text y="24" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontWeight="300" fontSize="58" letterSpacing="-1.5" fill="currentColor" style={{ fontVariantNumeric: "lining-nums", fontFeatureSettings: "'lnum' 1" }}>
            {alt.toLocaleString("en-US").replace(/,/g, " ")}
          </text>
          <text y="48" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9.5" letterSpacing="1.6" fill="currentColor" opacity="0.6">
            METRES
          </text>
        </svg>

        <div className={"mt-8 flex min-h-[86px] flex-col items-center gap-3 transition-opacity duration-700 " + (ready && !leaving ? "opacity-100" : "pointer-events-none opacity-0")}>
          <button
            onClick={() => enter(true)}
            data-cursor={t.y.loader.enter}
            className="group flex items-center gap-3 rounded-full bg-ink py-3 ps-7 pe-6 text-[15px] text-paper transition-transform duration-500 ease-soft hover:scale-[1.04]"
          >
            {t.y.loader.enter}
            <span className="block h-px w-6 bg-paper/60 transition-all duration-500 group-hover:w-10" />
          </button>
          <button onClick={() => enter(false)} className="mono text-[10px] text-ink/55 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink">
            {t.y.loader.silent}
          </button>
        </div>
      </div>

      <div className="absolute inset-x-[8px] bottom-[8px] flex h-[56px] items-center justify-between gap-4 px-4 md:inset-x-[14px] md:bottom-[14px] md:h-[60px] md:px-6">
        <span className="serif-i text-[clamp(1rem,1.6vw,1.35rem)]">{t.y.loader.tagline}</span>
        <span className="mono hidden text-end text-[10px] opacity-60 sm:block">
          {SITES.length} {t.y.sites.count} · 7 {t.y.stats.languages} · {t.y.loader.hint}
        </span>
      </div>
    </div>
  );
}
