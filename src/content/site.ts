/**
 * All copy and facts for the page live here, in two languages.
 *
 * - `site`, `sceneIds`, `levelStyle`, `kana`: language-neutral data.
 * - `copy.vi` / `copy.ja`: every visible string. Both must have the same shape
 *   (TypeScript checks `ja` against `vi`). Components read the active one via `useCopy()`.
 *
 * Real facts only. Anything marked TODO(Lavie) is intentionally left empty: the page hides
 * those blocks until real information is filled in. Never invent credentials or quotes.
 */

export type Lang = "vi" | "ja";
export const LANGS: Lang[] = ["vi", "ja"];

export const site = {
  name: "Lavie",
  nameJp: "ラヴィ",
  contact: {
    phoneDisplay: "0917 989 323",
    phoneRaw: "0917989323",
    phoneIntl: "+84917989323",
    tel: "tel:+84917989323",
    zalo: "https://zalo.me/0917989323",
    maps: "https://maps.google.com/?q=Hu%E1%BA%BF",
  },
};

/** section ids in journey order + the kanji on the scene rail */
export const sceneIds = [
  { id: "doi-anh-dao", jp: "丘" },
  { id: "lo-trinh", jp: "空" },
  { id: "thu-chu", jp: "池" },
  { id: "ve-lavie", jp: "手紙" },
  { id: "lop-hoc", jp: "夜" },
] as const;

/** the four tanzaku: code, vertical Japanese line, paper and ink colours */
export const levelStyle = [
  { code: "N5", jp: "はじめの一歩", tint: "#f7d3dd", ink: "#7a2a43" },
  { code: "N4", jp: "基礎をかためる", tint: "#f6ead2", ink: "#6b4a17" },
  { code: "N3", jp: "ことばが広がる", tint: "#d9e8f5", ink: "#1f4870" },
  { code: "N2", jp: "自信をもって", tint: "#dcebd8", ink: "#28502e" },
] as const;

/** `meaning` is Vietnamese in both languages: in Japanese mode it reads as a tiny Vietnamese lesson */
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

/* ───────────────────────────── Tiếng Việt ───────────────────────────── */

