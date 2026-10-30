import { useEffect } from "react";
import type { Dict } from "../i18n";
import Sky from "../three/Sky";
import { SITES } from "../sites";

export default function Home({ t, go }: { t: Dict; go: (h: string) => void }) {
  // scrolling up through the sky leads into the spiral
  useEffect(() => {
    let acc = 0;
    let timer = 0;
    const wheel = (e: WheelEvent) => {
      acc += e.deltaY;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => (acc = 0), 400);
      if (acc > 320) {
        acc = -99999;
        go("#/index");
      }
    };
    window.addEventListener("wheel", wheel, { passive: true });
    return () => window.removeEventListener("wheel", wheel);
  }, [go]);

  const stats: [string, string][] = [
    [String(SITES.length).padStart(2, "0"), t.y.sites.count],
    ["100%", t.y.sites.prompt],
    ["7", t.y.stats.languages],
    ["0 €", t.y.stats.cost],
  ];

  return (
    <section className="relative h-full w-full overflow-hidden bg-sky">
      <Sky tone="dawn" />

      <p className="mono fade-up pointer-events-none absolute inset-x-6 top-[88px] text-center text-[10px] text-ink/70 md:top-[100px]" style={{ animationDelay: "0.9s" }}>
        {t.y.home.kicker}
      </p>

      <div className="pointer-events-none absolute inset-x-6 bottom-[84px] grid gap-8 md:inset-x-12 md:bottom-[96px] lg:grid-cols-12 lg:items-end">
        <h1 className="lg:col-span-8">
          <span className="line">
            <span className="display text-[clamp(3.6rem,10.4vw,10.6rem)]" style={{ animationDelay: "1.1s" }}>
              {t.y.home.l1}
            </span>
          </span>
          <span className="line ps-[0.6em] md:ps-[1.2em]">
            <span className="display italic text-[clamp(3.6rem,10.4vw,10.6rem)]" style={{ animationDelay: "1.25s" }}>
              {t.y.home.l2}
            </span>
          </span>
        </h1>

        <div className="fade-up pointer-events-auto lg:col-span-4" style={{ animationDelay: "1.5s" }}>
          <p className="max-w-[26rem] text-[15px] leading-[1.5] text-ink/80">{t.y.sites.homeSub}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => go("#/index")}
              data-cursor={t.y.sites.cta}
              className="group flex items-center gap-3 rounded-full bg-ink py-3 ps-6 pe-5 text-[14px] text-paper transition-transform duration-500 ease-soft hover:scale-[1.03]"
            >
              {t.y.sites.cta}
              <span className="block h-px w-5 bg-paper/60 transition-all duration-500 group-hover:w-9" />
            </button>
            <button
              onClick={() => go(`#/site/${SITES[SITES.length - 1].id}`)}
              className="rounded-full border border-ink/35 bg-paper/50 px-5 py-3 text-[14px] transition-colors duration-500 hover:bg-ink hover:text-paper"
            >
              {SITES[SITES.length - 1].name} — {t.y.sites.latest}
            </button>
          </div>
          <dl className="mt-8 grid grid-cols-4 gap-2 border-t border-ink/20 pt-4">
            {stats.map(([n, l]) => (
              <div key={l}>
                <dt className="display text-[clamp(1.6rem,2.4vw,2.3rem)] leading-none">{n}</dt>
                <dd className="mono mt-1 text-[8.5px] leading-[1.3] text-ink/60">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <button
        onClick={() => go("#/index")}
        className="mono fade-in absolute end-6 top-1/2 hidden origin-right -translate-y-1/2 translate-x-1/2 -rotate-90 items-center gap-3 text-[10px] text-ink/60 transition-colors hover:text-ink md:flex"
        style={{ animationDelay: "2s" }}
      >
        <span className="block h-px w-10 bg-current" /> {t.y.home.ascend} ↑
      </button>
    </section>
  );
}
