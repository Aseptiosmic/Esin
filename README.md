# Esin

**Müzik İkizini Bul.** Android için koyu temalı müzik çalar ve müzik zevki eşleştirme uygulaması. Kaynak kodu Android uygulaması (`app/`), Next.js indirme sayfası (`web/`), Supabase şeması (`supabase/schema.sql`) ve imzalı sürüm betiğinden (`scripts/release.sh`) oluşur. Reklam SDK'sı yoktur.

> **Derleme durumu:** `Esin-1.0.0.apk` Git dışında tutulur; gerçek, R8 ile küçültülmüş ve release anahtarıyla imzalanmış bir deneme APK’sıdır. Bu derleme Supabase/Audius kimlik bilgileri olmadan yapılmıştır: Supabase eşleştirmesi ve senkronizasyon çalışmaz; üretim yapılandırmasıyla yeniden derlenmelidir. Fiziksel cihaz testi ve Vercel yayını henüz yapılmadı. `web/public/version.json` zorunlu olmayan başlangıç manifestidir ve web indirmesi yayın APK’sı sağlanana kadar kapalıdır.

## Gereksinimler

- JDK 17; Android Studio ve Android SDK Platform **35**, Build Tools ve platform-tools.
- Gradle Wrapper 8.10.2 indirme erişimi; Google Maven ve Maven Central erişimi.
- Node.js 20.9+ (tercihen Node 22), npm ve Python 3; yayında `sha256sum`, SDK `apksigner` ve Vercel CLI.
- Supabase projesi ve Audius API erişimi. Emülatör/telefon: Android 8.0+; gerçek cihaz testi özellikle Android 13, 14 ve 15'te önerilir.

## 1. Supabase'i hazırlama

1. Supabase Dashboard → **Authentication → Providers** bölümünden **Allow anonymous sign-ins** özelliğini açın.
2. **DİKKAT:** `supabase/schema.sql` mevcut `public.users` ve `public.profiles` tablolarını ve verilerini siler. Yalnızca yeni projede veya yedek aldıktan sonra SQL Editor'da **bir kez** çalıştırın. Var olan veritabanında bunun yerine bir migrasyon hazırlayın.
3. Project URL ve **anon/publishable** anahtarını alın. `service_role`, secret API key veya veritabanı parolasını APK'ya, `local.properties`'e ya da repoya koymayın.
4. Şema `profiles` için RLS ve yalnızca kendi satırına erişim politikaları kurar. `find_twins` yalnızca `authenticated` rolüne açıktır ve kendi kayıtlı şarkı/sanatçı listesi dışındaki sorgu girdilerini reddeder. RPC, şartnamedeki gibi karşı tarafın **tür sayıları özetini** ve ortak ID'leri döndürür; ham profil satırı döndürmez. Anon anahtarın APK'da görünür olması normaldir; yetki sınırı RLS'dir.

Anonim oturum aynı kurulumda saklanır. Uygulama verisi silinirse veya uygulama kaldırılırsa hesabı geri getirecek bir giriş yöntemi yoktur. Ağ hatasında profil yerelde kalır, `pending_sync` ve ağa bağlı WorkManager işi ile tekrar gönderilir.

## 2. Yerel yapılandırma ve geliştirme

```bash
cp local.properties.example local.properties
# local.properties dosyasını Android SDK yolunuz ve aşağıdaki değerlerle düzenleyin.
./gradlew :app:assembleDebug
```

`local.properties` içinde:

```properties
sdk.dir=/Android/Sdk
SUPABASE_URL=https://proje.supabase.co
SUPABASE_ANON_KEY=anon_veya_publishable_anahtar
AUDIUS_API_KEY=audius_api_key
AUDIUS_TOKEN=audius_bearer_token
```

Audius için `https://api.audius.co/plans` üzerinden anahtar alın. İstekler `https://api.audius.co/v1/` adresine gider; `Authorization: Bearer ...` ve `app_name=Esin` kullanılır. Bu spesifikasyonda API key bilgi amaçlı BuildConfig'te tutulur; **Bearer token** HTTP yetkilendirmesinde kullanılır. `local.properties` Git tarafından izlenmez, ancak derlenmiş istemcideki her değer çıkarılabilir. **Bearer token'ı gizli kabul etmeyin**; kullanıcı adına işlem yetkili veya kritik bir token kullanmayın, sınırlandırın ve gerektiğinde döndürün. Audius'un güncel SDK belgeleri Bearer token'ın istemcide yayınlanmamasını önermektedir; üretimde güvenli alternatif, yetki ve hız sınırlı bir sunucu proxy'sidir. Bu proje, verilen istemci-içi Bearer şartını uygular; gerçek yayın öncesi Audius kullanım koşullarını ve çevrimdışı saklama izinlerini doğrulayın.

Android Studio ile kök klasörü açabilir veya `./gradlew :app:testDebugUnitTest` çalıştırabilirsiniz. Room şemaları `app/schemas/` altında tutulur; KSP ilk derlemede şemayı yeniden oluşturur. Değişikliklerde üretilen JSON'u gözden geçirip sürüm kontrolüne alın, veritabanı sürümünü artırın ve açık bir migration yazın; yıkıcı otomatik migration kullanılmaz.

## 3. Keystore ve imzalı APK

