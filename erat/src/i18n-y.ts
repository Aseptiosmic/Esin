import type { LangCode } from "./i18n";

type Plates = { home: string; index: string; library: string; cabinet: string; atlas: string; archive: string; analyze: string; board: string; about: string; contact: string; piece: string };

export type YDict = {
  plate: string;
  plates: Plates;
  descs: Omit<Plates, "home" | "piece">;
  home: { kicker: string; l1: string; l2: string; sub: string; cta: string; cta2: string; ascend: string };
  loader: { ascending: string; ready: string; enter: string; silent: string; hint: string; tagline: string };
  atlas: { sub: string; hint: string; all: string; stars: string; fit: string };
  contact: { l1: string; l2: string; sub: string; name: string; email: string; message: string; kinds: [string, string, string]; send: string; direct: string };
  free: string;
  sound: { on: string; off: string };
  sources: { commons: string; nasa: string };
  stats: { pieces: string; kinds: string; archives: string; languages: string; cost: string };
  local: string;
  rate: string;
  sites: {
    title: string; sub: string; count: string; cta: string; homeSub: string; latest: string;
    preview: string; prompt: string; desktop: string; tablet: string; phone: string;
    replay: string; recorder: string; open: string; download: string; copyPrompt: string; copied: string; downloadPrompt: string;
    words: string; sections: string; palette: string; fonts: string; category: string; year: string; size: string;
    back: string; next: string; empty: string; soon: string; soonText: string; fullscreen: string; exit: string;
  };
  cabinet: {
    loading: string; error: string; drag: string; lighting: string; modeLabel: string; exposure: string; env: string; spin: string; variants: string;
    modes: { beauty: string; clay: string; wire: string; normal: string };
    hdris: { studio: string; dawn: string; sky: string; dusk: string };
    triangles: string; meshes: string; materials: string; textures: string; dims: string; file: string;
    artist: string; source: string; license: string; owner: string; open: string; download: string; embed: string; copyLink: string;
  };
};

const en: YDict = {
  plate: "Plate",
  plates: { home: "Erathra", index: "Sites", library: "The Spiral", cabinet: "The Cabinet", atlas: "Atlas", archive: "Archive", analyze: "Analyze", board: "Board", about: "Manifesto", contact: "Correspondence", piece: "Site" },
  descs: {
    index: "Every website design, live, with its prompt.",
    library: "Climb a spiral of selected pieces above the clouds.",
    cabinet: "Real 3D models from Khronos and Poly Haven, lit by real skies.",
    atlas: "The whole library drawn as a sky of stars.",
    archive: "Search NASA and Wikimedia Commons, live.",
    analyze: "Measure any website or image, get prompts.",
    board: "Your saved pieces, ready to export or share.",
    about: "Why Erathra exists, and why it stays free.",
    contact: "Write to us, or submit a piece.",
  },
  home: {
    kicker: "A free design library · Code & AI prompts for every piece",
    l1: "The library",
    l2: "above the clouds",
    sub: "3D objects, motion, imagery, palettes, type, components and site studies — each with production code and prompts for any AI model. Free, in seven languages.",
    cta: "Ascend the spiral",
    cta2: "Open the atlas",
    ascend: "Scroll to ascend",
  },
  loader: { ascending: "Ascending", ready: "Above the clouds", enter: "Enter", silent: "Enter in silence", hint: "Best with sound", tagline: "The library above the clouds" },
  atlas: { sub: "Every piece is a star. Every kind is a constellation.", hint: "Drag to wander · scroll to zoom · click a star", all: "All constellations", stars: "stars", fit: "Fit sky" },
  contact: { l1: "Write to", l2: "the sky", sub: "Send a piece for the library, a question, or a kind word. We read everything.", name: "Your name", email: "Email", message: "Message", kinds: ["Submit a piece", "General", "Press"], send: "Send letter", direct: "Or write directly" },
  free: "Free forever",
  sound: { on: "Sound on", off: "Sound off" },
  sources: { commons: "Wikimedia Commons", nasa: "NASA Image Library" },
  stats: { pieces: "pieces", kinds: "kinds", archives: "live archives", languages: "languages", cost: "cost, forever" },
  local: "Local time",
  rate: "The free analysis quota for today is used up. Cached sites still work — try again tomorrow.",
  sites: {"title": "Sites", "sub": "A library of complete website designs. Every site is a live build you can scroll, resize and download — with the exact prompt that made it.", "count": "sites", "cta": "Browse the sites", "homeSub": "Complete website designs, each one a live preview you can explore and the exact prompt that builds it. Free, in seven languages.", "latest": "Latest", "preview": "Live preview", "prompt": "The prompt", "desktop": "Desktop", "tablet": "Tablet", "phone": "Phone", "replay": "Replay", "recorder": "Recorder", "open": "Open full page", "download": "Download .html", "copyPrompt": "Copy prompt", "copied": "Copied", "downloadPrompt": "Download .md", "words": "words", "sections": "Sections", "palette": "Palette", "fonts": "Type", "category": "Category", "year": "Year", "size": "Size", "back": "All sites", "next": "Next site", "empty": "Nothing saved yet.", "soon": "More sites are on the way", "soonText": "New designs are added one by one, each with its prompt.", "fullscreen": "Focus", "exit": "Exit"},
  cabinet: {"loading": "Loading model", "error": "This model could not be loaded.", "drag": "Drag to orbit · scroll to zoom", "lighting": "Lighting · HDRI", "modeLabel": "Inspection", "exposure": "Exposure", "env": "Sky backdrop", "spin": "Turntable", "variants": "Material variants", "modes": {"beauty": "Beauty", "clay": "Clay", "wire": "Wireframe", "normal": "Normals"}, "hdris": {"studio": "Studio", "dawn": "Dawn", "sky": "Open sky", "dusk": "Dusk"}, "triangles": "Triangles", "meshes": "Meshes", "materials": "Materials", "textures": "Textures", "dims": "Size", "file": "File", "artist": "Artist", "source": "Source", "license": "Licence", "owner": "Owner", "open": "Open piece", "download": "Download", "embed": "Copy AR embed", "copyLink": "Copy source link"},
};

