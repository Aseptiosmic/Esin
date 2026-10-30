import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Mail, Menu, Volume2, VolumeX, X } from "lucide-react";
import { NAV } from "./data";

/* ------------------------------------------------------------------ */
/*  motion primitives                                                  */
/* ------------------------------------------------------------------ */

export function scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;
  const header = document.querySelector<HTMLElement>(".site-header");
  const offset = (header?.getBoundingClientRect().height ?? 64) + 26;
  const top = section.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

export function useReveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return progress;
}

export function useActiveSection() {
  const [active, setActive] = useState<string>(NAV[0].id);
  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.18, 0.4], rootMargin: "-18% 0px -52% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return active;
}

export function useScrolled(threshold = 36) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export function usePointerTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onPointerMove = (event: React.PointerEvent<T>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -7, y: x * 10 });
  };
  const onPointerLeave = () => setTilt({ x: 0, y: 0 });
  return { ref, tilt, onPointerMove, onPointerLeave };
}

/* ------------------------------------------------------------------ */
/*  graphic details                                                    */
/* ------------------------------------------------------------------ */

export function WaxSeal({ label = "K", size = 64, className = "" }: { label?: string; size?: number; className?: string }) {
  return (
    <span className={`wax-seal ${className}`} style={{ width: size, height: size } as CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="wax-seal-ring">
        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,248,235,.5)" strokeWidth="1.4" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,248,235,.28)" strokeWidth="0.8" strokeDasharray="1 3" />
        {Array.from({ length: 24 }).map((_, index) => {
          const angle = (index / 24) * Math.PI * 2;
          const r1 = 45;
          const r2 = index % 3 === 0 ? 49 : 47.5;
          return (
            <line
              key={index}
              x1={50 + Math.cos(angle) * r1}
              y1={50 + Math.sin(angle) * r1}
              x2={50 + Math.cos(angle) * r2}
              y2={50 + Math.sin(angle) * r2}
              stroke="rgba(255,248,235,.35)"
              strokeWidth="0.9"
            />
          );
        })}
      </svg>
      <span className="wax-seal-letter">{label}</span>
    </span>
  );
}

export function FlowerLine({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.1" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="3.1" />
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const x = 16 + Math.cos(angle) * 9;
        const y = 16 + Math.sin(angle) * 9;
        return <ellipse key={index} cx={x} cy={y} rx="2.6" ry="5" transform={`rotate(${(angle * 180) / Math.PI + 90} ${x} ${y})`} />;
      })}
    </svg>
  );
}

export function Monogram({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className={`monogram ${tone === "light" ? "monogram-light" : ""}`}>
      <span>K</span>
      <i aria-hidden="true" />
      <span>E</span>
    </span>
  );
}

export function SectionLabel({ no, children, tone = "dark" }: { no: string; children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <div className={`section-label ${tone === "light" ? "section-label-light" : ""}`}>
      <span className="section-label-no">{no}</span>
      <span className="section-label-rule" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <div className={`hairline ${className}`} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  cursor halo, reading rail, sound                                   */
/* ------------------------------------------------------------------ */

export function CursorHalo() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let currentX = x;
    let currentY = y;
    let frame = 0;
    let visible = false;
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!visible) {
        visible = true;
        node.style.opacity = "1";
      }
      const target = event.target as HTMLElement | null;
      const interactive = !!target?.closest("a,button,input,textarea,label,[data-hover]");
      node.classList.toggle("is-hovering", interactive);
    };
    const loop = () => {
      currentX += (x - currentX) * 0.16;
      currentY += (y - currentY) * 0.16;
      node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      frame = window.requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    frame = window.requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={ref} className="cursor-halo" aria-hidden="true">
      <span />
    </div>
  );
}

export function ReadingRail({ active, onGo }: { active: string; onGo: (id: string) => void }) {
  return (
    <nav className="reading-rail" aria-label="Bölümler">
      <span className="reading-rail-line" aria-hidden="true" />
      {NAV.map((item, index) => (
        <button key={item.id} className={active === item.id ? "is-active" : ""} onClick={() => onGo(item.id)} aria-label={item.label} aria-current={active === item.id ? "true" : undefined}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <i aria-hidden="true" />
          <em>{item.label}</em>
        </button>
      ))}
    </nav>
  );
}

