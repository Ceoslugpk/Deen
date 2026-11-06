export type QuranTopic={id:string;category:'Faith'|'Life'|'Spirituality';title:string;description:string;titleAr:string;descriptionAr:string;references:string[]};
export const QURAN_TOPICS:QuranTopic[]=[
 {id:'oneness',category:'Faith',title:'Oneness of Allah',description:'Verses affirming the absolute oneness, independence and incomparability of Allah.',titleAr:'توحيد الله',descriptionAr:'آيات تثبت وحدانية الله وغناه المطلق وتنزيهه عن المثل.',references:['112:1','112:2','112:3','112:4']},
 {id:'trust',category:'Faith',title:'Trust and reliance',description:'Reliance on Allah alongside mindful action and steadfastness.',titleAr:'التوكل والاعتماد',descriptionAr:'الاعتماد على الله مع الأخذ بالأسباب والثبات.',references:['3:159','9:51','65:2','65:3']},
 {id:'signs',category:'Faith',title:'Signs in creation',description:'Passages inviting reflection on creation, order and purpose.',titleAr:'الآيات في الكون',descriptionAr:'مقاطع تدعو إلى التأمل في الخلق والنظام والغاية.',references:['3:190','3:191','30:20','30:21']},
 {id:'resurrection',category:'Faith',title:'Resurrection and return',description:'Reminders of accountability, renewal and the final return to Allah.',titleAr:'البعث والرجعة',descriptionAr:'تذكير بالحساب وتجدّد الخلق والرجوع إلى الله.',references:['22:5','36:78','36:79','75:3','75:4']},
 {id:'parents',category:'Life',title:'Parents and family',description:'Mercy, gratitude and excellent conduct within family life.',titleAr:'الوالدان والأسرة',descriptionAr:'الرحمة والشكر وحسن العشرة في الحياة الأسرية.',references:['17:23','17:24','31:14','31:15']},
 {id:'justice',category:'Life',title:'Justice and integrity',description:'Standing firmly for justice even when it is personally difficult.',titleAr:'العدل والاستقامة',descriptionAr:'القيام بالعدل ولو كان فيه مشقة على النفس.',references:['4:135','5:8','16:90']},
 {id:'patience',category:'Life',title:'Patience in difficulty',description:'Seeking help through patience and prayer during hardship.',titleAr:'الصبر عند الشدة',descriptionAr:'الاستعانة بالصبر والصلاة عند اشتداد البلاء.',references:['2:153','2:155','2:156','94:5','94:6']},
 {id:'speech',category:'Life',title:'Mindful speech',description:'Speaking what is best, avoiding suspicion and protecting one another’s dignity.',titleAr:'حفظ اللسان',descriptionAr:'قول الأحسن واجتناب الظن وحفظ أعراض الناس.',references:['17:53','33:70','49:11','49:12']},
 {id:'remembrance',category:'Spirituality',title:'Remembrance and calm',description:'Finding steadiness of heart through remembrance of Allah.',titleAr:'الذكر والسكينة',descriptionAr:'ثبات القلب وسكونه بذكر الله.',references:['13:28','20:14','33:41','33:42']},
 {id:'repentance',category:'Spirituality',title:'Hope and repentance',description:'Never despairing of mercy and returning sincerely after error.',titleAr:'الرجاء والتوبة',descriptionAr:'عدم القنوط من الرحمة والرجوع بصدق بعد الخطأ.',references:['39:53','66:8','2:222']},
 {id:'gratitude',category:'Spirituality',title:'Gratitude',description:'Recognizing blessings and responding through grateful worship.',titleAr:'الشكر',descriptionAr:'إدراك النعم والاستجابة لها بالعبادة شكراً.',references:['14:7','16:18','31:12']},
 {id:'dua',category:'Spirituality',title:'Supplication and nearness',description:'Allah’s nearness and the invitation to call upon Him.',titleAr:'الدعاء والقرب',descriptionAr:'قرب الله من عبده ودعوته إياهم أن يسألوه فيستجيب.',references:['2:186','40:60','7:55']},
];


/* Persian and Turkish wording for the topics and the tajweed rules.
 *
 * These are read through a language code, never through an `rtl` flag: Persian,
 * Urdu and Arabic are all right-to-left, so a boolean could only ever answer
 * "Arabic or not" and handed Persian and Urdu the Arabic column. */
export const TOPIC_FA: Record<string, { title: string; description: string }> = {
  oneness: { title: 'یگانگی خداوند', description: 'آیاتی که یگانگیِ مطلق، بی‌نیازی و بی‌همتاییِ خداوند را اثبات می‌کند.' },
  trust: { title: 'توکل و اعتماد', description: 'تکیه بر خداوند در کنار تلاشِ آگاهانه و پایداری.' },
  signs: { title: 'نشانه‌ها در آفرینش', description: 'فرازهایی که به اندیشیدن در آفرینش، نظم و هدف فرا می‌خواند.' },
  resurrection: { title: 'رستاخیز و بازگشت', description: 'یادآوریِ حساب‌رسی، نوزاییِ آفرینش و بازگشتِ پایانی به سوی خداوند.' },
  parents: { title: 'والدین و خانواده', description: 'مهربانی، سپاسگزاری و رفتارِ نیکو در زندگیِ خانوادگی.' },
  justice: { title: 'عدالت و درستکاری', description: 'ایستادگی بر عدالت، حتی آن‌گاه که برای خودِ انسان دشوار است.' },
  patience: { title: 'صبر در دشواری', description: 'یاری جستن از صبر و نماز در روزگارِ سختی.' },
  speech: { title: 'پاسداریِ زبان', description: 'گفتنِ سخنِ نیکو، پرهیز از گمان و پاس داشتِ آبروی دیگران.' },
  remembrance: { title: 'ذکر و آرامش', description: 'دست یافتن به آرامشِ دل با یاد خداوند.' },
  repentance: { title: 'امید و توبه', description: 'هرگز نومید نشدن از رحمتِ الهی و بازگشتِ صادقانه پس از خطا.' },
  gratitude: { title: 'سپاسگزاری', description: 'شناختِ نعمت‌ها و پاسخ به آن‌ها با عبادتِ سپاس‌گزارانه.' },
  dua: { title: 'دعا و نزدیکی', description: 'نزدیکیِ خداوند به بنده و فراخوانِ او به خواندنِ خود.' },
};

export const TOPIC_TR: Record<string, { title: string; description: string }> = {
  oneness: { title: 'Allah’ın birliği', description: 'Allah’ın mutlak birliğini, hiçbir şeye muhtaç olmayışını ve benzersizliğini ortaya koyan ayetler.' },
  trust: { title: 'Tevvekkül ve güven', description: 'Allah’a dayanmakla birlikte sebeplere sarılmak ve sebat göstermek.' },
  signs: { title: 'Yaratılıştaki deliller', description: 'Yaratılış, düzen ve gaye üzerinde düşünmeye çağıran bölümler.' },
  resurrection: { title: 'Diriliş ve dönüş', description: 'Hesap, yaratılışın yenilenmesi ve sonunda Allah’a dönüşün hatırlatılması.' },
  parents: { title: 'Anne baba ve aile', description: 'Aile hayatında merhamet, şükür ve güzel geçim.' },
  justice: { title: 'Adalet ve doğruluk', description: 'Kişiye zor gelse de adalet için dimdik ayakta durmak.' },
  patience: { title: 'Zorlukta sabır', description: 'Sıkıntı zamanında sabır ve namazla yardım dilemek.' },
  speech: { title: 'Dili korumak', description: 'En güzel sözü söylemek, zandan sakınmak ve insanların onurunu korumak.' },
  remembrance: { title: 'Zikir ve sükûnet', description: 'Allah’ı anmakla kalbe dinginlik bulmak.' },
  repentance: { title: 'Ümit ve tövbe', description: 'Rahmetten ümit kesmemek ve hatadan sonra içtenlikle dönmek.' },
  gratitude: { title: 'Şükür', description: 'Nimetleri fark etmek ve şükrederek ibadetle karşılık vermek.' },
  dua: { title: 'Dua ve yakınlık', description: 'Allah’ın kuluna yakınlığı ve O’na dua etmeye çağırması.' },
};

export const TOPIC_CATEGORY_FA: Record<string, string> = { Faith: 'عقیده', Life: 'زندگی', Spirituality: 'معنویت' };
export const TOPIC_CATEGORY_TR: Record<string, string> = { Faith: 'İnanç', Life: 'Hayat', Spirituality: 'Maneviyat' };

/** Tajweed rules in Persian and Turkish, keyed by the same colour codes. */

/* Urdu, alongside Persian and Turkish. These existed in Arabic only, and the
   Arabic was reached through an `rtl` flag - which is true for Urdu too, so
   Urdu was handed Arabic it does not read. Repairing the flag exposed that
   there had never been any Urdu to fall back to. */
