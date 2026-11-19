/** New player hints only; the existing Translation audio / On / Off labels use tx. */
const EN = {
  wholeSurah: 'Translation audio is available with verse-by-verse playback.',
  unavailable: 'This translation audio is unavailable.',
};
const COPY: Record<string, [string, string]> = {
  ar: ['صوت الترجمة متاح مع التشغيل آيةً بآية.', 'صوت هذه الترجمة غير متاح.'],
  ur: ['ترجمے کی آواز آیت بہ آیت پلے بیک کے ساتھ دستیاب ہے۔', 'اس ترجمے کی آواز دستیاب نہیں ہے۔'],
  fa: ['صوت ترجمه در پخش آیه‌به‌آیه در دسترس است.', 'صوت این ترجمه در دسترس نیست.'],
  ps: ['د ژباړې غږ د آیت په آیت غږولو سره شته.', 'د دې ژباړې غږ نشته.'],
  fr: ['La traduction audio est disponible avec la lecture verset par verset.', 'Cette traduction audio est indisponible.'],
  tr: ['Sesli meal, ayet ayet dinlemede kullanılabilir.', 'Bu sesli meal kullanılamıyor.'],
  ru: ['Аудиоперевод доступен при воспроизведении по аятам.', 'Этот аудиоперевод недоступен.'],
  uz: ['Аудио таржима оятма-оят тинглашда мавжуд.', 'Бу аудио таржима мавжуд эмас.'],
  kk: ['Аудио аударма аят бойынша ойнатуда қолжетімді.', 'Бұл аудио аударма қолжетімсіз.'],
  zh: ['逐节播放时可使用译文音频。', '此译文音频不可用。'],
  vi: ['Bản dịch âm thanh có sẵn khi phát từng câu kinh.', 'Bản dịch âm thanh này không khả dụng.'],
  az: ['Səsli tərcümə ayə-ayə dinləmədə mövcuddur.', 'Bu səsli tərcümə mövcud deyil.'],
  bs: ['Zvučni prijevod dostupan je pri reprodukciji ajet po ajet.', 'Ovaj zvučni prijevod nije dostupan.'],
  bg: ['Аудиопреводът е достъпен при възпроизвеждане аят по аят.', 'Този аудиопревод не е достъпен.'],
  si: ['ආයතයෙන් ආයතය වාදනයේදී පරිවර්තන හඬ ලබා ගත හැක.', 'මෙම පරිවර්තන හඬ ලබා ගත නොහැක.'],
  bn: ['আয়াত অনুযায়ী চালালে অনুবাদের অডিও পাওয়া যায়।', 'এই অনুবাদের অডিও পাওয়া যাচ্ছে না।'],
  hi: ['आयत-दर-आयत सुनते समय अनुवाद ऑडियो उपलब्ध है।', 'इस अनुवाद का ऑडियो उपलब्ध नहीं है।'],
  id: ['Audio terjemahan tersedia dalam pemutaran ayat per ayat.', 'Audio terjemahan ini tidak tersedia.'],
  ms: ['Audio terjemahan tersedia untuk main balik ayat demi ayat.', 'Audio terjemahan ini tidak tersedia.'],
  ta: ['வசனம் வாரியாக இயக்கும்போது மொழிபெயர்ப்பு ஒலி கிடைக்கும்.', 'இந்த மொழிபெயர்ப்பு ஒலி கிடைக்கவில்லை.'],
  ml: ['ആയത്ത് തിരിച്ചുള്ള പ്ലേബാക്കിൽ പരിഭാഷാ ഓഡിയോ ലഭ്യമാണ്.', 'ഈ പരിഭാഷാ ഓഡിയോ ലഭ്യമല്ല.'],
};
export function audioPlayerText(language: string, key: keyof typeof EN): string {
  return COPY[language]?.[key === 'wholeSurah' ? 0 : 1] || EN[key];
}

