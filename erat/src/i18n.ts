import { X, type XDict } from "./i18n-x";
import { Y, type YDict } from "./i18n-y";
export type LangCode = "en" | "tr" | "es" | "fr" | "de" | "ja" | "ar";

export const LANGS: { code: LangCode; label: string; native: string }[] = [
  { code: "en", label: "EN", native: "English" },
  { code: "tr", label: "TR", native: "Türkçe" },
  { code: "es", label: "ES", native: "Español" },
  { code: "fr", label: "FR", native: "Français" },
  { code: "de", label: "DE", native: "Deutsch" },
  { code: "ja", label: "JA", native: "日本語" },
  { code: "ar", label: "AR", native: "العربية" },
];

export type BaseDict = {
  nav: { index: string; library: string; contact: string; world: string; menu: string; close: string; lang: string };
  loader: { loading: string; enter: string; silent: string; hint: string };
  home: { eyebrow: string; l1: string; l2: string; cta: string; about: string };
  library: { selected: string; view: string; hold: string };
  index: { title: string; sub: string; search: string; all: string; no: string; name: string; cat: string; models: string; empty: string };
  world: { title: string; drag: string; sub: string };
  contact: { title: string; sub: string; submit: string; general: string; note: string };
  about: {
    kicker: string;
    title: string;
    lead: string;
    body: [string, string];
    principlesTitle: string;
    principles: { t: string; d: string }[];
    stepsTitle: string;
    steps: [string, string, string];
    faqTitle: string;
    faq: { q: string; a: string }[];
    cta: string;
  };
  piece: { back: string; category: string; updated: string; license: string; models: string; prompt: string; code: string; copy: string; copied: string; next: string; free: string; intro: string };
  cats: Record<string, string>;
};

const en: BaseDict = {
  nav: { index: "Index", library: "Library", contact: "Contact", world: "World", menu: "Menu", close: "Close", lang: "Language" },
  loader: { loading: "Opening the library", enter: "Enter", silent: "Enter without sound", hint: "Best experienced with sound" },
  home: { eyebrow: "A free design library — code & AI prompts", l1: "Designing the", l2: "unseen", cta: "View the library", about: "Read about Erathra" },
  library: { selected: "Selected pieces", view: "View piece", hold: "Click & hold" },
  index: {
    title: "Index",
    sub: "Every composition in the library. Each one ships with production code and a prompt your AI model can follow.",
    search: "Search the index",
    all: "All",
    no: "No.",
    name: "Name",
    cat: "Category",
    models: "Works with",
    empty: "Nothing found. Try another word.",
  },
  world: { title: "Erathra World", drag: "Drag to explore", sub: "Studies, experiments and pieces in progress" },
  contact: { title: "Say hello", sub: "We look forward to seeing what you make", submit: "Submit a piece", general: "General", note: "Erathra is free. Always." },
  about: {
    kicker: "About Erathra",
    title: "Free, by design.",
    lead: "Erathra is a design library for interfaces that feel quietly unreal. Every piece ships with production code and a prompt any AI model can follow.",
    body: [
      "It began as a private archive: compositions we kept returning to, rebuilt until nothing could be removed. We opened it because good form should be common ground, not a subscription.",
      "No account, no tiers, no limits. Copy the code, or hand the prompt to Claude, ChatGPT, Gemini, Cursor or v0 and let it rebuild the piece inside your own project.",
    ],
    principlesTitle: "Principles",
    principles: [
      { t: "Light before colour", d: "We compose with air, plaster and shadow. Colour arrives last, and only when it means something." },
      { t: "Motion as breath", d: "Nothing jumps. Elements rise, settle and rest, on curves borrowed from physical weight." },
      { t: "Type is structure", d: "A serif for the thought, a grotesque for the instruction. Hierarchy from size and silence." },
      { t: "Code you can keep", d: "Plain, readable, dependency-light. No lock-in and no ceremony." },
    ],
    stepsTitle: "How it works",
    steps: ["Choose a piece from the library.", "Copy the code or the AI prompt.", "Paste it anywhere and keep making."],
    faqTitle: "Questions",
    faq: [
      { q: "Is Erathra really free?", a: "Yes. Every piece, every prompt, every line of code. There is no paid tier." },
      { q: "Which AI models do the prompts support?", a: "They are written to be model-agnostic and are tested with Claude, ChatGPT, Gemini, Cursor and v0." },
      { q: "Can I use pieces in commercial work?", a: "Yes. Everything is MIT licensed. Credit is welcome, never required." },
      { q: "Which languages are available?", a: "English, Türkçe, Español, Français, Deutsch, 日本語 and العربية." },
    ],
    cta: "Enter the library",
  },
  piece: {
    back: "Back to index",
    category: "Category",
    updated: "Updated",
    license: "License",
    models: "Works with",
    prompt: "AI prompt",
    code: "Code",
    copy: "Copy",
    copied: "Copied",
    next: "Next piece",
    free: "Free · MIT",
    intro: "Take the finished code, or hand the prompt to your AI model and let it rebuild the piece inside your own project.",
  },
  cats: { all: "All", hero: "Hero", nav: "Navigation", card: "Card", form: "Form", motion: "Motion", text: "Typography", layout: "Layout" },
};

