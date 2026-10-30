import { useEffect, useRef, useState } from "react";

/** Astrolabe cursor: a fine ring with four ticks that open on hover, label set beside it. */
export default function Cursor({ dark = false, hidden = false }: { dark?: boolean; hidden?: boolean }) {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;
    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      setSeen(true);
      const el = e.target as HTMLElement | null;
      const tagged = el?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(tagged ? tagged.dataset.cursor || null : null);
      setHover(!!el?.closest?.("a,button,[role=button],input,textarea,select,label,canvas"));
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled || hidden) return null;
  const c = dark ? "text-white" : "text-ink";
  const open = hover || !!label;
  const size = label ? 54 : hover ? 40 : 26;
  return (
    <div aria-hidden className={"pointer-events-none fixed left-0 top-0 z-[200] mix-blend-normal " + c + (seen ? "" : " opacity-0")}>
      <div ref={dot} className="absolute left-0 top-0">
        <span className="absolute -left-[2px] -top-[2px] block h-1 w-1 rounded-full bg-current" />
      </div>
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className="absolute rounded-full border border-current transition-[width,height,margin,opacity] duration-500 ease-soft"
          style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, opacity: down ? 0.4 : 0.7 }}
        >
          {[0, 90, 180, 270].map((r) => (
            <span
              key={r}
              className="absolute left-1/2 top-1/2 block h-px bg-current transition-all duration-500 ease-soft"
              style={{ width: open ? 7 : 0, transform: `rotate(${r}deg) translateX(${size / 2 + 2}px)`, transformOrigin: "0 0" }}
            />
          ))}
        </div>
        {label && (
          <span className="mono fade-in absolute left-[36px] top-[-6px] whitespace-nowrap text-[10px]">{label}</span>
        )}
      </div>
    </div>
  );
}
