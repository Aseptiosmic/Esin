import { Fragment, type ReactNode } from "react";

/** A small, safe markdown renderer for prompts: headings, nested bullets, bold, italics, code and links. */
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|https?:\/\/[^\s)]+[^\s).,])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${key}-${i++}`;
    if (tok.startsWith("**")) out.push(<strong key={k} className="font-medium text-ink">{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={k} className="rounded bg-cloud px-1.5 py-0.5 font-mono text-[0.86em] text-ink">{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("http")) {
      const short = tok.length > 64 ? tok.slice(0, 40) + "…" + tok.slice(-14) : tok;
      out.push(
        <a key={k} href={tok} target="_blank" rel="noreferrer" className="break-all underline decoration-halo decoration-1 underline-offset-2 hover:text-ink" title={tok}>
          {short}
        </a>
      );
    } else out.push(<em key={k} className="font-serif text-[1.08em] italic">{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function PromptView({ md, className = "" }: { md: string; className?: string }) {
  const lines = md.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let list: { depth: number; text: string }[] = [];
  let para: string[] = [];
  let n = 0;

  const flushPara = () => {
    if (!para.length) return;
    const k = `p${n++}`;
    blocks.push(<p key={k} className="max-w-[46rem] text-[16px] leading-[1.65] text-ink/80">{inline(para.join(" "), k)}</p>);
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    const k = `l${n++}`;
    blocks.push(
      <ul key={k} className="grid max-w-[46rem] gap-1.5">
        {list.map((li, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-[1.6] text-ink/80" style={{ paddingInlineStart: li.depth * 22 }}>
            <span className={"mt-[0.7em] block h-[5px] w-[5px] shrink-0 rounded-full " + (li.depth ? "border border-ink/50" : "bg-ink/70")} />
            <span className="min-w-0">{inline(li.text, `${k}-${i}`)}</span>
          </li>
        ))}
      </ul>
    );
    list = [];
  };

  lines.forEach((raw) => {
    const line = raw.replace(/\s+$/, "");
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    const b = /^(\s*)[-*]\s+(.*)$/.exec(line);
    if (h) {
      flushPara();
      flushList();
      const k = `h${n++}`;
      const level = h[1].length;
      blocks.push(
        level === 1 ? (
          <h3 key={k} className="display text-[clamp(2rem,3.4vw,3rem)]">{inline(h[2].replace(/^Prompt:\s*/i, ""), k)}</h3>
        ) : (
          <h4 key={k} className="mono mt-6 flex items-center gap-3 border-t border-ink/15 pt-5 text-[11px] text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-halo" /> {h[2]}
          </h4>
        )
      );
    } else if (b) {
      flushPara();
      list.push({ depth: Math.min(3, Math.floor(b[1].length / 2)), text: b[2] });
    } else if (!line.trim()) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  });
  flushPara();
  flushList();
  return <div className={"grid gap-4 " + className}>{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>;
}