const tr: YDict = {
  plate: "Levha",
  plates: { home: "Erathra", index: "Siteler", library: "Sarmal", cabinet: "Kabine", atlas: "Atlas", archive: "Arşiv", analyze: "Analiz", board: "Pano", about: "Manifesto", contact: "Mektup", piece: "Site" },
  descs: {
    index: "Her web sitesi tasarımı, canlı ve promptuyla.",
    library: "Bulutların üstünde seçilmiş parçalardan bir sarmala tırman.",
    cabinet: "Khronos ve Poly Haven'dan gerçek 3D modeller, gerçek gökyüzleriyle aydınlatılmış.",
    atlas: "Tüm kütüphane, yıldızlarla dolu bir gökyüzü olarak.",
    archive: "NASA ve Wikimedia Commons'ta canlı ara.",
    analyze: "Herhangi bir siteyi ya da görseli ölç, promptlarını al.",
    board: "Kaydettiğin parçalar; dışa aktar ya da paylaş.",
    about: "Erathra neden var ve neden ücretsiz kalıyor.",
    contact: "Bize yaz ya da bir parça gönder.",
  },
  home: {
    kicker: "Ücretsiz tasarım kütüphanesi · Her parça için kod ve AI promptu",
    l1: "Bulutların",
    l2: "üstündeki kütüphane",
    sub: "3D nesneler, hareket, görseller, paletler, tipografi, bileşenler ve site çalışmaları — her biri üretime hazır kod ve her yapay zekâ modeli için promptlarla. Ücretsiz, yedi dilde.",
    cta: "Sarmala yüksel",
    cta2: "Atlası aç",
    ascend: "Yükselmek için kaydır",
  },
  loader: { ascending: "Yükseliyor", ready: "Bulutların üstünde", enter: "Gir", silent: "Sessizce gir", hint: "Sesle en güzeli", tagline: "Bulutların üstündeki kütüphane" },
  atlas: { sub: "Her parça bir yıldız. Her tür bir takımyıldız.", hint: "Gezmek için sürükle · yakınlaşmak için kaydır · bir yıldıza tıkla", all: "Tüm takımyıldızlar", stars: "yıldız", fit: "Gökyüzünü sığdır" },
  contact: { l1: "Gökyüzüne", l2: "yaz", sub: "Kütüphane için bir parça, bir soru ya da güzel bir söz gönder. Hepsini okuyoruz.", name: "Adın", email: "E-posta", message: "Mesaj", kinds: ["Parça gönder", "Genel", "Basın"], send: "Mektubu gönder", direct: "Ya da doğrudan yaz" },
  free: "Sonsuza dek ücretsiz",
  sound: { on: "Ses açık", off: "Ses kapalı" },
  sources: { commons: "Wikimedia Commons", nasa: "NASA Görsel Kütüphanesi" },
  stats: { pieces: "parça", kinds: "tür", archives: "canlı arşiv", languages: "dil", cost: "ücret, her zaman" },
  local: "Yerel saat",
  rate: "Bugünkü ücretsiz analiz kotası doldu. Önbellekteki siteler çalışmaya devam eder — yarın tekrar dene.",
  sites: {"title": "Siteler", "sub": "Eksiksiz web sitesi tasarımlarından oluşan bir kütüphane. Her site kaydırabileceğin, boyutlandırabileceğin ve indirebileceğin canlı bir yapı — onu üreten promptun birebir aynısıyla.", "count": "site", "cta": "Sitelere göz at", "homeSub": "Eksiksiz web sitesi tasarımları: her biri keşfedebileceğin canlı bir önizleme ve onu kuran promptun ta kendisi. Ücretsiz, yedi dilde.", "latest": "En yeni", "preview": "Canlı önizleme", "prompt": "Prompt", "desktop": "Masaüstü", "tablet": "Tablet", "phone": "Telefon", "replay": "Tekrar oynat", "recorder": "Kayıt modu", "open": "Tam sayfa aç", "download": ".html indir", "copyPrompt": "Promptu kopyala", "copied": "Kopyalandı", "downloadPrompt": ".md indir", "words": "kelime", "sections": "Bölümler", "palette": "Palet", "fonts": "Yazı", "category": "Kategori", "year": "Yıl", "size": "Boyut", "back": "Tüm siteler", "next": "Sonraki site", "empty": "Henüz kayıt yok.", "soon": "Yeni siteler yolda", "soonText": "Yeni tasarımlar tek tek ekleniyor, her biri promptuyla birlikte.", "fullscreen": "Odak", "exit": "Çık"},
  cabinet: {"loading": "Model yükleniyor", "error": "Bu model yüklenemedi.", "drag": "Döndürmek için sürükle · yakınlaştırmak için kaydır", "lighting": "Işık · HDRI", "modeLabel": "İnceleme", "exposure": "Pozlama", "env": "Gökyüzü fonu", "spin": "Döner tabla", "variants": "Malzeme varyantları", "modes": {"beauty": "Güzel", "clay": "Kil", "wire": "Tel kafes", "normal": "Normaller"}, "hdris": {"studio": "Stüdyo", "dawn": "Şafak", "sky": "Açık gök", "dusk": "Alacakaranlık"}, "triangles": "Üçgen", "meshes": "Mesh", "materials": "Malzeme", "textures": "Doku", "dims": "Boyut", "file": "Dosya", "artist": "Sanatçı", "source": "Kaynak", "license": "Lisans", "owner": "Sahip", "open": "Parçayı aç", "download": "İndir", "embed": "AR embed kopyala", "copyLink": "Kaynak bağlantısını kopyala"},
};