export const TOPIC_UR: Record<string, { title: string; description: string }> = {
  oneness: { title: 'اللہ کی وحدانیت', description: 'آیات جو اللہ کی مطلق وحدانیت، بے نیازی اور بے مثال ہونے کو ثابت کرتی ہیں۔' },
  trust: { title: 'توکل اور بھروسہ', description: 'اسباب اختیار کرتے اور ثبات قائم رکھتے ہوئے اللہ پر بھروسہ۔' },
  signs: { title: 'کائنات میں نشانیاں', description: 'تخلیق، نظام اور مقصد پر غور و فکر کی دعوت دینے والے مقامات۔' },
  resurrection: { title: 'قیامت اور لوٹنا', description: 'حساب، تخلیق کے نئے سرے سے ہونے اور آخر کار اللہ کی طرف لوٹنے کی یاد دہانی۔' },
  parents: { title: 'والدین اور خاندان', description: 'خاندانی زندگی میں رحم، شکر اور حسنِ معاشرت۔' },
  justice: { title: 'انصاف اور دیانت', description: 'انصاف کے لیے مضبوطی سے کھڑا ہونا، چاہے وہ ذاتی طور پر دشوار ہو۔' },
  patience: { title: 'مشکل میں صبر', description: 'سختی کے وقت صبر اور نماز سے مدد مانگنا۔' },
  speech: { title: 'زبان کی حفاظت', description: 'بہترین بات کہنا، بدگمانی سے بچنا اور ایک دوسرے کی عزت کی حفاظت کرنا۔' },
  remembrance: { title: 'ذکر اور سکون', description: 'اللہ کے ذکر سے دل کو سکون ملنا۔' },
  repentance: { title: 'امید اور توبہ', description: 'رحمت سے کبھی ناامید نہ ہونا اور خطا کے بعد خلوص سے لوٹنا۔' },
  gratitude: { title: 'شکر', description: 'نعمتوں کو پہچاننا اور شکر گزار عبادت سے اس کا جواب دینا۔' },
  dua: { title: 'دعا اور قرب', description: 'اللہ کا اپنے بندے سے قریب ہونا اور اس کا دعا کی دعوت دینا۔' },
};

export const TOPIC_CATEGORY_UR: Record<string, string> = { Faith: 'عقیدہ', Life: 'زندگی', Spirituality: 'روحانیت' };

export const TAJWEED_UR: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'غیر ملفوظی حروف', detail: 'ہمزۂ وصل، خاموش نشانات اور لامِ شمسیہ الگ سے ادا نہیں ہوتے۔' },
  m: { name: 'مدّ طبیعی', detail: 'دو حرکتوں کی مقدار کی عام کشش۔' },
  p: { name: 'مدّ جائز', detail: 'دو، چار یا چھ حرکتوں کی مقدار کی جائز کشش۔' },
  n: { name: 'مدّ لازم', detail: 'چھ حرکتوں کی مقدار کی لازمی کشش۔' },
  o: { name: 'مدّ واجب', detail: 'واجب کشش، عموماً چار یا پانچ حرکتیں۔' },
  q: { name: 'قلقلہ', detail: 'سکون کی حالت میں «قطب جد» کے حروف میں سے کسی پر ایک مضبوط گونج۔' },
  c: { name: 'اخفائے شفوی', detail: 'باء سے پہلے میم کی آواز کو چھپانا۔' },
  f: { name: 'اخفاء', detail: 'نونِ ساکن یا تنوین کو اس کے حروف سے پہلے چھپانا۔' },
  w: { name: 'ادغامِ شفوی', detail: 'میمِ ساکن کا بعد والی میم میں مل جانا۔' },
  i: { name: 'اقلاب', detail: 'باء سے پہلے نونِ ساکن یا تنوین کا پوشیدہ میم میں بدل جانا۔' },
  a: { name: 'ادغام با غُنّہ', detail: 'ناک کی گونج کے ساتھ ادغام۔' },
  u: { name: 'ادغام بلا غُنّہ', detail: 'ناک کی گونج کے بغیر ادغام۔' },
  g: { name: 'غُنّہ', detail: 'ناک کی وہ آواز جو دو حرکتیں روک کر ادا کی جائے۔' },
};

export const TAJWEED_FA: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'حروفِ ناخوانا', detail: 'همزهٔ وصل، نشانه‌های بی‌صدا و لامِ شمسی به‌تنهایی خوانده نمی‌شوند.' },
  m: { name: 'مدّ طبیعی', detail: 'کششِ معمول به اندازهٔ دو حرکت.' },
  p: { name: 'مدّ جایز', detail: 'کششی جایز به اندازهٔ دو، چهار یا شش حرکت.' },
  n: { name: 'مدّ لازم', detail: 'کششِ واجب به اندازهٔ شش حرکت.' },
  o: { name: 'مدّ واجب', detail: 'کششی واجب، معمولاً به اندازهٔ چهار یا پنج حرکت.' },
  q: { name: 'قلقله', detail: 'پژواکی کنترل‌شده بر یکی از حروفِ «قطب جد» هنگامِ سکون.' },
  c: { name: 'اخفای شفوی', detail: 'پوشاندنِ صدای میم در برابرِ حرفِ باء.' },
  f: { name: 'اخفاء', detail: 'پوشاندنِ نونِ ساکن یا تنوین در برابرِ حروفِ آن.' },
  w: { name: 'ادغامِ شفوی', detail: 'ادغامِ میمِ ساکن در میمِ پس از آن.' },
  i: { name: 'اقلاب', detail: 'دگرگونیِ نونِ ساکن یا تنوین به میمِ پوشیده در برابرِ حرفِ باء.' },
  a: { name: 'ادغام با غُنّه', detail: 'ادغام همراه با طنینِ بینی.' },
  u: { name: 'ادغام بی‌غُنّه', detail: 'ادغام بدون طنینِ بینی.' },
  g: { name: 'غُنّه', detail: 'صدایی از بینی که به اندازهٔ دو حرکت نگه داشته می‌شود.' },
};

export const TAJWEED_TR: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'Okunmayan harfler', detail: 'Vasıl hemzesi, sessiz işaretler ve şemsî lâm tek başına okunmaz.' },
  m: { name: 'Tabiî med', detail: 'İki harek miktarında normal uzatma.' },
  p: { name: 'Câiz med', detail: 'İki, dört veya altı harek miktarında caiz uzatma.' },
  n: { name: 'Lâzım med', detail: 'Altı harek miktarında gerekli uzatma.' },
  o: { name: 'Vâcip med', detail: 'Genellikle dört veya beş harek miktarında vacip uzatma.' },
  q: { name: 'Kalkale', detail: 'Sükûn halinde «kutbu cidin» harflerinden birinde kontrollü bir yankı.' },
  c: { name: 'Şefvî ihfâ', detail: 'Bâ harfi önünde mim sesinin gizlenmesi.' },
  f: { name: 'İhfâ', detail: 'Sakin nun veya tenvinin kendi harfleri önünde gizlenmesi.' },
  w: { name: 'Şefvî idğam', detail: 'Sakin mim’in ardından gelen mim’e katılması.' },
  i: { name: 'İklâb', detail: 'Bâ harfi önünde sakin nun veya tenvinin gizli bir mim’e dönüşmesi.' },
  a: { name: 'Gunneli idğam', detail: 'Geniz tınısı eşliğinde idğam.' },
  u: { name: 'Gunnesiz idğam', detail: 'Geniz tınısı olmadan idğam.' },
  g: { name: 'Gunne', detail: 'İki harek boyunca tutulan geniz sesi.' },
};

export const TOPIC_ID: Record<string, { title: string; description: string }> = {
  oneness: { title: 'Keesaan Allah', description: 'Ayat-ayat yang menegaskan keesaan, kemandirian, dan ketiadaan yang menyerupai Allah secara mutlak.' },
  trust: { title: 'Tawakal dan bersandar', description: 'Bersandar kepada Allah sembari tetap berikhtiar dan teguh.' },
  signs: { title: 'Tanda-tanda di alam', description: 'Ayat-ayat yang mengajak merenungkan penciptaan, keteraturan, dan tujuan.' },
  resurrection: { title: 'Kebangkitan dan kembalinya', description: 'Peringatan tentang pertanggungjawaban, pembaruan, dan kembalinya segala sesuatu kepada Allah.' },
  parents: { title: 'Orang tua dan keluarga', description: 'Kasih sayang, rasa syukur, dan pergaulan yang baik dalam kehidupan keluarga.' },
  justice: { title: 'Keadilan dan integritas', description: 'Berdiri teguh membela keadilan sekalipun terasa berat bagi diri sendiri.' },
  patience: { title: 'Sabar dalam kesulitan', description: 'Memohon pertolongan dengan sabar dan salat ketika keadaan sukar.' },
  speech: { title: 'Menjaga ucapan', description: 'Mengatakan yang terbaik, menjauhi prasangka, dan menjaga kehormatan sesama.' },
  remembrance: { title: 'Dzikir dan ketenangan', description: 'Menemukan keteguhan hati melalui dzikir kepada Allah.' },
  repentance: { title: 'Harapan dan taubat', description: 'Tidak pernah berputus asa dari rahmat-Nya dan kembali dengan sungguh-sungguh setelah salah.' },
  gratitude: { title: 'Syukur', description: 'Mengenali nikmat dan menyambutnya dengan ibadah yang penuh syukur.' },
  dua: { title: 'Doa dan kedekatan', description: 'Kedekatan Allah dan undangan-Nya untuk memohon kepada-Nya.' },
};

export const TOPIC_CATEGORY_ID: Record<string, string> = { Faith: 'Aqidah', Life: 'Kehidupan', Spirituality: 'Spiritualitas' };

