import Head from "next/head";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { GetStaticProps } from "next";

type Props = { apkAvailable: boolean };
function Wave({ small = false }: { small?: boolean }) {
  return <svg width={small ? 28 : 56} height={small ? 28 : 56} viewBox="0 0 108 108" fill="none" aria-hidden="true">
    <path d="M30 26 C20 35 40 44 30 54 C20 64 40 73 30 82 M54 26 C44 35 64 44 54 54 C44 64 64 73 54 82 M78 26 C68 35 88 44 78 54 C68 64 88 73 78 82" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
  </svg>;
}
function Arrow() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
export default function Home({ apkAvailable }: Props) {
  return <>
    <Head>
      <title>Esin — Müzik İkizini Bul</title>
      <meta name="description" content="On şarkı seç, müzik zevkini paylaşan insanlarla tanış. Esin sadece Android'de." />
      <meta name="theme-color" content="#000000" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    </Head>
    <div className="site-shell">
      <header className="topbar"><a className="wordmark" href="#baslangic" aria-label="Esin ana sayfa"><Wave small /><span>esin<span className="dot">.</span></span></a><span className="top-note"><span className="status-dot" /> ANDROID İÇİN</span></header>
      <main id="baslangic">
        <section className="hero" aria-labelledby="hero-title">
          <div className="halo" aria-hidden="true" />
          <div className="hero-mark"><Wave /></div>
          <p className="brand-title">Esin</p>
          <p className="eyebrow"><span /> MÜZİKLE BİRBİRİMİZE YAKINIZ</p>
          <h1 id="hero-title">Müzik İkizini <em>Bul.</em></h1>
          <p className="hero-copy">Bazı şarkılar sadece sana aitmiş gibi hissettirir.<br className="desktop" /> Belki de onları senin gibi hisseden biri daha vardır.</p>
          {apkAvailable ? <a className="download" href="/app-release.apk" download><Arrow /> APK İndir <span>(Android)</span></a> : <span className="download disabled" aria-disabled="true"><Arrow /> APK hazırlanıyor <span>(Android)</span></span>}
          <p className="download-note">Play Store’da yok. Yükleme için bilinmeyen kaynaklara<br className="desktop" /> izin vermen gerekir.</p>
          <a className="version-link" href="/version.json">Sürüm bilgileri <span>↗</span></a>
        </section>
        <section className="how" aria-labelledby="how-title">
          <div className="how-heading"><div><p className="eyebrow">KÜÇÜK BİR BAŞLANGIÇ</p><h2 id="how-title">Kurulum nasıl yapılır?</h2></div><p>Üç küçük adım, binlerce ortak şarkı.</p></div>
          <div className="steps">
            <article><span className="step-number">01</span><div className="step-icon">↓</div><h3>APK’yı indir</h3><p>Yukarıdaki butona dokun ve Esin’i telefonuna indir.</p></article>
            <article><span className="step-number">02</span><div className="step-icon">⌁</div><h3>İzin ver</h3><p>İstendiğinde tarayıcın için “bilinmeyen uygulamaları yükle” iznini aç.</p></article>
            <article><span className="step-number">03</span><div className="step-icon">♫</div><h3>Müziğe karış</h3><p>Dosyayı açıp yükle. On şarkı seç, gerisini müziğe bırak.</p></article>
          </div>
          <p className="protect-note"><span>ⓘ</span> Google Play Protect, mağaza dışından yüklenen uygulamalar için uyarı gösterebilir. Yalnızca güvendiğin kaynaklardan yükleme yap.</p>
        </section>
      </main>
      <footer><div className="footer-brand"><Wave small /><span>esin<span className="dot">.</span></span></div><span>Müzik İkizini Bul.</span><span>Powered by Audius</span></footer>
    </div>
  </>;
}
// The APK is deliberately never a fake placeholder. The release script supplies it before deploy.
export const getStaticProps: GetStaticProps<Props> = async () => ({ props: { apkAvailable: existsSync(join(process.cwd(), "public", "app-release.apk")) } });
