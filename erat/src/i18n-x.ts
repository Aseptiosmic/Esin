import type { LangCode } from "./i18n";

export type XDict = {
  nav: { archive: string; analyze: string; board: string };
  kinds: { all: string; component: string; object: string; model: string; motion: string; image: string; palette: string; type: string; study: string };
  grid: string; list: string; save: string; saved: string; live: string; credit: string; by: string; source: string; visit: string;
  download: string; material: string; original: string; similar: string; promptsCode: string; contrast: string; specimen: string; editHint: string;
  count: string;
  lib: { scroll: string; fly: string; of: string };
  analyze: { title: string; sub: string; placeholder: string; run: string; running: string; drop: string; or: string; error: string; palette: string; mood: string; prompt: string; measured: string; examples: string; imagePrompt: string; videoPrompt: string };
  archive: { title: string; sub: string; placeholder: string; loading: string; empty: string; more: string; license: string; open: string; suggestions: string[] };
  board: { title: string; sub: string; empty: string; export: string; share: string; shared: string; clear: string; copyPrompts: string; copied: string };
  study: { voice: string; strengths: string; takeaways: string; livePalette: string; notes: string; loading: string };
};

const en: XDict = {
  nav: { archive: "Archive", analyze: "Analyze", board: "Board" },
  kinds: { all: "Everything", component: "Components", object: "Sculptures", model: "3D Models", motion: "Motion", image: "Imagery", palette: "Palettes", type: "Type", study: "Site studies" },
  grid: "Grid", list: "List", save: "Save", saved: "Saved", live: "Live", credit: "Credit", by: "by", source: "Source", visit: "Visit site",
  download: "Download .glb", material: "Material", original: "Original", similar: "Similar pieces", promptsCode: "Prompts & code", contrast: "Contrast", specimen: "Specimen", editHint: "Click the text to edit it",
  count: "pieces",
  lib: { scroll: "Scroll, drag or hold to walk", fly: "Hold to fly", of: "of" },
  analyze: { title: "Analyze", sub: "Paste any website or drop an image. Erathra measures its palette and mood live, then writes prompts for code, image and video.", placeholder: "unseen.co", run: "Analyze", running: "Measuring…", drop: "Drop an image here", or: "or", error: "That one didn't work. Try another URL or image.", palette: "Measured palette", mood: "Mood", prompt: "Vibe-coding prompt", measured: "Measured live", examples: "Try", imagePrompt: "Image prompt", videoPrompt: "Video prompt" },
  archive: { title: "Archive", sub: "Millions of public images from Wikimedia Commons, searched live. Open one to extract its palette and get a prompt.", placeholder: "Search the open archive", loading: "Searching the archive…", empty: "Nothing found. Try another word.", more: "Load more", license: "Licence", open: "Open on Commons", suggestions: ["pink architecture", "cherry blossom", "clouds", "marble sculpture", "Japanese garden", "seashell"] },
  board: { title: "Board", sub: "Pieces you saved. Export them as a design brief or share the board with a link.", empty: "Nothing saved yet. Tap Save on any piece.", export: "Export brief (.md)", share: "Copy share link", shared: "Link copied", clear: "Clear", copyPrompts: "Copy all prompts", copied: "Copied" },
  study: { voice: "Tone of voice", strengths: "What it does well", takeaways: "Apply it", livePalette: "Palette measured live", notes: "Erathra notes", loading: "Measuring the live site…" },
};