const tr: BaseDict = {
  nav: { index: "Dizin", library: "Kütüphane", contact: "İletişim", world: "Dünya", menu: "Menü", close: "Kapat", lang: "Dil" },
  loader: { loading: "Kütüphane açılıyor", enter: "Gir", silent: "Sessiz gir", hint: "En iyi deneyim sesle" },
  home: { eyebrow: "Ücretsiz tasarım kütüphanesi — kod & AI promptları", l1: "Görülmemişi", l2: "tasarlamak", cta: "Kütüphaneyi gör", about: "Erathra hakkında" },
  library: { selected: "Seçilmiş parçalar", view: "Parçayı gör", hold: "Tıkla & basılı tut" },
  index: {
    title: "Dizin",
    sub: "Kütüphanedeki her kompozisyon. Hepsi üretime hazır kod ve yapay zekâ modelinin izleyebileceği bir promptla gelir.",
    search: "Dizinde ara",
    all: "Tümü",
    no: "No.",
    name: "Ad",
    cat: "Kategori",
    models: "Uyumlu",
    empty: "Bir şey bulunamadı. Başka bir kelime dene.",
  },
  world: { title: "Erathra Dünyası", drag: "Keşfetmek için sürükle", sub: "Çalışmalar, deneyler ve süren parçalar" },
  contact: { title: "Merhaba de", sub: "Neler yapacağını görmek için sabırsızlanıyoruz", submit: "Parça gönder", general: "Genel", note: "Erathra ücretsizdir. Her zaman." },
  about: {
    kicker: "Erathra hakkında",
    title: "Tasarımı gereği ücretsiz.",
    lead: "Erathra, sessizce gerçeküstü hissettiren arayüzler için bir tasarım kütüphanesi. Her parça üretime hazır kod ve her yapay zekâ modelinin izleyebileceği bir promptla gelir.",
    body: [
      "Kişisel bir arşiv olarak başladı: tekrar tekrar döndüğümüz, çıkarılacak hiçbir şey kalmayana dek yeniden kurduğumuz kompozisyonlar. Açtık, çünkü iyi biçim bir abonelik değil, ortak zemin olmalı.",
      "Hesap yok, paket yok, sınır yok. Kodu kopyala ya da promptu Claude, ChatGPT, Gemini, Cursor veya v0'a ver ve parçayı kendi projende yeniden kursun.",
    ],
    principlesTitle: "İlkeler",
    principles: [
      { t: "Renkten önce ışık", d: "Hava, sıva ve gölgeyle kurarız. Renk en son gelir, yalnızca bir anlam taşıdığında." },
      { t: "Nefes gibi hareket", d: "Hiçbir şey zıplamaz. Ögeler yükselir, yerleşir ve dinlenir." },
      { t: "Yapı tipografidir", d: "Düşünce için serif, yönerge için grotesk. Hiyerarşi boyut ve sessizlikten doğar." },
      { t: "Saklayabileceğin kod", d: "Sade, okunabilir, bağımlılığı az. Kilit yok, tören yok." },
    ],
    stepsTitle: "Nasıl çalışır",
    steps: ["Kütüphaneden bir parça seç.", "Kodu ya da AI promptunu kopyala.", "İstediğin yere yapıştır, üretmeye devam et."],
    faqTitle: "Sorular",
    faq: [
      { q: "Erathra gerçekten ücretsiz mi?", a: "Evet. Her parça, her prompt, her satır kod. Ücretli bir paket yok." },
      { q: "Promptlar hangi modelleri destekliyor?", a: "Modelden bağımsız yazıldılar; Claude, ChatGPT, Gemini, Cursor ve v0 ile test edildiler." },
      { q: "Ticari işlerde kullanabilir miyim?", a: "Evet. Her şey MIT lisanslı. Atıf hoş karşılanır ama zorunlu değildir." },
      { q: "Hangi diller var?", a: "English, Türkçe, Español, Français, Deutsch, 日本語 ve العربية." },
    ],
    cta: "Kütüphaneye gir",
  },
  piece: {
    back: "Dizine dön",
    category: "Kategori",
    updated: "Güncelleme",
    license: "Lisans",
    models: "Uyumlu",
    prompt: "AI promptu",
    code: "Kod",
    copy: "Kopyala",
    copied: "Kopyalandı",
    next: "Sonraki parça",
    free: "Ücretsiz · MIT",
    intro: "Bitmiş kodu al ya da promptu yapay zekâ modeline ver; parçayı kendi projende yeniden kursun.",
  },
  cats: { all: "Tümü", hero: "Hero", nav: "Navigasyon", card: "Kart", form: "Form", motion: "Hareket", text: "Tipografi", layout: "Düzen" },
};

