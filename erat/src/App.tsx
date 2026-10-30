import { useEffect, useState } from "react";
import { ANSWERS, type AnswerKey } from "./ela/data";
import {
  CursorHalo,
  MenuOverlay,
  ReadingRail,
  SiteFooter,
  SiteNav,
  scrollToSection,
  useActiveSection,
  useReveal,
  useScrollProgress,
  useScrolled,
} from "./ela/parts";
import { Between, Effort, Gallery, Letter, Opening, Question, Reply } from "./ela/sections";

export default function App() {
  const [letterOpen, setLetterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [answer, setAnswer] = useState<AnswerKey | null>(null);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyHint, setCopyHint] = useState("");

  const active = useActiveSection();
  const progress = useScrollProgress();
  const scrolled = useScrolled(36);
  useReveal();

  useEffect(() => {
    document.documentElement.lang = "tr";
    document.documentElement.dir = "ltr";
    document.title = "Ela — sana bir notum var.";
  }, []);

  const scrollTo = (id: string, delay = 60) => {
    window.setTimeout(() => scrollToSection(id), delay);
  };

  const go = (id: string) => {
    setMenuOpen(false);
    if (id === "mektup") {
      setLetterOpen(true);
      scrollTo("mektup", 120);
      return;
    }
    scrollTo(id, 30);
  };

  const openLetter = () => {
    setMenuOpen(false);
    setLetterOpen(true);
    scrollTo("mektup", 140);
  };

  const chooseAnswer = (key: AnswerKey) => {
    setAnswer(key);
    setMessage(ANSWERS[key].message);
    setCopied(false);
    setCopyHint("");
    scrollTo("cevap", 180);
  };

  const resetAnswer = () => {
    setAnswer(null);
    setMessage("");
    setCopied(false);
    setCopyHint("");
    scrollTo("soru", 80);
  };

  const copyReply = async () => {
    if (!message.trim()) return;
    try {
      await navigator.clipboard.writeText(message.trim());
      setCopied(true);
      setCopyHint("");
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      try {
        const area = document.getElementById("ela-reply") as HTMLTextAreaElement | null;
        area?.focus();
        area?.select();
        const ok = document.execCommand("copy");
        if (ok) {
          setCopied(true);
          setCopyHint("");
          window.setTimeout(() => setCopied(false), 2600);
          return;
        }
      } catch {
        /* fall through to hint */
      }
      setCopyHint("Metni seçtim. Basılı tutup kopyalayabilirsin.");
    }
  };

  return (
    <div className="ela" data-answer={answer ?? "none"}>
      <div className="paper-grain" aria-hidden="true" />
      <div className="reading-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <CursorHalo />
      <SiteNav scrolled={scrolled} menuOpen={menuOpen} onMenu={() => setMenuOpen((open) => !open)} onLetter={openLetter} />
      <ReadingRail active={active} onGo={go} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} onGo={go} />

      <main>
        <Opening onOpenLetter={openLetter} onGo={go} />
        <Letter open={letterOpen} onOpen={openLetter} onGo={go} />
        <Between onGo={go} />
        <Gallery onGo={go} />
        <Effort />
        <Question onAnswer={chooseAnswer} selected={answer} />
        {answer && (
          <Reply
            answer={answer}
            message={message}
            setMessage={setMessage}
            onCopy={copyReply}
            copied={copied}
            copyHint={copyHint}
            onReset={resetAnswer}
          />
        )}
      </main>

      <SiteFooter onGo={go} />
    </div>
  );
}
