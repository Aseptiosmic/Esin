import { useEffect, useMemo, useRef, useState } from "react";
import type { Dict } from "../i18n";
import { SITES, type Site } from "../sites";
import { plateNo, type RouteName } from "../lib/router";
import { ambience } from "../lib/audio";

type Row = { kind: "plate"; r: RouteName; h: string } | { kind: "site"; s: Site };
const PLATES: RouteName[] = ["home", "index", "board", "about", "contact"];

/** ⌘K — jump to any site or plate. */
export default function Palette({ t, open, onClose, go }: { t: Dict; open: boolean; onClose: () => void; go: (h: string) => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      window.setTimeout(() => input.current?.focus(), 30);
    }
  }, [open]);

  const rows = useMemo<Row[]>(() => {
    const s = q.trim().toLowerCase();
    const sites: Row[] = SITES.filter((x) => !s || [x.name, x.title, x.category, ...x.tags, "er·" + String(SITES.indexOf(x) + 1).padStart(3, "0")].join(" ").toLowerCase().includes(s)).map((x) => ({ kind: "site", s: x }));
    const plates: Row[] = PLATES.filter((r) => !s || (t.y.plates[r] + " " + r).toLowerCase().includes(s)).map((r) => ({ kind: "plate", r, h: r === "home" ? "#/" : `#/${r}` }));
    return [...sites, ...plates];
  }, [q, t]);

  useEffect(() => setSel(0), [q]);
  if (!open) return null;
  const choose = (r: Row | undefined) => {
    if (!r) return;
    onClose();
    ambience.tick(1.2);
    window.setTimeout(() => go(r.kind === "plate" ? r.h : `#/site/${r.s.id}`), 60);
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label={t.index.search}>
      <button className="fade-in absolute inset-0 bg-ink/35" onClick={onClose} aria-label={t.nav.close} />
      <div className="blur-in relative w-full max-w-[720px] border border-ink/15 bg-vellum shadow-[0_60px_140px_-50px_rgba(20,21,27,0.6)]" style={{ animationDuration: "0.7s" }}>
        <div className="flex items-center gap-4 border-b border-ink/15 px-6 py-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="shrink-0 opacity-60">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(rows.length - 1, s + 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
              else if (e.key === "Enter") { e.preventDefault(); choose(rows[sel]); }
              else if (e.key === "Escape") onClose();
            }}
            placeholder={t.index.search}
            aria-label={t.index.search}
            className="w-full bg-transparent font-serif text-[30px] font-light italic leading-none outline-none placeholder:text-ink/30"
          />
          <span className="mono shrink-0 rounded border border-ink/20 px-1.5 py-0.5 text-[9px] text-ink/50">ESC</span>
        </div>
        <ul className="no-bar max-h-[56vh] overflow-y-auto py-2">
          {rows.length === 0 && <li className="px-6 py-10 font-serif text-2xl font-light text-ink/45">{t.index.empty}</li>}
          {rows.map((r, i) => (
            <li key={r.kind === "plate" ? "p-" + r.r : r.s.id}>
              <button onPointerMove={() => setSel(i)} onClick={() => choose(r)} className={"flex w-full items-center gap-4 px-6 py-2.5 text-start transition-colors " + (sel === i ? "bg-cloud" : "")}>
                {r.kind === "plate" ? (
                  <span className="mono flex h-11 w-16 shrink-0 items-center justify-center border border-ink/15 text-[10px]">{plateNo(r.r)}</span>
                ) : (
                  <img src={r.s.cover} alt="" className="h-11 w-16 shrink-0 object-cover" style={{ background: r.s.canvas }} />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-[22px] font-light leading-none">{r.kind === "plate" ? t.y.plates[r.r] : r.s.name}</span>
                  <span className="mono mt-1 block text-[9px] text-ink/45">{r.kind === "plate" ? t.y.plate : `ER·${String(SITES.indexOf(r.s) + 1).padStart(3, "0")} · ${r.s.title}`}</span>
                </span>
                {sel === i && <span className="mono text-[9px] text-ink/50">↵</span>}
              </button>
            </li>
          ))}
        </ul>
        <div className="mono flex items-center justify-between border-t border-ink/15 px-6 py-2.5 text-[9px] text-ink/45">
          <span>↑ ↓ · ↵</span>
          <span>{SITES.length} {t.y.sites.count}</span>
        </div>
      </div>
    </div>
  );
}