const vi = {
  docTitle: "Lavie — Dạy tiếng Nhật N5–N2 tại Huế",
  city: "Huế, Việt Nam",
  lang: { group: "Ngôn ngữ · 言語", stamp: "Tiếng Việt", short: "VI" },

  nav: {
    main: "Chính",
    top: "Lavie — về đầu trang",
    roadmap: "Lộ trình",
    classes: "Lớp học",
    contact: "Liên hệ",
    zaloAria: "Nhắn Zalo cho Lavie",
    call: "gọi",
    callAria: "Gọi Lavie",
    copyAria: "Chép số điện thoại",
    copied: "Đã chép",
    scenes: "Các cảnh",
    scrollDown: "Cuộn xuống",
  },
  scenes: ["Đồi anh đào", "Lộ trình", "Thử chữ", "Về Lavie", "Lớp học"],
  loader: ["Đang mài mực…", "Đang pha trà…", "Đang mở cửa sổ…", "Đang gọi cá koi…"],

  hero: {
    eyebrow: "日本語 · Huế · N5 → N2",
    title: ["Tiếng Nhật,", "nở hoa."],
    sub: "Học tiếng Nhật cùng Lavie, từ những chữ あいう đầu tiên đến ngày bước vào phòng thi N2. Kèm 1-1 online, trực tiếp tại Huế, hoặc nhóm nhỏ.",
    primary: "Học thử miễn phí",
    secondary: "Xem lộ trình",
  },

  levels: {
    label: "日本語の道 · lộ trình",
    title: ["Từ N5", "đến N2."],
    headLabel: "四つの段階 · bốn chặng",
    head: ["Bốn chặng, ", "một con đường."],
    sub: "Mỗi cấp độ là một mùa hoa. Bạn bắt đầu ở đâu cũng được, Lavie sẽ cùng bạn đi tiếp.",
    stage: "Chặng",
    swipe: "← vuốt để xem →",
    items: [
      { title: "Khởi đầu", points: ["Hiragana & Katakana", "Chào hỏi, giới thiệu bản thân", "Câu đơn giản hằng ngày"], stats: "~100 漢字 · ~800 từ" },
      { title: "Nền tảng", points: ["Ngữ pháp sơ cấp trọn vẹn", "Hội thoại đời sống", "Đọc đoạn văn ngắn"], stats: "~300 漢字 · ~1.500 từ" },
      { title: "Trung cấp", points: ["Đọc hiểu bài báo đơn giản", "Nghe tốc độ tự nhiên", "Diễn đạt ý kiến"], stats: "~650 漢字 · ~3.700 từ" },
      { title: "Vững vàng", points: ["Văn bản công việc, du học", "Tin tức & hội thoại chuyên sâu", "Chiến thuật thi JLPT"], stats: "~1.000 漢字 · ~6.000 từ" },
    ],
  },

  pond: {
    label: "池 · thử một bài học nhỏ",
    title: ["Chạm vào", "là nhớ."],
    body: "Chạm vào một chữ để nghe cách đọc và một từ ví dụ. Lớp của Lavie cũng vậy: học bằng tai, bằng mắt, và bằng tay.",
    pick: "Chọn bảng chữ",
    readAs: "đọc là",
    meaning: "",
    replay: "Nghe lại",
  },

  letter: {
    kicker: "手紙 · Thư từ Lavie",
    greeting: "Chào bạn,",
    paragraphs: [
      "Mình là Lavie, người dạy tiếng Nhật ở Huế. Mình tin học một ngôn ngữ cũng giống ngắm hoa nở: không vội được, nhưng mỗi ngày đều thấy khác đi một chút.",
      "Ở lớp của mình, bạn không phải học thuộc lòng một mình. Mỗi bài được chia thành những phần nhỏ vừa sức, có luyện nói, có chữa bài, và có người đi cùng bạn qua từng cấp độ, từ những chữ あいう đầu tiên cho đến kỳ thi N2.",
      "Nếu bạn còn đang phân vân, cứ nhắn mình một buổi học thử nhé. Mình sẽ pha sẵn trà.",
    ],
    signoff: "Thân mến,",
    photoAlt: "Lavie, giáo viên tiếng Nhật ở Huế",
    flipAlt: "Ảnh Lavie, chạm để lật",
    flipHint: "chạm để lật",
    back: "“Hẹn gặp bạn ở lớp nhé!”",
    /** Real facts only. TODO(Lavie): years teaching, e.g. { value: "5+", label: "năm đứng lớp" } */
    credentials: [{ value: "N1", label: "Chứng chỉ JLPT" }] as { value: string; label: string }[],
    /** TODO(Lavie): real student quotes only, e.g. { quote: "...", name: "Minh Anh", detail: "Đỗ N3 · 12/2025" } */
    testimonials: [] as { quote: string; name: string; detail: string }[],
  },

  classes: {
    label: "夜の教室 · lớp học buổi tối",
    title: ["Học theo", "cách của bạn."],
    sub: "Bốn hình thức, một cách dạy: chậm rãi, rõ ràng, và luôn có người trả lời khi bạn hỏi “tại sao?”.",
    formats: [
      { tag: "個人 · オンライン", title: "1 kèm 1 · Online", body: "Học qua video call, giờ giấc linh hoạt. Giáo trình xây theo đúng mục tiêu và tốc độ của riêng bạn." },
      { tag: "個人 · フエ", title: "1 kèm 1 · Tại Huế", body: "Gặp trực tiếp tại Huế. Học chậm rãi, hỏi bao nhiêu cũng được, như trò chuyện bên tách trà." },
      { tag: "グループ", title: "Nhóm nhỏ", body: "Học cùng vài bạn cùng trình độ để có thêm bạn luyện hội thoại, vui hơn và tiết kiệm hơn." },
      { tag: "JLPT対策", title: "Luyện thi JLPT", body: "Từ N5 đến N2: ôn theo cấu trúc đề, luyện đề có bấm giờ, chữa từng câu và chiến thuật phòng thi." },
    ],
    stepsLabel: "体験レッスン · buổi học thử",
    stepsTitle: ["Bắt đầu ", "trong ba bước."],
    steps: [
      { n: "一", title: "Nhắn hoặc gọi", body: "Gửi Lavie một tin qua Zalo hoặc gọi điện, kể mình nghe mục tiêu của bạn." },
      { n: "二", title: "Buổi học thử", body: "Một buổi học thử miễn phí để làm quen và xem bạn đang ở đâu trên lộ trình." },
      { n: "三", title: "Lộ trình riêng", body: "Bạn nhận lịch học, hình thức và học phí phù hợp, rồi mình cùng bắt đầu." },
    ],
    faqLabel: "よくある質問 · hỏi nhanh",
    faqTitle: ["Bạn đang", "thắc mắc?"],
    faqs: [
      { q: "Mình chưa biết chữ nào, học được không?", a: "Được chứ. Lớp N5 bắt đầu từ bảng chữ Hiragana, đi chậm và chắc từng bước." },
      { q: "Học phí bao nhiêu?", a: "Học phí tuỳ hình thức (1-1, nhóm, online hay trực tiếp) và cấp độ. Bạn nhắn Lavie để nhận báo giá cụ thể sau buổi học thử nhé." },
      { q: "Mình ở ngoài Huế thì sao?", a: "Bạn có thể học 1 kèm 1 online hoặc nhóm online, ở đâu cũng được." },
      { q: "Có luyện thi JLPT không?", a: "Có. Lavie luyện thi từ N5 đến N2, kết hợp học kiến thức nền với luyện đề theo đúng cấu trúc kỳ thi." },
    ],
  },

  cta: {
    label: "今度はあなたの番 · đến lượt bạn",
    title: ["Đến lượt ", "bạn."],
    sub: "Nhắn Lavie một câu こんにちは. Buổi học thử đầu tiên là miễn phí.",
    call: "Gọi cho Lavie",
    zalo: "Nhắn Zalo",
    copy: "Chép số",
    copied: "Đã chép số ✓",
    where: "Huế, Việt Nam · Online toàn quốc",
  },

  footer: {
    tagline: "ラヴィの日本語教室 · Huế",
    cols: ["Lộ trình", "Hình thức", "Các cảnh", "Liên hệ"],
    bottom: "Dạy tiếng Nhật N5–N2 tại Huế",
  },
};