**Tüm sürümler aynı keystore ve aynı anahtarla imzalanmalıdır.** Bu çalışma alanında oluşturulan ilk anahtar `private/esin-release.jks`, yerel yapılandırması `keystore.properties` ve yedeği `private/Esin-signing-backup.tar.gz` konumundadır. **Yedek şifrelenmemiş anahtarı ve parolalarını içerir:** güvenli, ayrı ve geri yüklenebilir bir yere taşıyın; Git veya web’e koymayın. Kaybederseniz bu anahtarla yüklenmiş sürümlerin üzerine güncelleme yapılamaz. Bu yeni anahtar, önceki farklı anahtarla imzalanmış kurulumları da güncelleyemez.

İlk kez bir anahtar oluşturmak için (parolalar etkileşimli sorulur):

```bash
keytool -genkeypair -v -keystore /güvenli/konum/esin-release.jks \
  -alias esin -keyalg RSA -keysize 4096 -validity 10000
cp keystore.properties.example keystore.properties
# storeFile, storePassword, keyAlias, keyPassword değerlerini düzenleyin.
./gradlew assembleRelease
```

Bu görev, yapılandırılmış keystore yoksa debug anahtarına düşmek veya imzasız APK üretmek yerine hata verir. Çıktı: `app/build/outputs/apk/release/app-release.apk`. R8 ve kaynak küçültme release'te açıktır. İmzalama parolaları yalnızca Gradle tarafından okunur; **BuildConfig'e yazılmaz**.

## 4. Sürüm yayınlama

1. `app/build.gradle.kts` içindeki `versionCode` değerini her yayın için artırın ve `versionName` değerini güncelleyin.
2. Aşağıdaki betik imzalı APK'yı derler, `apksigner` ile doğrular, ilk imza sertifikasının SHA-256 parmak izini `scripts/release-certificate.sha256` içine kaydeder (bu dosyayı Git'e ekleyin), sonraki yayınlarda aynı sertifikayı zorunlu tutar, APK SHA-256'sını hesaplar, APK'yı `web/public/` içine koyar ve `version.json` dosyasını günceller:

```bash
./scripts/release.sh --optional --changelog 'Hata düzeltmeleri'
# Gerektiğinde zorunlu güncelleme:
./scripts/release.sh --force --min-version-code 2 --changelog 'Güvenlik güncellemesi'
```

`--min-version-code`, yeni `versionCode` değerini aşamaz. `--force`, son sürümden eski bütün kurulumları; `min_version_code` ise belirtilen minimumdan eski kurulumları engeller. Manifest ve APK'yı **aynı Vercel dağıtımında** yayınlayın. SHA yanlışsa Android dosyayı siler ve kurulumu başlatmaz. Android güncellemesi ayrıca işletim sistemince aynı imzayla doğrulanır.

3. `web/` klasörünü Vercel projesinin root directory'si yapın ve `esin.vercel.app` alan adını projeye bağlayın. İmzalı APK büyük bir üretilmiş dosya olduğu için `.gitignore` içindedir; Git bağlantılı bir dağıtım tek başına APK'yı taşımaz. Betik çalıştıktan sonra **yalnızca `web/` dizininden** Vercel CLI ile dağıtın:

```bash
cd web
npm ci
vercel --prod
```

`web/.vercelignore` APK'yı dışlamaz. Canlıya aldıktan sonra `/app-release.apk` dosyasının gerçekten indirildiğini, `/version.json` içindeki özetle eşleştiğini ve Cache-Control/MIME başlıklarını doğrulayın. Keystore ve yerel yapılandırmanın `web/` altında olmadığından emin olun. Play Protect mağaza dışı yüklemelerde uyarı gösterebilir.

## Web geliştirme

```bash
cd web
npm ci
npm run dev
# http://localhost:3000
npm run typecheck
npm run build
```

Vercel kuralları `web/vercel.json` içindedir; Next yapılandırması aynı başlıkları yerel önizleme için de ekler. APK hazır değilse sayfa hatalı bir dosya sunmak yerine “APK hazırlanıyor” gösterir.

## Testler ve yayın öncesi kontrol

```bash
./gradlew :app:testDebugUnitTest
cd supabase/tests && npm ci && npm test  # PGlite ile RLS/RPC sınamaları
```

Fiziksel cihazlarda ayrıca: 10 şarkıdan önce ve süreç sonlandırılıp açıldığında Home'a geçilemediğini; anonim oturumun ve başarısız senkronizasyonun ağ geri gelince toparlandığını; izin reddiyle çalmanın devam ettiğini; ekran kilidi/bildirim kontrollerini; indirme tamamlandıktan sonra ağ kapalıyken çalmayı; depolama dolması ve `.part` temizliğini; sürüm manifesti önbellek ve zorunlu dialog davranışını; bilinmeyen kaynak izni/yanlış SHA/doğru SHA ve **aynı imzalı APK** ile güncelleme kurulumunu test edin. R8'li release'i gerçek cihazda açıp Audius, Room, serialization ve Hilt akışlarını da kontrol edin.

GitHub barındırılan Android SDK ile `assembleRelease` ve R8 başarıyla çalıştı; APK imzası ve ZIP bütünlüğü ayrı doğrulandı. Fiziksel cihaz, canlı Supabase ve güncelleme akışı henüz test edilmedi. Web derlemesi ve bağımsız SQL/hesaplama testleri de çalıştırılmıştır; yayın öncesi yukarıdaki Android doğrulamaları zorunludur.