const tr: XDict = {
  nav: { archive: "Arşiv", analyze: "Analiz", board: "Pano" },
  kinds: { all: "Her şey", component: "Bileşenler", object: "Heykeller", model: "3D Modeller", motion: "Hareket", image: "Görseller", palette: "Paletler", type: "Tipografi", study: "Site çalışmaları" },
  grid: "Izgara", list: "Liste", save: "Kaydet", saved: "Kaydedildi", live: "Canlı", credit: "Kaynak", by: "—", source: "Kaynak", visit: "Siteye git",
  download: ".glb indir", material: "Malzeme", original: "Orijinal", similar: "Benzer parçalar", promptsCode: "Promptlar & kod", contrast: "Kontrast", specimen: "Örnek", editHint: "Düzenlemek için metne tıkla",
  count: "parça",
  lib: { scroll: "Yürümek için kaydır, sürükle ya da basılı tut", fly: "Uçmak için basılı tut", of: "/" },
  analyze: { title: "Analiz", sub: "Herhangi bir siteyi yapıştır ya da bir görsel bırak. Erathra paletini ve havasını canlı ölçer; kod, görsel ve video için promptlar yazar.", placeholder: "unseen.co", run: "Analiz et", running: "Ölçülüyor…", drop: "Görseli buraya bırak", or: "ya da", error: "Bu olmadı. Başka bir adres ya da görsel dene.", palette: "Ölçülen palet", mood: "Hava", prompt: "Vibe-coding promptu", measured: "Canlı ölçüldü", examples: "Dene", imagePrompt: "Görsel promptu", videoPrompt: "Video promptu" },
  archive: { title: "Arşiv", sub: "Wikimedia Commons'taki milyonlarca açık görsel, canlı aranır. Birini aç; paletini çıkar ve promptunu al.", placeholder: "Açık arşivde ara", loading: "Arşivde aranıyor…", empty: "Bir şey bulunamadı. Başka bir kelime dene.", more: "Daha fazla", license: "Lisans", open: "Commons'ta aç", suggestions: ["pembe mimari", "kiraz çiçeği", "bulutlar", "mermer heykel", "Japon bahçesi", "deniz kabuğu"] },
  board: { title: "Pano", sub: "Kaydettiğin parçalar. Tasarım brifi olarak dışa aktar ya da panoyu bir bağlantıyla paylaş.", empty: "Henüz kayıt yok. Bir parçada Kaydet'e dokun.", export: "Brif indir (.md)", share: "Paylaşım bağlantısını kopyala", shared: "Bağlantı kopyalandı", clear: "Temizle", copyPrompts: "Tüm promptları kopyala", copied: "Kopyalandı" },
  study: { voice: "Ses tonu", strengths: "İyi yaptığı şeyler", takeaways: "Uygula", livePalette: "Canlı ölçülen palet", notes: "Erathra notları", loading: "Canlı site ölçülüyor…" },
};

const es: XDict = {
  nav: { archive: "Archivo", analyze: "Analizar", board: "Tablero" },
  kinds: { all: "Todo", component: "Componentes", object: "Esculturas", model: "Modelos 3D", motion: "Movimiento", image: "Imágenes", palette: "Paletas", type: "Tipografía", study: "Estudios de sitios" },
  grid: "Cuadrícula", list: "Lista", save: "Guardar", saved: "Guardado", live: "En vivo", credit: "Crédito", by: "por", source: "Fuente", visit: "Visitar sitio",
  download: "Descargar .glb", material: "Material", original: "Original", similar: "Piezas similares", promptsCode: "Prompts y código", contrast: "Contraste", specimen: "Muestra", editHint: "Haz clic en el texto para editarlo",
  count: "piezas",
  lib: { scroll: "Desplaza, arrastra o mantén para caminar", fly: "Mantén para volar", of: "de" },
  analyze: { title: "Analizar", sub: "Pega cualquier web o suelta una imagen. Erathra mide su paleta y ánimo en vivo y escribe prompts.", placeholder: "unseen.co", run: "Analizar", running: "Midiendo…", drop: "Suelta una imagen aquí", or: "o", error: "No funcionó. Prueba otra URL o imagen.", palette: "Paleta medida", mood: "Ánimo", prompt: "Prompt de vibe-coding", measured: "Medido en vivo", examples: "Prueba", imagePrompt: "Prompt de imagen", videoPrompt: "Prompt de vídeo" },
  archive: { title: "Archivo", sub: "Millones de imágenes públicas de Wikimedia Commons, buscadas en vivo.", placeholder: "Buscar en el archivo abierto", loading: "Buscando…", empty: "Nada encontrado.", more: "Cargar más", license: "Licencia", open: "Abrir en Commons", suggestions: ["arquitectura pastel", "flor de cerezo", "pintura de nubes", "escultura de mármol", "jardín japonés", "concha"] },
  board: { title: "Tablero", sub: "Piezas guardadas. Expórtalas como brief o comparte el tablero.", empty: "Aún no hay nada guardado.", export: "Exportar brief (.md)", share: "Copiar enlace", shared: "Enlace copiado", clear: "Vaciar", copyPrompts: "Copiar todos los prompts", copied: "Copiado" },
  study: { voice: "Tono de voz", strengths: "Lo que hace bien", takeaways: "Aplícalo", livePalette: "Paleta medida en vivo", notes: "Notas de Erathra", loading: "Midiendo el sitio…" },
};

