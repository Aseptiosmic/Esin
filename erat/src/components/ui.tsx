import { useState } from "react";
import type { Dict } from "../i18n";
import { board, useBoard } from "../lib/board";
import { ambience } from "../lib/audio";

export const Arrow = ({ className = "" }: { className?: string }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.3" fill="none" className={"rtl:-scale-x-100 " + className}>
    <path d="M1.5 8.5l7-7M3 1.5h5.5V7" />
  </svg>
);

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  ambience.tick(1.2);
}

export function SaveButton({ id, t, compact = false }: { id: string; t: Dict; compact?: boolean }) {
  const ids = useBoard();
  const on = ids.includes(id);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        board.toggle(id);
        ambience.tick(on ? 0.8 : 1.3);
      }}
      aria-pressed={on}
      aria-label={on ? t.x.saved : t.x.save}
      className={
        "flex items-center gap-1.5 rounded-full border transition-colors duration-500 " +
        (compact ? "h-8 w-8 justify-center " : "px-4 py-[8px] text-[13px] ") +
        (on ? "border-ink bg-ink text-paper" : "border-ink/25 bg-paper/90 text-ink hover:bg-ink hover:text-paper")
      }
    >
      <svg width="10" height="12" viewBox="0 0 20 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M2 2h16v20l-8-5-8 5z" />
      </svg>
      {!compact && (on ? t.x.saved : t.x.save)}
    </button>
  );
}

export function CopyButton({ text, label, done, className = "" }: { text: string; label: string; done: string; className?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        await copyText(text);
        setOk(true);
        window.setTimeout(() => setOk(false), 1600);
      }}
      className={"flex items-center gap-2 rounded-full px-4 py-[9px] text-[13px] transition-colors duration-500 " + (ok ? "bg-halo text-ink " : "bg-ink text-paper hover:bg-ink/85 ") + className}
    >
      {ok ? done : label}
      <span className="text-[10px]">{ok ? "✓" : "↘"}</span>
    </button>
  );
}

export function download(name: string, text: string, type = "text/html") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

export function openStandalone(html: string) {
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  window.open(url, "_blank", "noopener");
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