type Copy = typeof vi;

/* ───────────────────────────── 日本語 ───────────────────────────── */

const ja: Copy = {
  docTitle: "Lavie — フエの日本語教室 N5–N2",
  city: "ベトナム・フエ",
  lang: { group: "言語 · Ngôn ngữ", stamp: "日本語", short: "日" },

  nav: {
    main: "メイン",
    top: "Lavie — ページの先頭へ",
    roadmap: "ロードマップ",
    classes: "レッスン",
    contact: "お問い合わせ",
    zaloAria: "Zaloでラヴィにメッセージ",
    call: "電話",
    callAria: "ラヴィに電話",
    copyAria: "電話番号をコピー",
    copied: "コピーしました",
    scenes: "シーン",
    scrollDown: "スクロール",
  },
  scenes: ["桜の丘", "学びの道", "文字の池", "ラヴィの手紙", "夜の教室"],
  loader: ["墨をすっています…", "お茶を淹れています…", "窓を開けています…", "鯉を呼んでいます…"],

  hero: {
    eyebrow: "日本語 · フエ · N5 → N2",
    title: ["日本語、", "花ひらく。"],
    sub: "最初の「あいう」から、N2の試験当日まで。ラヴィと一緒に日本語を学びませんか。オンラインの個人レッスン、フエでの対面レッスン、少人数グループから選べます。",
    primary: "無料体験レッスン",
    secondary: "ロードマップを見る",
  },

  levels: {
    label: "Lộ trình · 日本語の道",
    title: ["N5から", "N2へ。"],
    headLabel: "Bốn chặng · 四つの段階",
    head: ["四つの段階、", "ひとつの道。"],
    sub: "どのレベルも、ひとつの花の季節。どこから始めても大丈夫です。ラヴィが一緒に歩きます。",
    stage: "段階",
    swipe: "← スワイプ →",
    items: [
      { title: "入門", points: ["ひらがな・カタカナ", "あいさつと自己紹介", "毎日使えるかんたんな文"], stats: "漢字 約100 · 語彙 約800" },
      { title: "基礎", points: ["初級文法をひととおり", "日常会話", "短い文章の読解"], stats: "漢字 約300 · 語彙 約1,500" },
      { title: "中級", points: ["やさしいニュース記事の読解", "自然なスピードの聞き取り", "自分の意見を伝える"], stats: "漢字 約650 · 語彙 約3,700" },
      { title: "確かな力", points: ["仕事・留学で使う文章", "ニュースと踏み込んだ会話", "JLPT本番の戦略"], stats: "漢字 約1,000 · 語彙 約6,000" },
    ],
  },

  pond: {
    label: "Thử chữ · 小さなレッスン",
    title: ["触れれば、", "心に残る。"],
    body: "文字にタッチすると、読み方と、その文字を使った単語が聞こえます。私のレッスンでも、耳と目と手を使って学びます。",
    pick: "文字の種類を選ぶ",
    readAs: "読み",
    meaning: "ベトナム語で",
    replay: "もう一度聞く",
  },

  letter: {
    kicker: "Thư từ Lavie · 手紙",
    greeting: "こんにちは。",
    paragraphs: [
      "フエで日本語を教えているラヴィです。言葉を学ぶことは、花が咲くのを見守ることに似ていると思っています。急ぐことはできないけれど、毎日少しずつ変わっていきます。",
      "私のレッスンでは、ひとりで暗記に取り組まなくても大丈夫です。毎回の内容を無理なく学べる小さなステップに分け、話す練習や添削を通して支えます。最初の「あいう」からN2の試験まで、一歩ずつ一緒に進んでいきます。",
      "まだ迷っていたら、まずは体験レッスンについて、気軽にメッセージを送ってください。お茶を用意して待っています。",
    ],
    signoff: "心をこめて",
    photoAlt: "フエの日本語教師、ラヴィ",
    flipAlt: "ラヴィの写真（タップで裏返す）",
    flipHint: "タップで裏返す",
    back: "「教室で会いましょう！」",
    credentials: [{ value: "N1", label: "日本語能力試験" }],
    testimonials: [],
  },

  classes: {
    label: "Lớp học buổi tối · 夜の教室",
    title: ["あなたに合った", "学び方で。"],
    sub: "四つのレッスン形式、ひとつの教え方。ゆっくり、わかりやすく。「どうして？」という質問にも、いつでもお答えします。",
    formats: [
      { tag: "1 kèm 1 · Online", title: "オンライン個人レッスン", body: "ビデオ通話で、時間は柔軟に。あなたの目標とペースに合わせてカリキュラムを組みます。" },
      { tag: "1 kèm 1 · Tại Huế", title: "フエで対面個人レッスン", body: "フエで直接お会いして、お茶を飲みながら話すように、ゆっくり学んでいきます。質問はいくつでもしてくださいね。" },
      { tag: "Nhóm nhỏ", title: "少人数グループ", body: "同じレベルの仲間と一緒に。会話の練習相手ができて、楽しく、受講料もおさえられます。" },
      { tag: "Luyện thi JLPT", title: "JLPT対策", body: "N5からN2まで対応しています。出題形式に沿って復習し、時間を計りながら問題を解きます。一問ずつ解説し、本番での解き方もお伝えします。" },
    ],
    stepsLabel: "Buổi học thử · 体験レッスン",
    stepsTitle: ["三つのステップで ", "はじめよう。"],
    steps: [
      { n: "一", title: "メッセージか電話", body: "Zaloでメッセージ、またはお電話で、あなたの目標を聞かせてください。" },
      { n: "二", title: "体験レッスン", body: "無料の体験レッスンで、お互いを知り、今どの段階にいるかを確かめます。" },
      { n: "三", title: "あなただけのプラン", body: "スケジュール、レッスン形式、受講料をご提案して、一緒にスタートします。" },
    ],
    faqLabel: "Hỏi nhanh · よくある質問",
    faqTitle: ["気になること、", "ありますか？"],
    faqs: [
      { q: "ひらがなもまだ読めません。大丈夫ですか？", a: "もちろんです。N5クラスはひらがなから始めて、ゆっくり確実に進めます。" },
      { q: "受講料はいくらですか？", a: "レッスン形式（個人・グループ、オンライン・対面）とレベルによって異なります。体験レッスンのあとに具体的な料金をお伝えしますので、お気軽にメッセージを送ってください。" },
      { q: "フエ以外に住んでいても受けられますか？", a: "はい。オンラインの個人レッスンやグループレッスンなら、どこからでも受講できます。" },
      { q: "JLPT対策はありますか？", a: "あります。N5からN2まで、基礎の学習と、本番と同じ形式の問題演習を組み合わせて対策します。" },
    ],
  },

  cta: {
    label: "Đến lượt bạn · 今度はあなたの番",
    title: ["次は、", "あなたの番。"],
    sub: "ラヴィに「Xin chào」とひとことどうぞ。最初の体験レッスンは無料です。",
    call: "ラヴィに電話する",
    zalo: "Zaloでメッセージ",
    copy: "番号をコピー",
    copied: "コピーしました ✓",
    where: "ベトナム・フエ · オンラインはベトナム全国対応",
  },

  footer: {
    tagline: "ラヴィの日本語教室 · Huế",
    cols: ["ロードマップ", "レッスン形式", "シーン", "お問い合わせ"],
    bottom: "フエの日本語教室 · N5–N2",
  },
};

export const copy: Record<Lang, Copy> = { vi, ja };
