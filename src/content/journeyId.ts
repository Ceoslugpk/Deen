/**
 * The Umrah and Hajj journeys in Indonesian.
 *
 * The English steps in `journeyService.ts` stay the source of truth: they carry
 * the ids, the counter maxima and the order. This file holds only the
 * Indonesian wording, reached through a language code rather than an `rtl`
 * flag — a boolean cannot tell Arabic, Urdu, Persian and Indonesian apart and
 * hands whichever table it happens to reach first to all of them.
 *
 * Register note. The rites keep their Arabic names — ihram, tawaf, sa'i,
 * talbiyah, wukuf, jumrah — because those are the words an Indonesian
 * pilgrim says and hears, and because the Indonesian Hajj literature uses
 * them without glossing. Where a step describes what breaks the state of
 * ihram or what expiates it, the text says the schools differ and sends the
 * reader to a scholar, exactly as the English does.
 *
 * The quoted Arabic of the talbiyah is left in Arabic. It is recited in
 * Arabic; an Indonesian paraphrase beside it would be a translation of a
 * worship, not the worship.
 */

export type JourneyStepId = { title: string; short: string; detail: string; counterLabel?: string };

export const JOURNEY_META_ID: Record<string, { intro: string }> = {
  umrah: {
    intro:
      'Umrah, ibadah haji kecil: ihram, tawaf, sa’i, lalu mencukur atau memotong rambut. Dapat dikerjakan kapan saja sepanjang tahun.',
  },
  hajj: {
    intro:
      'Haji, ibadah haji besar, pada tanggal 8 sampai 13 Zulhijah, dengan wukuf di Arafah sebagai pusatnya.',
  },
};