const fr: XDict = {
  nav: { archive: "Archive", analyze: "Analyser", board: "Tableau" },
  kinds: { all: "Tout", component: "Composants", object: "Sculptures", model: "Modèles 3D", motion: "Mouvement", image: "Images", palette: "Palettes", type: "Typographie", study: "Études de sites" },
  grid: "Grille", list: "Liste", save: "Enregistrer", saved: "Enregistré", live: "En direct", credit: "Crédit", by: "par", source: "Source", visit: "Visiter le site",
  download: "Télécharger .glb", material: "Matière", original: "Original", similar: "Pièces similaires", promptsCode: "Prompts & code", contrast: "Contraste", specimen: "Spécimen", editHint: "Cliquez sur le texte pour l'éditer",
  count: "pièces",
  lib: { scroll: "Défilez, glissez ou maintenez pour marcher", fly: "Maintenir pour voler", of: "sur" },
  analyze: { title: "Analyser", sub: "Collez un site ou déposez une image. Erathra mesure sa palette et son ambiance en direct, puis écrit des prompts.", placeholder: "unseen.co", run: "Analyser", running: "Mesure…", drop: "Déposez une image ici", or: "ou", error: "Cela n'a pas marché. Essayez une autre URL ou image.", palette: "Palette mesurée", mood: "Ambiance", prompt: "Prompt vibe-coding", measured: "Mesuré en direct", examples: "Essayez", imagePrompt: "Prompt image", videoPrompt: "Prompt vidéo" },
  archive: { title: "Archive", sub: "Des millions d'images publiques de Wikimedia Commons, en direct.", placeholder: "Chercher dans l'archive", loading: "Recherche…", empty: "Rien trouvé.", more: "Plus", license: "Licence", open: "Ouvrir sur Commons", suggestions: ["architecture pastel", "fleur de cerisier", "peinture de nuages", "sculpture en marbre", "jardin japonais", "coquillage"] },
  board: { title: "Tableau", sub: "Vos pièces enregistrées. Exportez un brief ou partagez le tableau.", empty: "Rien d'enregistré pour l'instant.", export: "Exporter le brief (.md)", share: "Copier le lien", shared: "Lien copié", clear: "Vider", copyPrompts: "Copier tous les prompts", copied: "Copié" },
  study: { voice: "Ton", strengths: "Ce qu'il fait bien", takeaways: "À appliquer", livePalette: "Palette mesurée en direct", notes: "Notes Erathra", loading: "Mesure du site…" },
};

const de: XDict = {
  nav: { archive: "Archiv", analyze: "Analyse", board: "Board" },
  kinds: { all: "Alles", component: "Komponenten", object: "Skulpturen", model: "3D-Modelle", motion: "Bewegung", image: "Bilder", palette: "Paletten", type: "Typografie", study: "Website-Studien" },
  grid: "Raster", list: "Liste", save: "Merken", saved: "Gemerkt", live: "Live", credit: "Quelle", by: "von", source: "Quelle", visit: "Website besuchen",
  download: ".glb laden", material: "Material", original: "Original", similar: "Ähnliche Stücke", promptsCode: "Prompts & Code", contrast: "Kontrast", specimen: "Muster", editHint: "Text anklicken zum Bearbeiten",
  count: "Stücke",
  lib: { scroll: "Scrollen, ziehen oder halten zum Gehen", fly: "Halten zum Fliegen", of: "von" },
  analyze: { title: "Analyse", sub: "Füge eine Website ein oder ziehe ein Bild hinein. Erathra misst Palette und Stimmung live und schreibt Prompts.", placeholder: "unseen.co", run: "Analysieren", running: "Messe…", drop: "Bild hier ablegen", or: "oder", error: "Das hat nicht geklappt. Andere URL oder Bild versuchen.", palette: "Gemessene Palette", mood: "Stimmung", prompt: "Vibe-Coding-Prompt", measured: "Live gemessen", examples: "Probiere", imagePrompt: "Bild-Prompt", videoPrompt: "Video-Prompt" },
  archive: { title: "Archiv", sub: "Millionen freier Bilder von Wikimedia Commons, live durchsucht.", placeholder: "Offenes Archiv durchsuchen", loading: "Suche…", empty: "Nichts gefunden.", more: "Mehr laden", license: "Lizenz", open: "Auf Commons öffnen", suggestions: ["Pastell Architektur", "Kirschblüte", "Wolkengemälde", "Marmorskulptur", "Japanischer Garten", "Muschel"] },
  board: { title: "Board", sub: "Deine gemerkten Stücke. Als Brief exportieren oder per Link teilen.", empty: "Noch nichts gemerkt.", export: "Brief exportieren (.md)", share: "Link kopieren", shared: "Link kopiert", clear: "Leeren", copyPrompts: "Alle Prompts kopieren", copied: "Kopiert" },
  study: { voice: "Tonalität", strengths: "Was es gut macht", takeaways: "Anwenden", livePalette: "Live gemessene Palette", notes: "Erathra-Notizen", loading: "Website wird gemessen…" },
};

