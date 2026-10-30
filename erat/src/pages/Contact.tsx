import { useState } from "react";
import type { Dict } from "../i18n";
import { plateNo } from "../lib/router";
import Sky from "../three/Sky";

const MAIL = "hello@erathra.app";

export default function Contact({ t }: { t: Dict }) {
  const [kind, setKind] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const c = t.y.contact;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Erathra — ${c.kinds[kind]}${name ? ` — ${name}` : ""}`;
    const body = `${msg}\n\n— ${name}${email ? ` <${email}>` : ""}`;
    window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const field = "w-full border-b border-ink/25 bg-transparent py-3 text-[17px] outline-none transition-colors placeholder:text-ink/35 focus:border-ink";

  return (
    <section className="relative h-full w-full overflow-hidden bg-dawn">
      <Sky tone="dusk" offset={0.55} ascend={false} />

      <div className="absolute inset-x-[8px] bottom-[64px] top-[68px] overflow-y-auto md:inset-x-auto md:bottom-[84px] md:start-[60px] md:top-[92px] md:w-[min(520px,44vw)]">
        <form onSubmit={send} className="blur-in border border-ink/15 bg-paper/92 p-6 md:p-9" style={{ animationDelay: "0.2s" }}>
          <p className="mono text-[10px] text-ink/55">{t.y.plate} {plateNo("contact")} — {t.y.plates.contact}</p>
          <h1 className="mt-4">
            <span className="line"><span className="display text-[clamp(3rem,6vw,5.6rem)]" style={{ animationDelay: "0.4s" }}>{c.l1}</span></span>
            <span className="line"><span className="display italic text-[clamp(3rem,6vw,5.6rem)]" style={{ animationDelay: "0.5s" }}>{c.l2}</span></span>
          </h1>
          <p className="mt-4 max-w-[26rem] text-[15px] leading-[1.5] text-ink/70">{c.sub}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {c.kinds.map((k, i) => (
              <button type="button" key={k} onClick={() => setKind(i)} className={"rounded-full border px-4 py-1.5 text-[13px] transition-colors " + (kind === i ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink/60")}>
                {k}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-1 sm:grid-cols-2 sm:gap-6">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={c.name} aria-label={c.name} className={field} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={c.email} aria-label={c.email} className={field} />
          </div>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} required rows={4} placeholder={c.message} aria-label={c.message} className={field + " mt-1 resize-none"} />

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <button type="submit" className="group flex items-center gap-3 rounded-full bg-ink py-3 ps-6 pe-5 text-[14px] text-paper transition-transform duration-500 ease-soft hover:scale-[1.03]">
              {c.send}
              <span className="block h-px w-5 bg-paper/60 transition-all duration-500 group-hover:w-9" />
            </button>
            <span className="text-end text-[13px] text-ink/60">
              {c.direct} ·{" "}
              <a href={`mailto:${MAIL}`} className="text-ink underline decoration-halo decoration-2 underline-offset-4">{MAIL}</a>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