const es: YDict = {
  plate: "Lámina",
  plates: { home: "Erathra", index: "Sitios", library: "La Espiral", cabinet: "El Gabinete", atlas: "Atlas", archive: "Archivo", analyze: "Analizar", board: "Tablero", about: "Manifiesto", contact: "Correspondencia", piece: "Sitio" },
  descs: {
    index: "Cada diseño web, en vivo, con su prompt.",
    library: "Sube una espiral de piezas sobre las nubes.",
    cabinet: "Modelos 3D reales de Khronos y Poly Haven, iluminados por cielos reales.",
    atlas: "Toda la biblioteca dibujada como un cielo de estrellas.",
    archive: "Busca en NASA y Wikimedia Commons, en vivo.",
    analyze: "Mide cualquier web o imagen y obtén prompts.",
    board: "Tus piezas guardadas, listas para exportar.",
    about: "Por qué existe Erathra y por qué es gratis.",
    contact: "Escríbenos o envía una pieza.",
  },
  home: { kicker: "Biblioteca de diseño gratuita · Código y prompts de IA", l1: "La biblioteca", l2: "sobre las nubes", sub: "Objetos 3D, movimiento, imágenes, paletas, tipografía, componentes y estudios de sitios — con código y prompts para cualquier IA. Gratis, en siete idiomas.", cta: "Sube la espiral", cta2: "Abrir el atlas", ascend: "Desliza para ascender" },
  loader: { ascending: "Ascendiendo", ready: "Sobre las nubes", enter: "Entrar", silent: "Entrar en silencio", hint: "Mejor con sonido", tagline: "La biblioteca sobre las nubes" },
  atlas: { sub: "Cada pieza es una estrella. Cada tipo, una constelación.", hint: "Arrastra · desplaza para zoom · haz clic en una estrella", all: "Todas", stars: "estrellas", fit: "Ajustar cielo" },
  contact: { l1: "Escribe", l2: "al cielo", sub: "Envía una pieza, una pregunta o una palabra amable.", name: "Tu nombre", email: "Email", message: "Mensaje", kinds: ["Enviar pieza", "General", "Prensa"], send: "Enviar carta", direct: "O escribe directamente" },
  free: "Gratis para siempre",
  sound: { on: "Sonido sí", off: "Sonido no" },
  sources: { commons: "Wikimedia Commons", nasa: "Biblioteca de NASA" },
  stats: { pieces: "piezas", kinds: "tipos", archives: "archivos en vivo", languages: "idiomas", cost: "coste, siempre" },
  local: "Hora local",
  rate: "Se agotó la cuota gratuita de análisis de hoy. Los sitios en caché siguen funcionando.",
  sites: {"title": "Sitios", "sub": "Una biblioteca de diseños web completos. Cada sitio es una versión en vivo que puedes recorrer, redimensionar y descargar — con el prompt exacto que lo creó.", "count": "sitios", "cta": "Ver los sitios", "homeSub": "Diseños web completos: cada uno con vista previa en vivo y el prompt exacto que lo construye. Gratis, en siete idiomas.", "latest": "Lo último", "preview": "Vista previa", "prompt": "El prompt", "desktop": "Escritorio", "tablet": "Tableta", "phone": "Móvil", "replay": "Repetir", "recorder": "Grabación", "open": "Abrir página completa", "download": "Descargar .html", "copyPrompt": "Copiar prompt", "copied": "Copiado", "downloadPrompt": "Descargar .md", "words": "palabras", "sections": "Secciones", "palette": "Paleta", "fonts": "Tipografía", "category": "Categoría", "year": "Año", "size": "Tamaño", "back": "Todos los sitios", "next": "Siguiente sitio", "empty": "Nada guardado aún.", "soon": "Llegan más sitios", "soonText": "Se añaden diseños uno a uno, cada uno con su prompt.", "fullscreen": "Enfoque", "exit": "Salir"},
  cabinet: {"loading": "Cargando modelo", "error": "No se pudo cargar el modelo.", "drag": "Arrastra para orbitar · desplaza para zoom", "lighting": "Luz · HDRI", "modeLabel": "Inspección", "exposure": "Exposición", "env": "Fondo de cielo", "spin": "Giratorio", "variants": "Variantes de material", "modes": {"beauty": "Belleza", "clay": "Arcilla", "wire": "Alambre", "normal": "Normales"}, "hdris": {"studio": "Estudio", "dawn": "Alba", "sky": "Cielo", "dusk": "Ocaso"}, "triangles": "Triángulos", "meshes": "Mallas", "materials": "Materiales", "textures": "Texturas", "dims": "Tamaño", "file": "Archivo", "artist": "Artista", "source": "Fuente", "license": "Licencia", "owner": "Titular", "open": "Abrir pieza", "download": "Descargar", "embed": "Copiar embed AR", "copyLink": "Copiar enlace"},
};