const es: BaseDict = {
  nav: { index: "Índice", library: "Biblioteca", contact: "Contacto", world: "Mundo", menu: "Menú", close: "Cerrar", lang: "Idioma" },
  loader: { loading: "Abriendo la biblioteca", enter: "Entrar", silent: "Entrar sin sonido", hint: "Mejor con sonido" },
  home: { eyebrow: "Una biblioteca de diseño gratuita — código y prompts", l1: "Diseñando lo", l2: "invisible", cta: "Ver la biblioteca", about: "Sobre Erathra" },
  library: { selected: "Piezas elegidas", view: "Ver pieza", hold: "Mantén pulsado" },
  index: {
    title: "Índice",
    sub: "Cada composición de la biblioteca, con código listo para producción y un prompt que tu modelo de IA puede seguir.",
    search: "Buscar en el índice",
    all: "Todo",
    no: "N.º",
    name: "Nombre",
    cat: "Categoría",
    models: "Compatible",
    empty: "Nada encontrado. Prueba otra palabra.",
  },
  world: { title: "Mundo Erathra", drag: "Arrastra para explorar", sub: "Estudios, experimentos y piezas en curso" },
  contact: { title: "Saluda", sub: "Queremos ver lo que creas", submit: "Enviar una pieza", general: "General", note: "Erathra es gratis. Siempre." },
  about: {
    kicker: "Sobre Erathra",
    title: "Gratis, por diseño.",
    lead: "Erathra es una biblioteca de diseño para interfaces que se sienten serenamente irreales. Cada pieza incluye código y un prompt que cualquier modelo de IA puede seguir.",
    body: [
      "Empezó como un archivo privado de composiciones que reconstruimos hasta que no sobraba nada. La abrimos porque la buena forma debe ser terreno común.",
      "Sin cuenta, sin planes, sin límites. Copia el código o entrega el prompt a Claude, ChatGPT, Gemini, Cursor o v0.",
    ],
    principlesTitle: "Principios",
    principles: [
      { t: "Luz antes que color", d: "Componemos con aire, yeso y sombra. El color llega al final." },
      { t: "Movimiento como respiración", d: "Nada salta. Los elementos ascienden, se posan y descansan." },
      { t: "La tipografía es estructura", d: "Serif para la idea, grotesca para la instrucción." },
      { t: "Código para quedarte", d: "Simple, legible, con pocas dependencias." },
    ],
    stepsTitle: "Cómo funciona",
    steps: ["Elige una pieza.", "Copia el código o el prompt.", "Pégalo donde quieras."],
    faqTitle: "Preguntas",
    faq: [
      { q: "¿Es realmente gratis?", a: "Sí. Cada pieza, cada prompt, cada línea de código." },
      { q: "¿Qué modelos de IA admite?", a: "Probado con Claude, ChatGPT, Gemini, Cursor y v0." },
      { q: "¿Uso comercial?", a: "Sí. Licencia MIT. El crédito es bienvenido, no obligatorio." },
      { q: "¿Qué idiomas hay?", a: "English, Türkçe, Español, Français, Deutsch, 日本語 y العربية." },
    ],
    cta: "Entrar en la biblioteca",
  },
  piece: {
    back: "Volver al índice",
    category: "Categoría",
    updated: "Actualizado",
    license: "Licencia",
    models: "Compatible",
    prompt: "Prompt de IA",
    code: "Código",
    copy: "Copiar",
    copied: "Copiado",
    next: "Siguiente pieza",
    free: "Gratis · MIT",
    intro: "Toma el código terminado o entrega el prompt a tu modelo de IA.",
  },
  cats: { all: "Todo", hero: "Hero", nav: "Navegación", card: "Tarjeta", form: "Formulario", motion: "Movimiento", text: "Tipografía", layout: "Layout" },
};

