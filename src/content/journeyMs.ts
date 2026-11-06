/**
 * The Umrah and Hajj journey in Malay.
 *
 * Keyed by the step id, which is the same in every language, so a step that has
 * not been written here yet reads in English rather than showing nothing.
 *
 * Reached through a language code, never through an `rtl` flag. Malay is
 * written left-to-right, so the old boolean could not reach it at all and
 * these screens would have stayed in English.
 *
 * The wording follows the vocabulary a Malaysian pilgrim actually uses:
 * ihram, miqat, tawaf, sa‘i, pusingan, talbiah, jamrah, Arafah, Mina,
 * Muzdalifah, hadi, Tawaf Ifadah, hari-hari Tasyrik. Where the schools of law
 * differ — on what breaks ihram, on whether the sa‘i of Hajj comes before or
 * after Tawaf al-Ifādah — the text says so and sends the reader to someone
 * qualified, instead of quietly picking one ruling and presenting it as the
 * only one.
 *
 * The Prophet ﷺ is never named without the blessing.
 */

export type JourneyStepMs = { title: string; short: string; detail: string; counterLabel?: string };

export const JOURNEY_META_MS: Record<string, { intro: string }> = {
  umrah: {
    intro: 'Ibadat haji yang lebih kecil: Ihram, Tawaf, Sa‘i, dan bercukur atau memotong rambut. Ia boleh dikerjakan pada bila-bila masa dalam setahun.',
  },
  hajj: {
    intro: 'Haji yang lebih besar, pada 8 hingga 13 Zulhijjah, dengan wukuf di Arafah sebagai intinya.',
  },
};