const fr: YDict = {
  plate: "Planche",
  plates: { home: "Erathra", index: "Sites", library: "La Spirale", cabinet: "Le Cabinet", atlas: "Atlas", archive: "Archive", analyze: "Analyser", board: "Tableau", about: "Manifeste", contact: "Correspondance", piece: "Site" },
  descs: {
    index: "Chaque site, vivant, avec son prompt.",
    library: "Gravissez une spirale de pièces au-dessus des nuages.",
    cabinet: "De vrais modèles 3D de Khronos et Poly Haven, éclairés par de vrais ciels.",
    atlas: "Toute la bibliothèque dessinée comme un ciel d'étoiles.",
    archive: "Cherchez dans NASA et Wikimedia Commons, en direct.",
    analyze: "Mesurez un site ou une image, obtenez des prompts.",
    board: "Vos pièces enregistrées, prêtes à partager.",
    about: "Pourquoi Erathra existe et reste gratuit.",
    contact: "Écrivez-nous ou proposez une pièce.",
  },
  home: { kicker: "Bibliothèque de design gratuite · Code & prompts IA", l1: "La bibliothèque", l2: "au-dessus des nuages", sub: "Objets 3D, mouvement, images, palettes, typographie, composants et études de sites — avec code et prompts pour toute IA. Gratuit, en sept langues.", cta: "Gravir la spirale", cta2: "Ouvrir l'atlas", ascend: "Défilez pour monter" },
  loader: { ascending: "Ascension", ready: "Au-dessus des nuages", enter: "Entrer", silent: "Entrer en silence", hint: "Meilleur avec le son", tagline: "La bibliothèque au-dessus des nuages" },
  atlas: { sub: "Chaque pièce est une étoile. Chaque nature, une constellation.", hint: "Glissez · zoomez · cliquez une étoile", all: "Toutes", stars: "étoiles", fit: "Ajuster le ciel" },
  contact: { l1: "Écrire", l2: "au ciel", sub: "Envoyez une pièce, une question ou un mot doux.", name: "Votre nom", email: "Email", message: "Message", kinds: ["Proposer une pièce", "Général", "Presse"], send: "Envoyer la lettre", direct: "Ou écrivez directement" },
  free: "Gratuit pour toujours",
  sound: { on: "Son activé", off: "Son coupé" },
  sources: { commons: "Wikimedia Commons", nasa: "Bibliothèque NASA" },
  stats: { pieces: "pièces", kinds: "natures", archives: "archives en direct", languages: "langues", cost: "coût, toujours" },
  local: "Heure locale",
  rate: "Le quota d'analyse gratuit du jour est épuisé. Les sites en cache fonctionnent toujours.",
  sites: {"title": "Sites", "sub": "Une bibliothèque de sites complets. Chaque site est une version vivante à parcourir, redimensionner et télécharger — avec le prompt exact qui l'a créé.", "count": "sites", "cta": "Parcourir les sites", "homeSub": "Des sites complets, chacun avec un aperçu vivant et le prompt exact qui le construit. Gratuit, en sept langues.", "latest": "Dernier", "preview": "Aperçu vivant", "prompt": "Le prompt", "desktop": "Bureau", "tablet": "Tablette", "phone": "Mobile", "replay": "Rejouer", "recorder": "Enregistreur", "open": "Ouvrir la page", "download": "Télécharger .html", "copyPrompt": "Copier le prompt", "copied": "Copié", "downloadPrompt": "Télécharger .md", "words": "mots", "sections": "Sections", "palette": "Palette", "fonts": "Typo", "category": "Catégorie", "year": "Année", "size": "Taille", "back": "Tous les sites", "next": "Site suivant", "empty": "Rien d'enregistré.", "soon": "D'autres sites arrivent", "soonText": "Les designs arrivent un par un, chacun avec son prompt.", "fullscreen": "Focus", "exit": "Quitter"},
  cabinet: {"loading": "Chargement du modèle", "error": "Ce modèle n'a pas pu être chargé.", "drag": "Glisser pour orbiter · défiler pour zoomer", "lighting": "Lumière · HDRI", "modeLabel": "Inspection", "exposure": "Exposition", "env": "Fond de ciel", "spin": "Plateau", "variants": "Variantes de matière", "modes": {"beauty": "Rendu", "clay": "Argile", "wire": "Filaire", "normal": "Normales"}, "hdris": {"studio": "Studio", "dawn": "Aube", "sky": "Ciel", "dusk": "Crépuscule"}, "triangles": "Triangles", "meshes": "Maillages", "materials": "Matières", "textures": "Textures", "dims": "Taille", "file": "Fichier", "artist": "Artiste", "source": "Source", "license": "Licence", "owner": "Titulaire", "open": "Ouvrir la pièce", "download": "Télécharger", "embed": "Copier l'embed AR", "copyLink": "Copier le lien"},
};

