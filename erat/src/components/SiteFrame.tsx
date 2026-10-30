import { useEffect, useMemo, useRef, useState } from "react";
import { buildHtml, type Site } from "../sites";

/**
 * Renders a site at a true device width inside an iframe and scales it to fit.
 * The page inside believes it is 1440 / 834 / 390 px wide, so its own media queries,
 * units and scroll effects behave exactly as they would in a real browser.
 */
export default function SiteFrame({
  site,
  width = 1440,
  interactive = true,
  rec = false,
  lazy = false,
  reloadKey = 0,
  fit = "width",
  className = "",
  title,
}: {
  site: Site;
  width?: number;
  interactive?: boolean;
  rec?: boolean;
  lazy?: boolean;
  reloadKey?: number;
  /** "width": fill the container width; "contain": fit entirely inside the box */
  fit?: "width" | "contain";
  className?: string;
  title?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [visible, setVisible] = useState(!lazy);
  const [loaded, setLoaded] = useState(false);
  const html = useMemo(() => buildHtml(site, { rec }), [site, rec]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    let io: IntersectionObserver | null = null;
    if (lazy) {
      io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "300px" });
      io.observe(el);
    }
    return () => {
      ro.disconnect();
      io?.disconnect();
    };
  }, [lazy]);

  useEffect(() => setLoaded(false), [reloadKey, html, width]);

  const scale = size.w ? Math.min(1, fit === "width" ? size.w / width : Math.min(size.w / width, size.h / (width * 0.625))) : 1;
  const frameW = width;
  const frameH = size.h ? size.h / scale : 900;
  const offsetX = fit === "contain" ? Math.max(0, (size.w - width * scale) / 2) : Math.max(0, (size.w - width * scale) / 2);

  return (
    <div ref={box} className={(/\b(absolute|fixed)\b/.test(className) ? "" : "relative ") + "overflow-hidden " + className} style={{ background: site.canvas }}>
      {visible && size.w > 0 && (
        <iframe
          key={`${reloadKey}-${width}-${rec}`}
          title={title || site.name}
          srcDoc={html}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          loading={lazy ? "lazy" : "eager"}
          onLoad={() => setLoaded(true)}
          tabIndex={interactive ? 0 : -1}
          className={"absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-700 " + (loaded ? "opacity-100" : "opacity-0")}
          style={{
            width: frameW,
            height: frameH,
            transform: `translateX(${offsetX}px) scale(${scale})`,
            pointerEvents: interactive ? "auto" : "none",
          }}
        />
      )}
      {!loaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <img src={site.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 blur-xl" />
          <span className="relative block h-10 w-10 animate-spin rounded-full border border-ink/20 border-t-ink" />
        </div>
      )}
    </div>
  );
}