const fr: BaseDict = {
  nav: { index: "Index", library: "Bibliothèque", contact: "Contact", world: "Monde", menu: "Menu", close: "Fermer", lang: "Langue" },
  loader: { loading: "Ouverture de la bibliothèque", enter: "Entrer", silent: "Entrer sans son", hint: "Meilleur avec le son" },
  home: { eyebrow: "Une bibliothèque de design gratuite — code & prompts IA", l1: "Dessiner", l2: "l'invisible", cta: "Voir la bibliothèque", about: "À propos d'Erathra" },
  library: { selected: "Pièces choisies", view: "Voir la pièce", hold: "Cliquer & maintenir" },
  index: {
    title: "Index",
    sub: "Chaque composition de la bibliothèque, avec son code de production et un prompt que votre IA peut suivre.",
    search: "Chercher dans l'index",
    all: "Tout",
    no: "N°",
    name: "Nom",
    cat: "Catégorie",
    models: "Compatible",
    empty: "Rien trouvé. Essayez un autre mot.",
  },
  world: { title: "Monde Erathra", drag: "Glisser pour explorer", sub: "Études, expériences et pièces en cours" },
  contact: { title: "Dites bonjour", sub: "Nous avons hâte de voir ce que vous créez", submit: "Proposer une pièce", general: "Général", note: "Erathra est gratuit. Toujours." },
  about: {
    kicker: "À propos d'Erathra",
    title: "Gratuit, par nature.",
    lead: "Erathra est une bibliothèque de design pour des interfaces doucement irréelles. Chaque pièce inclut son code et un prompt pour n'importe quelle IA.",
    body: [
      "C'était une archive privée de compositions reconstruites jusqu'à ce que rien ne puisse être retiré. Nous l'avons ouverte car la bonne forme est un bien commun.",
      "Pas de compte, pas d'offre, pas de limite. Copiez le code ou confiez le prompt à Claude, ChatGPT, Gemini, Cursor ou v0.",
    ],
    principlesTitle: "Principes",
    principles: [
      { t: "La lumière avant la couleur", d: "Nous composons avec l'air, le plâtre et l'ombre." },
      { t: "Le mouvement comme souffle", d: "Rien ne saute. Les éléments montent, se posent, reposent." },
      { t: "La typographie est structure", d: "Un serif pour l'idée, une grotesque pour l'instruction." },
      { t: "Un code à garder", d: "Simple, lisible, léger en dépendances." },
    ],
    stepsTitle: "Comment ça marche",
    steps: ["Choisissez une pièce.", "Copiez le code ou le prompt.", "Collez-le où vous voulez."],
    faqTitle: "Questions",
    faq: [
      { q: "Est-ce vraiment gratuit ?", a: "Oui. Chaque pièce, chaque prompt, chaque ligne." },
      { q: "Quels modèles d'IA ?", a: "Testé avec Claude, ChatGPT, Gemini, Cursor et v0." },
      { q: "Usage commercial ?", a: "Oui. Licence MIT. Créditer est apprécié, jamais obligatoire." },
      { q: "Quelles langues ?", a: "English, Türkçe, Español, Français, Deutsch, 日本語 et العربية." },
    ],
    cta: "Entrer dans la bibliothèque",
  },
  piece: {
    back: "Retour à l'index",
    category: "Catégorie",
    updated: "Mise à jour",
    license: "Licence",
    models: "Compatible",
    prompt: "Prompt IA",
    code: "Code",
    copy: "Copier",
    copied: "Copié",
    next: "Pièce suivante",
    free: "Gratuit · MIT",
    intro: "Prenez le code fini ou confiez le prompt à votre modèle d'IA.",
  },
  cats: { all: "Tout", hero: "Héros", nav: "Navigation", card: "Carte", form: "Formulaire", motion: "Mouvement", text: "Typographie", layout: "Mise en page" },
};

