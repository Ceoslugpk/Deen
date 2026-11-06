/**
 * The worship guides in Azerbaijani.
 *
 * The English guides in `worshipGuides.ts` stay the source of truth: they carry
 * the ids, the reference links and the order. This file holds only the
 * Azerbaijani wording, so a guide that has not been written here yet simply
 * reads in English rather than showing an empty screen.
 *
 * The register is the one an Azerbaijani Muslim prays in, and it is the
 * terminology of the Alikhan Musayev edition the reader is given
 * (`tr_az_alikhan_musayev`): namaz for the prayer, dəstəmaz for the washing and
 * qüsl for the full one, rüku, səcdə and təşəhhüd for its parts, cənazə namazı
 * for the funeral prayer, təravih for the Ramadan night prayer, istixarə,
 * səhur and iftar, and fitrə for the Eid charity. The testimony is Shahada —
 * the word the copy table uses elsewhere, so the guides and the rest of the
 * interface agree. Witr, Dua, Zakat and Dhikr stay in the form the Azerbaijani
 * editions carry them, and the prayer is the five the prayer-time screens name:
 * Sübh, Zöhr, Əsr, Məğrib and İşa.
 *
 * The Prophet ﷺ is never named without the blessing.
 *
 * Azerbaijani is written left-to-right, so these guides are only reachable
 * through a language code: the old `rtl` boolean could never have found them.
 *
 * Arabic numerals are kept, as the rest of the Azerbaijani interface keeps them
 * — no digit conversion belongs here.
 */

export type WorshipGuideAz = {
  title: string;
  subtitle: string;
  introduction: string;
  steps: string[];
  note?: string;
};