/* Indonesian tajwid teaching uses the Arabic rule names as they are: a pupil is
   taught "qalqalah" and "ghunnah", not an Indonesian description of them, and
   the rules are named in the Indonesian conventions found in Indonesian
   tajwid material — Idgham Bighunnah, Idgham Mimi, Ikhfa' Haqiqi — rather
   than in the transliteration the English list happens to use. Idgham is
   spelled with "gh", as Indonesian writes it, where the English writes
   "Idgham" only for some and drops the "h" in others. */
export const TAJWEED_ID: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'Huruf yang tidak dibaca', detail: 'Hamzah wasal, tanda diam, dan lam syamsiah tidak dilafalkan secara berdiri sendiri.' },
  m: { name: 'Mad tabi’i', detail: 'Panjangan baku yang ditahan selama dua harakat.' },
  p: { name: 'Mad jaiz', detail: 'Panjangan yang boleh dilakukan dua, empat, atau enam harakat.' },
  n: { name: 'Mad lazim', detail: 'Panjangan yang diwajibkan memanjang.' },
  o: { name: 'Mad wajib', detail: 'Panjangan yang mesti dilakukan, umumnya empat sampai lima harakat.' },
  q: { name: 'Qalqalah', detail: 'Pantulan yang terkendali pada salah satu huruf qutbu jidin ketika berharakat sukun.' },
  c: { name: 'Ikhfa syafawi', detail: 'Bunyi mim yang disembunyikan sebelum huruf ba.' },
  f: { name: 'Ikhfa haqiqi', detail: 'Nun sukun atau tanwin yang disembunyikan sebelum huruf-hurufnya.' },
  w: { name: 'Idgham mimi', detail: 'Mim sukun yang melebur ke dalam mim berikutnya.' },
  i: { name: 'Iqlab', detail: 'Nun sukun atau tanwin berubah menjadi mim yang tersembunyi sebelum huruf ba.' },
  a: { name: 'Idgham bighunnah', detail: 'Peleburan yang disertai dengung.' },
  u: { name: 'Idgham bilaghunnah', detail: 'Peleburan tanpa dengung.' },
  g: { name: 'Ghunnah', detail: 'Bunyi dengung yang ditahan selama dua harakat.' },
};


/* Hindi wording for the topics and the tajweed rules.
 *
 * Reached through a language code, never through an `rtl` flag: Arabic, Urdu
 * and Persian are right-to-left while Hindi is left-to-right, so a boolean
 * could only ever answer "Arabic or not" and would hand Hindi the Arabic
 * column — a script the reader does not read.
 *
 * The rules keep their Arabic names — मद्द, क़लक़ला, ग़ुन्ना, इख़फ़ा, इद्ग़ाम,
 * इक़लाब — because that is what a Hindi-speaking pupil is taught and says. A
 * descriptive Hindi label would be a different thing from the rule, and the
 * reader would have to unlearn it at the first lesson. Qalqalah and Ghunnah
 * are entered exactly as the English writes them: they are the same word in
 * both, which is correct and not a missing translation. */
export const TOPIC_HI: Record<string, { title: string; description: string }> = {
  oneness: { title: 'अल्लाह की वहदानियत', description: 'वे आयतें जो अल्लाह की पूर्ण एकता, उसकी बे-नियाज़ी और उसके बे-मिसाल होने की गवाही देती हैं।' },
  trust: { title: 'तवक्कुल और भरोसा', description: 'असबाब अपनाते और स्थिर रहते हुए अल्लाह पर भरोसा।' },
  signs: { title: 'कायनात में निशानियाँ', description: 'ऐसे अंश जो रचना, उसके निज़ाम और उसके उद्देश्य पर विचार की दावत देते हैं।' },
  resurrection: { title: 'दूसरा जीवन और पलटना', description: 'हिसाब, नए सिरे से पैदा किए जाने और अंततः अल्लाह की ओर लौटने की याद दहानी।' },
  parents: { title: 'माता-पिता और परिवार', description: 'पारिवारिक जीवन में रहम, शुक्र और अच्छा बर्ताव।' },
  justice: { title: 'इन्साफ़ और दियानत', description: 'इन्साफ़ पर दृढ़ता से खड़े रहना, चाहे वह अपने आप पर भारी पड़े।' },
  patience: { title: 'तकलीफ़ में सब्र', description: 'मुसीबत के समय सब्र और नमाज़ से मदद माँगना।' },
  speech: { title: 'ज़बान की हिफ़ाज़त', description: 'बेहतर बात कहना, गुमान से बचना और एक-दूसरे की इज़्ज़त की रक्षा करना।' },
  remembrance: { title: 'ज़िक्र और सुकून', description: 'अल्लाह के ज़िक्र से दिल को थिरकन मिलना।' },
  repentance: { title: 'उम्मीद और तौबा', description: 'रहमत से नाउम्मीद न होना और ख़ता के बाद ईमानदारी से लौटना।' },
  gratitude: { title: 'शुक्र', description: 'नेमतों को पहचानना और उनका जवाब शुक्र की इबादत से देना।' },
  dua: { title: 'दुआ और क़ुर्ब', description: 'अल्लाह का निकट होना और उसकी दावत कि उससे माँगा जाए।' },
};

export const TOPIC_CATEGORY_HI: Record<string, string> = { Faith: 'ईमान', Life: 'ज़िंदगी', Spirituality: 'रूहानियत' };

export const TAJWEED_HI: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'ख़ामोश हुरूफ़', detail: 'हम्ज़ा-ए-वस्ल, ख़ामोश निशान और लाम-ए-शम्सिया अपने आप अदा नहीं होते।' },
  m: { name: 'मद्द-ए-तबीई', detail: 'सामान्य खिंचाव जो दो हरकत के बराबर रोका जाता है।' },
  p: { name: 'मद्द-ए-जायज़', detail: 'जायज़ खिंचाव: दो, चार या छह हरकत।' },
  n: { name: 'मद्द-ए-लाज़िम', detail: 'वह खिंचाव जिसे बढ़ाना आवश्यक है।' },
  o: { name: 'मद्द-ए-वाजिब', detail: 'अनिवार्य खिंचाव, आम तौर पर चार से पाँच हरकत।' },
  q: { name: 'क़लक़ला', detail: '«ق ط ب ج د» में से किसी अक्षर पर साकिन की हालत में नियंत्रित गूँज।' },
  c: { name: 'इख़फ़ा-ए-शफ़वी', detail: 'बा से पहले मीम की आवाज़ को छिपाना।' },
  f: { name: 'इख़फ़ा', detail: 'नून-ए-साकिन या तनवीन को अपने हुरूफ़ से पहले छिपाना।' },
  w: { name: 'इद्ग़ाम-ए-शफ़वी', detail: 'साकिन मीम का बाद वाली मीम में मिल जाना।' },
  i: { name: 'इक़लाब', detail: 'बा से पहले नून-ए-साकिन या तनवीन का छिपी हुई मीम की ओर बदल जाना।' },
  a: { name: 'इद्ग़ाम मअ ग़ुन्ना', detail: 'नाक की गूँज के साथ मिलाना।' },
  u: { name: 'इद्ग़ाम बिला ग़ुन्ना', detail: 'नाक की गूँज के बिना मिलाना।' },
  g: { name: 'ग़ुन्ना', detail: 'नाक की आवाज़ जो दो हरकत के बराबर रोकी जाती है।' },
};

/* Malayalam. The tajweed terms are written as the Kerala madrasa writes them —
   ഖൽഖല, ഗുന്ന, ഇഖ്ഫാഅ്, ഇദ്ഗാം — because that is the form a Malayali reader
   who has been taught to recite already knows them by, and not the Latin
   transliteration the English list happens to carry. */