const de: BaseDict = {
  nav: { index: "Index", library: "Bibliothek", contact: "Kontakt", world: "Welt", menu: "Menü", close: "Schließen", lang: "Sprache" },
  loader: { loading: "Bibliothek wird geöffnet", enter: "Eintreten", silent: "Ohne Ton eintreten", hint: "Am schönsten mit Ton" },
  home: { eyebrow: "Eine kostenlose Design-Bibliothek — Code & KI-Prompts", l1: "Das Ungesehene", l2: "gestalten", cta: "Zur Bibliothek", about: "Über Erathra" },
  library: { selected: "Ausgewählte Stücke", view: "Stück ansehen", hold: "Klicken & halten" },
  index: {
    title: "Index",
    sub: "Jede Komposition der Bibliothek, mit Produktionscode und einem Prompt, dem dein KI-Modell folgen kann.",
    search: "Index durchsuchen",
    all: "Alle",
    no: "Nr.",
    name: "Name",
    cat: "Kategorie",
    models: "Passt zu",
    empty: "Nichts gefunden. Versuch ein anderes Wort.",
  },
  world: { title: "Erathra Welt", drag: "Ziehen zum Erkunden", sub: "Studien, Experimente und Stücke in Arbeit" },
  contact: { title: "Sag hallo", sub: "Wir freuen uns darauf, zu sehen, was du baust", submit: "Stück einreichen", general: "Allgemein", note: "Erathra ist kostenlos. Immer." },
  about: {
    kicker: "Über Erathra",
    title: "Kostenlos, aus Prinzip.",
    lead: "Erathra ist eine Design-Bibliothek für Oberflächen, die leise unwirklich wirken. Jedes Stück kommt mit Code und einem Prompt für jedes KI-Modell.",
    body: [
      "Es begann als privates Archiv von Kompositionen, die wir so lange neu bauten, bis nichts mehr wegzunehmen war. Wir haben es geöffnet, weil gute Form Gemeingut sein sollte.",
      "Kein Konto, keine Stufen, keine Grenzen. Kopiere den Code oder gib den Prompt an Claude, ChatGPT, Gemini, Cursor oder v0.",
    ],
    principlesTitle: "Prinzipien",
    principles: [
      { t: "Licht vor Farbe", d: "Wir komponieren mit Luft, Putz und Schatten." },
      { t: "Bewegung als Atem", d: "Nichts springt. Elemente steigen, setzen sich, ruhen." },
      { t: "Typografie ist Struktur", d: "Serif für den Gedanken, Grotesk für die Anweisung." },
      { t: "Code zum Behalten", d: "Schlicht, lesbar, ohne Ballast." },
    ],
    stepsTitle: "So funktioniert es",
    steps: ["Wähle ein Stück.", "Kopiere Code oder Prompt.", "Füge es überall ein."],
    faqTitle: "Fragen",
    faq: [
      { q: "Ist es wirklich kostenlos?", a: "Ja. Jedes Stück, jeder Prompt, jede Zeile Code." },
      { q: "Welche KI-Modelle?", a: "Getestet mit Claude, ChatGPT, Gemini, Cursor und v0." },
      { q: "Kommerzielle Nutzung?", a: "Ja. MIT-Lizenz. Nennung willkommen, nie Pflicht." },
      { q: "Welche Sprachen?", a: "English, Türkçe, Español, Français, Deutsch, 日本語 und العربية." },
    ],
    cta: "Bibliothek betreten",
  },
  piece: {
    back: "Zurück zum Index",
    category: "Kategorie",
    updated: "Aktualisiert",
    license: "Lizenz",
    models: "Passt zu",
    prompt: "KI-Prompt",
    code: "Code",
    copy: "Kopieren",
    copied: "Kopiert",
    next: "Nächstes Stück",
    free: "Kostenlos · MIT",
    intro: "Nimm den fertigen Code oder gib den Prompt an dein KI-Modell.",
  },
  cats: { all: "Alle", hero: "Hero", nav: "Navigation", card: "Karte", form: "Formular", motion: "Bewegung", text: "Typografie", layout: "Layout" },
};

