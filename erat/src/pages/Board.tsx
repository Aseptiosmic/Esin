import { useState } from "react";
import type { Dict } from "../i18n";
import { SITE_BY_ID } from "../sites";
import { board, useBoard } from "../lib/board";
import { plateNo } from "../lib/router";
import { copyText, download } from "../components/ui";
import { SiteCard, siteNo } from "./Sites";

export default function Board({ t, go, shared }: { t: Dict; go: (h: string) => void; shared?: string }) {
  const mine = useBoard();
  const sharedIds = shared ? shared.split(",").filter((id) => SITE_BY_ID[id]) : null;
  const ids = (sharedIds ?? mine).filter((id) => SITE_BY_ID[id]);
  const sites = ids.map((id) => SITE_BY_ID[id]);
  const [flash, setFlash] = useState<string | null>(null);
  const ping = (s: string) => {
    setFlash(s);
    window.setTimeout(() => setFlash(null), 1600);
  };
  const allPrompts = sites.map((s) => `<!-- ${siteNo(s)} · ${s.name} -->\n\n${s.prompt}`).join("\n\n---\n\n");

  return (
    <section className="relative h-full w-full bg-vellum">
      <div className="scroller">
        <div className="mx-auto max-w-[1680px] px-5 pb-40 pt-24 md:px-10 md:pt-32">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <h1 className="flex flex-wrap items-start gap-3 md:col-span-7">
              <span className="mono w-full text-[10px] text-ink/55">{t.y.plate} {plateNo("board")} — {t.y.plates.board}</span>
              <span className="line"><span className="display text-[clamp(5rem,13vw,12.5rem)]">{t.x.board.title}</span></span>
              <span className="fade-up mt-[0.6em] text-[clamp(1rem,1.6vw,1.4rem)] font-medium">({sites.length})</span>
            </h1>
            <div className="fade-up md:col-span-5" style={{ animationDelay: "0.2s" }}>
              <p className="max-w-[32rem] text-[17px] leading-[1.45] md:text-[19px]">{t.x.board.sub}</p>
              {sites.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {sharedIds && (
                    <button onClick={() => { board.set([...sharedIds, ...mine]); go("#/board"); }} className="rounded-full bg-ink px-4 py-2 text-[13px] text-paper">+ {t.x.save}</button>
                  )}
                  <button onClick={() => download("erathra-prompts.md", allPrompts, "text/markdown")} className="rounded-full bg-ink px-4 py-2 text-[13px] text-paper transition-transform hover:scale-105">{t.x.board.export} ↓</button>
                  <button onClick={async () => { await copyText(`${location.origin}${location.pathname}#/board/${encodeURIComponent(ids.join(","))}`); ping("share"); }} className="rounded-full border border-ink/25 px-4 py-2 text-[13px] transition-colors hover:bg-ink hover:text-paper">
                    {flash === "share" ? t.x.board.shared : t.x.board.share}
                  </button>
                  <button onClick={async () => { await copyText(allPrompts); ping("prompts"); }} className="rounded-full border border-ink/25 px-4 py-2 text-[13px] transition-colors hover:bg-ink hover:text-paper">
                    {flash === "prompts" ? t.x.board.copied : t.x.board.copyPrompts}
                  </button>
                  {!sharedIds && <button onClick={() => board.clear()} className="rounded-full px-4 py-2 text-[13px] text-ink/50 hover:text-ink">{t.x.board.clear}</button>}
                </div>
              )}
            </div>
          </div>

          {sites.length === 0 ? (
            <div className="mt-20 flex flex-col items-start gap-6">
              <p className="font-serif text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1] text-ink/50">{t.y.sites.empty}</p>
              <button onClick={() => go("#/index")} className="rounded-full bg-ink px-5 py-2.5 text-[14px] text-paper">{t.y.sites.cta} ↘</button>
            </div>
          ) : (
            <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
              {sites.map((s) => (
                <SiteCard key={s.id} s={s} t={t} go={go} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