export const TOPIC_ML: Record<string, { title: string; description: string }> = {
  oneness: { title: 'അല്ലാഹുവിന്റെ ഏകത്വം', description: 'അല്ലാഹുവിന്റെ പരിപൂർണ ഏകത്വം, അവന്റെ സ്വയംപര്യാപ്തത, അവനെ ഒന്നിനോടും ഉപമിക്കാനാവാത്തത് എന്നിവയ്ക്ക് സാക്ഷ്യം വഹിക്കുന്ന ആയത്തുകൾ.' },
  trust: { title: 'തവക്കുൽ', description: 'കാരണങ്ങൾ സ്വീകരിച്ചുകൊണ്ടും സ്ഥിരതയോടെയും അല്ലാഹുവിൽ ഭരമേൽപിക്കുക.' },
  signs: { title: 'പ്രപഞ്ചത്തിലെ ദൃഷ്ടാന്തങ്ങൾ', description: 'സൃഷ്ടി, അതിന്റെ ക്രമം, അതിന്റെ ലക്ഷ്യം എന്നിവയെക്കുറിച്ച് ചിന്തിക്കാൻ ക്ഷണിക്കുന്ന ഭാഗങ്ങൾ.' },
  resurrection: { title: 'പുനരുത്ഥാനവും മടക്കവും', description: 'വിചാരണ, പുനഃസൃഷ്ടി, ഒടുവിൽ അല്ലാഹുവിലേക്കുള്ള മടക്കം എന്നിവയുടെ ഓർമ്മപ്പെടുത്തൽ.' },
  parents: { title: 'മാതാപിതാക്കളും കുടുംബവും', description: 'കുടുംബജീവിതത്തിൽ കരുണ, നന്ദി, നല്ല പെരുമാറ്റം.' },
  justice: { title: 'നീതിയും സത്യസന്ധതയും', description: 'സ്വന്തം നന്മയ്ക്കെതിരായാലും നീതിയിൽ ഉറച്ചുനിൽക്കുക.' },
  patience: { title: 'വിഷമതകളിലെ ക്ഷമ', description: 'പ്രയാസസമയത്ത് ക്ഷമയും നിസ്കാരവും കൊണ്ട് സഹായം തേടുക.' },
  speech: { title: 'നാവിന്റെ സംരക്ഷണം', description: 'നല്ലതു പറയുക, ഊഹക്കച്ചവടം ഒഴിവാക്കുക, അന്യോന്യമുള്ള അന്തസ്സ് കാക്കുക.' },
  remembrance: { title: 'ദിക്‌റും സമാധാനവും', description: 'അല്ലാഹുവിന്റെ ദിക്‌റിലൂടെ ഹൃദയത്തിന് ശാന്തി ലഭിക്കുന്നു.' },
  repentance: { title: 'പ്രതീക്ഷയും തൗബയും', description: 'കാരുണ്യത്തിൽ നിരാശപ്പെടാതിരിക്കുകയും തെറ്റിനുശേഷം നിഷ്കളങ്കമായി മടങ്ങുകയും ചെയ്യുക.' },
  gratitude: { title: 'നന്ദി', description: 'അനുഗ്രഹങ്ങളെ തിരിച്ചറിയുക, അവയ്ക്ക് നന്ദിയുടെ ആരാധനയോടെ മറുപടി നൽകുക.' },
  dua: { title: 'ദുആയും സാമീപ്യവും', description: 'അല്ലാഹുവിന്റെ സാമീപ്യവും അവനോട് ചോദിക്കാനുള്ള അവന്റെ ക്ഷണവും.' },
};
export const TOPIC_CATEGORY_ML: Record<string, string> = { Faith: 'അഖീദ', Life: 'ജീവിതം', Spirituality: 'ആത്മീയത' };
export const TAJWEED_ML: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'നിശ്ശബ്ദ അക്ഷരങ്ങൾ', detail: 'ഹംസത്തുൽ വസ്ല്, നിശ്ശബ്ദ ചിഹ്നങ്ങൾ, ശംസിയ്യ ലാം എന്നിവ സ്വതന്ത്രമായി ഉച്ചരിക്കപ്പെടുന്നില്ല.' },
  m: { name: 'മദ്ദ് തബീഈ', detail: 'രണ്ടു ഹറക്കത്ത് നീളത്തിൽ നിർത്തുന്ന സാധാരണ ദീർഘീകരണം.' },
  p: { name: 'മദ്ദ് ജാഇസ്', detail: 'അനുവദനീയമായ ദീർഘീകരണം: രണ്ട്, നാല് അല്ലെങ്കിൽ ആറ് ഹറക്കത്ത്.' },
  n: { name: 'മദ്ദ് ലാസിം', detail: 'നീട്ടൽ നിർബന്ധമായിട്ടുള്ള ദീർഘീകരണം.' },
  o: { name: 'മദ്ദ് വാജിബ്', detail: 'നിർബന്ധമായ ദീർഘീകരണം, സാധാരണയായി നാലു മുതൽ അഞ്ചു ഹറക്കത്ത്.' },
  q: { name: 'ഖൽഖല', detail: '«ق ط ب ج د» എന്ന അക്ഷരങ്ങളിൽ ഏതെങ്കിലുമൊന്നിന് സുകൂൻ വരുമ്പോഴുള്ള നിയന്ത്രിതമായ പ്രതിധ്വനി.' },
  c: { name: 'ഇഖ്ഫാഅ് ശഫവീ', detail: 'ബാഇന് മുമ്പ് മീമിന്റെ ശബ്ദം മറയ്ക്കുക.' },
  f: { name: 'ഇഖ്ഫാഅ്', detail: 'നൂനു സാകിനയെയോ തൻവീനെയോ അതിന്റെ അക്ഷരങ്ങൾക്ക് മുമ്പ് മറയ്ക്കുക.' },
  w: { name: 'ഇദ്ഗാം ശഫവീ', detail: 'സാകിനായ മീം പിന്നാലെ വരുന്ന മീമിൽ ചേരുന്നു.' },
  i: { name: 'ഇഖ്‌ലാബ്', detail: 'ബാഇന് മുമ്പ് നൂനു സാകിനയോ തൻവീനോ മറഞ്ഞ മീമായി മാറുന്നു.' },
  a: { name: 'ഇദ്ഗാം ബിഗുന്ന', detail: 'മൂക്കിലെ മൂളലോടെയുള്ള ചേർക്കൽ.' },
  u: { name: 'ഇദ്ഗാം ബിലാ ഗുന്ന', detail: 'മൂക്കിലെ മൂളൽ ഇല്ലാതെയുള്ള ചേർക്കൽ.' },
  g: { name: 'ഗുന്ന', detail: 'രണ്ടു ഹറക്കത്ത് നീളത്തിൽ നിർത്തുന്ന മൂക്കിലെ ശബ്ദം.' },
};

export type VocabularyWord={id:string;arabic:string;transliteration:string;meaning:string;root?:string};
// Ordered from high-frequency Quranic lemmas and verbs documented by the Quranic Arabic Corpus.
export const QURAN_VOCABULARY:VocabularyWord[]=[
 {id:'allah',arabic:'ٱللَّه',transliteration:'Allāh',meaning:'Allah'},
 {id:'rabb',arabic:'رَبّ',transliteration:'Rabb',meaning:'Lord, Sustainer',root:'ر ب ب'},
 {id:'qala',arabic:'قَالَ',transliteration:'Qāla',meaning:'He said',root:'ق و ل'},
 {id:'kana',arabic:'كَانَ',transliteration:'Kāna',meaning:'He was / to be',root:'ك و ن'},
 {id:'amana',arabic:'آمَنَ',transliteration:'Āmana',meaning:'He believed',root:'أ م ن'},
 {id:'alima',arabic:'عَلِمَ',transliteration:'ʿAlima',meaning:'He knew',root:'ع ل م'},
 {id:'jaala',arabic:'جَعَلَ',transliteration:'Jaʿala',meaning:'He made or placed',root:'ج ع ل'},
 {id:'amila',arabic:'عَمِلَ',transliteration:'ʿAmila',meaning:'He did or worked',root:'ع م ل'},
 {id:'jaa',arabic:'جَاءَ',transliteration:'Jāʾa',meaning:'He came',root:'ج ي ء'},
 {id:'kitab',arabic:'كِتَاب',transliteration:'Kitāb',meaning:'Book or scripture',root:'ك ت ب'},
 {id:'yawm',arabic:'يَوْم',transliteration:'Yawm',meaning:'Day',root:'ي و م'},
 {id:'nas',arabic:'نَاس',transliteration:'Nās',meaning:'People or humankind',root:'أ ن س'},
 {id:'ard',arabic:'أَرْض',transliteration:'Arḍ',meaning:'Earth or land',root:'أ ر ض'},
 {id:'sama',arabic:'سَمَاء',transliteration:'Samāʾ',meaning:'Sky or heaven',root:'س م و'},
 {id:'khayr',arabic:'خَيْر',transliteration:'Khayr',meaning:'Good or better',root:'خ ي ر'},
 {id:'nafs',arabic:'نَفْس',transliteration:'Nafs',meaning:'Self or soul',root:'ن ف س'},
 {id:'haqq',arabic:'حَقّ',transliteration:'Ḥaqq',meaning:'Truth or right',root:'ح ق ق'},
 {id:'sabr',arabic:'صَبْر',transliteration:'Ṣabr',meaning:'Patient perseverance',root:'ص ب ر'},
 {id:'rahmah',arabic:'رَحْمَة',transliteration:'Raḥmah',meaning:'Mercy',root:'ر ح م'},
 {id:'huda',arabic:'هُدًى',transliteration:'Hudā',meaning:'Guidance',root:'ه د ي'},
];