class Ambience {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  on = false;
  private listeners = new Set<(on: boolean) => void>();
  subscribe(listener: (on: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  private emit() {
    this.listeners.forEach((listener) => listener(this.on));
  }
  private build() {
    const AudioCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtor();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;
    filter.Q.value = 0.6;
    filter.connect(master);
    [110, 164.81, 220, 329.63].forEach((frequency, index) => {
      [-5, 5].forEach((detune) => {
        const oscillator = ctx.createOscillator();
        oscillator.type = index === 0 ? "sine" : "triangle";
        oscillator.frequency.value = frequency;
        oscillator.detune.value = detune;
        const voice = ctx.createGain();
        voice.gain.value = index === 0 ? 0.12 : 0.045;
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.04 + index * 0.015;
        lfoGain.gain.value = voice.gain.value * 0.55;
        lfo.connect(lfoGain).connect(voice.gain);
        lfo.start();
        oscillator.connect(voice).connect(filter);
        oscillator.start();
      });
    });
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.frequency.value = 0.045;
    sweepGain.gain.value = 210;
    sweep.connect(sweepGain).connect(filter.frequency);
    sweep.start();
    this.ctx = ctx;
    this.master = master;
  }
  async start() {
    try {
      if (!this.ctx) this.build();
      await this.ctx!.resume();
      const now = this.ctx!.currentTime;
      this.master!.gain.cancelScheduledValues(now);
      this.master!.gain.setValueAtTime(this.master!.gain.value, now);
      this.master!.gain.linearRampToValueAtTime(0.11, now + 2.2);
      this.on = true;
    } catch {
      this.on = false;
    }
    this.emit();
  }
  stop() {
    if (this.ctx && this.master) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(this.master.gain.value, now);
      this.master.gain.linearRampToValueAtTime(0, now + 0.7);
    }
    this.on = false;
    this.emit();
  }
  toggle() {
    if (this.on) this.stop();
    else void this.start();
  }
}

const ambience = new Ambience();

export function SoundControl({ compact = false, tone = "dark" }: { compact?: boolean; tone?: "dark" | "light" }) {
  const [on, setOn] = useState(ambience.on);
  useEffect(() => {
    const unsubscribe = ambience.subscribe(setOn);
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <button
      className={`sound-control ${compact ? "is-compact" : ""} ${tone === "light" ? "sound-light" : ""}`}
      onClick={() => ambience.toggle()}
      aria-pressed={on}
      aria-label={on ? "Sesi kapat" : "Sesi aç"}
      title={on ? "Sesi kapat" : "Sesi aç"}
    >
      {on ? <Volume2 size={15} /> : <VolumeX size={15} />}
      {!compact && <span>{on ? "ses açık" : "ses kapalı"}</span>}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  navigation & footer                                                */
/* ------------------------------------------------------------------ */

export function SiteNav({
  scrolled,
  onMenu,
  onLetter,
  menuOpen,
}: {
  scrolled: boolean;
  onMenu: () => void;
  onLetter: () => void;
  menuOpen: boolean;
}) {
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <a className="brand" href="#baslangic" aria-label="Ela mektubunun başına git">
        <span className="brand-mark">e</span>
        <span className="brand-word">ela<span className="brand-dot">.</span></span>
      </a>
      <div className="header-route" aria-label="Kadir'den Ela'ya">
        <span>Kadir</span>
        <ArrowRight size={13} strokeWidth={1.4} />
        <span>Ela</span>
        <span className="header-class">9A</span>
      </div>
      <div className="header-actions">
        <SoundControl compact />
        <button className="header-letter" onClick={onLetter}>
          <Mail size={15} strokeWidth={1.5} />
          <span>Mektubu aç</span>
        </button>
        <button className="menu-trigger" onClick={onMenu} aria-expanded={menuOpen} aria-controls="ela-menu">
          {menuOpen ? <X size={17} strokeWidth={1.5} /> : <Menu size={17} strokeWidth={1.5} />}
          <span>{menuOpen ? "kapat" : "menü"}</span>
        </button>
      </div>
    </header>
  );
}

export function MenuOverlay({
  open,
  onClose,
  onGo,
}: {
  open: boolean;
  onClose: () => void;
  onGo: (id: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div id="ela-menu" className="menu-sheet" role="dialog" aria-modal="true" aria-label="Mektup bölümleri">
      <div className="menu-head">
        <Monogram tone="light" />
        <p>Sadece Ela için.</p>
        <button onClick={onClose} aria-label="Menüyü kapat">
          <X size={18} />
        </button>
      </div>
      <nav className="menu-list">
        {NAV.map((item, index) => (
          <button key={item.id} onClick={() => onGo(item.id)}>
            <span className="menu-no">{String(index + 1).padStart(2, "0")}</span>
            <span className="menu-name">{item.label}</span>
            <ArrowUpRight size={24} strokeWidth={1.2} />
          </button>
        ))}
      </nav>
      <div className="menu-foot">
        <div>
          <span>Kadir</span>
          <ArrowRight size={15} />
          <span>Ela</span>
        </div>
        <div className="menu-sound">
          <span>Ses</span>
          <SoundControl tone="light" />
        </div>
      </div>
    </div>
  );
}

export function SiteFooter({ onGo }: { onGo: (id: string) => void }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-mark">
          <Monogram tone="light" />
          <p>Bazı cümleler mesajla olmuyor.</p>
        </div>
        <div className="footer-links">
          {NAV.map((item) => (
            <button key={item.id} onClick={() => onGo(item.id)}>{item.short}</button>
          ))}
        </div>
        <button className="footer-top-button" onClick={() => onGo("baslangic")}>
          Başa dön <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="footer-bottom">
        <span>9A · Kadir’den Ela’ya</span>
        <span>Bu sayfa yalnızca bir kez açılacak.</span>
        <span>Özel.</span>
      </div>
      <p className="footer-ghost" aria-hidden="true">Ela</p>
    </footer>
  );
}
