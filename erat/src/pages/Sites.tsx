import { useMemo, useState } from "react";
import type { Dict } from "../i18n";
import { SITES, type Site } from "../sites";
import SiteFrame from "../components/SiteFrame";
import { Arrow, SaveButton } from "../components/ui";
import { plateNo } from "../lib/router";

export const siteNo = (s: Site) => "ER·" + String(SITES.indexOf(s) + 1).padStart(3, "0");

export function SiteCard({ s, t, go, big = false }: { s: Site; t: Dict; go: (h: string) => void; big?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={`#/site/${s.id}`}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={(e) => {
        e.preventDefault();
        go(`#/site/${s.id}`);
      }}
      data-cursor={t.library.view}
      className="group block"
    >
      <div className="relative overflow-hidden border border-ink/12" style={{ background: s.canvas }}>
        <div className="transition-transform duration-[1400ms] ease-soft group-hover:scale-[1.015]">
          {big || hover ? (
            <SiteFrame site={s} interactive={false} className={big ? "h-[min(64vh,720px)] w-full" : "aspect-[16/10] w-full"} />
          ) : (
            <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden p-6">
              <img src={s.cover} alt={s.name} loading="lazy" className="max-h-full max-w-full object-contain drop-shadow-[0_24px_40px_rgba(20,21,27,0.22)]" />
              <span className="mono absolute bottom-3 end-3 rounded-full border border-ink/15 bg-paper/90 px-2.5 py-1 text-[9px] text-ink">
                {t.y.sites.preview} ↗
              </span>
            </div>
          )}
        </div>
        <div className="absolute end-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
          <SaveButton id={s.id} t={t} compact />
        </div>
        <span className="mono absolute start-3 top-3 rounded-full border border-ink/15 bg-paper/90 px-2.5 py-1 text-[9px]">{siteNo(s)}</span>
      </div>
      <div className={"mt-4 grid gap-2 " + (big ? "md:grid-cols-12 md:items-end" : "")}>
        <div className={big ? "md:col-span-7" : ""}>
          <p className="mono text-[10px] text-ink/50">
            {s.category} · {s.year}
          </p>
          <h3 className={"display mt-1 transition-transform duration-700 ease-soft group-hover:translate-x-2 " + (big ? "text-[clamp(3rem,7vw,6.4rem)]" : "text-[clamp(2.2rem,3.4vw,3.2rem)]")}>{s.name}</h3>
          <p className="serif-i mt-1 text-[clamp(1.1rem,1.5vw,1.35rem)] text-ink/70">{s.title}</p>
        </div>
        {big && (
          <div className="md:col-span-5">
            <p className="max-w-[30rem] text-[15px] leading-[1.55] text-ink/70">{s.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {s.palette.map((c) => (
                <span key={c} className="h-5 w-5 rounded-full ring-1 ring-ink/15" style={{ background: c }} title={c} />
              ))}
              <span className="ms-2 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] text-paper">
                {t.y.sites.preview} <Arrow />
              </span>
            </div>
          </div>
        )}
      </div>
    </a>
  );
}

export default function Sites({ t, go }: { t: Dict; go: (h: string) => void }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return SITES.filter((x) => !s || [x.name, x.title, x.category, x.summary, ...x.tags].join(" ").toLowerCase().includes(s));
  }, [q]);
  const [latest, ...rest] = [...SITES].reverse();

  return (
    <section className="relative h-full w-full bg-vellum">
      <div className="scroller">
        <div className="mx-auto max-w-[1680px] px-5 pb-40 pt-24 md:px-10 md:pt-32">
          <p className="mono fade-up mb-4 text-[10px] text-ink/55">
            {t.y.plate} {plateNo("index")} — {t.y.sites.title} · {SITES.length} {t.y.sites.count}
          </p>
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <h1 className="flex items-start gap-3 md:col-span-7">
              <span className="line">
                <span className="display text-[clamp(5rem,13vw,12.5rem)]">{t.y.sites.title}</span>
              </span>
              <span className="fade-up mt-[0.6em] text-[clamp(1rem,1.6vw,1.4rem)] font-medium" style={{ animationDelay: "0.5s" }}>
                ({String(SITES.length).padStart(2, "0")})
              </span>
            </h1>
            <div className="fade-up md:col-span-5" style={{ animationDelay: "0.2s" }}>
              <p className="max-w-[32rem] text-[17px] leading-[1.45] md:text-[19px]">{t.y.sites.sub}</p>
              <label className="mt-6 flex items-center gap-3 border-b border-ink/30 pb-2 focus-within:border-ink">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.index.search} aria-label={t.index.search} className="w-full bg-transparent text-[16px] outline-none placeholder:text-ink/40" />
                <span className="text-[12px] tabular-nums text-ink/45">{list.length}</span>
              </label>
            </div>
          </div>

          {q ? (
            <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
              {list.length === 0 && <p className="font-serif text-4xl font-light text-ink/40">{t.index.empty}</p>}
              {list.map((s) => (
                <SiteCard key={s.id} s={s} t={t} go={go} />
              ))}
            </div>
          ) : (
            <>
              <div className="fade-up mt-16 md:mt-20" style={{ animationDelay: "0.3s" }}>
                <p className="mono mb-3 flex items-center gap-2 text-[10px] text-ink/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-halo" /> {t.y.sites.latest}
                </p>
                <SiteCard s={latest} t={t} go={go} big />
              </div>

              <div className="mt-24 grid gap-x-8 gap-y-16 md:mt-32 md:grid-cols-2">
                {rest.map((s) => (
                  <SiteCard key={s.id} s={s} t={t} go={go} />
                ))}
                <div className="flex aspect-[16/10] flex-col items-start justify-end border border-dashed border-ink/25 p-8">
                  <span className="mono text-[10px] text-ink/45">ER·{String(SITES.length + 1).padStart(3, "0")}</span>
                  <p className="display mt-3 text-[clamp(2rem,3vw,2.8rem)] text-ink/70">{t.y.sites.soon}</p>
                  <p className="mt-2 max-w-[24rem] text-[14px] leading-[1.5] text-ink/55">{t.y.sites.soonText}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