const de: YDict = {
  plate: "Tafel",
  plates: { home: "Erathra", index: "Websites", library: "Die Spirale", cabinet: "Das Kabinett", atlas: "Atlas", archive: "Archiv", analyze: "Analyse", board: "Board", about: "Manifest", contact: "Korrespondenz", piece: "Website" },
  descs: {
    index: "Jedes Website-Design, live, mit Prompt.",
    library: "Steige eine Spirale ausgewählter Stücke über die Wolken.",
    cabinet: "Echte 3D-Modelle von Khronos und Poly Haven, beleuchtet von echten Himmeln.",
    atlas: "Die ganze Bibliothek als Sternenhimmel.",
    archive: "NASA und Wikimedia Commons, live durchsucht.",
    analyze: "Miss jede Website oder jedes Bild, erhalte Prompts.",
    board: "Deine gemerkten Stücke, bereit zum Teilen.",
    about: "Warum es Erathra gibt und warum es frei bleibt.",
    contact: "Schreib uns oder reiche ein Stück ein.",
  },
  home: { kicker: "Kostenlose Design-Bibliothek · Code & KI-Prompts", l1: "Die Bibliothek", l2: "über den Wolken", sub: "3D-Objekte, Bewegung, Bilder, Paletten, Typografie, Komponenten und Website-Studien — mit Code und Prompts für jede KI. Kostenlos, in sieben Sprachen.", cta: "Die Spirale hinauf", cta2: "Atlas öffnen", ascend: "Scrollen zum Aufsteigen" },
  loader: { ascending: "Aufstieg", ready: "Über den Wolken", enter: "Eintreten", silent: "Still eintreten", hint: "Am schönsten mit Ton", tagline: "Die Bibliothek über den Wolken" },
  atlas: { sub: "Jedes Stück ein Stern. Jede Art ein Sternbild.", hint: "Ziehen · scrollen zum Zoomen · Stern anklicken", all: "Alle Sternbilder", stars: "Sterne", fit: "Himmel einpassen" },
  contact: { l1: "Schreib", l2: "an den Himmel", sub: "Sende ein Stück, eine Frage oder ein freundliches Wort.", name: "Dein Name", email: "E-Mail", message: "Nachricht", kinds: ["Stück einreichen", "Allgemein", "Presse"], send: "Brief senden", direct: "Oder direkt schreiben" },
  free: "Für immer kostenlos",
  sound: { on: "Ton an", off: "Ton aus" },
  sources: { commons: "Wikimedia Commons", nasa: "NASA-Bildarchiv" },
  stats: { pieces: "Stücke", kinds: "Arten", archives: "Live-Archive", languages: "Sprachen", cost: "Kosten, für immer" },
  local: "Ortszeit",
  rate: "Das kostenlose Analyse-Kontingent für heute ist aufgebraucht. Zwischengespeicherte Seiten funktionieren weiter.",
  sites: {"title": "Websites", "sub": "Eine Bibliothek vollständiger Website-Designs. Jede Seite ist ein Live-Build zum Scrollen, Skalieren und Herunterladen — mit dem exakten Prompt, der sie erzeugt hat.", "count": "Websites", "cta": "Websites ansehen", "homeSub": "Vollständige Website-Designs, jedes mit Live-Vorschau und dem exakten Prompt dazu. Kostenlos, in sieben Sprachen.", "latest": "Neu", "preview": "Live-Vorschau", "prompt": "Der Prompt", "desktop": "Desktop", "tablet": "Tablet", "phone": "Smartphone", "replay": "Neu starten", "recorder": "Recorder", "open": "Ganze Seite öffnen", "download": ".html laden", "copyPrompt": "Prompt kopieren", "copied": "Kopiert", "downloadPrompt": ".md laden", "words": "Wörter", "sections": "Abschnitte", "palette": "Palette", "fonts": "Schrift", "category": "Kategorie", "year": "Jahr", "size": "Größe", "back": "Alle Websites", "next": "Nächste Website", "empty": "Noch nichts gemerkt.", "soon": "Weitere Websites folgen", "soonText": "Neue Designs kommen einzeln hinzu, jedes mit seinem Prompt.", "fullscreen": "Fokus", "exit": "Beenden"},
  cabinet: {"loading": "Modell lädt", "error": "Dieses Modell konnte nicht geladen werden.", "drag": "Ziehen zum Drehen · scrollen zum Zoomen", "lighting": "Licht · HDRI", "modeLabel": "Ansicht", "exposure": "Belichtung", "env": "Himmel als Hintergrund", "spin": "Drehteller", "variants": "Materialvarianten", "modes": {"beauty": "Beauty", "clay": "Ton", "wire": "Drahtgitter", "normal": "Normalen"}, "hdris": {"studio": "Studio", "dawn": "Morgen", "sky": "Himmel", "dusk": "Abend"}, "triangles": "Dreiecke", "meshes": "Meshes", "materials": "Materialien", "textures": "Texturen", "dims": "Größe", "file": "Datei", "artist": "Künstler", "source": "Quelle", "license": "Lizenz", "owner": "Inhaber", "open": "Stück öffnen", "download": "Herunterladen", "embed": "AR-Embed kopieren", "copyLink": "Quell-Link kopieren"},
};

