/** Publisher's dedication, shown only at the end of Settings. The copyright
 * year and proper brand name are intentionally the same in every language. */
const DEDICATION: Record<string, string> = {
  en: '2026 © Islamic. This app is a hadiyah for my beloved parents and the entire Muslim Ummah. May Allah accept it as sadaqah jariyah and grant them His mercy and forgiveness.🤲❤️',
  ar: '2026 © Islamic. هذا التطبيق هدية لوالديَّ الحبيبين وللأمة الإسلامية جمعاء. أسأل الله أن يتقبّله صدقةً جاريةً، وأن يشملهم برحمته ومغفرته.🤲❤️',
  ur: '2026 © Islamic. یہ ایپ میرے پیارے والدین اور پوری امتِ مسلمہ کے لیے ایک ہدیہ ہے۔ اللہ اسے صدقۂ جاریہ کے طور پر قبول فرمائے اور انہیں اپنی رحمت و مغفرت عطا فرمائے۔🤲❤️',
  fa: '2026 © Islamic. این برنامه هدیه‌ای برای پدر و مادر عزیزم و تمام امت مسلمان است. خداوند آن را به‌عنوان صدقهٔ جاریه بپذیرد و رحمت و آمرزش خویش را نصیبشان فرماید.🤲❤️',
  ps: '2026 © Islamic. دا اپ زما ګرانو مور او پلار او ټول مسلمان امت ته یوه ډالۍ ده. الله دې دا د صدقې جاریې په توګه قبول کړي او هغوی ته دې خپل رحمت او مغفرت ورپه برخه کړي.🤲❤️',
  fr: '2026 © Islamic. Cette application est un cadeau pour mes parents bien-aimés et pour toute la communauté musulmane. Qu’Allah l’accepte comme une aumône perpétuelle (sadaqah jariyah) et leur accorde Sa miséricorde et Son pardon.🤲❤️',
  tr: '2026 © Islamic. Bu uygulama, sevgili anne babama ve tüm Müslüman ümmetine bir hediyedir. Allah bunu sadaka-i cariye olarak kabul etsin, onlara rahmetini ve mağfiretini ihsan eylesin.🤲❤️',
  ru: '2026 © Islamic. Это приложение — подарок моим любимым родителям и всей мусульманской умме. Пусть Аллах примет его как садака джария и дарует им Свою милость и прощение.🤲❤️',
  uz: '2026 © Islamic. Ушбу илова азиз ота-онамга ва бутун мусулмон умматига ҳадядир. Аллоҳ уни садақаи жория сифатида қабул қилсин ҳамда уларга Ўз раҳмати ва мағфиратини ато этсин.🤲❤️',
  kk: '2026 © Islamic. Бұл қолданба — сүйікті ата-анама және бүкіл мұсылман үмбетіне арналған сый. Алла оны садақа жария ретінде қабыл етіп, оларға Өзінің рақымы мен кешірімін нәсіп етсін.🤲❤️',
  zh: '2026 © Islamic. 此应用是献给我挚爱的父母和全体穆斯林乌玛的一份礼物。愿真主悦纳它为长久的施舍（sadaqah jariyah），并赐予他们祂的慈悯与宽恕。🤲❤️',
  vi: '2026 © Islamic. Ứng dụng này là món quà dành tặng cha mẹ kính yêu của tôi và toàn thể cộng đồng Muslim. Cầu xin Allah chấp nhận đây là một sự bố thí lâu dài (sadaqah jariyah) và ban cho họ lòng thương xót cùng sự tha thứ của Ngài.🤲❤️',
  az: '2026 © Islamic. Bu tətbiq əziz valideynlərimə və bütün müsəlman ümmətinə bir hədiyyədir. Allah bunu sədəqeyi-cariyə olaraq qəbul etsin, onlara Öz rəhmətini və məğfirətini bəxş etsin.🤲❤️',
  bs: '2026 © Islamic. Ova aplikacija je hedija mojim voljenim roditeljima i cijelom muslimanskom ummetu. Neka je Allah primi kao trajnu sadaku i podari im Svoju milost i oprost.🤲❤️',
  bg: '2026 © Islamic. Това приложение е подарък за моите обични родители и за цялата мюсюлманска общност. Нека Аллах го приеме като садака джария и ги дари със Своята милост и опрощение.🤲❤️',
  si: '2026 © Islamic. මෙම යෙදුම මාගේ ආදරණීය දෙමාපියන්ට සහ සමස්ත මුස්ලිම් උම්මාවට පිරිනමන ත්‍යාගයකි. අල්ලාහ් මෙය සදකා ජාරියා ලෙස පිළිගෙන, ඔවුන්ට ඔහුගේ දයාව සහ සමාව ලබා දෙත්වා.🤲❤️',
  bn: '2026 © Islamic. এই অ্যাপটি আমার প্রিয় বাবা-মা এবং সমগ্র মুসলিম উম্মাহর জন্য একটি হাদিয়া। আল্লাহ এটিকে সদকায়ে জারিয়া হিসেবে কবুল করুন এবং তাঁদের তাঁর রহমত ও মাগফিরাত দান করুন।🤲❤️',
  hi: '2026 © Islamic. यह ऐप मेरे प्यारे माता-पिता और पूरी मुस्लिम उम्मत के लिए एक हदिया है। अल्लाह इसे सदक़ा-ए-जारिया के रूप में क़बूल फ़रमाए और उन्हें अपनी रहमत और मग़फ़िरत अता फ़रमाए।🤲❤️',
  id: '2026 © Islamic. Aplikasi ini adalah hadiah untuk kedua orang tua tercinta saya dan seluruh umat Muslim. Semoga Allah menerimanya sebagai sedekah jariyah serta melimpahkan rahmat dan ampunan-Nya kepada mereka.🤲❤️',
  ms: '2026 © Islamic. Aplikasi ini ialah hadiah untuk ibu bapa tercinta saya dan seluruh umat Islam. Semoga Allah menerimanya sebagai sedekah jariah serta mengurniakan rahmat dan keampunan-Nya kepada mereka.🤲❤️',
  ta: '2026 © Islamic. இந்தச் செயலி என் அன்பிற்குரிய பெற்றோருக்கும் முழு முஸ்லிம் உம்மத்திற்கும் ஒரு அன்பளிப்பாகும். அல்லாஹ் இதை சதகா ஜாரியாவாக ஏற்றுக்கொண்டு, அவர்களுக்கு தனது அருளையும் மன்னிப்பையும் வழங்குவானாக.🤲❤️',
  ml: '2026 © Islamic. ഈ ആപ്പ് എന്റെ പ്രിയപ്പെട്ട മാതാപിതാക്കൾക്കും മുഴുവൻ മുസ്‌ലിം സമൂഹത്തിനുമുള്ള ഒരു സമ്മാനമാണ്. അല്ലാഹു ഇത് സ്വദഖ ജാരിയയായി സ്വീകരിക്കുകയും അവർക്ക് തന്റെ കാരുണ്യവും പാപമോചനവും നൽകുകയും ചെയ്യുമാറാകട്ടെ.🤲❤️',
};

export function settingsDedicationText(language: string): string {
  const text = DEDICATION[language];
  return typeof text === 'string' ? text : DEDICATION.en;
}