export const JOURNEY_STEPS_ID: Record<string, JourneyStepId> = {
  prepare: {
    title: 'Bersiap dan berniat',
    short: 'Kenakan ihram sebelum melewati miqat',
    detail:
      'Potong kuku dan rambut, mandi, lalu kenakan pakaian ihram sebelum melewati miqat yang sesuai arah perjalanan Anda. Kemudian niatkan umrah di dalam hati dan mulailah talbiyah. Setelah berihram, jangan memotong rambut atau kuku, memakai pakaian berjahit atau wewangian (bagi laki-laki), berburu, atau melangsungkan akad nikah — perincian tentang apa yang membatalkan ihram dan apa kafaratnya berbeda antarmazhab, jadi pastikan keadaan Anda sendiri dengan ulama yang Anda percaya.',
  },
  talbiyah: {
    title: 'Talbiyah',
    short: 'Terus ulangi sampai Anda tiba di tanah haram',
    detail:
      '«Labbayka Allāhumma labbayk, labbayka lā sharīka laka labbayk, inna al-ḥamda wa an-ni‘mata laka wa al-mulk, lā sharīka lak.» Laki-laki mengucapkannya dengan suara keras; perempuan mengucapkannya pelan. Teruskan sampai Anda memulai tawaf.',
  },
  tawaf: {
    title: 'Tawaf mengelilingi Kabah',
    short: 'Tujuh putaran, dimulai dari Hajar Aswad',
    detail:
      'Masuklah dari Hajar Aswad dengan niat memulai, lalu kelilingi Kabah tujuh kali dengan Kabah berada di sebelah kiri Anda. Sentuh atau isyaratkan ke Hajar Aswad setiap kali melewatinya, dan bacalah dzikir atau Al-Quran yang mudah bagi Anda — tidak ada doa tertentu yang ditetapkan untuk setiap putaran. Laki-laki berjalan cepat pada tiga putaran pertama. Setelah selesai, salat dua rakaat di belakang Maqam Ibrahim bila memungkinkan, lalu minumlah air zamzam.',
    counterLabel: 'putaran',
  },
  sai: {
    title: 'Sa’i antara Safa dan Marwah',
    short: 'Tujuh kali bolak-balik antara dua bukit itu',
    detail:
      'Berjalanlah dari Safa ke Marwah — itu satu kali — lalu kembali, tujuh kali seluruhnya, dan berakhir di Marwah. Sa’i adalah manasik yang berdiri sendiri dan tidak diringkas. Berjalanlah sesuai kemampuan Anda; hanya bagian di antara dua tanda hijau yang dilakukan dengan berlari kecil.',
    counterLabel: 'kali',
  },
  halq: {
    title: 'Mencukur atau memotong rambut',
    short: 'Langkah yang melepaskan Anda dari ihram',
    detail:
      'Laki-laki mencukur gundul atau memotong rambut secara merata; mencukur gundul lebih utama. Perempuan memotong sepanjang ujung jari dari ujung rambut. Dengan ini umrah pun selesai dan segala yang dilarang ihram kembali halal bagi Anda.',
  },
  closing: {
    title: 'Berdzikir, dan tutup perjalanan ini',
    short: 'Salat dua rakaat dan bersyukur',
    detail:
      'Salatlah di mana pun memungkinkan di tanah haram, bersedekah bila Anda mampu, dan jaga doa yang dipanjatkan setelah sebuah manasik selesai. Banyak orang kemudian mengulang umrah dari Tan’im atau mengerjakannya lagi untuk orang lain — itu terserah niat dan kemampuan Anda sendiri.',
  },
  intention: {
    title: 'Pilih jenis haji Anda',
    short: 'Tamatu’, Qiran, atau Ifrad',
    detail:
      'Tamatu’: berihram untuk umrah, selesaikan, lepaskan ihram, lalu berihram lagi untuk haji pada tanggal 8; jenis ini membawa kewajiban hewan kurban. Qiran: menggabung umrah dan haji dalam satu ihram. Ifrad: berihram untuk haji saja dan tetap berihram sampai selesai. Mana yang lebih utama, dan apa yang diwajibkan masing-masing, bergantung pada keadaan dan mazhab Anda — putuskan dengan ilmu sebelum Anda berangkat.',
  },
  ihram: {
    title: 'Masuk ihram',
    short: 'Mandi, berpakaian, berniat, dan mulailah talbiyah',
    detail:
      'Mandilah dan kenakan pakaian ihram, lalu niatkan manasik yang Anda pilih dan mulailah talbiyah. Larangan-larangan ihram sekarang berlaku sampai Anda melempar jumrah, berkurban, dan mencukur atau memotong rambut.',
  },
  qudum: {
    title: 'Tawaf qudum dan sa’i',
    short: 'Tawaf al-Qudum, lalu sa’i bagi yang Tamatu’',
    detail:
      'Setibanya di Makkah, kerjakan tawaf qudum tujuh putaran lalu salat dua rakaat. Bagi Tamatu’, lanjutkan dengan sa’i haji (atau tunda sa’i sampai setelah tawaf ifadah — keduanya dipandang sah oleh mazhab yang berbeda). Anda kemudian tetap berihram.',
    counterLabel: 'putaran',
  },
  tarwiyah: {
    title: '8 Zulhijah — Mina',
    short: 'Hari Tarwiyah, dihabiskan di Mina',
    detail:
      'Berihramlah untuk haji jika sebelumnya Anda telah melepaskannya, lalu berangkat ke Mina, salat Zuhur, Asar, Magrib, Isya, dan Subuh di sana, masing-masing diringkas menjadi dua rakaat tetapi tidak dijamak. Habiskan malam di Mina sebelum berangkat ke Arafah.',
  },
  arafah: {
    title: '9 Zulhijah — Arafah',
    short: 'Wukuf yang menjadi inti haji',
    detail:
      'Setelah matahari terbit, berangkatlah ke Arafah dan berwukuf di sana dari siang sampai matahari terbenam, dengan salat Zuhur dan Asar dijamak dan diringkas. Seluruh Arafah adalah tempat wukuf, meski batu di Jabal ar-Rahmah menjadi tempat orang berkumpul. Penuhilah hari itu dengan talbiyah, dzikir, Al-Quran, taubat, dan doa — pada hari inilah haji itu bergantung.',
  },
  muzdalifah: {
    title: 'Malam di Muzdalifah',
    short: 'Berangkat setelah matahari terbenam, salat, dan kumpulkan kerikil',
    detail:
      'Tinggalkan Arafah setelah matahari terbenam — sebelum fajar — lalu pergi ke Muzdalifah, tempat Anda salat Magrib dan Isya dijamak dan menghabiskan malam. Kumpulkan kerikil untuk melempar di sini, lalu berangkat ke Mina sebelum atau sekitar fajar.',
  },
  aqaba: {
    title: '10 Zulhijah — Melempar jumrah besar',
    short: 'Tujuh kerikil di Jumrat al-Aqabah',
    detail:
      'Di Mina, lemparkan tujuh kerikil ke jumrah besar (al-Aqabah, yang paling dekat dengan Makkah) sambil mengucapkan «Allāhu akbar» pada setiap lemparan. Dengan lemparan ini berlakulah tahallul besar dari ihram.',
    counterLabel: 'kerikil',
  },
  hady: {
    title: '10 Zulhijah — Berkurban dan mencukur',
    short: 'Hewan kurban, lalu mencukur atau memotong',
    detail:
      'Sembelih hewan kurban yang diwajibkan bagi Tamatu’ dan Qiran — dewasa ini kebanyakan jamaah menunjuk wakil yang resmi, dan itu diterima. Kemudian cukurlah gundul atau potong rambut; perempuan memotong sepanjang ujung jari. Dengan selesainya melempar, berkurban, dan mencukur, segala yang dilarang ihram menjadi halal kembali kecuali hubungan dengan istri.',
  },
  ifadah: {
    title: '10 sampai 12 Zulhijah — Tawaf ifadah',
    short: 'Rukun haji, dan sa’i bila masih terhutang',
    detail:
      'Kembalilah ke Makkah untuk tawaf ifadah, tujuh putaran, diikuti sa’i jika Anda belum mengerjakannya untuk haji ini. Tawaf inilah rukun yang menentukan: haji tidak sah tanpanya.',
    counterLabel: 'putaran',
  },
  tashreeq: {
    title: '11 sampai 13 Zulhijah — hari-hari Tasyrik',
    short: 'Tiga jumrah setiap siang, lalu kembali ke Mina',
    detail:
      'Setiap siang setelah zawal, lemparkan ketiga jumrah secara berurutan — yang kecil, lalu yang tengah, lalu yang besar — masing-masing tujuh kerikil, sambil mengucapkan «Allāhu akbar» pada setiap lemparan. Habiskan malam-malam ini di Mina. Siapa yang berangkat setelah tanggal 12, setelah melempar pada hari itu, ia melakukannya tanpa dosa; dan siapa yang tinggal sampai tanggal 13, ia pun melakukannya tanpa dosa.',
    counterLabel: 'kerikil',
  },
  wada: {
    title: 'Tawaf wada',
    short: 'Tawaf al-Wada’ sebelum meninggalkan Makkah',
    detail:
      'Sebelum pulang, kerjakan tujuh putaran sebagai tawaf wada, lalu salat dua rakaat dan berangkat. Inilah manasik terakhir haji bagi siapa pun yang meninggalkan Makkah.',
    counterLabel: 'putaran',
  },
};
