/**
 * The worship guides in Indonesian.
 *
 * The English guides in `worshipGuides.ts` stay the source of truth: they carry
 * the ids, the reference links and the order. This file holds only the
 * Indonesian wording, so a guide that has not been written here yet simply
 * reads in English rather than showing an empty screen.
 *
 * Register note. Indonesian Muslim writing keeps the Arabic term wherever the
 * term is itself part of what a person says or does, so wudu stays wudu rather
 * than becoming a descriptive phrase, and rukuk, sujud, takbir, tasyahud and
 * salam all appear as themselves. This is not laziness: an Indonesian who
 * prays says these words, and rendering them into Sanskrit- or Dutch-derived
 * equivalents would move the text away from the thing it describes.
 *
 * Where a step names something that differs between the schools, the text says
 * so rather than picking one. Where it names a ruling, it names it as
 * something to confirm with a scholar, which is how the English puts it.
 */

export type WorshipGuideId = {
  title: string;
  subtitle: string;
  introduction: string;
  steps: string[];
  note?: string;
};

export const WORSHIP_GUIDES_ID: Record<string, WorshipGuideId> = {
  'Wudu Guide': {
    title: 'Panduan Wudu',
    subtitle: 'Bersiap untuk salat dengan saksama',
    introduction:
      'Urutan ringkas berdasarkan perintah Al-Quran dan praktik Nabi ﷺ yang diriwayatkan.',
    steps: [
      'Mulai dengan niat dan ucapkan bismillah.',
      'Cuci kedua tangan.',
      'Berkumur dan membersihkan hidung.',
      'Cuci wajah.',
      'Cuci kedua lengan sampai siku, dimulai dari yang kanan.',
      'Usap kepala dan kedua telinga.',
      'Cuci kedua kaki sampai mata kaki, dimulai dari yang kanan.',
    ],
    note:
      'Air harus sampai ke seluruh bagian yang diwajibkan. Untuk gips, luka, mengusap alas kaki, atau keraguan yang terus berulang, mintalah pendapat ulama yang berkompeten.',
  },
  'Salah Guide': {
    title: 'Panduan Salat',
    subtitle: 'Gambaran yang jelas tentang salat',
    introduction:
      'Pelajari urutan utamanya sebelum mendalami hukum terperinci dalam mazhab yang Anda ikuti.',
    steps: [
      'Menghadaplah ke kiblat dengan niat.',
      'Mulai dengan takbiratul ihram.',
      'Berdiri dan baca Al-Fatihah serta ayat Al-Quran yang dianjurkan.',
      'Rukuk dengan tenang.',
      'Bangkit dan berdiri tegak.',
      'Lakukan dua sujud dengan duduk sejenak di antaranya.',
      'Sempurnakan rakaat yang diwajibkan, tasyahud, dan selawat.',
      'Akhiri dengan salam ke kanan dan ke kiri.',
    ],
    note:
      'Gambaran umum ini tidak menggantikan belajar salat langsung dari guru yang berkompeten.',
  },
  'Janazah Guide': {
    title: 'Panduan Janazah',
    subtitle: 'Salat jenazah secara ringkas',
    introduction:
      'Salat jenazah adalah kewajiban kolektif dan dikerjakan dengan berdiri, tanpa rukuk dan tanpa sujud.',
    steps: [
      'Berniat dan menghadap kiblat.',
      'Setelah takbir pertama, baca Al-Fatihah.',
      'Setelah takbir kedua, berselawat kepada Nabi ﷺ.',
      'Setelah takbir ketiga, berdoalah dengan sungguh-sungguh untuk jenazah.',
      'Setelah takbir keempat, berhenti sejenak lalu akhiri dengan salam.',
    ],
    note:
      'Perinciannya berbeda antarmazhab; ikuti imam dan mintalah bimbingan ulama setempat.',
  },
  'Eid Prayer Guide': {
    title: 'Panduan Salat Id',
    subtitle: 'Bersiap untuk salat berjamaah',
    introduction:
      'Id ditandai dengan dzikir, rasa syukur, salat berjamaah, dan kedermawanan.',
    steps: [
      'Mandi wajib dan kenakan pakaian yang bersih.',
      'Untuk Idulfitri, makanlah sebelum berangkat; untuk Iduladha, praktik setempat dapat berbeda.',
      'Bacalah takbir di perjalanan.',
      'Ikuti imam untuk salat dua rakaat beserta takbir tambahannya.',
      'Dengarkan khotbah dan pulang dengan tertib.',
    ],
  },
  'Istikhara Guide': {
    title: 'Panduan Istikharah',
    subtitle: 'Memohon petunjuk Allah dalam sebuah keputusan',
    introduction:
      'Istikharah memadukan dua rakaat sunnah dengan doa Nabi ﷺ memohon yang terbaik.',
    steps: [
      'Pertimbangkan pilihan-pilihan yang halal dan mintalah nasihat yang benar.',
      'Salat dua rakaat yang tidak wajib.',
      'Baca doa istikharah yang diriwayatkan, sambil menyebut urusannya.',
      'Jalani dengan tawakal; mimpi bukanlah syarat.',
      'Terbukalah terhadap bagaimana Allah memudahkan atau memalingkan urusan itu.',
    ],
  },
  'Taraweeh Guide': {
    title: 'Panduan Tarawih',
    subtitle: 'Salat malam di bulan Ramadan',
    introduction:
      'Salat malam Ramadan adalah ibadah sunnah yang dikerjakan setelah Isya.',
    steps: [
      'Salatlah setelah Isya, sendiri atau berjamaah.',
      'Salatlah dalam satuan dua rakaat.',
      'Bacalah dengan penuh perhatian, bukan tergesa-gesa.',
      'Beristirahatlah bila perlu dan jagalah konsentrasi.',
      'Akhiri dengan Witir sesuai praktik Anda.',
    ],
  },
  Shahada: {
    title: 'Syahadat',
    subtitle: 'Kesaksian iman',
    introduction:
      'Aku bersaksi bahwa tidak ada yang berhak disembah selain Allah, dan aku bersaksi bahwa Muhammad adalah utusan Allah.',
    steps: [
      'Pahami makna kesaksian ini.',
      'Ikrarkan dengan sungguh-sungguh dan penuh kerelaan.',
      'Untuk masuk Islam secara resmi, hubungi masjid setempat yang tepercaya untuk mendapat pendampingan dan pembelajaran.',
    ],
  },
  'Ramadan Guide': {
    title: 'Panduan Ramadan',
    subtitle: 'Sebulan berpuasa dan bersama Al-Quran',
    introduction:
      'Ramadan berpusat pada puasa, salat, Al-Quran, sedekah, taubat, dan akhlak yang baik.',
    steps: [
      'Susun rencana ibadah yang realistis.',
      'Jalankan puasa dari fajar sejati sampai matahari terbenam.',
      'Jaga ucapan dan perbuatan, bukan hanya makan dan minum.',
      'Jadikan sahur, salat, dan berbuka sebagai penanda hari.',
      'Perbanyak Al-Quran, doa, sedekah, dan melayani sesama.',
      'Carilah Lailatulkadar pada sepuluh malam terakhir.',
    ],
  },
  'Fasting Guide': {
    title: 'Panduan Puasa',
    subtitle: 'Pedoman pokok berpuasa',
    introduction:
      'Puasa yang sah memerlukan niat yang sungguh-sungguh dan menahan diri dari hal-hal yang membatalkannya sepanjang hari puasa.',
    steps: [
      'Ketahui apakah puasa itu wajib atau sunnah.',
      'Lakukan niat yang diperlukan sebelum waktunya berakhir.',
      'Makan sahurlah dan berhenti sebelum fajar sejati.',
      'Tinggalkan makan, minum, hubungan suami istri, dan hal-hal yang membatalkan dengan sengaja sampai matahari terbenam.',
      'Berbukalah segera ketika matahari terbenam.',
      'Mintalah nasihat yang berkompeten untuk sakit, bepergian, kehamilan, pengobatan, atau kondisi kronis.',
    ],
    note:
      'Keadaan kesehatan berbeda-beda. Mintalah pendapat ulama yang berkompeten dan juga tenaga medis bila diperlukan.',
  },
  'Laylatul Qadr': {
    title: 'Lailatulkadar',
    subtitle: 'Carilah malam ketetapan itu',
    introduction:
      'Malam ketetapan itu lebih baik dari seribu bulan dan dicari pada malam-malam terakhir Ramadan.',
    steps: [
      'Perbanyak salat malam pada sepuluh malam terakhir.',
      'Baca dan renungkan Al-Quran.',
      'Perbanyak doa dan dzikir.',
      'Bersedekah dan berdamailah dengan orang lain.',
      'Jangan mengaku pasti tentang malam yang tertentu.',
    ],
  },
  'Zakat al-Fitr': {
    title: 'Zakat Fitrah',
    subtitle: 'Sedekah sebelum salat Id',
    introduction:
      'Zakat fitrah wajib pada akhir Ramadan bagi Muslim yang memenuhi syarat dan sebaiknya sampai kepada penerimanya sebelum salat Id.',
    steps: [
      'Pastikan tanggung jawab Anda dan orang yang Anda tanggung.',
      'Gunakan ukuran makanan pokok yang diterima setempat, atau pandangan nilai uang yang diikuti ulama setempat yang tepercaya.',
      'Kenali pihak yang berhak menerima.',
      'Berikan cukup awal agar sampai sebelum salat Id.',
      'Simpan catatan pribadi bila itu membantu.',
    ],
    note:
      'Besarnya dan apakah pembayaran dengan uang diterima berbeda menurut pandangan ulama dan daerah.',
  },
};

/**
 * The citation forms used in the guide references: "Qur'an 5:6",
 * "Sahih al-Bukhari 164".
 *
 * Only the container word is Indonesian — "Al-Quran" and the "Shahih" spelling
 * used by Indonesian editions — the citation itself is left alone, because a
 * reader looking up "Sahih al-Bukhari 164" needs the number unchanged and
 * does not need the Arabic transliterated twice.
 */
export function indonesianReference(label: string): string {
  return label
    .replace('Qur’an', 'Al-Quran')
    .replace('Sahih al-Bukhari', 'Shahih al-Bukhari')
    .replace('Sahih Muslim', 'Shahih Muslim');
}
