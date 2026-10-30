import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Dict } from "../i18n";
import { SITES, SITE_BY_ID, buildHtml, siteStats, type Site as SiteT } from "../sites";
import SiteFrame from "../components/SiteFrame";
import PromptView from "../components/PromptView";
import { Arrow, CopyButton, SaveButton, download, openStandalone } from "../components/ui";
import { siteNo } from "./Sites";
import { plateNo } from "../lib/router";
import { ambience } from "../lib/audio";

type Device = "desktop" | "tablet" | "phone";
const DEVICES: Record<Device, { w: number; h: number }> = {
  desktop: { w: 1440, h: 900 },
  tablet: { w: 834, h: 1112 },
  phone: { w: 390, h: 844 },
};

function Stage({ site, device, reload, rec, maxH }: { site: SiteT; device: Device; reload: number; rec: boolean; maxH: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(1200);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const d = DEVICES[device];
  let boxW = W;
  let boxH = device === "desktop" && site.desktopH ? Math.min(maxH, (W * site.desktopH) / 1440) : maxH;
  if (device === "desktop" && site.desktopH) boxW = Math.min(W, (boxH * 1440) / site.desktopH);
  if (device !== "desktop") {
    boxH = Math.min(maxH, (W * d.h) / d.w);
    boxW = (boxH * d.w) / d.h;
    if (boxW > W) {
      boxW = W;
      boxH = (W * d.h) / d.w;
    }
  }
  return (
    <div ref={wrap} className="flex w-full justify-center">
      <div
        className={"relative transition-[width,height] duration-700 ease-soft " + (device === "phone" ? "overflow-hidden rounded-[34px] border-[6px] border-ink shadow-[0_40px_90px_-50px_rgba(20,21,27,0.7)]" : device === "tablet" ? "overflow-hidden rounded-[22px] border-[6px] border-ink" : "border border-ink/15")}
        style={{ width: boxW, height: boxH }}
      >
        <SiteFrame site={site} width={d.w} reloadKey={reload} rec={rec} className="absolute inset-0" />
      </div>
    </div>
  );
}

export default function Site({ t, id, go }: { t: Dict; id?: string; go: (h: string) => void }) {
  const site = (id && SITE_BY_ID[id]) || SITES[0];
  const idx = SITES.indexOf(site);
  const next = SITES[(idx + 1) % SITES.length];
  const T = t.y.sites;
  const [device, setDevice] = useState<Device>(() => (typeof window !== "undefined" && window.innerWidth < 760 ? "phone" : "desktop"));
  const [reload, setReload] = useState(0);
  const [rec, setRec] = useState(false);
  const [focus, setFocus] = useState(false);
  const [raw, setRaw] = useState(false);
  const [vh, setVh] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 900));
  const stats = useMemo(() => siteStats(site), [site]);
  const html = useMemo(() => buildHtml(site), [site]);

  useEffect(() => {
    const r = () => setVh(window.innerHeight);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);
  useEffect(() => {
    if (!focus) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setFocus(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [focus]);

  const toolbar = (dark = false) => (
    <div className="flex flex-wrap items-center gap-2">
      <div className={"flex rounded-full border p-1 " + (dark ? "border-paper/25" : "border-ink/20")}>
        {(Object.keys(DEVICES) as Device[]).map((d) => (
          <button
            key={d}
            onClick={() => {
              setDevice(d);
              ambience.tick(1.1);
            }}
            className={"flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors " + (device === d ? (dark ? "bg-paper text-ink" : "bg-ink text-paper") : dark ? "text-paper/70 hover:text-paper" : "text-ink/60 hover:text-ink")}
          >
            <DeviceIcon d={d} />
            <span className="hidden sm:inline">{T[d]}</span>
            <span className="mono hidden text-[9px] opacity-60 lg:inline">{DEVICES[d].w}</span>
          </button>
        ))}
      </div>
      <button onClick={() => setReload((r) => r + 1)} className={"rounded-full border px-3.5 py-2 text-[12.5px] transition-colors " + (dark ? "border-paper/25 hover:bg-paper hover:text-ink" : "border-ink/20 hover:bg-ink hover:text-paper")}>
        ↻ {T.replay}
      </button>
      <button
        onClick={() => {
          setRec((v) => !v);
          setReload((r) => r + 1);
        }}
        aria-pressed={rec}
        title="?rec=1"
        className={"flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12.5px] transition-colors " + (rec ? "border-halo bg-halo text-ink" : dark ? "border-paper/25 hover:border-paper/60" : "border-ink/20 hover:border-ink/55")}
      >
        <span className={"h-2 w-2 rounded-full " + (rec ? "animate-pulse bg-ink" : "bg-[#d24b3e]")} /> {T.recorder}
      </button>
    </div>
  );

  return (
    <section className="relative h-full w-full bg-vellum">
      <div className="scroller">
        <article className="mx-auto max-w-[1680px] px-5 pb-40 pt-24 md:px-10 md:pt-28">
          <div className="fade-up flex items-center justify-between gap-4">
            <button onClick={() => go("#/index")} className="text-[14px] opacity-60 transition-opacity hover:opacity-100">
              <span className="inline-block rtl:rotate-180">←</span> {T.back}
            </button>
            <span className="mono text-[10px] text-ink/50">
              {t.y.plate} {plateNo("piece")} — {siteNo(site)} / {String(SITES.length).padStart(3, "0")}
            </span>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-12 md:items-end">
            <h1 className="md:col-span-7">
              <span className="mono fade-up block text-[10px] text-ink/55">
                {site.category} · {site.year}
              </span>
              <span className="line">
                <span className="display text-[clamp(3.6rem,10vw,10rem)]" style={{ animationDelay: "0.06s" }}>
                  {site.name}
                </span>
              </span>
              <span className="serif-i fade-up mt-1 block text-[clamp(1.3rem,2vw,1.9rem)] text-ink/70" style={{ animationDelay: "0.2s" }}>
                {site.title}
              </span>
            </h1>
            <div className="fade-up flex flex-wrap gap-2 md:col-span-5 md:justify-end" style={{ animationDelay: "0.25s" }}>
              <SaveButton id={site.id} t={t} />
              <button onClick={() => openStandalone(html)} className="flex items-center gap-2 rounded-full border border-ink/25 px-4 py-[8px] text-[13px] transition-colors hover:bg-ink hover:text-paper">
                {T.open} <Arrow />
              </button>
              <button onClick={() => download(`${site.id}.html`, html)} className="rounded-full border border-ink/25 px-4 py-[8px] text-[13px] transition-colors hover:bg-ink hover:text-paper">
                {T.download} ↓
              </button>
            </div>
          </div>

          {/* preview */}
          <div className="mt-10 md:mt-12">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="mono flex items-center gap-2 text-[10px]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-halo" /> {T.preview} · {DEVICES[device].w}px
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {toolbar()}
                <button onClick={() => setFocus(true)} className="rounded-full bg-ink px-4 py-2 text-[12.5px] text-paper transition-transform hover:scale-[1.03]">
                  ⤢ {T.fullscreen}
                </button>
              </div>
            </div>
            <Stage site={site} device={device} reload={reload} rec={rec} maxH={Math.max(420, vh * 0.78)} />
          </div>

          {/* spec sheet */}
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink/15 pt-6 md:grid-cols-6">
            {[
              [T.category, site.category],
              [T.year, String(site.year)],
              [T.sections, String(site.sections.length)],
              [T.size, `${stats.kb.toFixed(1)} KB`],
              [T.prompt, `${stats.words} ${T.words}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="mono text-[10px] text-ink/50">{k}</dt>
                <dd className="mt-1.5 font-serif text-[26px] font-light leading-none">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="mono text-[10px] text-ink/50">{T.palette}</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {site.palette.map((c) => (
                  <span key={c} className="h-6 w-6 rounded-full ring-1 ring-ink/15" style={{ background: c }} title={c} />
                ))}
              </dd>
            </div>
          </dl>
          <div className="mt-8 grid gap-6 md:grid-cols-12">
            <p className="max-w-[40rem] text-[17px] leading-[1.55] text-ink/75 md:col-span-7">{site.summary}</p>
            <div className="md:col-span-5">
              <p className="mono text-[10px] text-ink/50">{T.sections}</p>
              <p className="mt-2 text-[15px]">{site.sections.join(" → ")}</p>
              <p className="mono mt-5 text-[10px] text-ink/50">{T.fonts}</p>
              <p className="mt-2 text-[15px]">{site.fonts.join(" · ")}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {site.tags.map((tg) => (
                  <span key={tg} className="mono rounded-full border border-ink/15 px-2.5 py-1 text-[9px] text-ink/60">{tg}</span>
                ))}
              </div>
            </div>
          </div>

          {/* the prompt */}
          <div className="mt-24 grid gap-10 border-t border-ink/15 pt-10 md:mt-32 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-6">
                <p className="mono text-[10px] text-ink/55">{siteNo(site)}</p>
                <h2 className="display mt-2 text-[clamp(3rem,6vw,5.6rem)]">{T.prompt}</h2>
                <p className="mt-3 text-[14px] text-ink/60">
                  {stats.words} {T.words} · Markdown
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <CopyButton text={site.prompt} label={T.copyPrompt} done={T.copied} />
                  <button onClick={() => download(`${site.id}-prompt.md`, site.prompt, "text/markdown")} className="rounded-full border border-ink/25 px-4 py-[9px] text-[13px] transition-colors hover:bg-ink hover:text-paper">
                    {T.downloadPrompt} ↓
                  </button>
                </div>
                <div className="mt-6 inline-flex rounded-full border border-ink/20 p-1">
                  {[false, true].map((r) => (
                    <button key={String(r)} onClick={() => setRaw(r)} className={"rounded-full px-4 py-1.5 text-[12.5px] transition-colors " + (raw === r ? "bg-ink text-paper" : "text-ink/60")}>
                      {r ? "Markdown" : "Aa"}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
            <div className="min-w-0 lg:col-span-8">
              {raw ? (
                <pre dir="ltr" className="whitespace-pre-wrap break-words border border-ink/10 bg-paper p-6 font-mono text-[12.5px] leading-[1.75] text-ink/80">{site.prompt}</pre>
              ) : (
                <PromptView md={site.prompt} />
              )}
            </div>
          </div>

          {/* next */}
          {SITES.length > 1 ? (
            <button onClick={() => go(`#/site/${next.id}`)} className="group mt-28 w-full border-t border-ink/15 pt-6 text-start md:mt-36" data-cursor={T.next}>
              <span className="mono block text-[10px]">{T.next} · {siteNo(next)}</span>
              <span className="display mt-2 block text-[clamp(3rem,8vw,7.5rem)] transition-transform duration-700 ease-soft group-hover:translate-x-3">
                {next.name} <span className="inline-block align-middle text-[0.45em]">↘</span>
              </span>
            </button>
          ) : (
            <div className="mt-28 border-t border-dashed border-ink/25 pt-6 md:mt-36">
              <span className="mono block text-[10px] text-ink/50">ER·{String(SITES.length + 1).padStart(3, "0")}</span>
              <p className="display mt-2 text-[clamp(2.6rem,6vw,5.4rem)] text-ink/60">{T.soon}</p>
            </div>
          )}
        </article>
      </div>

      {focus && createPortal(
        <div className="fixed inset-0 z-[130] flex flex-col bg-night text-paper" role="dialog" aria-modal="true" aria-label={site.name}>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <span className="flex items-baseline gap-3">
              <span className="font-serif text-[24px] font-light">{site.name}</span>
              <span className="mono text-[10px] opacity-55">{siteNo(site)}</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {toolbar(true)}
              <button onClick={() => setFocus(false)} className="rounded-full bg-paper px-4 py-2 text-[12.5px] text-ink">
                {T.exit} ✕
              </button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-hidden px-3 pb-3 md:px-6 md:pb-6">
            <Stage site={site} device={device} reload={reload} rec={rec} maxH={vh - 90} />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

function DeviceIcon({ d }: { d: Device }) {
  if (d === "desktop")
    return (
      <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="0.6" y="0.6" width="12.8" height="8.4" rx="1" />
        <path d="M4.5 11.4h5M7 9v2.4" />
      </svg>
    );
  if (d === "tablet")
    return (
      <svg width="11" height="13" viewBox="0 0 11 13" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="0.6" y="0.6" width="9.8" height="11.8" rx="1.4" />
      </svg>
    );
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="0.6" y="0.6" width="6.8" height="11.8" rx="1.6" />
    </svg>
  );
}
