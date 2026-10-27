import Head from 'next/head';
import {existsSync} from 'fs';
import path from 'path';
import styles from '../styles/Home.module.css';

export async function getStaticProps(){
  return {props:{apkAvailable:existsSync(path.join(process.cwd(),'public/app-release.apk'))}};
}

export default function Home({apkAvailable}:{apkAvailable:boolean}){
  return <>
    <Head>
      <title>Esinfy — Müzik İkizini Bul</title>
      <meta name="description" content="On şarkını seç, müzik zevkine en yakın insanlarla eşleş. Esinfy: reklamsız müzik keşfi ve çevrimdışı dinleme."/>
      <meta name="theme-color" content="#050507"/>
      <meta property="og:title" content="Esinfy — Müzik İkizini Bul"/>
      <meta property="og:description" content="Müzik zevkini paylaşan insanlarla tanış."/>
    </Head>
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href="#top" aria-label="Esinfy ana sayfa"><span className={styles.brandMark}>≋</span><span>esinfy</span></a>
        <nav className={styles.navLinks}><a href="#kesfet">Nasıl çalışır</a><a href="#ozellikler">Özellikler</a><a href="#sss">SSS</a></nav>
        {apkAvailable?<a className={styles.navCta} href="/app-release.apk" download>APK indir <span>↗</span></a>:<a className={styles.navCtaDisabled} href="#indir">Çok yakında</a>}
      </header>

      <section className={styles.hero} id="top">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span className={styles.liveDot}/> ANDROID İÇİN · ÜCRETSİZ · REKLAMSIZ</div>
          <h1>Müzik ikizini <span>bul.</span></h1>
          <p className={styles.lede}>En sevdiğin 10 şarkıyı seç. Aynı şarkılarda buluştuğun insanlarla tanış; dinlediklerin seni anlatsın.</p>
          <div className={styles.heroActions}>
            {apkAvailable?<a className={styles.primary} href="/app-release.apk" download>Android için indir <span>↓</span></a>:<a className={styles.primaryDisabled} href="#indir">APK hazırlanıyor <span>·</span></a>}
            <a className={styles.secondary} href="#kesfet">Esinfy’yi keşfet <span>↓</span></a>
          </div>
          {!apkAvailable&&<p className={styles.availability}>İmzalı APK yayına alındığında indirme düğmesi burada etkinleşecek.</p>}
          <div className={styles.heroMeta}><span>◉&nbsp; Android</span><i/><span>♪&nbsp; Powered by Audius</span><i/><span>◈&nbsp; Gizli reklam yok</span></div>
        </div>
        <div className={styles.visual} aria-label="Esinfy müzik çalar önizlemesi">
          <div className={styles.orbit}/><div className={styles.orbitTwo}/>
          <div className={styles.phone}>
            <div className={styles.phoneTop}><span>9:41</span><span>•••</span></div>
            <div className={styles.phoneLabel}>ŞİMDİ ÇALIYOR</div>
            <div className={styles.album}><div className={styles.albumGlow}/><span className={styles.albumSymbol}>◌</span><span className={styles.albumCaption}>AFTER<br/>HOURS</span></div>
            <div className={styles.songInfo}><b>Geceye Dön</b><span>Yol Arkadaşları</span></div>
            <div className={styles.fakeProgress}><i/></div><div className={styles.fakeTimes}><span>1:24</span><span>−2:08</span></div>
            <div className={styles.playControls}><span>↻</span><span>◀</span><b>Ⅱ</b><span>▶</span><span>⇄</span></div>
            <div className={styles.miniTwin}><span className={styles.twinAvatar}>E</span><span><b>Müzik ikizin burada</b><small>Benzerlik · %92</small></span><span className={styles.twinArrow}>↗</span></div>
          </div>
          <div className={styles.floatingTag}><span>✦</span> Senin frekansın</div>
        </div>
      </section>

      <section className={styles.stats}>
        <div><b>10</b><span>şarkı ile başla</span></div><i/><div><b>0</b><span>reklam, gerçekten</span></div><i/><div><b>∞</b><span>yeni müzik ikizi</span></div>
      </section>

      <section className={styles.section} id="kesfet">
        <div className={styles.sectionHead}><div><div className={styles.eyebrow}>KENDİ FREKANSINI BUL</div><h2>Bir eşleşme,<br/><span>on şarkı uzağında.</span></h2></div><p>Uzun profiller yok, karmaşa yok. Müzik zevkini birkaç dokunuşta anlat ve sana benzeyen dinleyicileri keşfet.</p></div>
        <div className={styles.steps}>
          <article className={styles.step}><span className={styles.stepNo}>01</span><div className={styles.stepIcon}>♫</div><h3>On şarkı seç</h3><p>Trendlerden keşfet ya da sevdiğin parçayı ara. Her seçimin seni biraz daha anlatır.</p><div className={styles.progressDots}><b/><b/><b/><b/><b/><i/><i/><i/><i/><i/></div></article>
          <article className={styles.step}><span className={styles.stepNo}>02</span><div className={styles.stepIcon}>◎</div><h3>İkizini keşfet</h3><p>Ortak parçalar ve müzik türleri üzerinden sana en yakın dinleyicilerle eşleş.</p><div className={styles.matchMini}><span>♪</span><span>♫</span><span>♬</span><b>%92 uyum</b></div></article>
          <article className={styles.step}><span className={styles.stepNo}>03</span><div className={styles.stepIcon}>⌁</div><h3>Dinlemeye devam et</h3><p>Beğendiğin şarkıları indir, çevrimdışıyken bile müziğin yanında olsun.</p><div className={styles.offlineMini}><span>↓</span> Cihazına kaydedildi <b>✓</b></div></article>
        </div>
      </section>

      <section className={styles.featureBand} id="ozellikler">
        <div className={styles.featureIntro}><div className={styles.eyebrow}>MÜZİĞİN ÖN PLANDA</div><h2>Sadece müzik.<br/><span>Gereksiz hiçbir şey yok.</span></h2><p>Esinfy, müziği keşfetmek ve paylaşmak için tasarlandı. Feed kalabalığına, reklamlara ve gereksiz hesap kurulumlarına veda et.</p></div>
        <div className={styles.featureList}>
          <article><span>01</span><div><h3>Reklamsız, sakin bir alan</h3><p>Takipçi yarışı yok. Dikkatini dağıtan reklamlar yok. Müzik ve gerçek eşleşmeler var.</p></div><b>↗</b></article>
          <article><span>02</span><div><h3>Çevrimdışı da seninle</h3><p>Şarkılarını cihazına indir; internet bağlantısı olmadan dinlemeye devam et.</p></div><b>↗</b></article>
          <article><span>03</span><div><h3>Ekran kapalıyken çalmaya devam</h3><p>Arka planda ve kilit ekranında oynatmayı kontrol et. Kulaklığınla kesintisiz dinle.</p></div><b>↗</b></article>
          <article><span>04</span><div><h3>Anonim başla</h3><p>E-posta ya da telefon numarası gerekmez. Bir takma ad seç, müziğin konuşsun.</p></div><b>↗</b></article>
        </div>
      </section>

      <section className={styles.downloadSection} id="indir">
        <div className={styles.downloadGlow}/><div className={styles.eyebrow}>İLK ADIMINI AT</div>
        <h2>Bir sonraki favorin<br/>belki de <span>bir insan.</span></h2>
        <p>Esinfy’yi Android cihazına yükle ve müzik zevkini paylaşan insanlarla tanış.</p>
        {apkAvailable?<a className={styles.primary} href="/app-release.apk" download>APK indir <span>↓</span></a>:<div className={styles.releaseStatus}><span className={styles.statusPulse}/> İmzalı Android sürümü hazırlanıyor</div>}
        <small>Android 8.0 ve üzeri · Ücretsiz · Play Store dışında dağıtılır</small>
      </section>

      <section className={styles.faq} id="sss">
        <div><div className={styles.eyebrow}>MERAK EDİLENLER</div><h2>Kısa ve net.</h2><p>Esinfy hakkında bilmen gerekenler.</p></div>
        <div className={styles.faqList}>
          <details><summary>Esinfy nedir?<span>＋</span></summary><p>Müzik zevkine göre benzer dinleyicilerle eşleşmeni sağlayan, Android için hazırlanmış reklamsız bir müzik keşif uygulamasıdır.</p></details>
          <details><summary>Nasıl eşleşiyorum?<span>＋</span></summary><p>İlk kullanımda sevdiğin 10 şarkıyı seçersin. Esinfy ortak şarkıları ve müzik türlerini karşılaştırarak sana yakın dinleyicileri gösterir.</p></details>
          <details><summary>Uygulama nereden indirilir?<span>＋</span></summary><p>Esinfy Google Play Store’da bulunmaz. İmzalı APK yalnızca bu siteden indirilebilir; Android ayarlarından bu kaynağa yükleme izni vermen gerekir.</p></details>
          <details><summary>Müziği kim sağlıyor?<span>＋</span></summary><p>Esinfy müzik keşfi ve yayın akışı için Audius API’sini kullanır. Sanatçı adı her parçada görünür ve çalardan Audius’a geçebilirsin.</p></details>
        </div>
      </section>

      <footer className={styles.footer}><a className={styles.brand} href="#top"><span className={styles.brandMark}>≋</span><span>esinfy</span></a><span>Müzik İkizini Bul</span><div><a href="/version.json">Sürüm bilgisi</a><a href="https://audius.co" target="_blank" rel="noreferrer">Powered by Audius ↗</a></div><small>© 2026 Esinfy</small></footer>
    </main>
  </>;
}
