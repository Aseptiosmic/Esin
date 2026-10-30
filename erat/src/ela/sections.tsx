import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties, type PointerEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Circle,
  Copy,
  Flower2,
  ImagePlus,
  PencilLine,
  Play,
  Printer,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { ANSWERS, CARE, DRAFTS, FRAMES, MOMENTS, type AnswerKey } from "./data";
import { FlowerLine, SectionLabel, WaxSeal } from "./parts";

/* ================================================================== */
/*  01 — OPENING                                                       */
/* ================================================================== */

export function Opening({
  onOpenLetter,
  onGo,
}: {
  onOpenLetter: () => void;
  onGo: (id: string) => void;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 9 });
  };

  return (
    <section id="baslangic" className="opening" aria-labelledby="opening-title">
      <div className="opening-photo" aria-hidden="true" />
      <div className="opening-haze" aria-hidden="true" />
      <div className="opening-grain" aria-hidden="true" />
      <div className="opening-frame" aria-hidden="true">
        <span className="frame-corner tl" />
        <span className="frame-corner tr" />
        <span className="frame-corner bl" />
        <span className="frame-corner br" />
      </div>

      <div className="opening-inner">
        <div className="opening-copy">
          <SectionLabel no="00">özel bir mektup</SectionLabel>
          <p className="opening-route">Kadir’den Ela’ya <span>·</span> 9A</p>
          <h1 id="opening-title" className="opening-title">
            <span className="opening-name">Ela,</span>
            <span className="opening-line">sana bir</span>
            <span className="opening-line opening-italic">notum var.</span>
          </h1>
          <p className="opening-lead">
            Bazı şeyleri mesajla söylemek olmuyor. En azından ben beceremedim.
          </p>
          <div className="opening-actions">
            <button className="button-primary" onClick={onOpenLetter}>
              <span>Mektubu aç</span>
              <span className="button-icon"><ArrowUpRight size={17} strokeWidth={1.7} /></span>
            </button>
            <button className="text-link" onClick={() => onGo("mektup")}>
              Önce bir bak <ArrowDown size={15} strokeWidth={1.5} />
            </button>
          </div>
          <p className="opening-note">
            <FlowerLine size={18} /> Birkaç akşam, birkaç taslak, biraz cesaret.
          </p>
        </div>

        <div className="opening-object">
          <span className="object-orbit orbit-a" aria-hidden="true"><Flower2 size={18} strokeWidth={1.2} /></span>
          <span className="object-orbit orbit-b">9A</span>
          <button
            className="hero-envelope"
            onClick={onOpenLetter}
            onPointerMove={onMove}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            style={{ "--tilt-x": `${tilt.x}deg`, "--tilt-y": `${tilt.y}deg` } as CSSProperties}
            aria-label="Kadir'den Ela'ya mektubu aç"
          >
            <span className="envelope-shadow" aria-hidden="true" />
            <span className="envelope-back" aria-hidden="true" />
            <span className="envelope-note" aria-hidden="true">
              <span className="envelope-note-top">ELA’YA</span>
              <span className="envelope-hand">biraz<br />cesaret,<br />birkaç cümle.</span>
              <span className="envelope-note-bottom">— Kadir</span>
            </span>
            <span className="envelope-pocket" aria-hidden="true" />
            <span className="envelope-flap" aria-hidden="true" />
            <span className="envelope-seal-wrap" aria-hidden="true">
              <WaxSeal label="K" size={62} />
            </span>
            <span className="envelope-cta">açmak için dokun</span>
          </button>
          <p className="object-caption">Bu sayfa sadece senin için.</p>
        </div>

        <div className="opening-footer">
          <span>Bir sınıf. İki isim. Küçük bir cesaret.</span>
          <span className="opening-private">PRIVATE · 9A · ELA</span>
          <button onClick={() => onGo("mektup")}>
            devam et <ArrowDown size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  02 — LETTER                                                        */
/* ================================================================== */

const letterParagraphs = [
  "Bunu yazmak için birkaç akşam oturdum. İlk denemelerim ya çok kısaydı ya da çok fazla. Sonunda anladım ki mesele doğru cümleyi bulmak değil, onu söylemeye cesaret etmek.",
  "Bunu büyük bir ilan gibi söylemek istemiyorum. Sadece aynı sınıfta olmaktan memnun olduğumu, bazen koridorda yanından geçerken günümün daha iyi olduğunu bilmeni istiyorum.",
  "Belki bir gün daha çok konuşuruz. Belki sadece arkadaş kalırız. İkisi de benim için kötü değil. Ama bunu söylemeden içimde kalmasını istemedim.",
  "Eğer sen de istersen, birbirimizi biraz daha tanıyalım. İstemiyorsan da sorun değil. Bu mektup sana hiçbir şey borçlu bırakmıyor.",
];

export function Letter({
  open,
  onOpen,
  onGo,
}: {
  open: boolean;
  onOpen: () => void;
  onGo: (id: string) => void;
}) {
  const paperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      const element = paperRef.current;
      if (!element) return;
      const header = document.querySelector<HTMLElement>(".site-header");
      const offset = (header?.getBoundingClientRect().height ?? 64) + 32;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 420);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <section id="mektup" className="letter" aria-labelledby="letter-title">
      <div className="shell">
        <SectionLabel no="01">mektup</SectionLabel>
        <div className="letter-layout">
          <aside className="letter-aside">
            <div className="letter-aside-sticky">
              <h2 id="letter-title" className="display">
                Bir<br /><em>mektup.</em>
              </h2>
              <p className="letter-aside-copy">
                Yazmak, söylemekten daha kolay oldu. Ama göndermek için yine de biraz cesaret gerekti.
              </p>
              <ol className="letter-index">
                <li><span>i.</span> Sana söylemek istediğim şey</li>
                <li><span>ii.</span> Nasıl buraya geldim</li>
                <li><span>iii.</span> Geri kalanı</li>
              </ol>
              <figure className="letter-still">
                <img src="/ela/flower.jpg" alt="Kâğıt üzerinde duran küçük bir kır çiçeği" loading="lazy" />
                <figcaption>Fig. 01 — kâğıda düşen gölge.</figcaption>
              </figure>
              <button
                className="quiet-action"
                onClick={() => {
                  if (!open) {
                    onOpen();
                    window.setTimeout(() => window.print(), 1200);
                  } else {
                    window.print();
                  }
                }}
              >
                <Printer size={15} strokeWidth={1.5} /> Mektubu yazdır
              </button>
            </div>
          </aside>

          <div className="letter-main">
            {!open ? (
              <div className="letter-closed reveal">
                <div className="letter-closed-top">
                  <span>Mektup · 01 / 01</span>
                  <WaxSeal label="K" size={46} />
                </div>
                <p className="letter-closed-lead">
                  Aynı sınıftayız. Bunu zaten biliyorsun. Ama söylemek istediğim şey,
                  ders programından biraz daha farklı.
                </p>
                <p className="letter-closed-hand hand">bir dakika ayırabilir misin?</p>
                <button className="button-primary" onClick={onOpen}>
                  <span>Mektubu aç</span>
                  <span className="button-icon"><BookOpen size={17} strokeWidth={1.6} /></span>
                </button>
                <div className="letter-closed-foot">
                  <span>Sadece senin için yazıldı.</span>
                  <span>9A</span>
                </div>
              </div>
            ) : (
              <article className="letter-paper reveal is-visible" ref={paperRef}>
                <div className="letter-paper-head">
                  <div>
                    <span className="paper-mono">KADİR’DEN</span>
                    <span className="paper-mono light">ELA’YA</span>
                  </div>
                  <div className="paper-seal">
                    <WaxSeal label="K" size={44} />
                  </div>
                </div>
                <div className="letter-paper-body">
                  <p className="letter-salutation">Ela,</p>
                  {letterParagraphs.slice(0, 1).map((text) => <p key={text}>{text}</p>)}
                  <p className="letter-confession">Senden hoşlanıyorum.</p>
                  {letterParagraphs.slice(1).map((text) => <p key={text}>{text}</p>)}
                </div>
                <div className="letter-signature">
                  <span>içtenlikle,</span>
                  <strong>Kadir</strong>
                  <span className="letter-date">9A · birkaç akşam sonra</span>
                </div>
                <div className="letter-paper-foot">
                  <span className="hand">P.S. Acele yok. Gerçekten.</span>
                  <button className="text-link" onClick={() => onGo("aramizda")}>
                    Devamı <ArrowRight size={15} strokeWidth={1.5} />
                  </button>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  03 — BETWEEN: thanks, glances, the request                        */
/* ================================================================== */

export function Between({ onGo }: { onGo: (id: string) => void }) {
  const [lens, setLens] = useState<"sign" | "chance">("sign");

  return (
    <section id="aramizda" className="between" aria-labelledby="between-title">
      <div className="between-light" aria-hidden="true" />
      <div className="shell">
        <SectionLabel no="02" tone="light">aramızda</SectionLabel>
        <div className="between-head reveal">
          <h2 id="between-title" className="display display-light">
            Sana söylemek<br />istediğim iki <em>küçük şey.</em>
          </h2>
          <p>
            Birincisi bir teşekkür. İkincisi, belki de bu mektubu yazmamın asıl sebebi.
            İkisi de kararını değiştirmek için değil.
          </p>
        </div>

        <div className="between-grid">
          <article className="between-chapter reveal">
            <div className="chapter-head">
              <span className="chapter-no">01</span>
              <span className="chapter-rule" aria-hidden="true" />
              <span className="chapter-tag">teşekkür</span>
            </div>
            <h3 className="chapter-title">Bana iyi geldin.</h3>
            <p>
              Bana hep yardımcı oldun. Özellikle son attığın videolar beni daha çok
              cesaretlendirdi. Bunu çok belli etmesem de, o gün gerçekten iyi geldi.
            </p>
            <div className="video-note">
              <span className="video-play"><Play size={15} fill="currentColor" strokeWidth={0} /></span>
              <div>
                <span className="paper-mono">son gönderdiklerin</span>
                <strong>iyi bir yerde duruyor.</strong>
              </div>
              <span className="video-loop" aria-hidden="true">↻</span>
            </div>
            <p className="chapter-foot hand">Bazen bir video, bir cümleden fazlasını söylüyor.</p>
          </article>

          <article className="between-chapter reveal">
            <div className="chapter-head">
              <span className="chapter-no">02</span>
              <span className="chapter-rule" aria-hidden="true" />
              <span className="chapter-tag">bakışlar</span>
            </div>
            <h3 className="chapter-title">Okulda bazen gözlerimiz kesişiyor.</h3>
            <p>
              İşaret mi, tesadüf mü, bilmiyorum. Buna bir isim koymaya çalışmıyorum.
              Ama bunu bir işaret sayıp seni ikna etmeye çalışmayacağım; kararını
              değiştirmeyecek, biliyorum.
            </p>

            <div className={`gaze-instrument ${lens === "sign" ? "is-sign" : "is-chance"}`}>
              <div className="gaze-visual" aria-hidden="true">
                <span className="gaze-orbit gaze-orbit-a" />
                <span className="gaze-orbit gaze-orbit-b" />
                <span className="gaze-intersection" />
                <span className="gaze-dot gaze-dot-a" />
                <span className="gaze-dot gaze-dot-b" />
              </div>
              <div className="gaze-controls">
                <span className="paper-mono">o an, bence:</span>
                <div className="gaze-toggle" role="group" aria-label="Bakışları nasıl adlandırıyorsun">
                  <button className={lens === "sign" ? "is-on" : ""} onClick={() => setLens("sign")} aria-pressed={lens === "sign"}>
                    işaret
                  </button>
                  <button className={lens === "chance" ? "is-on" : ""} onClick={() => setLens("chance")} aria-pressed={lens === "chance"}>
                    tesadüf
                  </button>
                </div>
                <p className="gaze-answer">
                  {lens === "sign"
                    ? "Bilmiyorum. Ama o anlar beni en çok mutlu eden şeylerden."
                    : "Olabilir. Yine de o anlar beni en çok mutlu eden şeylerden."}
                </p>
              </div>
            </div>

            <blockquote className="between-quote">
              “Ama bunları bu açıklama yüzünden yapmayı durdurma. Çünkü beni en çok mutlu
              eden şeylerden biri bu. Çok belli etmesem de.”
            </blockquote>
            <p className="chapter-foot">
              Yalnızca rahatsız olduğun bir şey olursa söylemen yeter. O zaman dururum.
            </p>
          </article>
        </div>

        <div className="between-moments reveal">
          <span className="paper-mono">küçük anlar</span>
          <ul>
            {MOMENTS.map((moment, index) => (
              <li key={moment.time}>
                <span className="moment-no">{String(index + 1).padStart(2, "0")}</span>
                <span className="moment-time">{moment.time}</span>
                <span className="moment-text">{moment.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="between-next reveal">
          <p className="hand">Bir de fotoğraflar meselesi var.</p>
          <button className="text-link text-link-light" onClick={() => onGo("galeri")}>
            Galeri <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  04 — GALLERY                                                       */
/* ================================================================== */

function FrameArt({ kind }: { kind: "sun" | "hall" | "flower" }) {
  if (kind === "sun") {
    return (
      <svg viewBox="0 0 120 150" className="frame-art" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <circle cx="60" cy="58" r="22" />
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          return <line key={index} x1={60 + Math.cos(angle) * 29} y1={58 + Math.sin(angle) * 29} x2={60 + Math.cos(angle) * 37} y2={58 + Math.sin(angle) * 37} />;
        })}
        <path d="M12 132c18-20 32-20 48-6 16 14 32 12 48-8" />
        <path d="M12 138h96" />
      </svg>
    );
  }
  if (kind === "hall") {
    return (
      <svg viewBox="0 0 120 150" className="frame-art" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <path d="M12 138V52l24-22 24 22v86M60 138V52l24-22 24 22v86" />
        <path d="M24 138V60h24v78M72 138V60h24v78" />
        <path d="M12 138h96M18 126h84" />
        <path d="M48 44h24" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 150" className="frame-art" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d="M60 138V82" />
      <path d="M60 116c-12-2-20-10-22-22 13 0 21 7 22 22Z" />
      <path d="M60 104c11-3 18-11 18-23-12 2-18 10-18 23Z" />
      <circle cx="60" cy="56" r="10" />
      {Array.from({ length: 6 }).map((_, index) => {
        const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
        return <circle key={index} cx={60 + Math.cos(angle) * 20} cy={56 + Math.sin(angle) * 20} r="7" />;
      })}
    </svg>
  );
}

export function Gallery({ onGo }: { onGo: (id: string) => void }) {
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (localImage) URL.revokeObjectURL(localImage);
    };
  }, [localImage]);

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (localImage) URL.revokeObjectURL(localImage);
    setLocalImage(URL.createObjectURL(file));
    setImageName(file.name);
    event.target.value = "";
  };

  return (
    <section id="galeri" className="gallery" aria-labelledby="gallery-title">
      <div className="shell">
        <SectionLabel no="03">galeri</SectionLabel>
        <div className="gallery-head reveal">
          <div>
            <p className="eyebrow-mono">henüz çekilmemiş kareler</p>
            <h2 id="gallery-title" className="display">
              Galerin<br /><em>şimdilik boş.</em>
            </h2>
          </div>
          <div className="gallery-head-copy">
            <p>
              Fotoğraflarını buraya koymak isterdim. Ama elimde güzel çekilmiş bir
              fotoğrafın yok.
            </p>
            <p className="gallery-konya">
              <span className="hand">Konyalı elemanın gönderdikleri hariç.</span>
            </p>
            <p>
              Belki de bundan sonra galerim senin karelerinle dolar. O zamana kadar
              bu üç çerçeve senin için boş duruyor.
            </p>
          </div>
        </div>

        <div className="gallery-layout">
          <figure className="gallery-plate reveal">
            <div className="gallery-plate-image">
              <img src="/ela/gallery.jpg" alt="Fildişi bir duvarın önünde boş pirinç çerçeveler" loading="lazy" />
              <span className="gallery-plate-number">01 / 03</span>
              <span className="gallery-plate-caption">boş çerçeveler, dolu bir niyet.</span>
            </div>
            <figcaption>
              <span className="paper-mono">şimdilik boş</span>
              <span className="hand">Bir gün senin fotoğraflarınla.</span>
            </figcaption>
          </figure>

          <div className="gallery-frames">
            {FRAMES.map((frame, index) => (
              <article key={frame.no} className={`empty-frame reveal frame-${frame.kind}`}>
                <div className="frame-head">
                  <span className="paper-mono">{frame.no}</span>
                  <span className="paper-mono">{frame.caption}</span>
                </div>
                <div className="frame-mat">
                  {index === 2 && localImage ? (
                    <img src={localImage} alt="Ela'nın bu sayfaya bıraktığı fotoğraf" />
                  ) : (
                    <>
                      <FrameArt kind={frame.kind} />
                      <span className="frame-empty-label">burada bir fotoğraf olacaktı</span>
                    </>
                  )}
                </div>
                <div className="frame-foot">
                  <strong>{frame.title}</strong>
                  <span>9A</span>
                </div>
                {index === 2 && (
                  <div className="frame-upload">
                    <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} aria-label="Bu çerçeveye bir fotoğraf bırak" />
                    <button onClick={() => inputRef.current?.click()}>
                      <ImagePlus size={15} strokeWidth={1.5} />
                      {localImage ? "başka bir kare" : "bir kare bırak"}
                    </button>
                    {localImage && (
                      <button className="frame-remove" onClick={() => { URL.revokeObjectURL(localImage); setLocalImage(null); setImageName(""); }} aria-label="Fotoğrafı kaldır">
                        <X size={14} />
                      </button>
                    )}
                    <small>
                      {imageName
                        ? "Yalnızca bu cihazda görünür; hiçbir yere yüklenmez."
                        : "İstersen. Yükleme yok, sadece bu sayfada."}
                    </small>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        <div className="gallery-note reveal">
          <p className="hand">“Belki bundan sonra galerim dolar.”</p>
          <div>
            <p>
              Bunu bir istek gibi yazmadım. Sadece bu sayfada senin için bir yer
              ayırmak istedim.
            </p>
            <button className="text-link" onClick={() => onGo("emek")}>
              Nasıl buraya geldi? <ArrowRight size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  05 — EFFORT                                                        */
/* ================================================================== */

export function Effort() {
  return (
    <section id="emek" className="effort" aria-labelledby="effort-title">
      <div className="shell">
        <SectionLabel no="04">emek</SectionLabel>
        <div className="effort-head reveal">
          <div>
            <p className="eyebrow-mono">kolay olmadı</p>
            <h2 id="effort-title" className="display">
              Bunu bir mesajla<br /><em>geçiştirebilirdim.</em>
            </h2>
          </div>
          <div className="effort-head-copy">
            <p>
              Bir mesaj yazmak on saniye sürerdi. Bunu hazırlamak birkaç akşamımı
              aldı. Senin için doğru kelimeleri bulmak istedim.
            </p>
            <dl className="effort-stats">
              <div><dt>03</dt><dd>akşam</dd></div>
              <div><dt>11</dt><dd>deneme</dd></div>
              <div><dt>01</dt><dd>mektup</dd></div>
            </dl>
          </div>
        </div>

        <div className="draft-stack">
          {DRAFTS.map((draft, index) => (
            <article key={draft.no} className={`draft ${draft.keep ? "is-kept" : ""} reveal`} style={{ "--draft-index": index } as CSSProperties}>
              <div className="draft-head">
                <span className="draft-no">{draft.no}</span>
                <span className="paper-mono">{draft.date}</span>
                <span className={`draft-stamp ${draft.keep ? "is-kept" : ""}`}>{draft.stamp}</span>
              </div>
              <p className={`draft-text ${draft.keep ? "" : "is-crossed"}`}>{draft.text}</p>
              <div className="draft-foot">
                <span className={`draft-status ${draft.keep ? "is-kept" : ""}`}>
                  <Circle size={6} fill="currentColor" strokeWidth={0} /> {draft.status}
                </span>
                <p className="draft-verdict">{draft.verdict}</p>
              </div>
              {draft.keep && (
                <div className="draft-kept-mark" aria-hidden="true">
                  <WaxSeal label="K" size={40} />
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="effort-quote reveal">
          <PencilLine size={22} strokeWidth={1.4} />
          <p>
            Üçüncü taslakta kısa kesmeye karar verdim. Çünkü en doğru şey, bütün
            kelimeleri sığdırmak değil; söylemek istediğimi açıkça söylemekti.
          </p>
        </div>

        <div className="care">
          <div className="care-head reveal">
            <span className="paper-mono">sana üç söz</span>
            <p>Bunları da aceleyle yazmadım.</p>
          </div>
          <ol className="care-list">
            {CARE.map((item) => (
              <li key={item.no} className="reveal">
                <span className="care-no">{item.no}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  06 — QUESTION                                                      */
/* ================================================================== */

export function Question({
  onAnswer,
  selected,
}: {
  onAnswer: (key: AnswerKey) => void;
  selected: AnswerKey | null;
}) {
  const keys = useMemo(() => Object.keys(ANSWERS) as AnswerKey[], []);
  return (
    <section id="soru" className="question" aria-labelledby="question-title">
      <div className="question-light" aria-hidden="true" />
      <div className="shell">
        <SectionLabel no="05" tone="light">cevabın</SectionLabel>
        <div className="question-layout">
          <div className="question-copy reveal">
            <p className="eyebrow-mono eyebrow-light">acele etme</p>
            <h2 id="question-title" className="display display-light">
              <span>Ela,</span>
              <span>bir şey</span>
              <span className="question-accent">soracağım.</span>
            </h2>
            <p className="question-lead">
              Birbirimizi biraz daha tanıyalım mı? Büyük bir plan değil. Okulda daha
              çok sohbet etmek. Nasıl rahat hissediyorsan.
            </p>
            <div className="question-signature">
              <span className="hand">— Kadir</span>
              <span className="paper-mono">9A · bunu bilmen yeter</span>
            </div>
            <div className="question-quote">
              <Sparkles size={18} strokeWidth={1.3} />
              <p>Hangi cevabı seçersen seç, bu sayfa sana bir borç yüklemiyor.</p>
            </div>
          </div>

          <div className="answer-card reveal">
            <div className="answer-card-head">
              <span className="paper-mono">ELA’NIN CEVABI</span>
              <WaxSeal label="E" size={40} />
            </div>
            <p className="answer-hint">İçinden geçen hangisine daha yakın?</p>
            <div className="answer-list" role="group" aria-label="Cevap seçenekleri">
              {keys.map((key, index) => {
                const answer = ANSWERS[key];
                return (
                  <button
                    key={key}
                    className={`answer-option answer-${key} ${selected === key ? "is-selected" : ""}`}
                    onClick={() => onAnswer(key)}
                    aria-pressed={selected === key}
                  >
                    <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="answer-copy">
                      <strong>{answer.label}</strong>
                      <em>{answer.noteLabel}</em>
                    </span>
                    <span className="answer-arrow"><ChevronRight size={18} strokeWidth={1.4} /></span>
                  </button>
                );
              })}
            </div>
            <p className="answer-foot">
              Dört cevap da birbirinden değerli. Hiçbirini seçmek zorunda değilsin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  REPLY                                                              */
/* ================================================================== */

const petals = Array.from({ length: 18 }, (_, index) => ({
  left: 3 + ((index * 41) % 94),
  delay: (index % 9) * 0.7,
  duration: 8 + (index % 5) * 1.6,
  drift: -34 + ((index * 57) % 68),
  size: 9 + (index % 4) * 4,
  rotate: (index * 43) % 360,
}));

export function Reply({
  answer,
  message,
  setMessage,
  onCopy,
  copied,
  copyHint,
  onReset,
}: {
  answer: AnswerKey;
  message: string;
  setMessage: (value: string) => void;
  onCopy: () => void;
  copied: boolean;
  copyHint: string;
  onReset: () => void;
}) {
  const content = ANSWERS[answer];
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(message.trim())}`;
  return (
    <section id="cevap" className={`reply reply-${answer}`} aria-live="polite">
      {answer === "yes" && (
        <div className="petal-field" aria-hidden="true">
          {petals.map((petal, index) => (
            <span
              key={index}
              className="petal"
              style={
                {
                  left: `${petal.left}%`,
                  animationDelay: `${petal.delay}s`,
                  animationDuration: `${petal.duration}s`,
                  "--drift": `${petal.drift}px`,
                  width: petal.size,
                  height: petal.size * 1.6,
                  rotate: `${petal.rotate}deg`,
                } as CSSProperties
              }
            >
              <Flower2 strokeWidth={1.1} />
            </span>
          ))}
        </div>
      )}
      <div className="shell reply-shell">
        <div className="reply-copy">
          <p className="eyebrow-mono">{content.kicker}</p>
          <h2 className="display">{content.title}</h2>
          <p>{content.body}</p>
          <p className="reply-note hand">{content.note}</p>
          <p className="reply-sign hand">Kadir</p>
        </div>
        <div className="reply-card">
          <div className="reply-card-head">
            <span className="paper-mono">CEVABIN HAZIR</span>
            <WaxSeal label="E" size={40} />
          </div>
          <label htmlFor="ela-reply">İstersen bana böyle yazabilirsin</label>
          <textarea
            id="ela-reply"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <div className="reply-actions">
            <button onClick={onCopy} disabled={!message.trim()}>
              {copied ? <CheckMark /> : <Copy size={16} strokeWidth={1.6} />}
              {copied ? "Kopyalandı" : "Mesajı kopyala"}
            </button>
            <a
              href={message.trim() ? whatsapp : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!message.trim()}
              onClick={(event) => { if (!message.trim()) event.preventDefault(); }}
            >
              <Send size={16} strokeWidth={1.6} /> WhatsApp’ta paylaş
            </a>
          </div>
          {copyHint && <p className="copy-hint">{copyHint}</p>}
          <p className="reply-privacy">
            {answer === "no"
              ? "Cevap vermesen de olur. Bu sayfada hiçbir şey saklanmıyor; yalnızca istersen kopyalayabilirsin."
              : "Cevabın bu sayfada saklanmaz. WhatsApp’ı seçersen mesajı göndermeden önce orada görürsün."}
          </p>
          <button className="reply-reset" onClick={onReset}>
            {answer === "no" ? "Sayfaya dön" : "Başka bir cevap seç"}
          </button>
        </div>
      </div>
    </section>
  );
}

function CheckMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 10.5 8 14.5 16 5.5" />
    </svg>
  );
}
