/** Tiny synthesised soundscape: an ambient pad plus soft UI ticks. No assets. */
class Ambience {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  on = false;
  private listeners = new Set<(on: boolean) => void>();
  private lastTick = 0;

  subscribe(fn: (on: boolean) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  private emit() {
    this.listeners.forEach((fn) => fn(this.on));
  }

  private build() {
    const AC =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const c = new AC();
    const master = c.createGain();
    master.gain.value = 0;
    master.connect(c.destination);

    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 650;
    filter.Q.value = 0.5;
    filter.connect(master);

    // soft major-ninth pad: A2, E3, B3, C#4
    const notes = [73.42, 146.83, 220.0, 329.63, 369.99];
    notes.forEach((f, i) => {
      [-6, 6].forEach((det) => {
        const o = c.createOscillator();
        o.type = i === 0 ? "sine" : "triangle";
        o.frequency.value = f;
        o.detune.value = det;
        const g = c.createGain();
        g.gain.value = i === 0 ? 0.16 : 0.055;
        // slow independent swell per voice
        const lfo = c.createOscillator();
        const lg = c.createGain();
        lfo.frequency.value = 0.04 + i * 0.017;
        lg.gain.value = g.gain.value * 0.6;
        lfo.connect(lg).connect(g.gain);
        lfo.start();
        o.connect(g).connect(filter);
        o.start();
      });
    });

    const sweep = c.createOscillator();
    const sg = c.createGain();
    sweep.frequency.value = 0.05;
    sg.gain.value = 260;
    sweep.connect(sg).connect(filter.frequency);
    sweep.start();

    this.ctx = c;
    this.master = master;
  }

  async start() {
    try {
      if (!this.ctx) this.build();
      await this.ctx!.resume();
      const t = this.ctx!.currentTime;
      this.master!.gain.cancelScheduledValues(t);
      this.master!.gain.setValueAtTime(this.master!.gain.value, t);
      this.master!.gain.linearRampToValueAtTime(0.14, t + 3);
      this.on = true;
    } catch {
      this.on = false;
    }
    this.emit();
  }

  stop() {
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(this.master.gain.value, t);
      this.master.gain.linearRampToValueAtTime(0, t + 0.8);
    }
    this.on = false;
    this.emit();
  }

  toggle() {
    if (this.on) this.stop();
    else void this.start();
  }

  /** a soft glassy tick for hovers & clicks */
  tick(pitch = 1) {
    if (!this.on || !this.ctx) return;
    const now = performance.now();
    if (now - this.lastTick < 70) return;
    this.lastTick = now;
    const c = this.ctx;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(1600 * pitch, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(900 * pitch, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.035, c.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.22);
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + 0.25);
  }
}

export const ambience = new Ambience();
