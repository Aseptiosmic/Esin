import { useEffect, useState } from "react";
import type { Dict, LangCode } from "../i18n";
import { LANGS } from "../i18n";
import { SITES } from "../sites";
import clouds from "../assets/library-above-clouds.jpg";
import { plateNo, type RouteName } from "../lib/router";
import { Logo, SoundToggle } from "./Chrome";

const ITEMS: { h: string; r: Exclude<RouteName, "home" | "piece">; img: string }[] = [
  { h: "#/index", r: "index", img: SITES[SITES.length - 1].cover },
  { h: "#/board", r: "board", img: SITES[0].cover },
  { h: "#/about", r: "about", img: clouds },
  { h: "#/contact", r: "contact", img: clouds },
];

export default function Menu({
  t,
  open,
  onClose,
  go,
  lang,
  setLang,
  current,
}: {
  t: Dict;
  open: boolean;
  onClose: () => void;
  go: (hash: string) => void;
  lang: LangCode;
  setLang: (l: LangCode) => void;
  current: RouteName;
}) {
  const [render, setRender] = useState(open);
  const [closing, setClosing] = useState(false);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
      const i = ITEMS.findIndex((x) => x.r === current);
      setHover(i >= 0 ? i : 0);
    } else if (render) {
      setClosing(true);
      const id = window.setTimeout(() => {
        setRender(false);
        setClosing(false);
      }, 800);
      return () => window.clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  if (!render) return null;
  const pick = (h: string) => {
    onClose();
    window.setTimeout(() => go(h), 320);
  };
  const it = ITEMS[hover];
  const ringText = `ERATHRA · ${t.y.loader.tagline.toUpperCase()} · ${t.y.plate.toUpperCase()} ${plateNo(it.r)} · ${t.y.plates[it.r].toUpperCase()} · `;

  return (
    <div
      className="fixed inset-0 z-[120] overflow-y-auto bg-vellum text-ink"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      style={{ animation: `${closing ? "menu-close" : "menu-open"} ${closing ? 0.8 : 1.1}s cubic-bezier(0.76,0,0.24,1) both` }}
    >
      <style>{`@keyframes menu-open{from{clip-path:circle(0% at calc(100% - 70px) 46px)}to{clip-path:circle(160% at calc(100% - 70px) 46px)}}@keyframes menu-close{from{clip-path:circle(160% at calc(100% - 70px) 46px)}to{clip-path:circle(0% at calc(100% - 70px) 46px)}}`}</style>
      <div className="pointer-events-none fixed inset-[8px] border border-ink/15 md:inset-[14px]" />

      <div className="relative flex min-h-full flex-col px-6 pb-8 pt-6 md:px-12 md:pt-8">
        <div className="flex items-center justify-between">
          <Logo />
          <button onClick={onClose} aria-label={t.nav.close} className="flex h-9 items-center gap-2 rounded-full border border-ink/30 ps-3 pe-3 transition-colors hover:bg-ink hover:text-paper">
            <span className="mono text-[10px]">{t.nav.close}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4"><path d="M1 1l8 8M9 1L1 9" /></svg>
          </button>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 md:grid-cols-12 md:gap-8">
          <nav className="md:col-span-7">
            <p className="mono mb-4 text-[10px] text-ink/50">{t.y.plate}s · {ITEMS.length}</p>
            <ul onPointerLeave={() => setHover(Math.max(0, ITEMS.findIndex((x) => x.r === current)))}>
              {ITEMS.map((x, i) => (
                <li key={x.h} className="border-t border-ink/15 last:border-b" style={{ animation: closing ? undefined : `fade-up 1s cubic-bezier(0.16,1,0.3,1) ${0.25 + i * 0.05}s both` }}>
                  <a
                    href={x.h}
                    onPointerEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onClick={(e) => {
                      e.preventDefault();
                      pick(x.h);
                    }}
                    className="group grid grid-cols-[3rem_1fr] items-baseline gap-2 py-[0.35em] md:grid-cols-[3.5rem_1fr_auto]"
                  >
                    <span className="mono text-[10px] text-ink/45">{plateNo(x.r)}</span>
                    <span className={"display flex items-center gap-3 text-[clamp(2.6rem,min(6vw,8vh),5.6rem)] transition-all duration-700 ease-soft group-hover:translate-x-3 " + (hover === i ? "italic" : "")}>
                      {t.y.plates[x.r]}
                      {current === x.r && <span className="h-2 w-2 rounded-full bg-halo" />}
                    </span>
                    <span className={"mono hidden max-w-[15rem] text-end text-[10px] leading-[1.5] text-ink/55 transition-opacity duration-500 md:block " + (hover === i ? "opacity-100" : "opacity-0")}>{t.y.descs[x.r]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* porthole */}
          <div className="hidden flex-col items-center md:col-span-5 md:flex">
            <div className="relative aspect-square w-[min(32vw,54vh)]">
              <svg viewBox="0 0 200 200" className="orbit-slow absolute -inset-[9%] h-[118%] w-[118%] text-ink">
                <defs>
                  <path id="ring" d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
                </defs>
                <text className="mono" fontSize="6.4" letterSpacing="2.2" fill="currentColor" opacity="0.6">
                  <textPath href="#ring">{ringText.repeat(2)}</textPath>
                </text>
              </svg>
              <div className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-ink/20">
                <img key={it.h} src={it.img} alt="" className="blur-in h-full w-full object-cover" style={{ objectPosition: it.r === "about" || it.r === "contact" ? "50% 40%" : "50% 18%" }} />
              </div>
              <span className="absolute -end-2 top-[12%] h-3 w-3 rounded-full bg-halo" />
            </div>
            <p key={hover} className="serif-i fade-up mt-10 text-center text-[clamp(1.4rem,2vw,1.9rem)] leading-[1.1]">{t.y.descs[it.r]}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-ink/15 pt-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)} className={"text-[14px] transition-opacity " + (l.code === lang ? "opacity-100 underline decoration-halo decoration-2 underline-offset-4" : "opacity-45 hover:opacity-90")}>
                {l.native}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <SoundToggle t={t} />
            <a href="mailto:hello@erathra.app" className="mono text-[10px] opacity-70 hover:opacity-100">hello@erathra.app</a>
            <span className="mono text-[10px] opacity-50">{t.y.free}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
