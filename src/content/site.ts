/**
 * All copy and facts for the page live here.
 * Anything marked TODO(Lavie) is intentionally left empty: the page hides
 * those blocks until real information is filled in. Never invent credentials.
 */

export const site = {
  name: "Lavie",
  nameJp: "ラヴィ",
  city: "Huế, Việt Nam",
  contact: {
    phoneDisplay: "0917 989 323",
    phoneRaw: "0917989323",
    phoneIntl: "+84917989323",
    tel: "tel:+84917989323",
    zalo: "https://zalo.me/0917989323",
  },
  /** Real facts only. TODO(Lavie): years teaching, e.g. { value: "5+", label: "năm đứng lớp" } */
  credentials: [{ value: "N1", label: "Chứng chỉ JLPT" }] as { value: string; label: string }[],
  /** TODO(Lavie): real student quotes only, e.g. { quote: "...", name: "Minh Anh", detail: "Đỗ N3 · 12/2025" } */
  testimonials: [] as { quote: string; name: string; detail: string }[],
};

export const scenes = [
  { id: "doi-anh-dao", label: "Đồi anh đào", jp: "丘" },
  { id: "lo-trinh", label: "Lộ trình", jp: "空" },
  { id: "thu-chu", label: "Thử chữ", jp: "池" },
  { id: "ve-lavie", label: "Về Lavie", jp: "手紙" },
  { id: "lop-hoc", label: "Lớp học", jp: "夜" },
] as const;

export const hero = {
  eyebrow: "日本語 · Huế · N5 → N2",
  title: ["Tiếng Nhật,", "nở hoa."],
  sub: "Học tiếng Nhật cùng Lavie, từ những chữ あいう đầu tiên đến ngày bước vào phòng thi N2. Kèm 1-1 online, trực tiếp tại Huế, hoặc nhóm nhỏ.",
  primary: "Học thử miễn phí",
  secondary: "Xem lộ trình",
};

export const levels = [
  {
    code: "N5",
    jp: "はじめの一歩",
    title: "Khởi đầu",
    tint: "#f7d3dd",
    ink: "#7a2a43",
    points: ["Hiragana & Katakana", "Chào hỏi, giới thiệu bản thân", "Câu đơn giản hằng ngày"],
    stats: "~100 漢字 · ~800 từ",
  },
  {
    code: "N4",
    jp: "基礎をかためる",
    title: "Nền tảng",
    tint: "#f6ead2",
    ink: "#6b4a17",
    points: ["Ngữ pháp sơ cấp trọn vẹn", "Hội thoại đời sống", "Đọc đoạn văn ngắn"],
    stats: "~300 漢字 · ~1.500 từ",
  },
  {
    code: "N3",
    jp: "ことばが広がる",
    title: "Trung cấp",
    tint: "#d9e8f5",
    ink: "#1f4870",
    points: ["Đọc hiểu bài báo đơn giản", "Nghe tốc độ tự nhiên", "Diễn đạt ý kiến"],
    stats: "~650 漢字 · ~3.700 từ",
  },
  {
    code: "N2",
    jp: "自信をもって",
    title: "Vững vàng",
    tint: "#dcebd8",
    ink: "#28502e",
    points: ["Văn bản công việc, du học", "Tin tức & hội thoại chuyên sâu", "Chiến thuật thi JLPT"],
    stats: "~1.000 漢字 · ~6.000 từ",
  },
];

export type KanaItem = { glyph: string; romaji: string; word: string; reading: string; meaning: string };