export const TAJWEED_RULES:Record<string,any>[]=[
 {codes:['h','s','l'],color:'#777777',name:'Silent letters',detail:'Hamzat al-waṣl, silent marks and solar lām are not pronounced independently.',nameAr:'الحروف غير المنطوقة',detailAr:'همزة الوصل والعلامات الصامتة ولام الشمسية لا تنطق وحدها.'},
 {codes:['m'],color:'#537FFF',name:'Madd normal',detail:'Standard prolongation held for two vowel counts.',nameAr:'المد الطبيعي',detailAr:'مد مقداره حركتان.'},
 {codes:['p'],color:'#4050FF',name:'Madd permissible',detail:'A permissible prolongation of two, four or six counts.',nameAr:'المد الجائز',detailAr:'مد جائز بمقدار حركتين أو أربع أو ست.'},
 {codes:['n'],color:'#000EBC',name:'Madd necessary',detail:'A required extended vowel.',nameAr:'المد اللازم',detailAr:'مد لازم مقداره ست حركات.'},
 {codes:['o'],color:'#2144C1',name:'Madd obligatory',detail:'An obligatory prolongation, commonly four to five counts.',nameAr:'المد الواجب',detailAr:'مد واجب مقداره أربع أو خمس حركات غالباً.'},
 {codes:['q'],color:'#DD0008',name:'Qalqalah',detail:'A controlled echo on one of the letters قطب جد when carrying sukūn.',nameAr:'القلقلة',detailAr:'صوت رجّة محكوم على أحد حروف «قطب جد» عند السكون.'},
 {codes:['c'],color:'#D500B7',name:'Ikhfāʾ shafawī',detail:'A concealed mīm sound before bāʾ.',nameAr:'الإخفاء الشفوي',detailAr:'إخفاء صوت الميم عند الباء.'},
 {codes:['f'],color:'#9400A8',name:'Ikhfāʾ',detail:'A concealed nūn sākin or tanwīn before its letters.',nameAr:'الإخفاء',detailAr:'إخفاء النون الساكنة أو التنوين عند حروفه.'},
 {codes:['w'],color:'#58B800',name:'Idghām shafawī',detail:'Assimilation of mīm sākin into a following mīm.',nameAr:'الإدغام الشفوي',detailAr:'إدغام الميم الساكنة في ميم بعدها.'},
 {codes:['i'],color:'#26BFFD',name:'Iqlāb',detail:'Nūn sākin or tanwīn changes toward a concealed mīm before bāʾ.',nameAr:'الإقلاب',detailAr:'قلب النون الساكنة أو التنوين ميماً مخفاة عند الباء.'},
 {codes:['a'],color:'#169777',name:'Idghām with ghunnah',detail:'Assimilation accompanied by nasal resonance.',nameAr:'الإدغام بغنة',detailAr:'إدغام مصحوب بغنة.'},
 {codes:['u'],color:'#169200',name:'Idghām without ghunnah',detail:'Assimilation without nasal resonance.',nameAr:'الإدغام بلا غنة',detailAr:'إدغام من غير غنة.'},
 {codes:['g'],color:'#FF7E1E',name:'Ghunnah',detail:'A nasal sound held for two counts.',nameAr:'الغنة',detailAr:'صوت أنفي مقداره حركتان.'},
];

export const TOPIC_CATEGORY_AR:Record<string,string>={Faith:'العقيدة',Life:'الحياة',Spirituality:'الروحانيات'};

/* The code of the interface, normalised. `true` is the old boolean form and
   still means Arabic, so any caller not yet converted keeps working. */
const langCode=(lang?:string|boolean):string=>typeof lang==='string'?lang:(lang===true?'ar':'en');

export const TOPIC_RU: Record<string, { title: string; description: string }> = {
  oneness: { title: 'Единобожие', description: 'Аяты, утверждающие абсолютное единство, независимость и несравнимость Аллаха.' },
  trust: { title: 'Упование и доверие', description: 'Полагаться на Аллаха, вместе с тем держась за причины и проявляя стойкость.' },
  signs: { title: 'Знамения в творении', description: 'Отрывки, зовущие к размышлению о творении, порядке и цели.' },
  resurrection: { title: 'Воскрешение и возвращение', description: 'Напоминание об отчёте, обновлении творения и последнем возвращении к Аллаху.' },
  parents: { title: 'Родители и семья', description: 'Милосердие, благодарность и доброе обхождение в семейной жизни.' },
  justice: { title: 'Справедливость и правдивость', description: 'Твёрдо стоять за справедливость, даже когда это трудно лично вам.' },
  patience: { title: 'Терпение в трудности', description: 'Терпение в тяготе и обращение за помощью через намаз.' },
  speech: { title: 'Хранение языка', description: 'Говорить лучшее, избегать подозрений и защищать достоинство людей.' },
  remembrance: { title: 'Зикр и покой', description: 'Обретать покой сердцем через поминание Аллаха.' },
  repentance: { title: 'Надежда и покаяние', description: 'Не терять надежды на милость и искренне возвращаться после ошибки.' },
  gratitude: { title: 'Благодарность', description: 'Замечать блага и отвечать на них благодарностью и поклонением.' },
  dua: { title: 'Дуа и близость', description: 'Близость Аллаха к рабу и Его призыв обращаться к Нему с мольбой.' },
};
export const TOPIC_FR: Record<string, { title: string; description: string }> = {
  oneness: { title: 'L’unicité', description: 'Versets affirmant l’unicité absolue, l’indépendance et l’incomparabilité d’Allah.' },
  trust: { title: 'La confiance et le recours à Allah', description: 'S’en remettre à Allah tout en agissant avec discernement et constance.' },
  signs: { title: 'Les signes dans la création', description: 'Passages invitant à réfléchir sur la création, l’ordre et le but.' },
  resurrection: { title: 'La résurrection et le retour', description: 'Rappels de la reddition des comptes, du renouveau et du retour final vers Allah.' },
  parents: { title: 'Les parents et la famille', description: 'Miséricorde, gratitude et excellente conduite au sein de la famille.' },
  justice: { title: 'La justice et la droiture', description: 'Se tenir fermement pour la justice même quand c’est personnellement difficile.' },
  patience: { title: 'La patience dans l’épreuve', description: 'Chercher secours par la patience et la prière dans l’épreuve.' },
  speech: { title: 'Garder sa langue', description: 'Dire ce qui est meilleur, éviter le soupçon et protéger la dignité d’autrui.' },
  remembrance: { title: 'Le dhikr et la sérénité', description: 'Trouver la sérénité du cœur par le rappel d’Allah.' },
  repentance: { title: 'L’espoir et le repentir', description: 'Ne jamais désespérer de la miséricorde et revenir sincèrement après la faute.' },
  gratitude: { title: 'La gratitude', description: 'Reconnaître les bienfaits et y répondre par une adoration reconnaissante.' },
  dua: { title: 'L’invocation et la proximité', description: 'La proximité d’Allah et l’invitation à L’invoquer.' },
};
export const TOPIC_CATEGORY_FR: Record<string, string> = { Faith: 'Foi', Life: 'Vie', Spirituality: 'Spiritualité' };

export const TAJWEED_FR: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'Lettres non prononcées', detail: 'La hamzat al-wasl, les marques muettes et le lām solaire ne se prononcent pas isolément.' },
  m: { name: 'Madd naturel', detail: 'Allongement standard tenu pendant deux voyelles.' },
  p: { name: 'Madd permis', detail: 'Un allongement permis de deux, quatre ou six temps.' },
  n: { name: 'Madd nécessaire', detail: 'Un allongement requis, tenu le temps qu’il faut.' },
  o: { name: 'Madd obligatoire', detail: 'Un allongement obligatoire, généralement de quatre à cinq temps.' },
  q: { name: 'Qalqala', detail: 'Un écho maîtrisé sur l’une des lettres قطب جد lorsqu’elle porte le sukūn.' },
  c: { name: 'Ikhfā shafawī', detail: 'Un son mīm dissimulé devant bāʾ.' },
  f: { name: 'Ikhfā', detail: 'Un nūn sākin ou un tanwīn dissimulé devant ses lettres.' },
  w: { name: 'Idghām shafawī', detail: 'Assimilation du mīm sākin dans un mīm suivant.' },
  i: { name: 'Iqlāb', detail: 'Le nūn sākin ou le tanwīn se change en mīm dissimulé devant bāʾ.' },
  a: { name: 'Idghām avec ghunna', detail: 'Assimilation accompagnée d’une résonance nasale.' },
  u: { name: 'Idghām sans ghunna', detail: 'Assimilation sans résonance nasale.' },
  g: { name: 'Ghunna', detail: 'Un son nasal tenu pendant deux temps.' },
};

export const TOPIC_CATEGORY_RU: Record<string, string> = { Faith: 'Вера', Life: 'Жизнь', Spirituality: 'Духовность' };