const ja: BaseDict = {
  nav: { index: "索引", library: "ライブラリ", contact: "連絡", world: "ワールド", menu: "メニュー", close: "閉じる", lang: "言語" },
  loader: { loading: "ライブラリを開いています", enter: "入る", silent: "音なしで入る", hint: "音ありがおすすめ" },
  home: { eyebrow: "無料のデザインライブラリ — コードと AI プロンプト", l1: "見えないものを", l2: "デザインする", cta: "ライブラリを見る", about: "Erathra について" },
  library: { selected: "選ばれた作品", view: "作品を見る", hold: "クリック＆ホールド" },
  index: {
    title: "索引",
    sub: "ライブラリのすべての作品。本番用コードと、AI が読めるプロンプト付き。",
    search: "索引を検索",
    all: "すべて",
    no: "番号",
    name: "名前",
    cat: "カテゴリ",
    models: "対応",
    empty: "見つかりません。別の語で。",
  },
  world: { title: "Erathra ワールド", drag: "ドラッグして探索", sub: "習作、実験、制作中の作品" },
  contact: { title: "こんにちは", sub: "あなたが作るものを楽しみにしています", submit: "作品を投稿", general: "一般", note: "Erathra は無料です。ずっと。" },
  about: {
    kicker: "Erathra について",
    title: "設計からして無料。",
    lead: "Erathra は、静かに非現実的なインターフェースのためのデザインライブラリ。すべての作品にコードと AI 用プロンプトが付きます。",
    body: [
      "何も削れなくなるまで作り直した作品の、個人的なアーカイブとして始まりました。良い形は共有財産であるべきだから、公開しました。",
      "アカウント不要、制限なし。コードをコピーするか、プロンプトを Claude、ChatGPT、Gemini、Cursor、v0 に渡してください。",
    ],
    principlesTitle: "原則",
    principles: [
      { t: "色より先に光", d: "空気と漆喰と影で構成する。" },
      { t: "呼吸としての動き", d: "何も跳ねない。立ち上がり、静まり、休む。" },
      { t: "文字が構造", d: "思考にセリフ、指示にグロテスク。" },
      { t: "持ち帰れるコード", d: "素直で読みやすく、依存が少ない。" },
    ],
    stepsTitle: "使い方",
    steps: ["作品を選ぶ。", "コードかプロンプトをコピー。", "好きな場所に貼る。"],
    faqTitle: "よくある質問",
    faq: [
      { q: "本当に無料？", a: "はい。すべての作品、プロンプト、コードが無料です。" },
      { q: "対応する AI は？", a: "Claude、ChatGPT、Gemini、Cursor、v0 で検証済み。" },
      { q: "商用利用は？", a: "可能です。MIT ライセンス。クレジットは任意。" },
      { q: "対応言語は？", a: "English、Türkçe、Español、Français、Deutsch、日本語、العربية。" },
    ],
    cta: "ライブラリへ",
  },
  piece: {
    back: "索引へ戻る",
    category: "カテゴリ",
    updated: "更新",
    license: "ライセンス",
    models: "対応",
    prompt: "AI プロンプト",
    code: "コード",
    copy: "コピー",
    copied: "コピー済み",
    next: "次の作品",
    free: "無料 · MIT",
    intro: "完成したコードを使うか、プロンプトを AI に渡してください。",
  },
  cats: { all: "すべて", hero: "ヒーロー", nav: "ナビ", card: "カード", form: "フォーム", motion: "モーション", text: "タイポ", layout: "レイアウト" },
};

