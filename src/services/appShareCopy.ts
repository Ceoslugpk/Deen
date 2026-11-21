/** Only the newly added Share app page; brand/store names remain proper names. */
const EN = {
  title: 'Share app',
  scan: 'Scan the QR code to open Islamic Companion on Google Play.',
  button: 'Share app with your friends and family',
  open: 'Open in Google Play',
  copied: 'Link copied. Paste it into a message.',
  error: 'Could not complete this action. Please try again or open Google Play.',
};
const COPY: Record<string, string[]> = {
  ar: ['مشاركة التطبيق', 'امسح رمز الاستجابة السريعة لفتح Islamic Companion على Google Play.', 'شارك التطبيق مع أصدقائك وعائلتك', 'فتح في Google Play', 'نُسخ الرابط. الصقه في رسالة.', 'تعذّر إكمال هذا الإجراء. يرجى المحاولة مجددًا أو فتح Google Play.'],
  ur: ['ایپ شیئر کریں', 'Google Play پر Islamic Companion کھولنے کے لیے کیو آر کوڈ اسکین کریں۔', 'ایپ اپنے دوستوں اور خاندان کے ساتھ شیئر کریں', 'Google Play میں کھولیں', 'لنک کاپی ہو گیا۔ اسے پیغام میں پیسٹ کریں۔', 'یہ عمل مکمل نہیں ہو سکا۔ دوبارہ کوشش کریں یا Google Play کھولیں۔'],
  fa: ['اشتراک‌گذاری برنامه', 'برای باز کردن Islamic Companion در Google Play کد را اسکن کنید.', 'برنامه را با دوستان و خانوادهٔ خود به اشتراک بگذارید', 'باز کردن در Google Play', 'پیوند کپی شد. آن را در یک پیام جای‌گذاری کنید.', 'این کار انجام نشد. دوباره تلاش کنید یا Google Play را باز کنید.'],
  ps: ['اپ شریک کړئ', 'په Google Play کې د Islamic Companion د پرانیستلو لپاره QR کوډ سکین کړئ.', 'اپ له خپلو ملګرو او کورنۍ سره شریک کړئ', 'په Google Play کې یې پرانیزئ', 'لینک کاپي شو. په پیغام کې یې ونښلوئ.', 'دا کار بشپړ نه شو. بیا هڅه وکړئ یا Google Play پرانیزئ.'],
  fr: ['Partager l’application', 'Scannez le code QR pour ouvrir Islamic Companion sur Google Play.', 'Partagez l’application avec vos amis et votre famille', 'Ouvrir dans Google Play', 'Lien copié. Collez-le dans un message.', 'Cette action a échoué. Réessayez ou ouvrez Google Play.'],
  tr: ['Uygulamayı paylaş', 'Islamic Companion uygulamasını Google Play’de açmak için QR kodunu tarayın.', 'Uygulamayı arkadaşlarınız ve ailenizle paylaşın', 'Google Play’de aç', 'Bağlantı kopyalandı. Bir mesaja yapıştırın.', 'Bu işlem tamamlanamadı. Tekrar deneyin veya Google Play’i açın.'],
  ru: ['Поделиться приложением', 'Отсканируйте QR-код, чтобы открыть Islamic Companion в Google Play.', 'Поделитесь приложением с друзьями и семьёй', 'Открыть в Google Play', 'Ссылка скопирована. Вставьте её в сообщение.', 'Не удалось выполнить действие. Повторите попытку или откройте Google Play.'],
  uz: ['Иловани улашиш', 'Islamic Companion иловасини Google Play орқали очиш учун QR-кодни сканерланг.', 'Иловани дўстларингиз ва оилангиз билан улашинг', 'Google Play орқали очиш', 'Ҳавола нусхаланди. Уни хабарга жойланг.', 'Бу амал бажарилмади. Қайта уриниб кўринг ёки Google Play орқали очинг.'],
  kk: ['Қолданбамен бөлісу', 'Islamic Companion қолданбасын Google Play арқылы ашу үшін QR-кодты сканерлеңіз.', 'Қолданбаны достарыңызбен және отбасыңызбен бөлісіңіз', 'Google Play арқылы ашу', 'Сілтеме көшірілді. Оны хабарламаға қойыңыз.', 'Бұл әрекет орындалмады. Қайталап көріңіз немесе Google Play арқылы ашыңыз.'],
  zh: ['分享应用', '扫描二维码，在 Google Play 上打开 Islamic Companion。', '与亲朋好友分享此应用', '在 Google Play 中打开', '链接已复制。请粘贴到消息中。', '无法完成此操作。请重试或打开 Google Play。'],
  vi: ['Chia sẻ ứng dụng', 'Quét mã QR để mở Islamic Companion trên Google Play.', 'Chia sẻ ứng dụng với bạn bè và gia đình', 'Mở trong Google Play', 'Đã sao chép liên kết. Hãy dán vào tin nhắn.', 'Không thể hoàn tất thao tác. Hãy thử lại hoặc mở Google Play.'],
  az: ['Tətbiqi paylaş', 'Islamic Companion tətbiqini Google Play-də açmaq üçün QR kodunu skan edin.', 'Tətbiqi dostlarınız və ailənizlə paylaşın', 'Google Play-də aç', 'Keçid kopyalandı. Onu mesaja yapışdırın.', 'Bu əməliyyat tamamlanmadı. Yenidən cəhd edin və ya Google Play-i açın.'],
  bs: ['Podijeli aplikaciju', 'Skenirajte QR kod da otvorite Islamic Companion na Google Playu.', 'Podijelite aplikaciju s prijateljima i porodicom', 'Otvori na Google Playu', 'Link je kopiran. Zalijepite ga u poruku.', 'Radnja nije dovršena. Pokušajte ponovo ili otvorite Google Play.'],
  bg: ['Споделяне на приложението', 'Сканирайте QR кода, за да отворите Islamic Companion в Google Play.', 'Споделете приложението с приятели и семейство', 'Отвори в Google Play', 'Връзката е копирана. Поставете я в съобщение.', 'Действието не бе завършено. Опитайте отново или отворете Google Play.'],
  si: ['යෙදුම බෙදාගන්න', 'Google Play හි Islamic Companion විවෘත කිරීමට QR කේතය ස්කෑන් කරන්න.', 'යෙදුම ඔබේ මිතුරන් සහ පවුලේ අය සමඟ බෙදාගන්න', 'Google Play තුළ විවෘත කරන්න', 'සබැඳිය පිටපත් විය. එය පණිවිඩයක අලවන්න.', 'මෙම ක්‍රියාව සම්පූර්ණ කළ නොහැකි විය. නැවත උත්සාහ කරන්න හෝ Google Play විවෘත කරන්න.'],
  bn: ['অ্যাপ শেয়ার করুন', 'Google Play-তে Islamic Companion খুলতে কিউআর কোড স্ক্যান করুন।', 'বন্ধু ও পরিবারের সঙ্গে অ্যাপ শেয়ার করুন', 'Google Play-তে খুলুন', 'লিংক কপি হয়েছে। এটি একটি বার্তায় পেস্ট করুন।', 'এই কাজটি সম্পূর্ণ করা যায়নি। আবার চেষ্টা করুন অথবা Google Play খুলুন।'],
  hi: ['ऐप साझा करें', 'Google Play पर Islamic Companion खोलने के लिए क्यूआर कोड स्कैन करें।', 'ऐप अपने दोस्तों और परिवार के साथ साझा करें', 'Google Play में खोलें', 'लिंक कॉपी हो गया। इसे किसी संदेश में पेस्ट करें।', 'यह काम पूरा नहीं हो सका। फिर कोशिश करें या Google Play खोलें।'],
  id: ['Bagikan aplikasi', 'Pindai kode QR untuk membuka Islamic Companion di Google Play.', 'Bagikan aplikasi dengan teman dan keluarga', 'Buka di Google Play', 'Tautan disalin. Tempelkan ke pesan.', 'Tindakan ini tidak dapat diselesaikan. Coba lagi atau buka Google Play.'],
  ms: ['Kongsi aplikasi', 'Imbas kod QR untuk membuka Islamic Companion di Google Play.', 'Kongsi aplikasi dengan rakan dan keluarga anda', 'Buka di Google Play', 'Pautan disalin. Tampalkannya ke dalam mesej.', 'Tindakan ini tidak dapat diselesaikan. Cuba lagi atau buka Google Play.'],
  ta: ['செயலியைப் பகிரவும்', 'Google Play இல் Islamic Companion ஐத் திறக்க QR குறியீட்டை ஸ்கேன் செய்யவும்.', 'செயலியை உங்கள் நண்பர்கள் மற்றும் குடும்பத்தினருடன் பகிரவும்', 'Google Play இல் திறக்கவும்', 'இணைப்பு நகலெடுக்கப்பட்டது. செய்தியில் ஒட்டவும்.', 'இந்தச் செயலை முடிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது Google Play ஐத் திறக்கவும்.'],
  ml: ['ആപ്പ് പങ്കിടുക', 'Google Play-യിൽ Islamic Companion തുറക്കാൻ QR കോഡ് സ്കാൻ ചെയ്യുക.', 'സുഹൃത്തുക്കളുമായും കുടുംബാംഗങ്ങളുമായും ആപ്പ് പങ്കിടുക', 'Google Play-യിൽ തുറക്കുക', 'ലിങ്ക് പകർത്തി. ഒരു സന്ദേശത്തിൽ ഒട്ടിക്കുക.', 'ഈ പ്രവർത്തനം പൂർത്തിയാക്കാനായില്ല. വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ Google Play തുറക്കുക.'],
};
const KEYS = Object.keys(EN) as (keyof typeof EN)[];
export function appShareText(language: string, key: keyof typeof EN): string {
  return COPY[language]?.[KEYS.indexOf(key)] || EN[key];
}
