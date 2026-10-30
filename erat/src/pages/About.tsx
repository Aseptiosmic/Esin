import { useState } from "react";
import type { Dict } from "../i18n";
import { plateNo } from "../lib/router";
import { LANGS } from "../i18n";
import { SITES } from "../sites";
import band from "../assets/library-above-clouds.jpg";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export default function About({ t, go }: { t: Dict; go: (h: string) => void }) {
  const [open, setOpen] = useState<number | null>(0);
  const a = t.about;
  const stats: [string, string][] = [
    [String(SITES.length).padStart(2, "0"), t.y.sites.count],
    ["3", t.y.sites.preview],
    ["7", t.y.stats.languages],
    ["0 €", t.y.stats.cost],
  ];
  return (
    <section className="relative h-full w-full bg-vellum">
      <div className="scroller">
        <article className="mx-auto max-w-[1500px] px-6 pb-40 pt-28 md:px-12 md:pt-36">
          <p className="mono fade-up text-[10px] text-ink/55">{t.y.plate} {plateNo("about")} — {t.y.plates.about}</p>
          <h1 className="mt-5">
            <span className="line"><span className="display text-[clamp(4rem,12vw,12rem)]" style={{ animationDelay: "0.1s" }}>{a.title}</span></span>
          </h1>
          <p className="fade-up mt-10 max-w-[60rem] font-serif text-[clamp(1.6rem,3vw,2.8rem)] font-light leading-[1.12] tracking-[-0.015em]" style={{ animationDelay: "0.25s" }}>
            {a.lead}
          </p>
        </article>

        {/* figure */}
        <figure className="fade-up relative mx-[8px] overflow-hidden md:mx-[14px]" style={{ animationDelay: "0.35s" }}>
          <img src={band} alt={t.y.loader.tagline} className="block aspect-[21/9] min-h-[320px] w-full object-cover" style={{ animation: "drift 18s ease-in-out infinite" }} />
          <figcaption className="mono absolute bottom-4 start-6 text-[10px] text-ink/70 md:start-12">Fig. 1 — {t.y.loader.tagline}</figcaption>
        </figure>

        <article className="mx-auto max-w-[1500px] px-6 pb-40 md:px-12">
          {/* numbers */}
          <dl className="grid grid-cols-2 gap-y-10 border-b border-ink/15 py-16 sm:grid-cols-3 md:grid-cols-4 md:py-24">
            {stats.map(([n, l]) => (
              <div key={l}>
                <dt className="display text-[clamp(3.6rem,7vw,6.4rem)]">{n}</dt>
                <dd className="mono mt-2 text-[10px] text-ink/55">{l}</dd>
              </div>
            ))}
          </dl>

          <Section n={0} title="Erathra">
            <div className="grid gap-6 text-[17px] leading-[1.6] md:grid-cols-2 md:text-[18px]">
              <p>{a.body[0]}</p>
              <p>{a.body[1]}</p>
            </div>
            
          </Section>

          <Section n={1} title={a.principlesTitle}>
            <ul>
              {a.principles.map((p, i) => (
                <li key={i} className="grid gap-2 border-t border-ink/15 py-8 md:grid-cols-12 md:gap-6">
                  <span className="mono text-[10px] text-ink/45 md:col-span-1">{ROMAN[i]}</span>
                  <span className="display text-[clamp(2.4rem,4.4vw,4rem)] md:col-span-6">{p.t}</span>
                  <span className="text-[16px] leading-[1.55] text-ink/70 md:col-span-5 md:pt-3">{p.d}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section n={2} title={a.stepsTitle}>
            <div className="grid items-center gap-12 md:grid-cols-2">
              <ol className="grid gap-10">
                {a.steps.map((s, i) => (
                  <li key={i} className="flex items-baseline gap-6">
                    <span className="display italic text-[clamp(4rem,7vw,6.5rem)] text-halo">{i + 1}</span>
                    <span className="max-w-[20rem] text-[19px] leading-[1.35]">{s}</span>
                  </li>
                ))}
              </ol>
              <div className="relative mx-auto aspect-square w-full max-w-[460px] overflow-hidden rounded-full ring-1 ring-ink/15"><img src={SITES[0].cover} alt={SITES[0].name} className="h-full w-full object-cover object-top" style={{ background: SITES[0].canvas }} /></div>
            </div>
          </Section>

          <Section n={3} title={a.faqTitle}>
            <ul>
              {a.faq.map((f, i) => (
                <li key={i} className="border-t border-ink/15">
                  <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-6 text-start">
                    <span className="font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] font-light leading-[1.1]">{f.q}</span>
                    <span className={"flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/30 transition-transform duration-500 ease-soft " + (open === i ? "rotate-45 bg-ink text-paper" : "")}>+</span>
                  </button>
                  <div className={"grid transition-[grid-template-rows] duration-700 ease-soft " + (open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <p className="max-w-[44rem] pb-7 text-[17px] leading-[1.55] text-ink/70">{f.a}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-2">
              {LANGS.map((l) => (
                <span key={l.code} className="rounded-full border border-ink/20 px-4 py-1.5 text-[14px]">{l.native}</span>
              ))}
            </div>
          </Section>

          <button onClick={() => go("#/index")} className="group mt-28 flex w-full items-end justify-between border-t border-ink/15 pt-8 text-start md:mt-40">
            <span className="display text-[clamp(3.2rem,9vw,8.5rem)] transition-transform duration-700 ease-soft group-hover:translate-x-3">{a.cta}</span>
            <span className="display mb-3 text-[clamp(2rem,4vw,3.4rem)] transition-transform duration-700 group-hover:-translate-y-2">↑</span>
          </button>
        </article>
      </div>
    </section>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-24 grid gap-8 md:mt-36 md:grid-cols-12">
      <div className="md:col-span-3">
        <p className="mono text-[10px] text-ink/50">§ {ROMAN[n]}</p>
        <h2 className="serif-i mt-2 text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none">{title}</h2>
      </div>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}