export const kana: Record<"hiragana" | "katakana" | "kanji", { label: string; items: KanaItem[] }> = {
  hiragana: {
    label: "ひらがな",
    items: [
      { glyph: "あ", romaji: "a", word: "あさ", reading: "asa", meaning: "buổi sáng" },
      { glyph: "い", romaji: "i", word: "いぬ", reading: "inu", meaning: "con chó" },
      { glyph: "う", romaji: "u", word: "うみ", reading: "umi", meaning: "biển" },
      { glyph: "お", romaji: "o", word: "おちゃ", reading: "ocha", meaning: "trà" },
      { glyph: "か", romaji: "ka", word: "かわ", reading: "kawa", meaning: "dòng sông" },
      { glyph: "き", romaji: "ki", word: "きもの", reading: "kimono", meaning: "áo kimono" },
      { glyph: "さ", romaji: "sa", word: "さくら", reading: "sakura", meaning: "hoa anh đào" },
      { glyph: "な", romaji: "na", word: "なつ", reading: "natsu", meaning: "mùa hè" },
      { glyph: "は", romaji: "ha", word: "はな", reading: "hana", meaning: "bông hoa" },
      { glyph: "ま", romaji: "ma", word: "まち", reading: "machi", meaning: "thành phố" },
      { glyph: "や", romaji: "ya", word: "やま", reading: "yama", meaning: "ngọn núi" },
      { glyph: "ゆ", romaji: "yu", word: "ゆめ", reading: "yume", meaning: "giấc mơ" },
    ],
  },
  katakana: {
    label: "カタカナ",
    items: [
      { glyph: "ア", romaji: "a", word: "アイス", reading: "aisu", meaning: "kem" },
      { glyph: "カ", romaji: "ka", word: "カメラ", reading: "kamera", meaning: "máy ảnh" },
      { glyph: "コ", romaji: "ko", word: "コーヒー", reading: "kōhī", meaning: "cà phê" },
      { glyph: "サ", romaji: "sa", word: "サラダ", reading: "sarada", meaning: "salad" },
      { glyph: "テ", romaji: "te", word: "テレビ", reading: "terebi", meaning: "ti vi" },
      { glyph: "ノ", romaji: "no", word: "ノート", reading: "nōto", meaning: "quyển vở" },
      { glyph: "パ", romaji: "pa", word: "パン", reading: "pan", meaning: "bánh mì" },
      { glyph: "ベ", romaji: "be", word: "ベトナム", reading: "Betonamu", meaning: "Việt Nam" },
      { glyph: "ホ", romaji: "ho", word: "ホテル", reading: "hoteru", meaning: "khách sạn" },
      { glyph: "ミ", romaji: "mi", word: "ミルク", reading: "miruku", meaning: "sữa" },
      { glyph: "ラ", romaji: "ra", word: "ラーメン", reading: "rāmen", meaning: "mì ramen" },
      { glyph: "レ", romaji: "re", word: "レモン", reading: "remon", meaning: "quả chanh" },
    ],
  },
  kanji: {
    label: "漢字 N5",
    items: [
      { glyph: "日", romaji: "nichi · hi", word: "日本", reading: "nihon", meaning: "Nhật Bản" },
      { glyph: "月", romaji: "getsu · tsuki", word: "月", reading: "tsuki", meaning: "mặt trăng" },
      { glyph: "山", romaji: "san · yama", word: "山", reading: "yama", meaning: "núi" },
      { glyph: "川", romaji: "sen · kawa", word: "川", reading: "kawa", meaning: "sông" },
      { glyph: "人", romaji: "jin · hito", word: "日本人", reading: "nihonjin", meaning: "người Nhật" },
      { glyph: "水", romaji: "sui · mizu", word: "水", reading: "mizu", meaning: "nước" },
      { glyph: "木", romaji: "moku · ki", word: "木", reading: "ki", meaning: "cái cây" },
      { glyph: "花", romaji: "ka · hana", word: "花", reading: "hana", meaning: "bông hoa" },
      { glyph: "学", romaji: "gaku", word: "学生", reading: "gakusei", meaning: "học sinh" },
      { glyph: "先", romaji: "sen · saki", word: "先生", reading: "sensei", meaning: "giáo viên" },
      { glyph: "語", romaji: "go", word: "日本語", reading: "nihongo", meaning: "tiếng Nhật" },
      { glyph: "雨", romaji: "u · ame", word: "雨", reading: "ame", meaning: "mưa (Huế!)" },
    ],
  },
};