const ja: XDict = {
  nav: { archive: "アーカイブ", analyze: "分析", board: "ボード" },
  kinds: { all: "すべて", component: "コンポーネント", object: "彫刻", model: "3D モデル", motion: "モーション", image: "イメージ", palette: "パレット", type: "タイポ", study: "サイト研究" },
  grid: "グリッド", list: "リスト", save: "保存", saved: "保存済み", live: "ライブ", credit: "クレジット", by: "—", source: "出典", visit: "サイトへ",
  download: ".glb をダウンロード", material: "マテリアル", original: "オリジナル", similar: "似た作品", promptsCode: "プロンプトとコード", contrast: "コントラスト", specimen: "見本", editHint: "テキストをクリックして編集",
  count: "作品",
  lib: { scroll: "スクロール・ドラッグ・長押しで進む", fly: "長押しで飛ぶ", of: "/" },
  analyze: { title: "分析", sub: "サイトの URL を貼るか画像をドロップ。パレットとムードをライブで測り、プロンプトを書きます。", placeholder: "unseen.co", run: "分析する", running: "測定中…", drop: "ここに画像をドロップ", or: "または", error: "うまくいきませんでした。別の URL か画像で。", palette: "測定したパレット", mood: "ムード", prompt: "バイブコーディング・プロンプト", measured: "ライブ測定", examples: "例", imagePrompt: "画像プロンプト", videoPrompt: "動画プロンプト" },
  archive: { title: "アーカイブ", sub: "Wikimedia Commons の膨大なパブリック画像をライブ検索。", placeholder: "オープンアーカイブを検索", loading: "検索中…", empty: "見つかりません。", more: "もっと見る", license: "ライセンス", open: "Commons で開く", suggestions: ["パステル 建築", "桜", "雲 絵画", "大理石 彫刻", "日本庭園", "貝殻"] },
  board: { title: "ボード", sub: "保存した作品。ブリーフとして書き出すか、リンクで共有。", empty: "まだ保存はありません。", export: "ブリーフを書き出す (.md)", share: "共有リンクをコピー", shared: "コピーしました", clear: "クリア", copyPrompts: "全プロンプトをコピー", copied: "コピー済み" },
  study: { voice: "トーン", strengths: "優れている点", takeaways: "活かし方", livePalette: "ライブ測定パレット", notes: "Erathra ノート", loading: "サイトを測定中…" },
};

const ar: XDict = {
  nav: { archive: "الأرشيف", analyze: "تحليل", board: "اللوحة" },
  kinds: { all: "الكل", component: "مكوّنات", object: "منحوتات", model: "نماذج ثلاثية الأبعاد", motion: "حركة", image: "صور", palette: "لوحات ألوان", type: "طباعة", study: "دراسات مواقع" },
  grid: "شبكة", list: "قائمة", save: "حفظ", saved: "محفوظ", live: "مباشر", credit: "المصدر", by: "—", source: "المصدر", visit: "زيارة الموقع",
  download: "تنزيل ‎.glb", material: "الخامة", original: "الأصلية", similar: "قطع مشابهة", promptsCode: "موجّهات وكود", contrast: "التباين", specimen: "عيّنة", editHint: "انقر على النص لتعديله",
  count: "قطعة",
  lib: { scroll: "مرّر أو اسحب أو اضغط مطولاً للمشي", fly: "اضغط مطولاً للطيران", of: "من" },
  analyze: { title: "تحليل", sub: "ألصق أي موقع أو أسقط صورة. تقيس إراثرا لوحة الألوان والمزاج مباشرة وتكتب الموجّهات.", placeholder: "unseen.co", run: "حلّل", running: "جارٍ القياس…", drop: "أسقط صورة هنا", or: "أو", error: "لم ينجح ذلك. جرّب رابطاً أو صورة أخرى.", palette: "الألوان المقاسة", mood: "المزاج", prompt: "موجّه البرمجة", measured: "مقاس مباشرة", examples: "جرّب", imagePrompt: "موجّه صورة", videoPrompt: "موجّه فيديو" },
  archive: { title: "الأرشيف", sub: "ملايين الصور العامة من ويكيميديا كومنز، بحث مباشر.", placeholder: "ابحث في الأرشيف المفتوح", loading: "جارٍ البحث…", empty: "لا نتائج.", more: "المزيد", license: "الرخصة", open: "افتح في كومنز", suggestions: ["عمارة باستيل", "زهر الكرز", "لوحة غيوم", "تمثال رخام", "حديقة يابانية", "صدفة"] },
  board: { title: "اللوحة", sub: "القطع المحفوظة. صدّرها كموجز تصميم أو شاركها برابط.", empty: "لا شيء محفوظ بعد.", export: "تصدير الموجز (.md)", share: "نسخ رابط المشاركة", shared: "تم نسخ الرابط", clear: "مسح", copyPrompts: "نسخ كل الموجّهات", copied: "تم النسخ" },
  study: { voice: "نبرة الصوت", strengths: "ما يجيده", takeaways: "طبّقه", livePalette: "ألوان مقاسة مباشرة", notes: "ملاحظات إراثرا", loading: "جارٍ قياس الموقع…" },
};

export const X: Record<LangCode, XDict> = { en, tr, es, fr, de, ja, ar };