export const TOPIC_BN: Record<string, { title: string; description: string }> = {
  oneness: { title: 'আল্লাহর একত্ব', description: 'আল্লাহর পরম একত্ব, অমুখাপেক্ষিতা ও অতুলনীয়তা নিশ্চিত করা আয়াতসমূহ।' },
  trust: { title: 'ভরসা ও নির্ভরতা', description: 'সচেতন আমল ও অবিচলতার সাথে আল্লাহর ওপর ভরসা।' },
  signs: { title: 'সৃষ্টিতে নিদর্শন', description: 'সৃষ্টি, শৃঙ্খলা ও উদ্দেশ্য নিয়ে চিন্তার আহ্বান জানানো অংশ।' },
  resurrection: { title: 'পুনরুত্থান ও প্রত্যাবর্তন', description: 'হিসাব, নবায়ন ও আল্লাহর দিকে শেষ প্রত্যাবর্তনের অনুস্মারক।' },
  parents: { title: 'পিতামাতা ও পরিবার', description: 'পারিবারিক জীবনে দয়া, কৃতজ্ঞতা ও উত্তম আচরণ।' },
  justice: { title: 'ন্যায়বিচার ও সততা', description: 'ব্যক্তিগতভাবে কঠিন হলেও ন্যায়ের পক্ষে দৃঢ়ভাবে দাঁড়ানো।' },
  patience: { title: 'কষ্টে ধৈর্য', description: 'কষ্টের সময় ধৈর্য ও নামাজের মাধ্যমে সাহায্য চাওয়া।' },
  speech: { title: 'সচেতন কথা', description: 'যা উত্তম তা বলা, সন্দেহ এড়ানো ও একে অপরের মর্যাদা রক্ষা করা।' },
  remembrance: { title: 'জিকির ও প্রশান্তি', description: 'আল্লাহর স্মরণের মাধ্যমে অন্তরের স্থিরতা খোঁজা।' },
  repentance: { title: 'আশা ও তাওবা', description: 'রহমত থেকে কখনো নিরাশ না হয়ে এবং ভুলের পর আন্তরিকভাবে ফিরে আসা।' },
  gratitude: { title: 'কৃতজ্ঞতা', description: 'নেয়ামতকে চেনা ও কৃতজ্ঞ ইবাদাতের মাধ্যমে সাড়া দেওয়া।' },
  dua: { title: 'দোয়া ও নৈকট্য', description: 'আল্লাহর নৈকট্য ও তাঁকে ডাকার আহ্বান।' },
};
export const TOPIC_CATEGORY_BN: Record<string, string> = { Faith: 'ঈমান', Life: 'জীবন', Spirituality: 'আধ্যাত্মিকতা' };
export const TAJWEED_BN: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'নীরব অক্ষর', detail: 'হামজাতুল ওয়াসল, নীরব চিহ্ন ও শামসী লাম স্বাধীনভাবে উচ্চারিত হয় না।' },
  m: { name: 'স্বাভাবিক মাদ', detail: 'দুই স্বর গণনা ধরে রাখা আদর্শ দীর্ঘায়ন।' },
  p: { name: 'মাদ জায়েজ', detail: 'দুই, চার বা ছয় গণনার অনুমোদিত দীর্ঘায়ন।' },
  n: { name: 'মাদ লাজিম', detail: 'একটি আবশ্যক দীর্ঘায়ন, যতটা দরকার ততক্ষণ ধরে রাখা।' },
  o: { name: 'মাদ ওয়াজিব', detail: 'একটি আবশ্যক দীর্ঘায়ন, সাধারণত চার থেকে পাঁচ গণনা।' },
  q: { name: 'ক্বলক্বলা', detail: 'সুকুন থাকা অবস্থায় قطب جد অক্ষরের একটিতে একটি নিয়ন্ত্রিত প্রতিধ্বনি।' },
  c: { name: 'ইখফা শফয়ী', detail: 'বা-এর আগে একটি গোপন মীমের ধ্বনি।' },
  f: { name: 'ইখফা', detail: 'তার অক্ষরের আগে একটি গোপন নূন সাকিন বা তানবিন।' },
  w: { name: 'ইদগাম শফয়ী', detail: 'পরবর্তী মীমে মীম সাকিনের একীভবন।' },
  i: { name: 'ইক্বলাব', detail: 'বা-এর আগে নূন সাকিন বা তানবিন গোপন মীমের দিকে বদলে যায়।' },
  a: { name: 'গুন্নাসহ ইদগাম', detail: 'অনুনাসিকতাসহ একীভবন।' },
  u: { name: 'গুন্নাবিহীন ইদগাম', detail: 'অনুনাসিকতা ছাড়া একীভবন।' },
  g: { name: 'গুন্না', detail: 'দুই গণনা ধরে রাখা অনুনাসিক ধ্বনি।' },
};

export const TOPIC_MS: Record<string, { title: string; description: string }> = {
  oneness: { title: 'Keesaan Allah', description: 'Ayat-ayat yang menegaskan keesaan Allah yang mutlak, keberdikarian-Nya dan tiada yang menyamai-Nya.' },
  trust: { title: 'Tawakal dan berserah', description: 'Berserah kepada Allah bersama tindakan yang sedar dan keteguhan.' },
  signs: { title: 'Tanda-tanda pada ciptaan', description: 'Petikan yang menjemput renungan tentang ciptaan, ketertiban dan tujuan.' },
  resurrection: { title: 'Kebangkitan dan kembalian', description: 'Peringatan tentang pertanggungjawaban, pembaharuan, dan kembalian akhir kepada Allah.' },
  parents: { title: 'Ibu bapa dan keluarga', description: 'Kasih sayang, kesyukuran dan akhlak yang baik dalam kehidupan keluarga.' },
  justice: { title: 'Keadilan dan integriti', description: 'Berdiri teguh menegakkan keadilan walau pun terasa berat bagi diri sendiri.' },
  patience: { title: 'Kesabaran dalam kesusahan', description: 'Memohon pertolongan melalui kesabaran dan solat ketika susah.' },
  speech: { title: 'Pertuturan yang berhati-hati', description: 'Mengucapkan apa yang terbaik, mengelak prasangka dan menjaga maruah antara satu sama lain.' },
  remembrance: { title: 'Zikir dan ketenangan', description: 'Menemui keteguhan hati melalui zikir kepada Allah.' },
  repentance: { title: 'Harapan dan taubat', description: 'Tidak pernah berputus asa daripada rahmat dan kembali dengan ikhlas selepas tersilap.' },
  gratitude: { title: 'Kesyukuran', description: 'Mengenali nikmat dan membalasnya dengan ibadat yang penuh kesyukuran.' },
  dua: { title: 'Doa dan kedekatan', description: 'Kedekatan Allah dan jemputan untuk berdoa kepada-Nya.' },
};
export const TOPIC_CATEGORY_MS: Record<string, string> = { Faith: 'Akidah', Life: 'Kehidupan', Spirituality: 'Kerohanian' };
export const TAJWEED_MS: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'Huruf yang tidak dibaca', detail: 'Hamzah wasal, tanda senyap dan lam syamsiah tidak disebut secara berasingan.' },
  m: { name: 'Madd tabii', detail: 'Pemanjangan biasa yang ditahan selama dua kiraan vokal.' },
  p: { name: 'Madd jaiz', detail: 'Pemanjangan yang diharuskan sebanyak dua, empat atau enam kiraan.' },
  n: { name: 'Madd lazim', detail: 'Pemanjangan yang diwajibkan, ditahan selama tempoh yang diperlukan.' },
  o: { name: 'Madd wajib', detail: 'Pemanjangan yang diwajibkan, biasanya empat hingga lima kiraan.' },
  q: { name: 'Qalqalah', detail: 'Gema yang terkawal pada salah satu huruf قطب جد apabila ia bersukun.' },
  c: { name: 'Ikhfa syafawi', detail: 'Bunyi mim yang disembunyikan sebelum ba.' },
  f: { name: 'Ikhfa', detail: 'Nun sakinah atau tanwin yang disembunyikan sebelum huruf-hurufnya.' },
  w: { name: 'Idgham syafawi', detail: 'Idgham mim sakinah ke dalam mim yang berikutnya.' },
  i: { name: 'Iqlab', detail: 'Nun sakinah atau tanwin berubah kepada mim yang disembunyikan sebelum ba.' },
  a: { name: 'Idgham dengan ghunnah', detail: 'Idgham yang disertai dengungan sengau.' },
  u: { name: 'Idgham tanpa ghunnah', detail: 'Idgham tanpa dengungan sengau.' },
  g: { name: 'Ghunnah', detail: 'Bunyi sengau yang ditahan selama dua kiraan.' },
};