const ja: YDict = {
  plate: "図版",
  plates: { home: "Erathra", index: "サイト", library: "螺旋", cabinet: "陳列室", atlas: "星図", archive: "アーカイブ", analyze: "分析", board: "ボード", about: "宣言", contact: "便り", piece: "サイト" },
  descs: {
    index: "すべてのサイトをライブで、プロンプト付きで。",
    library: "雲の上、選ばれた作品の螺旋を昇る。",
    cabinet: "Khronos と Poly Haven の実在する 3D モデルを、本物の空の光で。",
    atlas: "ライブラリ全体を星空として描く。",
    archive: "NASA と Wikimedia Commons をライブ検索。",
    analyze: "サイトや画像を測り、プロンプトを得る。",
    board: "保存した作品。書き出し・共有。",
    about: "Erathra が存在し、無料であり続ける理由。",
    contact: "お便り、または作品の投稿。",
  },
  home: { kicker: "無料のデザインライブラリ · すべてにコードと AI プロンプト", l1: "雲の上の", l2: "ライブラリ", sub: "3D オブジェクト、モーション、イメージ、パレット、書体、コンポーネント、サイト研究 — すべてにコードとプロンプト。無料、7 言語。", cta: "螺旋を昇る", cta2: "星図を開く", ascend: "スクロールで上昇" },
  loader: { ascending: "上昇中", ready: "雲の上へ", enter: "入る", silent: "静かに入る", hint: "音ありがおすすめ", tagline: "雲の上のライブラリ" },
  atlas: { sub: "作品はひとつの星。種類はひとつの星座。", hint: "ドラッグ · スクロールでズーム · 星をクリック", all: "すべての星座", stars: "星", fit: "全体表示" },
  contact: { l1: "空へ", l2: "便りを", sub: "作品、質問、やさしい言葉を送ってください。", name: "お名前", email: "メール", message: "メッセージ", kinds: ["作品を投稿", "一般", "プレス"], send: "送信", direct: "または直接" },
  free: "永久無料",
  sound: { on: "サウンド オン", off: "サウンド オフ" },
  sources: { commons: "Wikimedia Commons", nasa: "NASA 画像ライブラリ" },
  stats: { pieces: "作品", kinds: "種類", archives: "ライブ・アーカイブ", languages: "言語", cost: "永久に" },
  local: "現地時刻",
  rate: "本日の無料分析枠を使い切りました。キャッシュ済みのサイトは引き続き表示できます。",
  sites: {"title": "サイト", "sub": "完成したウェブサイトデザインのライブラリ。どのサイトもスクロール・リサイズ・ダウンロードできるライブ版で、作成に使ったプロンプトもそのまま。", "count": "サイト", "cta": "サイトを見る", "homeSub": "完成したウェブサイトデザイン。ライブプレビューと、それを作るプロンプトをそのまま。無料・7 言語。", "latest": "最新", "preview": "ライブプレビュー", "prompt": "プロンプト", "desktop": "デスクトップ", "tablet": "タブレット", "phone": "スマホ", "replay": "再生", "recorder": "録画モード", "open": "フルページで開く", "download": ".html をダウンロード", "copyPrompt": "プロンプトをコピー", "copied": "コピー済み", "downloadPrompt": ".md をダウンロード", "words": "語", "sections": "セクション", "palette": "パレット", "fonts": "書体", "category": "カテゴリ", "year": "年", "size": "サイズ", "back": "すべてのサイト", "next": "次のサイト", "empty": "まだ保存はありません。", "soon": "新しいサイトを準備中", "soonText": "デザインはひとつずつ、プロンプトと一緒に追加されます。", "fullscreen": "フォーカス", "exit": "閉じる"},
  cabinet: {"loading": "モデルを読み込み中", "error": "このモデルを読み込めませんでした。", "drag": "ドラッグで回転 · スクロールでズーム", "lighting": "照明 · HDRI", "modeLabel": "表示", "exposure": "露出", "env": "空の背景", "spin": "ターンテーブル", "variants": "マテリアル・バリアント", "modes": {"beauty": "ビューティー", "clay": "クレイ", "wire": "ワイヤー", "normal": "法線"}, "hdris": {"studio": "スタジオ", "dawn": "夜明け", "sky": "青空", "dusk": "夕暮れ"}, "triangles": "三角形", "meshes": "メッシュ", "materials": "マテリアル", "textures": "テクスチャ", "dims": "サイズ", "file": "ファイル", "artist": "作者", "source": "出典", "license": "ライセンス", "owner": "所有者", "open": "作品を開く", "download": "ダウンロード", "embed": "AR 埋め込みをコピー", "copyLink": "出典リンクをコピー"},
};

