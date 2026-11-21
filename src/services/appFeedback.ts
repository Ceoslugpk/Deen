import { Linking } from 'react-native';

/** The publisher-supplied form. No account, app state, identifiers or prefilled
 * answers are appended. The app never loads or submits the form itself. */
export const APP_FEEDBACK_URL = 'https://forms.gle/9jbqgcvUTBDV4g9Z6';

/** Native platforms hand this HTTPS link to the user's default external
 * handler/browser, never an embedded WebView or in-app browser. On web the
 * Settings row is a real new-tab anchor instead of invoking this bridge. */
export async function openAppFeedbackForm(): Promise<void> {
  await Linking.openURL(APP_FEEDBACK_URL);
}

const COPY: Record<string, { label: string; error: string }> = {
  en: { label: 'Report or request a feature', error: 'Could not open your browser. Please try again.' },
  ar: { label: 'الإبلاغ عن مشكلة أو طلب ميزة', error: 'تعذّر فتح متصفحك. يرجى المحاولة مجددًا.' },
  ur: { label: 'مسئلہ رپورٹ کریں یا کسی فیچر کی درخواست کریں', error: 'آپ کا براؤزر نہیں کھل سکا۔ براہ کرم دوبارہ کوشش کریں۔' },
  fa: { label: 'گزارش مشکل یا درخواست قابلیت', error: 'مرورگر شما باز نشد. لطفاً دوباره تلاش کنید.' },
  ps: { label: 'ستونزه راپور کړئ یا د یوې ځانګړنې غوښتنه وکړئ', error: 'ستاسو براوزر پرانیستل نه شو. مهرباني وکړئ بیا هڅه وکړئ.' },
  fr: { label: 'Signaler un problème ou demander une fonctionnalité', error: 'Impossible d’ouvrir votre navigateur. Veuillez réessayer.' },
  tr: { label: 'Sorun bildir veya özellik iste', error: 'Tarayıcınız açılamadı. Lütfen tekrar deneyin.' },
  ru: { label: 'Сообщить о проблеме или предложить функцию', error: 'Не удалось открыть браузер. Повторите попытку.' },
  uz: { label: 'Муаммо ҳақида хабар бериш ёки янги имконият сўраш', error: 'Браузерингизни очиб бўлмади. Қайта уриниб кўринг.' },
  kk: { label: 'Мәселе туралы хабарлау немесе жаңа мүмкіндік сұрау', error: 'Браузеріңізді ашу мүмкін болмады. Қайталап көріңіз.' },
  zh: { label: '报告问题或请求新功能', error: '无法打开浏览器，请重试。' },
  vi: { label: 'Báo lỗi hoặc yêu cầu tính năng', error: 'Không thể mở trình duyệt. Vui lòng thử lại.' },
  az: { label: 'Problem bildirin və ya funksiya istəyin', error: 'Brauzerinizi açmaq mümkün olmadı. Yenidən cəhd edin.' },
  bs: { label: 'Prijavite problem ili zatražite funkciju', error: 'Preglednik se nije mogao otvoriti. Pokušajte ponovo.' },
  bg: { label: 'Съобщете за проблем или поискайте функция', error: 'Браузърът не можа да се отвори. Опитайте отново.' },
  si: { label: 'ගැටලුවක් වාර්තා කරන්න හෝ විශේෂාංගයක් ඉල්ලන්න', error: 'ඔබේ බ්‍රවුසරය විවෘත කළ නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.' },
  bn: { label: 'সমস্যা জানান বা নতুন ফিচারের অনুরোধ করুন', error: 'আপনার ব্রাউজার খোলা যায়নি। আবার চেষ্টা করুন।' },
  hi: { label: 'समस्या बताएँ या नए फ़ीचर का अनुरोध करें', error: 'आपका ब्राउज़र नहीं खुल सका। कृपया फिर कोशिश करें।' },
  id: { label: 'Laporkan masalah atau minta fitur', error: 'Browser Anda tidak dapat dibuka. Silakan coba lagi.' },
  ms: { label: 'Laporkan masalah atau mohon ciri baharu', error: 'Pelayar anda tidak dapat dibuka. Sila cuba lagi.' },
  ta: { label: 'சிக்கலைப் புகாரளிக்கவும் அல்லது புதிய அம்சத்தைக் கோரவும்', error: 'உங்கள் உலாவியைத் திறக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.' },
  ml: { label: 'പ്രശ്നം അറിയിക്കുക അല്ലെങ്കിൽ പുതിയ സൗകര്യം അഭ്യർത്ഥിക്കുക', error: 'നിങ്ങളുടെ ബ്രൗസർ തുറക്കാനായില്ല. വീണ്ടും ശ്രമിക്കുക.' },
};

export function appFeedbackText(language: string, key: keyof typeof COPY.en): string {
  const row = Object.hasOwn(COPY, language) ? COPY[language] : COPY.en;
  return row[key];
}
