export type AnswerKey = "yes" | "friends" | "later" | "no";

export type AnswerContent = {
  key: AnswerKey;
  short: string;
  label: string;
  kicker: string;
  title: string;
  body: string;
  note: string;
  message: string;
  noteLabel: string;
};

export const ANSWERS: Record<AnswerKey, AnswerContent> = {
  yes: {
    key: "yes",
    short: "Evet",
    label: "Olur, tanışalım.",
    kicker: "içimden bir evet geçti",
    title: "Çok sevindim, Ela.",
    body:
      "Şu an gülümsediğimi saklamayacağım. Okulda denk geldiğimizde biraz daha konuşalım; acele etmeden, senin rahat ettiğin kadar.",
    note: "Bunu bir yere not edeceğim: bugün güzel bir gün.",
    message: "Mektubunu okudum Kadir. Olur, birbirimizi daha iyi tanıyabiliriz.",
    noteLabel: "bugün güzel bir gün.",
  },
  friends: {
    key: "friends",
    short: "Arkadaşız",
    label: "Arkadaş olarak konuşabiliriz.",
    kicker: "bu da güzel bir şey",
    title: "Sağ ol, Ela.",
    body:
      "Arkadaşça konuşmak da beni mutlu eder. Açık olduğun için teşekkür ederim; söylemesi kolay değildi belki, o yüzden ayrıca değerli.",
    note: "Okulda yanına gelip “selam” demekten çekinmeyeceğim.",
    message: "Mektubunu okudum Kadir. Arkadaş olarak konuşabiliriz.",
    noteLabel: "arkadaş kalmak da güzel.",
  },
  later: {
    key: "later",
    short: "Düşüneceğim",
    label: "Biraz düşünmek isterim.",
    kicker: "düşünmek de bir cevap",
    title: "Tabii, düşün.",
    body:
      "Hiç acele etme. Bir gün konuşuruz, olmadı bir hafta sonra. Bu sayfanın bir son tarihi yok; cevabını beklemekten rahatsız değilim.",
    note: "İstersen hiç cevap verme. Bu da olur.",
    message: "Mektubunu okudum Kadir. Biraz düşünmek isterim.",
    noteLabel: "hiç acele yok.",
  },
  no: {
    key: "no",
    short: "Hayır",
    label: "Hayır, istemiyorum.",
    kicker: "bunu da saklamayacağım",
    title: "Teşekkür ederim, Ela.",
    body:
      "Biraz buruk olduğumu saklamayacağım. Ama bu, senin hakkında düşündüğüm tek şey değil. Açık olduğun için sağ ol; okulda hiçbir şeyin garip olmasını istemem.",
    note: "Cevabını değiştirmeye çalışmayacağım. Bugünün geri kalanı sana iyi gelsin.",
    message: "Mektubunu okudum Kadir. Aynı duyguları hissetmiyorum ama söylediğin için teşekkür ederim.",
    noteLabel: "bazı şeyler olduğu gibi kalır.",
  },
};

export const NAV = [
  { id: "baslangic", label: "Başlangıç", short: "Başlangıç" },
  { id: "mektup", label: "Mektup", short: "Mektup" },
  { id: "aramizda", label: "Aramızda", short: "Aramızda" },
  { id: "galeri", label: "Galeri", short: "Galeri" },
  { id: "emek", label: "Emek", short: "Emek" },
  { id: "soru", label: "Cevabın", short: "Cevabın" },
] as const;

export const DRAFTS = [
  {
    no: "01",
    status: "gönderilmedi",
    date: "birinci akşam",
    text: "Selam Ela. Nasılsın? İyi misin? Neyse, iyi dersler.",
    verdict: "Çok kısaydı. Söylemek istediğim hiçbir şey yoktu sanki.",
    keep: false,
    stamp: "SİLİNDİ",
  },
  {
    no: "02",
    status: "gönderilmedi",
    date: "ikinci akşam",
    text:
      "Merhaba Ela, bunu yazmadan önce çok düşündüm. Aslında bir sürü şey söylemek istiyorum ama hepsini buraya sığdıramam. Sadece şunu bilmeni istiyorum ki...",
    verdict: "Çok fazlaydı. Kendi sesimi bile duyamıyordum.",
    keep: false,
    stamp: "SİLİNDİ",
  },
  {
    no: "03",
    status: "gönderilen",
    date: "üçüncü akşam",
    text: "Senden hoşlanıyorum, Ela. Ama cevabın ne olursa olsun, sana saygım aynı.",
    verdict: "Kısa, dürüst, doğru. Bunu gönderebildim.",
    keep: true,
    stamp: "KALDI",
  },
];

export const CARE = [
  {
    no: "01",
    title: "Cevap vermek zorunda değilsin.",
    body: "Bunu söylemek, senden bir karşılık beklediğim anlamına gelmiyor. Ne hissettiğin senin bileceğin iş.",
  },
  {
    no: "02",
    title: "Arkadaş kalmak da güzel.",
    body: "Hayır dersen de aynı sınıfta olmaya devam edeceğiz. Bunun aramızda garip bir hâl almasını istemem.",
  },
  {
    no: "03",
    title: "Zaman senin.",
    body: "Düşünmek istersen düşün. İstersen bir hafta sonra konuşuruz. İstersen hiç cevap verme.",
  },
];

export const FRAMES = [
  {
    no: "01",
    title: "Bir gülüşün",
    caption: "Henüz çekilmedi. Ama galerimde yeri hazır.",
    kind: "sun" as const,
  },
  {
    no: "02",
    title: "Bir ders arası",
    caption: "Sınıfın kapısında, zil çaldıktan sonra.",
    kind: "hall" as const,
  },
  {
    no: "03",
    title: "Bundan sonrası",
    caption: "Belki de bundan sonra galerim senin karelerinle dolar.",
    kind: "flower" as const,
  },
];

export const MOMENTS = [
  { time: "sabah", text: "Sınıfa girerken gözlerim seni arıyor. Bunu çok belli etmiyorum." },
  { time: "ders arası", text: "Koridorda denk geldiğimizde bir şey söylemek istiyorum, çoğu zaman söyleyemiyorum." },
  { time: "çıkışta", text: "Bazen gözlerimiz kesişiyor. İşaret mi, tesadüf mü bilmiyorum. İkisi de olabilir." },
];