export const TOPIC_TA: Record<string, { title: string; description: string }> = {
  oneness: { title: 'அல்லாஹ்வின் ஏகத்துவம்', description: 'அல்லாஹ்வின் முழுமையான ஏகத்துவம், தன்னிறைவ் மற்றும் ஒப்பற்ற தன்மையை உறுதிப்படுத்தும் வசனங்கள்.' },
  trust: { title: 'நம்பிக்கையும் சார்ந்திருத்தலும்', description: 'அல்லாஹ்வின் மீது சார்ந்திருத்தலும், விழிப்புணர்வுள்ள செயலும் விடாமுயற்றியும்.' },
  signs: { title: 'படைப்பில் அறிகுறிகள்', description: 'படைப்பு, ஒழுங்கு மற்றும் நோக்கம் பற்றிச் சிந்திக்க அழைக்கும் பகுதிகள்.' },
  resurrection: { title: 'உயிர்த்தெழுதலும் மீளுதலும்', description: 'பொறுப்புணர்வுணர்வு, புதுப்பித்தல் மற்றும் அல்லாஹ்விடம் இறுதி மீளுதல் ஆகியவற்றின் நினைவூட்டல்கள்.' },
  parents: { title: 'பெற்றோரும் குடும்பமும்', description: 'குடும்ப வாழ்வில் கருணை, நன்றி மற்றும் சிறந்த நடத்தை.' },
  justice: { title: 'நீதியும் நேர்மையும்', description: 'தனிப்பட்ட முறையில் கடினமாக இருக்கும்போதும் நீதிக்காக உறுதியாக நிற்ற்தல்.' },
  patience: { title: 'துன்பத்தில் பொறுமை', description: 'துன்பத்தில் பொறுமை மற்றும் தொழுகை மூலம் உதவி நாடுதல்.' },
  speech: { title: 'விழிப்புணர்வுள்ள பேச்சு', description: 'நல்லதைப் பேசுதல், ஐயப்படுவதை தவிர்த்தல் மற்றும் ஒருவர் மற்றவரின் மாண்பைப் பாதுகாத்தல்.' },
  remembrance: { title: 'திக்ரும் அமைதியும்', description: 'அல்லாஹ்வின் நினைவால் உள்ளத்தின் நிலைத்தன்மையைக் காணுதல்.' },
  repentance: { title: 'நம்பிக்கையும் தவ்பாவும்', description: 'கருணையில் ஒருப்பொழுதும் நம்பிக்கையிழந்து தவறுக்குப் பின் உளமாரத் திரும்புதல்.' },
  gratitude: { title: 'நன்றி', description: 'அருட்கொடைகளை உணர்ந்து நன்றியுள்ள வழிபாட்டால் பதிலளித்தல்.' },
  dua: { title: 'துஆவும் நெருக்கமும்', description: 'அல்லாஹ்வின் நெருக்கமும் அவனை அழைக்கும் அழைப்பு.' },
};
export const TOPIC_CATEGORY_TA: Record<string, string> = { Faith: 'ஈமான்', Life: 'வாழ்வு', Spirituality: 'ஆன்மீகம்' };
export const TAJWEED_TA: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'ஒலிக்காத எழுத்துக்கள்', detail: 'ஹம்ஸத்துல் வஸ்ல், மெய்யற்ற குறிகள் மற்றும் சூரிய லாம் தனித்து உச்சரிக்கப்படுவதில்லை.' },
  m: { name: 'தபீஈ மத்', detail: 'இரண்டு உயிர் அளவுகளுக்கு நிலையான நீட்டிப்பு.' },
  p: { name: 'ஜாயிஸ் மத்', detail: 'இரண்டு, நான்கு அல்லது ஆறு அளவுகள் வரை அநுமதிக்கப்பட்ட நீட்டிப்பு.' },
  n: { name: 'லாஸிம் மத்', detail: 'தேவைப்படும் நீடிய உயிர்.' },
  o: { name: 'வாஜிப் மத்', detail: 'கட்டாய நீட்டிப்பு, பொதுவாக நான்கு முதல் ஐந்து அளவுகள்.' },
  q: { name: 'கல்கலா', detail: 'சுகூன் தாங்கும்போது ‫قطب جد‬ எழுத்துக்கள்களில் ஒன்றில் கட்டுப்படுத்த எதிரொலி.' },
  c: { name: 'இக்ஃபா ஷஃபவீ', detail: 'பாவிற்கு முன் மறைக்கப்பட்ட மீம் ஒலி.' },
  f: { name: 'இக்ஃபா', detail: 'அதன் எழுத்துக்களுக்கு முன் மறைக்கப்பட்ட சாகின் நூன் அல்லது தன்வீன்.' },
  w: { name: 'இத்காம் ஷஃபவீ', detail: 'சாகின் மீம் அடுத்து வரும் மீமில் இணைதல்.' },
  i: { name: 'இக்லாப்', detail: 'பாவிற்கு சாகின் நூன் அல்லது தன்வீன் மறைந்த மீமாக மாறும்.' },
  a: { name: 'குன்னாவுடன் இத்காம்', detail: 'மூக்கொலியுடன் கூடிய இணைதல்.' },
  u: { name: 'குன்னா இல்லாமல் இத்காம்', detail: 'மூக்கொலி இல்லாமல் இணைதல்.' },
  g: { name: 'குன்னா', detail: 'இரண்டு அளவுகளுக்கு நிறுத்திப்படும் மூக்கொலி.' },
};

export const TOPIC_UZ: Record<string, { title: string; description: string }> = {
  oneness: { title: 'Аллоҳнинг ягоналиги', description: 'Аллоҳнинг мутлақ ягоналиги, беҳожатлиги ва тенгсизлигини тасдиқловчи оятлар.' },
  trust: { title: 'Таваккул ва суяниш', description: 'Аллоҳга суяниш билан бирга сабабларга ёпишиш ва матонатли бўлиш.' },
  signs: { title: 'Оламдаги белгилар', description: 'Яратилиш, тартиб ва мақсад ҳақида ўйлашга чорловчи парчалар.' },
  resurrection: { title: 'Қайта тирилиш ва қайтиш', description: 'Ҳисоб, яратилишнинг янгиланиши ва Аллоҳга сўнгги қайтиш ҳақида эслатмалар.' },
  parents: { title: 'Ота-она ва оила', description: 'Оила ҳаётида раҳм-шафқат, шукр ва гўзал муомала.' },
  justice: { title: 'Адолат ва ростгўйлик', description: 'Шахсан қийин бўлса ҳам адолат учун қатъий туриш.' },
  patience: { title: 'Машаққатда сабр', description: 'Оғирликда сабр қилиш ва намоз орқали ёрдам сўраш.' },
  speech: { title: 'Тилни сақлаш', description: 'Энг яхши сўзни айтиш, гумондан сақланиш ва бир-бирингизнинг қадр-қимматини ҳимоя қилиш.' },
  remembrance: { title: 'Зикр ва хотиржамлик', description: 'Аллоҳнинг зикри билан қалб хотиржамлигини топиш.' },
  repentance: { title: 'Умид ва тавба', description: 'Раҳматдан умидсизланмай, хатодан кейин чин дилдан қайтиш.' },
  gratitude: { title: 'Шукр', description: 'Неъматларни кўриб, шукр ва ибодат билан жавоб қайтариш.' },
  dua: { title: 'Дуо ва яқинлик', description: 'Аллоҳнинг бандага яқинлиги ва Унга дуо билан мурожаат қилишга чақириғи.' },
};
export const TOPIC_CATEGORY_UZ: Record<string, string> = { Faith: 'Иймон', Life: 'Ҳаёт', Spirituality: 'Маънавият' };
export const TAJWEED_UZ: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'Ўқилмайдиган ҳарфлар', detail: 'Ҳамзатул-васл, сокин белгилар ва қуёш ломи алоҳида талаффуз қилинмайди.' },
  m: { name: 'Табиий мадд', detail: 'Икки ҳаракат миқдоридаги одатий чўзиш.' },
  p: { name: 'Жоиз мадд', detail: 'Икки, тўрт ёки олти ҳаракат миқдоридаги жоиз чўзиш.' },
  n: { name: 'Лозим мадд', detail: 'Олти ҳаракат миқдоридаги зарурий чўзиш.' },
  o: { name: 'Вожиб мадд', detail: 'Одатда тўрт ёки беш ҳаракат миқдоридаги вожиб чўзиш.' },
  q: { name: 'Қалқала', detail: 'قطب جد ҳарфларидан бири сокин бўлганда бошқариладиган акс садо.' },
  c: { name: 'Ихфои шафавий', detail: 'Бо ҳарфидан олдин яширилган мим товуши.' },
  f: { name: 'Ихфо', detail: 'Ўз ҳарфларидан олдин сокин нун ёки танвиннинг яширилиши.' },
  w: { name: 'Идғоми шафавий', detail: 'Сокин мимнинг кейинги мимга қўшилиб кетиши.' },
  i: { name: 'Иқлоб', detail: 'Бо ҳарфидан олдин сокин нун ёки танвиннинг яширилган мимга айланиши.' },
  a: { name: 'Ғуннали идғом', detail: 'Бурун товуши билан қўшилиб кетиш.' },
  u: { name: 'Ғуннасиз идғом', detail: 'Бурун товушисиз қўшилиб кетиш.' },
  g: { name: 'Ғунна', detail: 'Икки ҳаракат миқдорида ушлаб туриладиган бурун товуши.' },
};

export const TOPIC_ZH: Record<string, { title: string; description: string }> = {
  oneness: { title: '真主的独一', description: '确认真主绝对独一、无求与无可比拟的经文。' },
  trust: { title: '信托与依靠', description: '信托真主，同时审慎行动并坚持不懈。' },
  signs: { title: '造化中的迹象', description: '引人思考造化、秩序与目的的经文。' },
  resurrection: { title: '复活与归返', description: '对问责、自新与最终归于真主的提醒。' },
  parents: { title: '父母与家人', description: '家庭生活中的仁慈、感恩与美德。' },
  justice: { title: '公正与诚信', description: '即使于己不利，仍坚定主持公正。' },
  patience: { title: '艰难中的忍耐', description: '在艰难中借忍耐与礼拜求助。' },
  speech: { title: '慎言', description: '言说至善，避免猜疑，维护彼此的尊严。' },
  remembrance: { title: '记念与宁静', description: '通过记念真主而获得内心的安定。' },
  repentance: { title: '希望与忏悔', description: '永不绝望于主的慈悯，犯错后诚心归返。' },
  gratitude: { title: '感恩', description: '认识恩典，并以感恩的功修回应。' },
  dua: { title: '都阿与临近', description: '真主的临近，以及呼唤他的邀约。' },
};
export const TOPIC_CATEGORY_ZH: Record<string, string> = { Faith: '信仰', Life: '生活', Spirituality: '灵性' };
export const TAJWEED_ZH: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: '不发音的字母', detail: '连接海姆宰、静音符与太阳字母的 لام 不单独发音。' },
  m: { name: '自然长音', detail: '标准延长，持续两个元音拍。' },
  p: { name: '允许长音', detail: '允许延长两、四或六拍。' },
  n: { name: '必需长音', detail: '六个元音拍的必需延长。' },
  o: { name: '必然长音', detail: '必然的延长，通常为四至五拍。' },
  q: { name: '盖勒盖拉', detail: 'قطب جد 中任一字母带静音符时的受限回声。' },
  c: { name: '唇音隐读', detail: 'باء 之前隐读的 ميم 音。' },
  f: { name: '隐读', detail: '静音 نون 或鼻音符在其字母前的隐读。' },
  w: { name: '唇音并入', detail: '静音 ميم 并入后继的 ميم。' },
  i: { name: '伊格拉卜', detail: '静音 نون 或鼻音符在 باء 前变为隐读的 ميم。' },
  a: { name: '带鼻音的并入', detail: '带鼻音共鸣的并入。' },
  u: { name: '不带鼻音的并入', detail: '不带鼻音的并入。' },
  g: { name: '鼻音', detail: '持续两拍的鼻音。' },
};