// Every real recording has a readable language label, independent of the
// performer name. In particular, never expose catalogue codes such as az/bs
// or use Arabic labels for a different right-to-left interface language.
const VOICE_LANGUAGES = ['fr', 'kk', 'ru', 'tr', 'uz', 'zh', 'en', 'fa', 'ur', 'az', 'bs'];
const VOICE_NAMES: Record<string, string[]> = {
  en: ['French', 'Kazakh', 'Russian', 'Turkish', 'Uzbek', 'Chinese', 'English', 'Persian', 'Urdu', 'Azerbaijani', 'Bosnian'],
  ar: ['الفرنسية', 'الكازاخية', 'الروسية', 'التركية', 'الأوزبكية', 'الصينية', 'الإنجليزية', 'الفارسية', 'الأردية', 'الأذربيجانية', 'البوسنية'],
  ur: ['فرانسیسی', 'قازق', 'روسی', 'ترکی', 'ازبک', 'چینی', 'انگریزی', 'فارسی', 'اردو', 'آذربائیجانی', 'بوسنیائی'],
  fa: ['فرانسوی', 'قزاقی', 'روسی', 'ترکی', 'ازبکی', 'چینی', 'انگلیسی', 'فارسی', 'اردو', 'آذربایجانی', 'بوسنیایی'],
  ps: ['فرانسوي', 'قزاقي', 'روسي', 'ترکي', 'ازبکي', 'چینایي', 'انګلیسي', 'فارسي', 'اردو', 'آذربایجاني', 'بوسنیایي'],
  fr: ['Français', 'Kazakh', 'Russe', 'Turc', 'Ouzbek', 'Chinois', 'Anglais', 'Persan', 'Ourdou', 'Azerbaïdjanais', 'Bosniaque'],
  tr: ['Fransızca', 'Kazakça', 'Rusça', 'Türkçe', 'Özbekçe', 'Çince', 'İngilizce', 'Farsça', 'Urduca', 'Azerbaycanca', 'Boşnakça'],
  ru: ['Французский', 'Казахский', 'Русский', 'Турецкий', 'Узбекский', 'Китайский', 'Английский', 'Персидский', 'Урду', 'Азербайджанский', 'Боснийский'],
  uz: ['Французча', 'Қозоқча', 'Русча', 'Туркча', 'Ўзбекча', 'Хитойча', 'Инглизча', 'Форсча', 'Урдуча', 'Озарбайжонча', 'Боснияча'],
  kk: ['Француз тілі', 'Қазақ тілі', 'Орыс тілі', 'Түрік тілі', 'Өзбек тілі', 'Қытай тілі', 'Ағылшын тілі', 'Парсы тілі', 'Урду тілі', 'Әзербайжан тілі', 'Босния тілі'],
  zh: ['法语', '哈萨克语', '俄语', '土耳其语', '乌兹别克语', '中文', '英语', '波斯语', '乌尔都语', '阿塞拜疆语', '波斯尼亚语'],
  vi: ['Tiếng Pháp', 'Tiếng Kazakh', 'Tiếng Nga', 'Tiếng Thổ Nhĩ Kỳ', 'Tiếng Uzbek', 'Tiếng Trung', 'Tiếng Anh', 'Tiếng Ba Tư', 'Tiếng Urdu', 'Tiếng Azerbaijan', 'Tiếng Bosnia'],
  az: ['Fransız dili', 'Qazax dili', 'Rus dili', 'Türk dili', 'Özbək dili', 'Çin dili', 'İngilis dili', 'Fars dili', 'Urdu dili', 'Azərbaycan dili', 'Bosniya dili'],
  bs: ['Francuski', 'Kazaški', 'Ruski', 'Turski', 'Uzbečki', 'Kineski', 'Engleski', 'Perzijski', 'Urdu', 'Azerbejdžanski', 'Bosanski'],
  bg: ['Френски', 'Казахски', 'Руски', 'Турски', 'Узбекски', 'Китайски', 'Английски', 'Персийски', 'Урду', 'Азербайджански', 'Босненски'],
  si: ['ප්‍රංශ', 'කසක්', 'රුසියානු', 'තුර්කි', 'උස්බෙක්', 'චීන', 'ඉංග්‍රීසි', 'පර්සියානු', 'උර්දු', 'අසර්බයිජානු', 'බොස්නියානු'],
  bn: ['ফরাসি', 'কাজাখ', 'রুশ', 'তুর্কি', 'উজবেক', 'চীনা', 'ইংরেজি', 'ফারসি', 'উর্দু', 'আজারবাইজানি', 'বসনীয়'],
  hi: ['फ़्रांसीसी', 'कज़ाख', 'रूसी', 'तुर्की', 'उज़्बेक', 'चीनी', 'अंग्रेज़ी', 'फ़ारसी', 'उर्दू', 'अज़रबैजानी', 'बोस्नियाई'],
  id: ['Prancis', 'Kazakh', 'Rusia', 'Turki', 'Uzbek', 'Tionghoa', 'Inggris', 'Persia', 'Urdu', 'Azerbaijan', 'Bosnia'],
  ms: ['Perancis', 'Kazakh', 'Rusia', 'Turki', 'Uzbek', 'Cina', 'Inggeris', 'Parsi', 'Urdu', 'Azerbaijan', 'Bosnia'],
  ta: ['பிரெஞ்சு', 'கசாக்', 'ரஷ்யம்', 'துருக்கியம்', 'உஸ்பெக்', 'சீனம்', 'ஆங்கிலம்', 'பாரசீகம்', 'உருது', 'அசர்பைஜானி', 'போஸ்னியன்'],
  ml: ['ഫ്രഞ്ച്', 'കസാഖ്', 'റഷ്യൻ', 'തുർക്കി', 'ഉസ്ബെക്ക്', 'ചൈനീസ്', 'ഇംഗ്ലീഷ്', 'പേർഷ്യൻ', 'ഉർദു', 'അസർബൈജാനി', 'ബോസ്നിയൻ'],
};
export function audioPlayerLanguage(language: string, code: string): string {
  const index = VOICE_LANGUAGES.indexOf(code);
  return index < 0 ? code : (VOICE_NAMES[language] || VOICE_NAMES.en)[index];
}
