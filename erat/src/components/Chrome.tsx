import { useEffect, useState } from "react";
import type { Dict, LangCode } from "../i18n";
import { LANGS } from "../i18n";
import type { Route } from "../lib/router";
import { plateNo, toneOf } from "../lib/router";
import { ambience } from "../lib/audio";
import { useBoard } from "../lib/board";

/* ---------------- brand ---------------- */

/** The Erathra mark: an aureole with a single star in orbit. */
export function Glyph({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <g className="orbit" style={{ transformOrigin: "12px 12px", animationDuration: "14s" }}>
        <circle cx="18.1" cy="5.9" r="2.05" fill="currentColor" />
      </g>
    </svg>
  );
}

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={"inline-flex items-center gap-2.5 leading-none " + (light ? "text-white " : "text-ink ") + className}>
      <Glyph size={22} />
      <span className="text-[12.5px] font-medium tracking-[0.34em]">ERATHRA</span>
    </span>
  );
}

export function SoundToggle({ t, className = "" }: { t: Dict; className?: string }) {
  const [on, setOn] = useState(ambience.on);
  useEffect(() => ambience.subscribe(setOn), []);
  return (
    <button
      onClick={() => ambience.toggle()}
      aria-pressed={on}
      aria-label={on ? t.y.sound.on : t.y.sound.off}
      data-cursor={on ? t.y.sound.off : t.y.sound.on}
      className={"group flex h-9 items-center gap-2.5 " + className}
    >
      <span className="flex h-3.5 items-end gap-[2px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={"block w-[1.5px] bg-current transition-all duration-500 " + (on ? "bar" : "")}
            style={{ height: on ? 14 : 3, animationDelay: `${i * 130}ms`, animationDuration: `${0.8 + (i % 3) * 0.25}s` }}
          />
        ))}
      </span>
      <span className="mono text-[10px]">{on ? t.y.sound.on : t.y.sound.off}</span>
    </button>
  );
}

/* ---------------- frame ---------------- */

const tick = (c: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='8'>${Array.from({ length: 5 }, (_, i) => `<line x1='${i * 24 + 0.5}' y1='0' x2='${i * 24 + 0.5}' y2='${i === 0 ? 8 : 4}' stroke='${c}' stroke-width='1'/>`).join("")}</svg>`
  )}")`;

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  let zone = "UTC";
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    /* noop */
  }
  return (
    <span className="tabular-nums">
      {now.toLocaleTimeString("en-GB", { hour12: false })} · {zone.replace(/_/g, " ")}
    </span>
  );
}

type Props = {
  t: Dict;
  route: Route;
  go: (hash: string) => void;
  onMenu: () => void;
  onSearch: () => void;
  lang: LangCode;
  setLang: (l: LangCode) => void;
};

