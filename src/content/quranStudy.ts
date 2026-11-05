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

export const topicTitle=(topic:QuranTopic,lang?:string|boolean)=>{
  const c=langCode(lang);
  if(c==='ar')return topic.titleAr;
  const t=(c==='fa'?TOPIC_FA:c==='tr'?TOPIC_TR:undefined)?.[topic.id];
  return t?.title||topic.title;
};
export const topicDescription=(topic:QuranTopic,lang?:string|boolean)=>{
  const c=langCode(lang);
  if(c==='ar')return topic.descriptionAr;
  const t=(c==='fa'?TOPIC_FA:c==='tr'?TOPIC_TR:undefined)?.[topic.id];
  return t?.description||topic.description;
};
export const topicCategory=(topic:QuranTopic,lang?:string|boolean)=>{
  const c=langCode(lang);
  if(c==='ar')return TOPIC_CATEGORY_AR[topic.category];
  const t=(c==='fa'?TOPIC_CATEGORY_FA:c==='tr'?TOPIC_CATEGORY_TR:undefined)?.[topic.category];
  return t||topic.category.toUpperCase();
};
const tajweedOwn=(rule:any,lang?:string|boolean)=>{
  const c=langCode(lang);
  if(c==='ar')return undefined;
  const table=c==='fa'?TAJWEED_FA:c==='tr'?TAJWEED_TR:undefined;
  return table?.[String((rule?.codes||[]).join(','))];
};
export const tajweedName=(rule:any,lang?:string|boolean)=>langCode(lang)==='ar'?(rule as any).nameAr:tajweedOwn(rule,lang)?.name||rule.name;
export const tajweedDetail=(rule:any,lang?:string|boolean)=>langCode(lang)==='ar'?(rule as any).detailAr:tajweedOwn(rule,lang)?.detail||rule.detail;
