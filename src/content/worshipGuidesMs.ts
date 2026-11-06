/**
 * The worship guides in Malay.
 *
 * The English guides in `worshipGuides.ts` stay the source of truth: they carry
 * the ids, the reference links and the order. This file holds only the Malay
 * wording, so a guide that has not been written here yet simply reads in
 * English rather than showing an empty screen.
 *
 * The register is the one a Malaysian Muslim prays in: wuduk for the washing,
 * solat for the prayer, rukuk and sujud and tahiyat for its parts, solat
 * jenazah for the funeral prayer, tarawih for the Ramadan night prayer,
 * istikharah, sahur and berbuka, zakat fitrah for the Eid charity. Sentences
 * end with a full stop, as Malay does, and the Prophet ﷺ is never named
 * without the blessing.
 *
 * Malay sits close to Indonesian and the two are often treated as one language
 * written twice. They are not, and these are not the Indonesian wordings:
 * mandi wajib rather than the Indonesian mandi besar where the two part
 * company, and the vocabulary a Malaysian actually says throughout.
 */

export type WorshipGuideMs = {
  title: string;
  subtitle: string;
  introduction: string;
  steps: string[];
  note?: string;
};

export const WORSHIP_GUIDES_MS: Record<string, WorshipGuideMs> = {
  'Wudu Guide': {
    title: 'Panduan Wuduk',
    subtitle: 'Bersedia untuk solat dengan teliti',
    introduction: 'Satu urutan ringkas berdasarkan perintah Al-Quran dan amalan yang diriwayatkan daripada Nabi ﷺ.',
    steps: [
      'Mulakan dengan niat dan ucapkan Bismillah.',
      'Basuh kedua-dua tangan.',
      'Berkumur dan basuh hidung.',
      'Basuh muka.',
      'Basuh kedua-dua tangan hingga siku, bermula dengan yang kanan.',
      'Sapu kepala dan kedua-dua telinga.',
      'Basuh kedua-dua kaki hingga buku lali, bermula dengan yang kanan.',
    ],
    note: 'Air mesti sampai ke tempat yang diwajibkan. Rujuk sarjana yang berkelayakan bagi simen tulang, luka, menyapu ke atas kasut, atau keraguan yang berterusan.'
  },
  'Salah Guide': {
    title: 'Panduan Solat',
    subtitle: 'Gambaran jelas tentang solat',
    introduction: 'Pelajarilah urutan utamanya sebelum mengkaji hukum terperinci mazhab anda.',
    steps: [
      'Bentukkan niat dan mengadap kiblat.',
      'Mulakan dengan takbiratul ihram.',
      'Berdiri dan bacalah Al-Fatihah serta ayat Al-Quran tambahan di tempat yang ditentukan.',
      'Rukuk dengan tenang.',
      'Bangkit dan berdiri tegak.',
      'Lakukan dua sujud dengan berhenti duduk di antaranya.',
      'Sempurnakan rakaat yang diwajibkan, tahiyat, dan selawat.',
      'Akhiri dengan salam ke kanan dan ke kiri.',
    ],
    note: 'Gambaran ini bukan ganti bagi mempelajari solat secara langsung daripada guru yang berkelayakan.'
  },
  'Janazah Guide': {
    title: 'Panduan Solat Jenazah',
    subtitle: 'Solat jenazah sepintas lalu',
    introduction: 'Solat Jenazah ialah kewajipan secara berjemaah dan dikerjakan secara berdiri, tanpa rukuk dan sujud.',
    steps: [
      'Bentukkan niat dan mengadap kiblat.',
      'Selepas takbir pertama, bacalah Al-Fatihah.',
      'Selepas takbir kedua, bacalah selawat ke atas Nabi ﷺ.',
      'Selepas takbir ketiga, berdoalah dengan ikhlas untuk si mati.',
      'Selepas takbir keempat, berhenti seketika dan akhiri dengan salam.',
    ],
    note: 'Butiran berbeza antara mazhab; ikutilah imam dan dapatkan panduan sarjana setempat.'
  },
  'Eid Prayer Guide': {
    title: 'Panduan Solat Aidilfitri',
    subtitle: 'Bersedia untuk solat berjemaah',
    introduction: 'Aidilfitri disambut dengan zikir, kesyukuran, solat berjemaah, dan kemurahan hati.',
    steps: [
      'Lakukan mandi wajib dan pakai pakaian yang bersih.',
      'Bagi Aidilfitri, makanlah sebelum keluar; bagi Aidiladha, amalan setempat mungkin berbeza.',
      'Bacalah takbir dalam perjalanan.',
      'Ikuti imam bagi solat dua rakaat dan takbir-takbir tambahan.',
      'Dengar khutbah dan beredar dengan tertib.',
    ]
  },
  'Istikhara Guide': {
    title: 'Panduan Istikharah',
    subtitle: 'Memohon petunjuk Allah dalam satu keputusan',
    introduction: 'Istikharah menggabungkan dua rakaat sunat dengan doa nabi memohon apa yang terbaik.',
    steps: [
      'Pertimbangkan pilihan yang halal dan dapatkan nasihat yang kukuh.',
      'Solat dua rakaat yang tidak wajib.',
      'Bacalah doa istikharah yang diriwayatkan, dengan menyebut urusan tersebut.',
      'Teruskan dengan penuh tawakal; mimpi tidak diperlukan.',
      'Terus terbuka kepada bagaimana Allah memudahkan atau memalingkan urusan itu.',
    ]
  },
  'Taraweeh Guide': {
    title: 'Panduan Solat Tarawih',
    subtitle: 'Solat malam sepanjang Ramadan',
    introduction: 'Solat malam Ramadan ialah ibadat sunat yang dikerjakan selepas Isyak.',
    steps: [
      'Solat selepas Isyak, secara bersendirian atau berjemaah.',
      'Solat dalam set dua rakaat.',
      'Bacalah dengan penuh perhatian dan bukannya tergesa-gesa.',
      'Rehat apabila perlu dan kekalkan tumpuan.',
      'Akhiri dengan Witir mengikut amalan anda.',
    ]
  },
  'Shahada': {
    title: 'Syahadah',
    subtitle: 'Persaksian iman',
    introduction: 'Aku bersaksi bahawa tiada tuhan yang berhak disembah melainkan Allah, dan aku bersaksi bahawa Muhammad ialah utusan Allah.',
    steps: [
      'Fahami maksud persaksian itu.',
      'Ikrarkannya dengan ikhlas dan rela.',
      'Untuk memeluk Islam secara rasmi, hubungi masjid setempat yang dipercayai untuk sokongan dan pembelajaran.',
    ]
  },
  'Ramadan Guide': {
    title: 'Panduan Ramadan',
    subtitle: 'Sebulan berpuasa dan Al-Quran',
    introduction: 'Ramadan berpusatkan puasa, solat, Al-Quran, sedekah, taubat, dan akhlak yang baik.',
    steps: [
      'Tetapkan pelan ibadat yang realistik.',
      'Laksanakan puasa dari fajar sadiq hingga matahari terbenam.',
      'Jagalah pertuturan dan tingkah laku sama seperti makanan dan minuman.',
      'Gunakan sahur, solat, dan berbuka sebagai penanda waktu.',
      'Perbanyakkan Al-Quran, doa, sedekah, dan khidmat.',
      'Carilah Lailatulqadar pada sepuluh malam terakhir.',
    ]
  },
  'Fasting Guide': {
    title: 'Panduan Puasa',
    subtitle: 'Panduan puasa yang asas',
    introduction: 'Puasa yang sah memerlukan niat yang ikhlas dan menahan diri daripada perkara yang membatalkan sepanjang hari puasa.',
    steps: [
      'Ketahui sama ada puasa itu wajib atau sunat.',
      'Berniat yang diwajibkan sebelum waktu yang berkenaan.',
      'Bersahur dan berhenti sebelum fajar sadiq.',
      'Elakkan makan, minum, hubungan suami isteri, dan pembatal yang disengajakan sehingga matahari terbenam.',
      'Berbuka segera apabila matahari terbenam.',
      'Dapatkan nasihat yang berkelayakan bagi sakit, musafir, kehamilan, ubat-ubatan, atau keadaan kronik.',
    ],
    note: 'Keadaan kesihatan berbeza. Rujuk kedua-dua sarjana yang berkelayakan dan doktor apabila perlu.'
  },
  'Laylatul Qadr': {
    title: 'Lailatulqadar',
    subtitle: 'Carilah Malam al-Qadar',
    introduction: 'Malam al-Qadar lebih baik daripada seribu bulan dan dicari pada malam-malam terakhir Ramadan.',
    steps: [
      'Perbanyakkan solat malam pada sepuluh malam terakhir.',
      'Bacalah dan renungilah Al-Quran.',
      'Perbanyakkan doa dan zikir.',
      'Bersedekah dan berdamai dengan orang lain.',
      'Elakkan mendakwa kepastian tentang malam tertentu.',
    ]
  },
  'Zakat al-Fitr': {
    title: 'Zakat Fitrah',
    subtitle: 'Sedekah sebelum solat Aidilfitri',
    introduction: 'Zakat fitrah diwajibkan pada akhir Ramadan bagi Muslim yang layak dan hendaklah sampai kepada penerima sebelum solat Aidilfitri.',
    steps: [
      'Sahkan tanggungjawab terhadap diri sendiri dan tanggungan.',
      'Gunakan ukuran makanan asasi atau pandangan kewangan yang diterima secara setempat dan diikuti oleh sarjana setempat yang dipercayai.',
      'Kenal pasti penerima yang layak.',
      'Berilah cukup awal supaya sampai kepada mereka sebelum solat Aidilfitri.',
      'Simpan rekod setempat yang peribadi jika membantu.',
    ],
    note: 'Jumlahnya dan sama ada tunai diterima berbeza mengikut pandangan sarjana dan setempat.'
  },
};

/**
 * Reference labels in Malay.
 *
 * The reference itself — the surah and ayah, the hadith number — is data
 * rather than prose, so it is kept as it is. Only the name of the source is
 * Malay: Al-Quran, Sahih al-Bukhari, Sahih Muslim. Malay writes numerals in
 * Latin digits, so nothing here needs converting.
 */
export function malayReference(label: string): string {
  return label
    .replace('Qur’an', 'Al-Quran')
    .replace('Sahih al-Bukhari', 'Sahih al-Bukhari')
    .replace('Sahih Muslim', 'Sahih Muslim');
}