export const WORSHIP_GUIDES_AZ: Record<string, WorshipGuideAz> = {
  'Wudu Guide': {
    title: 'Dəstəmaz bələdçisi',
    subtitle: 'Namaza diqqətlə hazırlaşın',
    introduction: 'Quranın əmrinə və Peyğəmbərin ﷺ nəql edilən əməlinə əsaslanan qısa ardıcıllıq.',
    steps: [
      'Niyyətlə başlayın və Bismillah deyin.',
      'Hər iki əli yuyun.',
      'Ağzı və burnu yaxalayın.',
      'Üzü yuyun.',
      'Sağdan başlayaraq qolları dirsəyə qədər yuyun.',
      'Başa və qulaqlara məsh çəkin.',
      'Sağdan başlayaraq ayaqları topuğa qədər yuyun.',
    ],
    note: 'Su tələb olunan yerlərə çatmalıdır. Gips, yaralar, ayaqqabı üzərindən məsh və ya davamlı şübhə üçün ixtisaslı alimə müraciət edin.'
  },
  'Salah Guide': {
    title: 'Namaz bələdçisi',
    subtitle: 'Namazın aydın icmalı',
    introduction: 'Fiqh məktəbinizin təfərrüatlı hökmlərini öyrənməzdən əvvəl əsas ardıcıllığı öyrənin.',
    steps: [
      'Niyyətlə qibləyə üz tutun.',
      'Açılış təkbiri ilə başlayın.',
      'Ayağa qalxın və təyin edildiyi yerdə Fatihəni və əlavə Quran oxuyun.',
      'Sakitliklə rüku edin.',
      'Qalxın və düz dayanın.',
      'Oturaraq fasilə ilə iki səcdə edin.',
      'Vacib rükətləri, təşəhhüdü və salavatı tamamlayın.',
      'Sağa və sola salamla bitirin.',
    ],
    note: 'Bu icmal namazı birbaşa ixtisaslı müəllimdən öyrənməyi əvəz etmir.'
  },
  'Janazah Guide': {
    title: 'Cənazə bələdçisi',
    subtitle: 'Cənazə namazı bir baxışda',
    introduction: 'Cənazə namazı kifayə fərzidir və rükü və səcdə olmadan ayaq üstə qılınır.',
    steps: [
      'Niyyət edin və qibləyə üz tutun.',
      'Birinci təkbirdən sonra Fatihəni oxuyun.',
      'İkincidən sonra Peyğəmbərə ﷺ salavat gətirin.',
      'Üçüncüdən sonra mərhum üçün səmimi dua edin.',
      'Dördüncüdən sonra qısa fasilə verin və salamla bitirin.',
    ],
    note: 'Təfərrüatlar hüquq məktəbləri arasında fərqlənir; imama tabe olun və yerli alim rəhbərliyi axtarın.'
  },
  'Eid Prayer Guide': {
    title: 'Bayram namazı bələdçisi',
    subtitle: 'Camaat namazına hazırlaşın',
    introduction: 'Bayram zikr, şükür, camaat namazı və səxavətlə qeyd edilir.',
    steps: [
      'Qüsl alın və təmiz paltar geyin.',
      'Ramazan bayramında çıxmazdan əvvəl yeyin; Qurban bayramında yerli adət fərqlənə bilər.',
      'Yolda təkbir gətirin.',
      'İki rükətli namaz və əlavə təkbirlər üçün imama tabe olun.',
      'Xütbəni dinləyin və hörmətlə ayrılın.',
    ],
  },
  'Istikhara Guide': {
    title: 'İstixarə bələdçisi',
    subtitle: 'Qərarda Allahın rəhbərliyini axtarın',
    introduction: 'İstixarə iki könüllü rükəti ən xeyirli olan üçün Peyğəmbər duası ilə birləşdirir.',
    steps: [
      'Halal variantları nəzərdən keçirin və düzgün məsləhət alın.',
      'İki könüllü rükət namaz qılın.',
      'Məsələni qeyd edərək istixarə duasını oxuyun.',
      'Etimadla davam edin; yuxu tələb olunmur.',
      'Allahın işi asanlaşdırmasına və ya çevirməsinə açıq qalın.',
    ],
  },
  'Taraweeh Guide': {
    title: 'Təravih bələdçisi',
    subtitle: 'Ramazanda gecə namazı',
    introduction: 'Ramazan gecə namazı işadan sonra qılınan könüllü ibadətdir.',
    steps: [
      'İşadan sonra tək və ya camaatla namaz qılın.',
      'İki rükətlik qruplarla namaz qılın.',
      'Tələsmədən, diqqətlə oxuyun.',
      'Lazım olduqda dincəlin və diqqəti qoruyun.',
      'Öz əməlinizə uyğun olaraq Vitr namazı ilə bitirin.',
    ],
  },
  Shahada: {
    title: 'Şəhadət',
    subtitle: 'Şəhadət kəlməsi',
    introduction: 'Şəhadət verirəm ki, Allahdan başqa ibadətə layiq heç bir tanrı yoxdur və şəhadət verirəm ki, Məhəmməd Allahın Rəsuludur.',
    steps: [
      'Şəhadətin mənasını anlayın.',
      'Bunu səmimi və könüllü təsdiq edin.',
      'Rəsmi şəkildə İslamı qəbul etmək üçün dəstək və öyrənmə üçün etibarlı yerli məscidlə əlaqə saxlayın.',
    ],
  },
  'Ramadan Guide': {
    title: 'Ramazan bələdçisi',
    subtitle: 'Oruc və Quran ayı',
    introduction: 'Ramazan oruc, namaz, Quran, sədəqə, tövbə və gözəl əxlaq üzərində qurulur.',
    steps: [
      'Real ibadət planı qurun.',
      'Həqiqi dan yerindən gün batana qədər oruc tutun.',
      'Yemək və içki ilə yanaşı nitqinizi və davranışınızı da qoruyun.',
      'Səhuru, namazları və iftarı dayaq kimi istifadə edin.',
      'Quranı, duanı, sədəqəni və xidməti artırın.',
      'Qədr gecəsini son on gecədə axtarın.',
    ],
  },
  'Fasting Guide': {
    title: 'Oruc bələdçisi',
    subtitle: 'Əsas oruc rəhbərliyi',
    introduction: 'Düzgün oruc səmimi niyyət və oruc günü pozuculardan çəkinmək tələb edir.',
    steps: [
      'Orucun vacib və ya könüllü olduğunu bilin.',
      'Vaxtı çatmamış tələb olunan niyyəti edin.',
      'Səhur edin və həqiqi dan yeri söküləndə dayanın.',
      'Gün batana qədər yemək, içmək, ailə münasibətləri və qəsdən pozuculardan çəkinin.',
      'Gün batanda orucu tez açın.',
      'Xəstəlik, səfər, hamiləlik, dərman və ya xroniki vəziyyətlər üçün ixtisaslı məsləhət alın.',
    ],
    note: 'Sağlamlıq vəziyyətləri fərqlənir. Lazım olduqda həm ixtisaslı alim, həm də həkimlə məsləhətləşin.'
  },
  'Laylatul Qadr': {
    title: 'Qədr gecəsi',
    subtitle: 'Qədr gecəsini axtarın',
    introduction: 'Qədr gecəsi min aydan xeyirlidir və Ramazanın son gecələrində axtarılır.',
    steps: [
      'Son on gecədə gecə namazını artırın.',
      'Quranı oxuyun və düşünün.',
      'Çoxlu dua və zikr edin.',
      'Sədəqə verin və başqaları ilə barışın.',
      'Müəyyən bir gecə haqqında dəqiqlik iddia etməyin.',
    ],
  },
  'Zakat al-Fitr': {
    title: 'Fitrə zəkatı',
    subtitle: 'Bayram namazından əvvəl sədəqə',
    introduction: 'Fitrə zəkatı Ramazanın sonunda imkanı olan müsəlmanlara vacibdir və bayram namazından əvvəl alıcılara çatmalıdır.',
    steps: [
      'Özünüz və himayənizdəkilər üçün məsuliyyəti təsdiq edin.',
      'Etibarlı yerli alimlərin izlədiyi yerli qəbul edilmiş əsas qida ölçüsü və ya pul baxışından istifadadə edin.',
      'Uyğun alıcıları müəyyən edin.',
      'Bayram namazına qədər onlara çatması üçün vaxtında verin.',
      'Faydalıdırsa, şəxsi lokal qeyd saxlayın.',
    ],
    note: 'Məbləğ və nağd pulun qəbul edilib-edilməməsi alim baxışına və yerə görə fərqlənir.'
  },
};

/**
 * Reference labels in Azerbaijani.
 *
 * The numbers are left as they are: Azerbaijani is written in Arabic numerals
 * throughout this app, so a reference reads "Quran 5:6" and not some other
 * digits. Only the words before the number change.
 */
export function azerbaijaniReference(label: string): string {
  return label
    .replace('Qur’an', 'Quran')
    .replace('Sahih al-Bukhari', 'Səhih əl-Buxari')
    .replace('Sahih Muslim', 'Səhih Müslim');
}