export const TOPIC_KK: Record<string, { title: string; description: string }> = {
  oneness: { title: 'Аллаһтың бірлігі', description: 'Аллаһтың мүлдем жалғыз, ешкімге мұқтаж емес және теңдессіз екенін растайтын аяттар.' },
  trust: { title: 'Тәуекел мен сенім', description: 'Аллаһқа тәуекел ету, әрі ұқыпты әрекет пен тұрақтылық.' },
  signs: { title: 'Жаратылыстағы белгілер', description: 'Жаратылыс, тәртіп пен мақсат туралы ойға шақыратын үзінділер.' },
  resurrection: { title: 'Қайта тірілу және оралу', description: 'Есеп беру, жаңару және Аллаһқа соңғы қайту туралы еске салулар.' },
  parents: { title: 'Ата-ана мен отбасы', description: 'Отбасы өміріндегі мейірім, шүкір мен көркем мінез.' },
  justice: { title: 'Әділет пен адалдық', description: 'Өзіне қиын болса да әділет үшін берік тұру.' },
  patience: { title: 'Қиындықтағы сабыр', description: 'Қиындықта сабыр мен намаз арқылы жәрдем тілеу.' },
  speech: { title: 'Тілді сақтау', description: 'Ең жақсысын айту, күдіктен аулақ болу және бір-бірінің абыройын қорғау.' },
  remembrance: { title: 'Зікір мен тыныштық', description: 'Аллаһты еске алу арқылы жүрек тыныштығын табу.' },
  repentance: { title: 'Үміт пен тәубе', description: 'Мейірімнен еш үміт үзбей, қатеден кейін шын қайту.' },
  gratitude: { title: 'Шүкір', description: 'Нығметті танып, шүкіршілік ғибадатпен жауап қайтару.' },
  dua: { title: 'Дұға мен жақындық', description: 'Аллаһтың жақындығы және Оған жалбарынуға шақыру.' },
};
export const TOPIC_CATEGORY_KK: Record<string, string> = { Faith: 'Иман', Life: 'Өмір', Spirituality: 'Руханилық' };
export const TAJWEED_KK: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'Сәкин әріптер', detail: 'Уасл хамзасы, сүкүн белгілері және күндізгі ләм жеке айтылмайды.' },
  m: { name: 'Табиғи мадд', detail: 'Екі дауысты өлшеміне созылатын әдеттегі созу.' },
  p: { name: 'Жәйіз мадд', detail: 'Екі, төрт немесе алты өлшемге рұқсат етілген созу.' },
  n: { name: 'Ләзім мадд', detail: 'Алты өлшемге созылатын қажетті созу.' },
  o: { name: 'Уәжіп мадд', detail: 'Міндетті созу, көбінесе төрт-бес өлшем.' },
  q: { name: 'Қалқала', detail: 'Сүкүн келгенде قطب جد әріптерінің бірінде жаңғырық пайда болады.' },
  c: { name: 'Ихфа шафауи', detail: 'Ба әрпінің алдындағы жасырын мим дыбысы.' },
  f: { name: 'Ихфо', detail: 'Әріптерінің алдындағы жасырын сәкин нун не танвин.' },
  w: { name: 'Идғам шафауи', detail: 'Сәкин мимнің келесі мимге бірігуі.' },
  i: { name: 'Иқлоб', detail: 'Сәкин нун не танвин ба әрпінің алдында жасырын мимге айналады.' },
  a: { name: 'Ғұнналы идғам', detail: 'Мұрын үнімен қосарланған бірігу.' },
  u: { name: 'Ғұннасыз идғам', detail: 'Мұрын үнінсіз бірігу.' },
  g: { name: 'Ғұнна', detail: 'Екі өлшемге созылған мұрын дыбысы.' },
};

export const TAJWEED_RU: Record<string, { name: string; detail: string }> = {
  'h,s,l': { name: 'Нечитаемые буквы', detail: 'Хамзат аль-васль, немые знаки и солнечный лям не произносятся отдельно.' },
  m: { name: 'Естественный мадд', detail: 'Обычное удлинение на две огласовки.' },
  p: { name: 'Дозволенный мадд', detail: 'Дозволенное удлинение на две, четыре или шесть огласовок.' },
  n: { name: 'Необходимый мадд', detail: 'Необходимое удлинение на шесть огласовок.' },
  o: { name: 'Обязательный мадд', detail: 'Обязательное удлинение, обычно на четыре или пять огласовок.' },
  q: { name: 'Калькаля', detail: 'Сдержанный отзвук на одной из букв قطب جد при наличии сукуна.' },
  c: { name: 'Ихфа шафави', detail: 'Скрытие звука «мим» перед буквой «ба».' },
  f: { name: 'Ихфа', detail: 'Скрытие «нун» с сукуном или танвина перед их буквами.' },
  w: { name: 'Идгам шафави', detail: 'Слияние «мим» с сукуном с последующей «мим».' },
  i: { name: 'Икляб', detail: 'Превращение «нун» с сукуном или танвина в скрытую «мим» перед буквой «ба».' },
  a: { name: 'Идгам с гунной', detail: 'Слияние, сопровождаемое носовым призвуком.' },
  u: { name: 'Идгам без гунны', detail: 'Слияние без носового призвука.' },
  g: { name: 'Гунна', detail: 'Носовой звук, удерживаемый в течение двух огласовок.' },
};

export const topicTitle=(topic:QuranTopic,lang?:string|boolean)=>{
  const c=langCode(lang);
  if(c==='ar')return topic.titleAr;
  const t=(c==='zh'?TOPIC_ZH:c==='kk'?TOPIC_KK:c==='uz'?TOPIC_UZ:c==='ta'?TOPIC_TA:c==='ms'?TOPIC_MS:c==='bn'?TOPIC_BN:c==='fr'?TOPIC_FR:c==='fa'?TOPIC_FA:c==='ru'?TOPIC_RU:c==='tr'?TOPIC_TR:c==='ur'?TOPIC_UR:c==='id'?TOPIC_ID:c==='hi'?TOPIC_HI:c==='ml'?TOPIC_ML:undefined)?.[topic.id];
  return t?.title||topic.title;
};
export const topicDescription=(topic:QuranTopic,lang?:string|boolean)=>{
  const c=langCode(lang);
  if(c==='ar')return topic.descriptionAr;
  const t=(c==='zh'?TOPIC_ZH:c==='kk'?TOPIC_KK:c==='uz'?TOPIC_UZ:c==='ta'?TOPIC_TA:c==='ms'?TOPIC_MS:c==='bn'?TOPIC_BN:c==='fr'?TOPIC_FR:c==='fa'?TOPIC_FA:c==='ru'?TOPIC_RU:c==='tr'?TOPIC_TR:c==='ur'?TOPIC_UR:c==='id'?TOPIC_ID:c==='hi'?TOPIC_HI:c==='ml'?TOPIC_ML:undefined)?.[topic.id];
  return t?.description||topic.description;
};
export const topicCategory=(topic:QuranTopic,lang?:string|boolean)=>{
  const c=langCode(lang);
  if(c==='ar')return TOPIC_CATEGORY_AR[topic.category];
  const t=(c==='zh'?TOPIC_CATEGORY_ZH:c==='kk'?TOPIC_CATEGORY_KK:c==='uz'?TOPIC_CATEGORY_UZ:c==='ta'?TOPIC_CATEGORY_TA:c==='ms'?TOPIC_CATEGORY_MS:c==='bn'?TOPIC_CATEGORY_BN:c==='fr'?TOPIC_CATEGORY_FR:c==='fa'?TOPIC_CATEGORY_FA:c==='ru'?TOPIC_CATEGORY_RU:c==='tr'?TOPIC_CATEGORY_TR:c==='ur'?TOPIC_CATEGORY_UR:c==='id'?TOPIC_CATEGORY_ID:c==='hi'?TOPIC_CATEGORY_HI:c==='ml'?TOPIC_CATEGORY_ML:undefined)?.[topic.category];
  return t||topic.category.toUpperCase();
};
const tajweedOwn=(rule:any,lang?:string|boolean)=>{
  const c=langCode(lang);
  if(c==='ar')return undefined;
  const table=c==='zh'?TAJWEED_ZH:c==='kk'?TAJWEED_KK:c==='uz'?TAJWEED_UZ:c==='ta'?TAJWEED_TA:c==='ms'?TAJWEED_MS:c==='bn'?TAJWEED_BN:c==='fr'?TAJWEED_FR:c==='fa'?TAJWEED_FA:c==='ru'?TAJWEED_RU:c==='tr'?TAJWEED_TR:c==='ur'?TAJWEED_UR:c==='id'?TAJWEED_ID:c==='hi'?TAJWEED_HI:c==='ml'?TAJWEED_ML:undefined;
  return table?.[String((rule?.codes||[]).join(','))];
};
export const tajweedName=(rule:any,lang?:string|boolean)=>langCode(lang)==='ar'?(rule as any).nameAr:tajweedOwn(rule,lang)?.name||rule.name;
export const tajweedDetail=(rule:any,lang?:string|boolean)=>langCode(lang)==='ar'?(rule as any).detailAr:tajweedOwn(rule,lang)?.detail||rule.detail;