const ar: BaseDict = {
  nav: { index: "الفهرس", library: "المكتبة", contact: "تواصل", world: "العالم", menu: "القائمة", close: "إغلاق", lang: "اللغة" },
  loader: { loading: "جارٍ فتح المكتبة", enter: "ادخل", silent: "ادخل بلا صوت", hint: "أجمل مع الصوت" },
  home: { eyebrow: "مكتبة تصميم مجانية — كود وموجّهات ذكاء اصطناعي", l1: "تصميم", l2: "غير المرئي", cta: "اعرض المكتبة", about: "عن إراثرا" },
  library: { selected: "قطع مختارة", view: "اعرض القطعة", hold: "انقر مع الاستمرار" },
  index: {
    title: "الفهرس",
    sub: "كل تركيبة في المكتبة، مع كود جاهز للإنتاج وموجّه يتبعه نموذج الذكاء الاصطناعي.",
    search: "ابحث في الفهرس",
    all: "الكل",
    no: "رقم",
    name: "الاسم",
    cat: "الفئة",
    models: "يعمل مع",
    empty: "لا نتائج. جرّب كلمة أخرى.",
  },
  world: { title: "عالم إراثرا", drag: "اسحب للاستكشاف", sub: "دراسات وتجارب وقطع قيد العمل" },
  contact: { title: "قل مرحباً", sub: "نتطلع لرؤية ما تصنعه", submit: "أرسل قطعة", general: "عام", note: "إراثرا مجانية. دائماً." },
  about: {
    kicker: "عن إراثرا",
    title: "مجانية بطبيعتها.",
    lead: "إراثرا مكتبة تصميم لواجهات تبدو غير واقعية بهدوء. كل قطعة تأتي بكود وموجّه يتبعه أي نموذج ذكاء اصطناعي.",
    body: [
      "بدأت أرشيفاً خاصاً لتركيبات أعدنا بناءها حتى لم يبقَ ما يُحذف. فتحناها لأن الشكل الجيد أرضية مشتركة.",
      "بلا حساب، بلا باقات، بلا حدود. انسخ الكود أو سلّم الموجّه إلى Claude أو ChatGPT أو Gemini أو Cursor أو v0.",
    ],
    principlesTitle: "المبادئ",
    principles: [
      { t: "الضوء قبل اللون", d: "نؤلّف بالهواء والجص والظل." },
      { t: "الحركة كالتنفّس", d: "لا شيء يقفز؛ العناصر ترتفع وتستقر." },
      { t: "الطباعة هي البنية", d: "سيريف للفكرة وغروتيسك للإرشاد." },
      { t: "كود تحتفظ به", d: "بسيط ومقروء وخفيف الاعتماديات." },
    ],
    stepsTitle: "كيف تعمل",
    steps: ["اختر قطعة.", "انسخ الكود أو الموجّه.", "الصقه في أي مكان."],
    faqTitle: "أسئلة",
    faq: [
      { q: "هل هي مجانية فعلاً؟", a: "نعم. كل قطعة وكل موجّه وكل سطر كود." },
      { q: "أي نماذج ذكاء اصطناعي؟", a: "مختبرة مع Claude وChatGPT وGemini وCursor وv0." },
      { q: "الاستخدام التجاري؟", a: "نعم. رخصة MIT. الإشارة مرحب بها وليست إلزامية." },
      { q: "ما اللغات المتاحة؟", a: "English وTürkçe وEspañol وFrançais وDeutsch و日本語 والعربية." },
    ],
    cta: "ادخل المكتبة",
  },
  piece: {
    back: "عودة إلى الفهرس",
    category: "الفئة",
    updated: "التحديث",
    license: "الرخصة",
    models: "يعمل مع",
    prompt: "موجّه الذكاء",
    code: "الكود",
    copy: "نسخ",
    copied: "تم النسخ",
    next: "القطعة التالية",
    free: "مجاني · MIT",
    intro: "خذ الكود الجاهز أو سلّم الموجّه لنموذج الذكاء الاصطناعي.",
  },
  cats: { all: "الكل", hero: "واجهة", nav: "تنقّل", card: "بطاقة", form: "نموذج", motion: "حركة", text: "طباعة", layout: "تخطيط" },
};

export type Dict = BaseDict & { x: XDict; y: YDict };
export const DICT: Record<LangCode, Dict> = {
  en: { ...en, x: X.en, y: Y.en },
  tr: { ...tr, x: X.tr, y: Y.tr },
  es: { ...es, x: X.es, y: Y.es },
  fr: { ...fr, x: X.fr, y: Y.fr },
  de: { ...de, x: X.de, y: Y.de },
  ja: { ...ja, x: X.ja, y: Y.ja },
  ar: { ...ar, x: X.ar, y: Y.ar },
};