const ar: YDict = {
  plate: "لوح",
  plates: { home: "إراثرا", index: "المواقع", library: "اللولب", cabinet: "الخزانة", atlas: "الأطلس", archive: "الأرشيف", analyze: "تحليل", board: "اللوحة", about: "البيان", contact: "مراسلة", piece: "موقع" },
  descs: {
    index: "كل تصميم موقع، حيّاً، مع موجّهه.",
    library: "اصعد لولباً من القطع المختارة فوق الغيوم.",
    cabinet: "نماذج ثلاثية الأبعاد حقيقية من Khronos وPoly Haven، مضاءة بسماوات حقيقية.",
    atlas: "المكتبة كلها مرسومة كسماء من النجوم.",
    archive: "ابحث في ناسا وويكيميديا كومنز مباشرة.",
    analyze: "قِس أي موقع أو صورة واحصل على الموجّهات.",
    board: "قطعك المحفوظة، جاهزة للتصدير والمشاركة.",
    about: "لماذا توجد إراثرا ولماذا تبقى مجانية.",
    contact: "راسلنا أو أرسل قطعة.",
  },
  home: { kicker: "مكتبة تصميم مجانية · كود وموجّهات لكل قطعة", l1: "المكتبة", l2: "فوق الغيوم", sub: "مجسّمات ثلاثية الأبعاد، حركة، صور، ألوان، خطوط، مكوّنات ودراسات مواقع — مع كود وموجّهات لأي نموذج. مجانية، بسبع لغات.", cta: "اصعد اللولب", cta2: "افتح الأطلس", ascend: "مرّر للصعود" },
  loader: { ascending: "صعود", ready: "فوق الغيوم", enter: "ادخل", silent: "ادخل بصمت", hint: "أجمل مع الصوت", tagline: "المكتبة فوق الغيوم" },
  atlas: { sub: "كل قطعة نجم. كل نوع كوكبة.", hint: "اسحب · مرّر للتكبير · انقر نجماً", all: "كل الكوكبات", stars: "نجم", fit: "ملاءمة السماء" },
  contact: { l1: "اكتب", l2: "إلى السماء", sub: "أرسل قطعة أو سؤالاً أو كلمة طيبة. نقرأ كل شيء.", name: "اسمك", email: "البريد", message: "الرسالة", kinds: ["إرسال قطعة", "عام", "صحافة"], send: "أرسل الرسالة", direct: "أو اكتب مباشرة" },
  free: "مجانية دائماً",
  sound: { on: "الصوت يعمل", off: "الصوت مغلق" },
  sources: { commons: "ويكيميديا كومنز", nasa: "مكتبة صور ناسا" },
  stats: { pieces: "قطعة", kinds: "أنواع", archives: "أرشيفات مباشرة", languages: "لغات", cost: "التكلفة، دائماً" },
  local: "التوقيت المحلي",
  rate: "نفدت حصة التحليل المجانية لليوم. المواقع المخزّنة مؤقتاً ما زالت تعمل — حاول غداً.",
  sites: {"title": "المواقع", "sub": "مكتبة من تصاميم مواقع كاملة. كل موقع نسخة حيّة يمكنك تصفّحها وتغيير حجمها وتنزيلها — مع الموجّه نفسه الذي صنعها.", "count": "مواقع", "cta": "تصفّح المواقع", "homeSub": "تصاميم مواقع كاملة، لكل منها معاينة حيّة والموجّه الذي يبنيها. مجانية، بسبع لغات.", "latest": "الأحدث", "preview": "معاينة حيّة", "prompt": "الموجّه", "desktop": "سطح المكتب", "tablet": "لوحي", "phone": "هاتف", "replay": "إعادة", "recorder": "وضع التسجيل", "open": "افتح الصفحة كاملة", "download": "تنزيل ‎.html", "copyPrompt": "نسخ الموجّه", "copied": "تم النسخ", "downloadPrompt": "تنزيل ‎.md", "words": "كلمة", "sections": "الأقسام", "palette": "الألوان", "fonts": "الخطوط", "category": "الفئة", "year": "السنة", "size": "الحجم", "back": "كل المواقع", "next": "الموقع التالي", "empty": "لا شيء محفوظ بعد.", "soon": "مواقع جديدة في الطريق", "soonText": "تُضاف التصاميم واحداً تلو الآخر، كلٌّ مع موجّهه.", "fullscreen": "تركيز", "exit": "خروج"},
  cabinet: {"loading": "جارٍ تحميل النموذج", "error": "تعذّر تحميل هذا النموذج.", "drag": "اسحب للدوران · مرّر للتكبير", "lighting": "الإضاءة · HDRI", "modeLabel": "الفحص", "exposure": "التعريض", "env": "خلفية السماء", "spin": "منصة دوّارة", "variants": "بدائل الخامات", "modes": {"beauty": "جمالي", "clay": "طين", "wire": "سلكي", "normal": "المتّجهات"}, "hdris": {"studio": "استوديو", "dawn": "فجر", "sky": "سماء", "dusk": "غسق"}, "triangles": "مثلثات", "meshes": "شبكات", "materials": "خامات", "textures": "نقوش", "dims": "الحجم", "file": "الملف", "artist": "الفنان", "source": "المصدر", "license": "الرخصة", "owner": "المالك", "open": "افتح القطعة", "download": "تنزيل", "embed": "نسخ كود AR", "copyLink": "نسخ رابط المصدر"},
};

export const Y: Record<LangCode, YDict> = { en, tr, es, fr, de, ja, ar };
