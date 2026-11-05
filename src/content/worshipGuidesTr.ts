/**
 * The worship guides in Turkish.
 *
 * The English guides in `worshipGuides.ts` stay the source of truth: they carry
 * the ids, the reference links and the order. This file holds only the Turkish
 * wording, so a guide that has not been written here yet simply reads in
 * English rather than showing an empty screen.
 *
 * Turkish is written left-to-right, like English, which is exactly why the old
 * `rtl` flag could not reach it: a boolean reads every LTR language as English.
 * These are reached through a language code. See `localizeGuide`.
 */

export type WorshipGuideTr = {
  title: string;
  subtitle: string;
  introduction: string;
  steps: string[];
  note?: string;
};

export const WORSHIP_GUIDES_TR: Record<string, WorshipGuideTr> = {
  'Wudu Guide': {
    title: 'Abdest Rehberi',
    subtitle: 'Namaza özenle hazırlanın',
    introduction: "Kur'an'daki emre ve Peygamber ﷺ'in bildirilen uygulamasına dayanan kısa bir sıra.",
    steps: [
      'Niyet ederek başlayın ve Bismillah deyin.',
      'İki elinizi yıkayın.',
      'Ağzınızı ve burnunuzu yıkayın.',
      'Yüzünüzü yıkayın.',
      'Dirseklerle birlikte kollarınızı yıkayın, sağdan başlayın.',
      'Başınızı ve kulaklarınızı mesh edin.',
      'Bileklerle birlikte ayaklarınızı yıkayın, sağdan başlayın.',
    ],
    note: 'Suyun farz olan yerlere ulaşması gerekir. Sargılar, yaralar, mest üzerine mesh ve sürekli vesvese konusunda yetkin bir âlime danışın.',
  },
  'Salah Guide': {
    title: 'Namaz Rehberi',
    subtitle: 'Namazın açık bir özeti',
    introduction: 'Mezhebinizin ayrıntılı hükümlerini öğrenmeden önce ana sırayı öğrenin.',
    steps: [
      'Niyet ederek kıbleye dönün.',
      'İftitah tekbiriyle başlayın.',
      "Ayakta Fâtiha'yı ve gereken yerde ek Kur'an okuyun.",
      'Sükûnetle rükûya varın.',
      'Doğrulun ve ayakta dik durun.',
      'Arada oturarak iki secde yapın.',
      'Gerekli rekâtları, teşehhüdü ve salavatı tamamlayın.',
      'Sağa ve sola selam vererek bitirin.',
    ],
    note: 'Bu özet, namazı yetkin bir hocadan doğrudan öğrenmenin yerini tutmaz.',
  },
  'Janazah Guide': {
    title: 'Cenaze Namazı',
    subtitle: 'Cenaze namazına kısa bir bakış',
    introduction: 'Cenaze namazı farz-ı kifâyedir; ayakta kılınır, rükû ve secde yoktur.',
    steps: [
      'Niyet edin ve kıbleye dönün.',
      "İlk tekbirden sonra Fâtiha'yı okuyun.",
      "İkincisinden sonra Peygamber ﷺ'e salavat getirin.",
      'Üçüncüsünden sonra ölü için içtenlikle dua edin.',
      'Dördüncüsünden sonra kısa bir duraksayın ve selam vererek bitirin.',
    ],
    note: 'Ayrıntılar mezhepler arasında değişir; imama uyun ve yerel âlimlerin rehberliğine başvurun.',
  },
  'Eid Prayer Guide': {
    title: 'Bayram Namazı',
    subtitle: 'Cemaatle kılınan namaza hazırlık',
    introduction: 'Bayram; zikir, şükür, cemaatle namaz ve cömertlikle belirginleşir.',
    steps: [
      'Gusül abdesti alın ve temiz giysiler giyin.',
      "Ramazan Bayramı'nda çıkmadan önce bir şey yiyin; Kurban Bayramı'nda yerel uygulama farklı olabilir.",
      'Yolda tekbir getirin.',
      'İki rekâtlık namaz ve ek tekbirlerde imama uyun.',
      'Hutbeyi dinleyin ve vakur biçimde ayrılın.',
    ],
  },
  'Istikhara Guide': {
    title: 'İstihare',
    subtitle: "Bir kararda Allah'tan yol göstermesini isteyin",
    introduction: 'İstihare, iki nafile rekât ile en hayırlısı için yapılan nebevî duayı birleştirir.',
    steps: [
      'Helal seçenekleri değerlendirin ve sağlam bir görüş alın.',
      'İki nafile rekât namaz kılın.',
      'Konuyu anarak bildirilen istihare duasını okuyun.',
      'Güvenerek yola devam edin; rüya gerekli değildir.',
      "Allah'ın işi kolaylaştırmasına veya çevirmesine açık kalın.",
    ],
  },
  'Taraweeh Guide': {
    title: 'Teravih Namazı',
    subtitle: "Ramazan'da gece namazı",
    introduction: "Ramazan gece namazı, yatsıdan sonra kılınan nafile bir ibadettir.",
    steps: [
      'Yatsıdan sonra tek başınıza veya cemaatle kılın.',
      'İkişer rekât hâlinde kılın.',
      'Acele değil, dikkatle tilavet edin.',
      'Gerektiğinde dinlenin ve yoğunlaşmanızı koruyun.',
      'Kendi uygulamanıza göre vitirle bitirin.',
    ],
  },
  Shahada: {
    title: 'Şehadet',
    subtitle: 'İmanın ikrarı',
    introduction: "Allah'tan başka ibadete layık hiçbir ilah olmadığına, ve Muhammed ﷺ'in Allah'ın elçisi olduğuna şehadet ederim.",
    steps: [
      'Kelime-i şehadetin anlamını kavrayın.',
      'İçtenlikle ve isteyerek onu ikrar edin.',
      "İslam'a resmen girmek için destek ve öğrenim üzere güvendiğiniz yerel bir camiye bağlanın.",
    ],
  },
  'Ramadan Guide': {
    title: 'Ramazan Rehberi',
    subtitle: "Oruç ve Kur'an ayı",
    introduction: "Ramazan'ın merkezinde oruç, namaz, Kur'an, sadaka, tövbe ve güzel ahlak vardır.",
    steps: [
      'Gerçekçi bir ibadet planı yapın.',
      'Orucu gerçek tan yerinden gün batımına kadar tutun.',
      'Yeme içme kadar sözünüzü ve davranışınızı da koruyun.',
      'Sahur, namazlar ve iftarı dayanak noktanız yapın.',
      "Kur'an, dua, sadaka ve hizmeti artırın.",
      "Kadir Gecesi'ni son on gecede arayın.",
    ],
  },
  'Fasting Guide': {
    title: 'Oruç Rehberi',
    subtitle: 'Temel oruç rehberliği',
    introduction: 'Geçerli bir oruç, içten bir niyet ve oruç günü boyunca bozan şeylerden sakınmayı gerektirir.',
    steps: [
      'Orucun farz mı nafile mi olduğunu bilin.',
      'Gereken niyeti kendi vaktinden önce yapın.',
      'Sahur yapın ve gerçek tan yerinde durun.',
      'Gün batımına kadar yeme, içme, cinsel ilişki ve kasten bozan şeylerden sakının.',
      'Gün batımında vakit geçirmeden orucunuzu açın.',
      'Hastalık, yolculuk, hamilelik, ilaç veya kronik durumlar için yetkin görüş alın.',
    ],
    note: 'Sağlık durumları değişir. Gerektiğinde hem yetkin bir âlime hem de bir hekime danışın.',
  },
  'Laylatul Qadr': {
    title: 'Kadir Gecesi',
    subtitle: "Kadir Gecesi'ni arayın",
    introduction: "Kadir Gecesi bin aydan hayırlıdır ve Ramazan'ın son gecelerinde aranır.",
    steps: [
      'Son on gecede gece namazını artırın.',
      "Kur'an okuyun ve üzerinde düşünün.",
      'Bolca dua edin ve zikredin.',
      'Sadaka verin ve insanlarla barışın.',
      'Belli bir gece hakkında kesin bir iddiada bulunmaktan kaçının.',
    ],
  },
  'Zakat al-Fitr': {
    title: 'Fıtır Sadakası',
    subtitle: 'Bayram namazından önce verilen sadaka',
    introduction: "Fıtır sadakası, Ramazan'ın sonunda gücü yeten Müslümanlara vaciptir ve bayram namazından önce muhtaçlara ulaşmalıdır.",
    steps: [
      'Kendiniz ve bakmakla yükümlü olduklarınız için sorumluluğunuzu belirleyin.',
      'Güvendiğiniz yerel âlimlerin uyguladığı, yörede kabul gören temel gıda ölçüsünü veya nakit görüşünü kullanın.',
      'Hak sahiplerini belirleyin.',
      'Bayram namazından önce onlara ulaşacak kadar erken verin.',
      'İsterseniz kendinize özel bir kayıt tutun.',
    ],
    note: 'Miktar ve nakdin kabul edilip edilmeyeceği, görüşe ve yöreye göre değişir.',
  },
};

/** The citation forms used in the guide references: "Qur’an 5:6", "Sahih al-Bukhari 164". */
export function turkishReference(label: string): string {
  return label
    .replace('Qur’an', "Kur'an")
    .replace('Sahih al-Bukhari', 'Sahih el-Buhârî')
    .replace('Sahih Muslim', 'Sahih Müslim');
}