export default function Chrome({ t, route, go, onMenu, onSearch, lang, setLang }: Props) {
  const tone = toneOf(route);
  const dark = tone === "dark";
  const [langOpen, setLangOpen] = useState(false);
  const saved = useBoard().length;
  const ink = dark ? "#ffffff" : "#14151b";
  const links: [string, Route["name"]][] = [
    ["#/index", "index"],
    ["#/about", "about"],
    ["#/contact", "contact"],
  ];
  const link = (h: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    go(h);
  };

  return (
    <div className={"pointer-events-none fixed inset-0 z-[90] transition-colors duration-700 " + (dark ? "text-white" : "text-ink")}>
      {/* the plate frame */}
      <div className="absolute inset-[8px] border md:inset-[14px]" style={{ borderColor: dark ? "rgba(255,255,255,.16)" : "rgba(20,21,27,.14)" }}>
        <div className="absolute inset-x-0 top-0 hidden h-2 opacity-40 md:block" style={{ backgroundImage: tick(ink) }} />
        <div className="absolute inset-x-0 bottom-0 hidden h-2 rotate-180 opacity-40 md:block" style={{ backgroundImage: tick(ink) }} />
        {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-left-[5px] -bottom-[5px]", "-right-[5px] -bottom-[5px]"].map((p) => (
          <span key={p} className={"absolute hidden h-[9px] w-[9px] md:block " + p}>
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current opacity-50" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current opacity-50" />
          </span>
        ))}
      </div>

      {tone === "paper" && (
        <>
          <div className="absolute inset-x-0 top-0 h-[68px] bg-vellum md:h-[80px]" />
          <div className="absolute inset-x-0 bottom-0 h-[64px] bg-vellum md:h-[74px]" />
          <div className="absolute inset-x-[8px] top-[68px] h-px bg-ink/10 md:inset-x-[14px] md:top-[80px]" />
          <div className="absolute inset-x-[8px] bottom-[64px] h-px bg-ink/10 md:inset-x-[14px] md:bottom-[74px]" />
        </>
      )}

      {/* top */}
      <div className="pointer-events-auto absolute inset-x-[8px] top-[8px] flex h-[60px] items-center justify-between px-4 md:inset-x-[14px] md:top-[14px] md:h-[66px] md:px-6">
        <a href="#/" onClick={link("#/")} aria-label="Erathra" className="transition-opacity duration-300 hover:opacity-60">
          <Logo light={dark} />
        </a>


        <div className="flex items-center gap-1 md:gap-2">
          <nav className="me-3 hidden items-center gap-5 xl:flex">
            {links.map(([h, name]) => (
              <a key={h} href={h} onClick={link(h)} className={"group relative text-[13.5px] transition-opacity " + (route.name === name ? "opacity-100" : "opacity-60 hover:opacity-100")}>
                <sup className="mono me-1 text-[8px] opacity-60">{plateNo(name)}</sup>
                {t.y.plates[name]}
                {route.name === name && <span className="absolute -bottom-1.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-current" />}
              </a>
            ))}
          </nav>
          <button onClick={onSearch} aria-label={t.index.search} data-cursor={t.index.search} className="mono flex h-9 items-center gap-2 px-2 text-[10px] opacity-80 transition-opacity hover:opacity-100">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span className="hidden rounded border border-current/30 px-1 py-px md:inline" style={{ borderColor: "currentColor", opacity: 0.6 }}>⌘K</span>
          </button>
          <a href="#/board" onClick={link("#/board")} aria-label={t.x.nav.board} data-cursor={t.x.nav.board} className="mono flex h-9 items-center gap-1.5 px-2 text-[10px] opacity-80 transition-opacity hover:opacity-100">
            <svg width="10" height="12" viewBox="0 0 20 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M2 2h16v20l-8-5-8 5z" />
            </svg>
            <span className="tabular-nums">{String(saved).padStart(2, "0")}</span>
          </a>
          <button
            onClick={onMenu}
            aria-label={t.nav.menu}
            className={"flex h-9 items-center gap-2 rounded-full border ps-3 pe-2.5 transition-colors duration-500 " + (dark ? "border-white/40 hover:bg-white hover:text-ink" : "border-ink/30 bg-paper/60 hover:bg-ink hover:text-paper")}
          >
            <span className="mono text-[10px]">{t.nav.menu}</span>
            <Glyph size={16} />
          </button>
        </div>
      </div>

      {/* bottom */}
      <div className="absolute inset-x-[8px] bottom-[8px] flex h-[56px] items-center justify-between px-4 md:inset-x-[14px] md:bottom-[14px] md:h-[60px] md:px-6">
        <div className="pointer-events-auto">
          <SoundToggle t={t} />
        </div>

        <span className="mono absolute left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[10px] md:block">
          <span className="opacity-90">{t.y.plate} {plateNo(route.name)} — {t.y.plates[route.name]}</span>
          <span className="opacity-50"> · <Clock /></span>
        </span>

        <div className="pointer-events-auto relative">
          <button onClick={() => setLangOpen((v) => !v)} aria-expanded={langOpen} aria-label={t.nav.lang} className="mono flex h-9 items-center gap-1.5 text-[10px]">
            <span className="opacity-50">{t.nav.lang}</span> {LANGS.find((l) => l.code === lang)?.label}
            <svg width="7" height="7" viewBox="0 0 10 10" className={"transition-transform " + (langOpen ? "" : "rotate-180")}>
              <path d="M1 3l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.4" />
            </svg>
          </button>
          {langOpen && (
            <>
              <div className="fixed inset-0" onClick={() => setLangOpen(false)} />
              <ul className="fade-up absolute bottom-11 end-0 w-48 border border-ink/15 bg-paper py-1.5 text-ink shadow-[0_30px_80px_-40px_rgba(20,21,27,0.5)]">
                {LANGS.map((l, i) => (
                  <li key={l.code}>
                    <button
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      className={"flex w-full items-center justify-between px-4 py-2 text-[14px] transition-colors hover:bg-cloud " + (l.code === lang ? "text-ink" : "text-ink/55")}
                    >
                      <span className="flex items-center gap-3">
                        <span className="mono w-4 text-[9px] text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                        {l.native}
                      </span>
                      {l.code === lang && <span className="h-1.5 w-1.5 rounded-full bg-halo" />}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