export const letter = {
  kicker: "手紙 · Thư từ Lavie",
  greeting: "Chào bạn,",
  paragraphs: [
    "Mình là Lavie, người dạy tiếng Nhật ở Huế. Mình tin học một ngôn ngữ cũng giống ngắm hoa nở: không vội được, nhưng mỗi ngày đều thấy khác đi một chút.",
    "Ở lớp của mình, bạn không phải học thuộc lòng một mình. Mỗi bài được chia thành những phần nhỏ vừa sức, có luyện nói, có chữa bài, và có người đi cùng bạn qua từng cấp độ, từ những chữ あいう đầu tiên cho đến kỳ thi N2.",
    "Nếu bạn còn đang phân vân, cứ nhắn mình một buổi học thử nhé. Mình sẽ pha sẵn trà.",
  ],
  signoff: "Thân mến,",
};

export const formats = [
  {
    jp: "個人 · オンライン",
    title: "1 kèm 1 · Online",
    body: "Học qua video call, giờ giấc linh hoạt. Giáo trình xây theo đúng mục tiêu và tốc độ của riêng bạn.",
  },
  {
    jp: "個人 · フエ",
    title: "1 kèm 1 · Tại Huế",
    body: "Gặp trực tiếp tại Huế. Học chậm rãi, hỏi bao nhiêu cũng được, như trò chuyện bên tách trà.",
  },
  {
    jp: "グループ",
    title: "Nhóm nhỏ",
    body: "Học cùng vài bạn cùng trình độ để có thêm bạn luyện hội thoại, vui hơn và tiết kiệm hơn.",
  },
  {
    jp: "JLPT対策",
    title: "Luyện thi JLPT",
    body: "Từ N5 đến N2: ôn theo cấu trúc đề, luyện đề có bấm giờ, chữa từng câu và chiến thuật phòng thi.",
  },
];

export const steps = [
  { n: "一", title: "Nhắn hoặc gọi", body: "Gửi Lavie một tin qua Zalo hoặc gọi điện, kể mình nghe mục tiêu của bạn." },
  { n: "二", title: "Buổi học thử", body: "Một buổi học thử miễn phí để làm quen và xem bạn đang ở đâu trên lộ trình." },
  { n: "三", title: "Lộ trình riêng", body: "Bạn nhận lịch học, hình thức và học phí phù hợp, rồi mình cùng bắt đầu." },
];

export const faqs = [
  {
    q: "Mình chưa biết chữ nào, học được không?",
    a: "Được chứ. Lớp N5 bắt đầu từ bảng chữ Hiragana, đi chậm và chắc từng bước.",
  },
  {
    q: "Học phí bao nhiêu?",
    a: "Học phí tuỳ hình thức (1-1, nhóm, online hay trực tiếp) và cấp độ. Bạn nhắn Lavie để nhận báo giá cụ thể sau buổi học thử nhé.",
  },
  {
    q: "Mình ở ngoài Huế thì sao?",
    a: "Bạn có thể học 1 kèm 1 online hoặc nhóm online, ở đâu cũng được.",
  },
  {
    q: "Có luyện thi JLPT không?",
    a: "Có. Lavie luyện thi từ N5 đến N2, kết hợp học kiến thức nền với luyện đề theo đúng cấu trúc kỳ thi.",
  },
];

export const cta = {
  title: "Đến lượt bạn.",
  sub: "Nhắn Lavie một câu こんにちは. Buổi học thử đầu tiên là miễn phí.",
};

export const loaderPhrases = ["Đang mài mực…", "Đang pha trà…", "Đang mở cửa sổ…", "Đang gọi cá koi…"];