export const JOURNEY_STEPS_MS: Record<string, JourneyStepMs> = {
  prepare: {
    title: 'Bersedia dan berniat',
    short: 'Ambillah ihram sebelum anda melintasi miqat',
    detail:
      'Potong kuku dan rambut, mandi, dan pakailah pakaian ihram sebelum melintasi miqat bagi arah perjalanan anda. Kemudian niatkan Umrah di dalam hati dan mulakan talbiah. Setelah berihram, jangan memotong rambut atau kuku, memakai pakaian berjahit atau wangian (bagi lelaki), berburu, atau mengikat akad nikah — butiran tentang apa yang membatalkan ihram dan apa fidyahnya berbeza antara mazhab, jadi sahkan keadaan anda sendiri dengan sarjana yang anda percayai.',
  },
  talbiyah: {
    title: 'Talbiah',
    short: 'Teruslah mengulanginya sehingga anda sampai ke Tanah Haram',
    detail:
      '“Labbayka Allāhumma labbayk, labbayka lā sharīka laka labbayk, inna al-ḥamda wa an-ni‘mata laka wa al-mulk, lā sharīka lak.” Lelaki melafazkannya dengan kuat; wanita melafazkannya secara perlahan. Teruskan sehingga anda memulakan Tawaf.',
  },
  tawaf: {
    title: 'Tawaf Kaabah',
    short: 'Tujuh pusingan, bermula di Hajarulaswad',
    detail:
      'Masuk di Hajarulaswad dengan niat untuk memulakan, dan lakukan tujuh pusingan mengelilingi Kaabah dengan Kaabah di sebelah kiri anda. Sentuh atau isyaratkan kepada Hajarulaswad setiap kali anda melaluinya, dan bacalah zikir atau Al-Quran yang mudah bagi anda — tiada doa tertentu yang ditetapkan bagi setiap pusingan. Lelaki berjalan cepat pada tiga pusingan yang pertama. Apabila anda selesai, solat dua rakaat di belakang Maqam Ibrahim jika anda mampu, kemudian minumlah air Zamzam.',
    counterLabel: 'Pusingan',
  },
  sai: {
    title: 'Sa‘i antara Safa dan Marwah',
    short: 'Tujuh pusingan antara dua bukit',
    detail:
      'Berjalan dari Safa ke Marwah — itu satu pusingan — dan kembali, tujuh pusingan kesemuanya, berakhir di Marwah. Sa‘i ialah ritusnya yang tersendiri dan tidak dipendekkan. Berjalanlah pada rentak anda sendiri; hanya bahagian antara dua penanda hijau yang dipercepatkan.',
    counterLabel: 'Pusingan',
  },
  halq: {
    title: 'Cukur atau potong rambut',
    short: 'Langkah yang melepaskan anda daripada ihram',
    detail:
      'Lelaki mencukur kepala atau memotong rambut seluruhnya; bercukur adalah lebih afdal. Wanita memotong sepanjang satu ruas jari daripada hujung rambut. Dengan ini, Umrah selesai dan segala yang dilarang oleh ihram menjadi halal semula.',
  },
  closing: {
    title: 'Berzikir, dan tutup perjalanan',
    short: 'Solat dua rakaat dan bersyukur',
    detail:
      'Solatlah di mana yang anda mampu di Tanah Haram, bersedekahlah jika anda berkemampuan, dan kekalkan doa yang dibaca selepas sesuatu ibadat selesai. Ramai kemudian mengulangi Umrah dari Al-Tan‘im atau melakukannya semula bagi orang lain — itu bergantung pada niat dan kemampuan anda sendiri.',
  },
  intention: {
    title: 'Pilih jenis Haji anda',
    short: 'Tamattuk, Qiran atau Ifrad',
    detail:
      'Tamattuk: masuk ihram bagi Umrah, selesaikannya, tinggalkan ihram, kemudian masuk ihram semula bagi Haji pada 8 haribulan; ia membawa seekor haiwan korban. Qiran: gabungkan Umrah dan Haji dalam satu ihram. Ifrad: masuk ihram bagi Haji sahaja dan kekal berihram sepanjangnya. Yang mana lebih afdal, dan apa yang diperlukan bagi setiap satunya, bergantung pada keadaan dan mazhab anda — putuskan dengan ilmu sebelum anda bertolak.',
  },
  ihram: {
    title: 'Masuk ihram',
    short: 'Mandi, berpakaian, berniat, dan mulakan talbiah',
    detail:
      'Mandi dan pakailah pakaian ihram, kemudian berniatlah bagi ibadat yang anda pilih dan mulakan talbiah. Larangan-larangan ihram kini berkuat kuasa sehingga anda melontar, menyembelih dan bercukur atau memotong rambut.',
  },
  qudum: {
    title: 'Tawaf Kedatangan dan Sa‘i',
    short: 'Tawaf Qudum, kemudian Sa‘i bagi Tamattuk',
    detail:
      'Setibanya di Makkah, lakukan Tawaf Qudum tujuh pusingan dan solat dua rakaat. Bagi Tamattuk, ikuti dengan Sa‘i Haji (atau tangguhkan Sa‘i sehingga selepas Tawaf Ifadah — kedua-duanya dianggap sah oleh mazhab yang berbeza). Anda kemudian kekal berihram.',
    counterLabel: 'Pusingan',
  },
  tarwiyah: {
    title: '8 Zulhijjah — Mina',
    short: 'Hari Tarwiyah, dihabiskan di Mina',
    detail:
      'Masuklah ihram bagi Haji jika anda telah meninggalkannya, dan pergilah ke Mina, dengan mengerjakan Zohor, Asar, Maghrib, Isyak dan Subuh di situ, setiap satunya dipendekkan kepada dua rakaat tetapi tidak dijamakkan. Bermalamlah di Mina sebelum berangkat ke Arafah.',
  },
  arafah: {
    title: '9 Zulhijjah — Arafah',
    short: 'Wukuf yang merupakan Haji',
    detail:
      'Pergilah ke Arafah selepas terbit matahari dan wukuf di situ dari tengah hari sehingga matahari terbenam, dengan mengerjakan Zohor dan Asar secara jamak dan qasar. Seluruh kawasan Arafah ialah tempat wukuf, walaupun orang ramai berkumpul berhampiran batu di Jabal al-Rahmah. Penuhilah hari itu dengan talbiah, zikir, Al-Quran, taubat dan doa — pada hari inilah Haji bergantung.',
  },
  muzdalifah: {
    title: 'Malam di Muzdalifah',
    short: 'Bertolak selepas matahari terbenam, solat, dan kumpulkan batu',
    detail:
      'Tinggalkan Arafah selepas matahari terbenam — sebelum fajar — dan pergilah ke Muzdalifah, di mana anda mengerjakan Maghrib dan Isyak secara jamak dan bermalam di situ. Kumpulkan batu kecil untuk melontar di sini, kemudian bertolak ke Mina sebelum atau sekitar fajar.',
  },
  aqaba: {
    title: '10 — Melontar jamrah besar',
    short: 'Tujuh biji batu di Jamratul Aqabah',
    detail:
      'Di Mina, lontarlah tiang besar (al-‘Aqabah, yang paling hampir dengan Makkah) dengan tujuh biji batu kecil, dengan mengucapkan “Allāhu akbar” pada setiap lontaran. Dengan lontaran ini berkuat kuasalah pelepasan besar daripada ihram.',
    counterLabel: 'Batu',
  },
  hady: {
    title: '10 — Penyembelihan dan bercukur',
    short: 'Hadi, kemudian cukur atau potong',
    detail:
      'Sembelihlah haiwan korban yang diwajibkan bagi Tamattuk dan Qiran — pada masa kini kebanyakan jemaah melantik wakil yang diluluskan, dan itu diterima. Kemudian cukurlah kepala atau potong rambut; wanita memotong sepanjang satu ruas jari. Setelah melontar, menyembelih dan bercukur, segala yang dilarang oleh ihram menjadi halal semula kecuali hubungan suami isteri.',
  },
  ifadah: {
    title: '10 hingga 12 — Tawaf Ifadah',
    short: 'Rukun Haji, dan Sa‘i jika ia masih berhutang',
    detail:
      'Kembalilah ke Makkah bagi Tawaf Ifadah, tujuh pusingan, diikuti Sa‘i jika anda belum melakukannya bagi Haji. Tawaf ini rukun yang utama: Haji tidak sah tanpanya.',
    counterLabel: 'Pusingan',
  },
  tashreeq: {
    title: '11 hingga 13 — hari-hari Tasyrik',
    short: 'Tiga tiang setiap petang, kemudian Mina',
    detail:
      'Selepas tengah hari, pada setiap petang lontarlah ketiga-tiga jamrah secara berturut-turut — yang kecil, kemudian yang pertengahan, kemudian yang besar — tujuh biji batu bagi setiap satu, dengan mengucapkan “Allāhu akbar” pada setiap lontaran. Habiskan malam-malam ini di Mina. Sesiapa yang beredar selepas melontar pada 12 haribulan melakukannya tanpa sebarang dosa; sesiapa yang kekal sehingga 13 haribulan juga melakukannya tanpa sebarang dosa.',
    counterLabel: 'Batu',
  },
  wada: {
    title: 'Tawaf Wada‘',
    short: 'Tawaf Wada‘ sebelum anda meninggalkan Makkah',
    detail:
      'Sebelum pulang, lakukan tujuh pusingan sebagai Tawaf Wada‘, kemudian solat dua rakaat dan beredar. Ia ritus terakhir Haji bagi sesiapa yang meninggalkan Makkah.',
    counterLabel: 'Pusingan',
  },
};
