/**
 * The Umrah and Hajj journey in Turkish.
 *
 * Keyed by the step id, which is the same in every language, so a step that has
 * not been written here yet reads in English rather than showing nothing.
 *
 * Reached through a language code, never through an `rtl` flag. Turkish is
 * written left-to-right, so the old boolean could not reach it at all and these
 * screens stayed in English.
 *
 * The wording follows Turkish pilgrimage usage (ihram, tavaf, sa‘y, şavt, remel,
 * vakfe, cemre) rather than a calque from English. Where the schools of law
 * differ - on what breaks ihram, on whether the sa‘y of Hajj comes before or
 * after tavafü’l-ifâda - the text says so and sends the reader to someone
 * qualified, instead of quietly picking one ruling and presenting it as the
 * only one.
 */

export type JourneyStepTr = { title: string; short: string; detail: string; counterLabel?: string };

export const JOURNEY_META_TR: Record<string, { intro: string }> = {
  umrah: {
    intro:
      'Küçük hac: ihram, tavaf, sa‘y ve tıraş olma veya saç kısaltma. Yılın herhangi bir zamanında yapılabilir.',
  },
  hajj: {
    intro:
      'Büyük hac; Zilhicce’nin 8’inden 13’üne kadar, merkezinde Arafat vakfesi ile.',
  },
};

export const JOURNEY_STEPS_TR: Record<string, JourneyStepTr> = {
  prepare: {
    title: 'Hazırlık ve niyet',
    short: 'Mîkatı geçmeden ihrama girin',
    detail:
      'Yolculuk yönünüzdeki mîkatı geçmeden önce tırnakları ve saçı kısaltın, gusül  abdesti alın ve ihram elbiselerini giyin. Ardından kalbinizle umreye niyet edin ve telbiyeye başlayın. İhrama girdikten sonra saç ve tırnak kesmeyin, dikişli elbise giymeyin ve koku sürünmeyin (erkekler için), avlanmayın ve nikâh akdi yapmayın — ihramı bozan şeylerin ve keffâretinin ayrıntısı mezheplere göre değişir; bu yüzden kendi durumunuzu güvendiğiniz bir âlime danışarak netleştirin.',
  },
  talbiyah: {
    title: 'Telbiye',
    short: 'Harem’e varana dek tekrar edin',
    detail:
      '“Lebbeyk Allâhümme lebbeyk, lebbeyke lâ şerîke leke lebbeyk, inne’l-hamde ve’n-ni‘mete leke ve’l-mülk, lâ şerîke lek.” Erkekler bunu yüksek sesle, kadınlar sessizce söyler. Tavafa başlayana kadar devam edin.',
  },
  tawaf: {
    title: 'Kâbe’yi tavaf',
    short: 'Hacerülesved’den başlayan yedi şavt',
    detail:
      'Başlamaya niyet ederek Hacerülesved hizasından girin ve Kâbe’yi solunuza alarak yedi kez dolanın. Her Hacerülesved hizasından geçişinizde onu istilâm edin veya işaretle selamlayın ve size kolay gelen zikir ve Kur’an’dan okuyun — her şavt için belirlenmiş özel bir dua yoktur. Erkekler ilk üç şavtta remel yapar, yani hızlı yürür. Bitirdiğinizde, yapabilirseniz Makâm-ı İbrâhim’in arkasında iki rekât namaz kılın, sonra zemzem için.',
    counterLabel: 'şavt',
  },
  sai: {
    title: 'Safa ile Merve arasında sa‘y',
    short: 'İki tepe arasında yedi defa',
    detail:
      'Safa’dan Merve’ye yürüyün — bu bir defadır — sonra geri dönün; toplam yedi defa olur ve Merve’de biter. Sa‘y kendi başına bir rükündür ve kısaltılmaz. Kendi temponuzda, vakarla yürüyün; yalnızca iki yeşil işaret arasındaki bölümde hızlanılır.',
    counterLabel: 'defa',
  },
  halq: {
    title: 'Saçı tıraş etmek veya kısaltmak',
    short: 'İhramdan çıkaran adım',
    detail:
      'Erkekler başı tıraş eder veya saçın tamamını kısaltır; tıraş olmak daha faziletlidir. Kadınlar saçlarının ucundan bir parmak ucu kadar keser. Bununla umre tamamlanır ve ihramın haram kıldığı her şey yeniden helâl olur.',
  },
  closing: {
    title: 'Hatırla ve yolculuğu kapat',
    short: 'İki rekât kıl ve şükret',
    detail:
      'Harem’de yapabildiğiniz yerde namaz kılın, gücünüz yetiyorsa sadaka verin ve tamamlanmış bir rükün ardından yapılan duayı ihmal etmeyin. Pek çok kişi ardından Ten‘îm’den umre yapar veya bir başkası adına eda eder — bu, kendi niyetinize ve imkânınıza bağlıdır.',
  },
  intention: {
    title: 'Hac türünüzü seçin',
    short: 'Temettü‘, Kırân veya İfrâd',
    detail:
      'Temettü‘: umre için ihrama girin, onu tamamlayın, ihramdan çıkın, sonra 8’inde hac için yeniden ihrama girin; bu türde kurban kesmek gerekir. Kırân: umre ile haccı tek ihramda birleştirin. İfrâd: yalnız hac için ihrama girin ve süre boyunca ihramda kalın. Hangisinin daha faziletli olduğu ve her birinin ne gerektirdiği, durumunuza ve mezhebinize bağlıdır — yola çıkmadan önce bilerek karar verin.',
  },
  ihram: {
    title: 'İhrama gir',
    short: 'Gusül, giyinme, niyet ve telbiyeye başlama',
    detail:
      'Gusül  abdesti alın ve ihram elbiselerini giyin, ardından seçtiğiniz menâsike niyet edin ve telbiyeye başlayın. Şimdi ihram yasakları, şeytan taşlayıp kurban kesip tıraş olana veya saç kısaltana kadar devam eder.',
  },
  qudum: {
    title: 'Kudüm tavafı ve sa‘y',
    short: 'Tavafü’l-kudüm, ardından temettü‘ için sa‘y',
    detail:
      'Mekke’ye varınca yedi şavtlık kudüm tavafını yapın ve iki rekât namaz kılın. Temettü‘de bunu haccın sa‘yi takip eder (veya sa‘yi tavafü’l-ifâda sonrasına bırakırsınız — farklı mezhepler ikisini de geçerli sayar). Ardından ihramda kalırsınız.',
    counterLabel: 'şavt',
  },
  tarwiyah: {
    title: 'Zilhicce’nin 8’i — Mina',
    short: 'Terviye günü, Mina’da geçirilir',
    detail:
      'İhramdan çıkmışsanız hac için yeniden ihrama girin ve Mina’ya gidin; öğle, ikindi, akşam, yatsı ve sabah namazlarını orada kılın. Her biri iki rekâta kısaltılır (kasr) ama birleştirilmez (cem). Arafat’a geçmeden önce geceyi Mina’da geçirin.',
  },
  arafah: {
    title: 'Zilhicce’nin 9’u — Arafat',
    short: 'Haccın kendisi olan vakfe',
    detail:
      'Güneş doğduktan sonra Arafat’a gidin ve öğleden akşama kadar orada durun; öğle ile ikindiyi birleştirip kısaltarak kılın. Arafat’ın tamamı vakfe yeridir, ancak halk Cebelü’r-Rahme’deki kayanın yanında toplanır. Günü telbiye, zikir, Kur’an, tövbe ve dua ile doldurun — hac bu güne dayanır.',
  },
  muzdalifah: {
    title: 'Müzdelife gecesi',
    short: 'Akşamdan sonra çık, namaz kıl ve taş topla',
    detail:
      'Arafat’tan akşamdan sonra — tan yeri ağarmadan önce — çıkın ve Müzdelife’ye gidin; orada akşam ve yatsıyı birlikte kılın ve geceyi geçirin. Taşlama için gereken taşları burada toplayın, sonra tan yerinden önce veya o sıralarda Mina’ya doğru yola çıkın.',
  },
  aqaba: {
    title: '10’u — Büyük cemrenin taşlanması',
    short: 'Cemretü’l-Akabe’ye yedi taş',
    detail:
      'Mina’da büyük cemreyi (Mekke’ye en yakın olan Akabe) yedi taşla taşlayın ve her atışta “Allâhu ekber” deyin. Bu taşlamayla ihramdan büyük çıkış gerçekleşir.',
    counterLabel: 'taş',
  },
  hady: {
    title: '10’u — Kurban ve tıraş',
    short: 'Hedy, ardından tıraş veya kısaltma',
    detail:
      'Temettü‘ ve Kırân için gereken kurbanı kesin — bugün hacıların çoğu yetkili bir vekil tayin eder, bu kabul edilir. Ardından başı tıraş edin veya saçı kısaltın; kadınlar bir parmak ucu kadar keser. Taşlama, kurban ve tıraş tamamlandığında, eşle cinsel ilişki dışında ihramın haram kıldığı her şey helâl olur.',
  },
  ifadah: {
    title: '10’u–12’si — Tavafü’l-ifâda',
    short: 'Haccın rüknü ve varsa sa‘y borcu',
    detail:
      'Tavafü’l-ifâda için Mekke’ye dönün; yedi şavt, ardından haccın sa‘yini daha önce yapmadıysanız sa‘y edin. Bu tavaf temel rükündür: hac onsuz tamam olmaz.',
    counterLabel: 'şavt',
  },
  tashreeq: {
    title: '11’i–13’ü — Teşrîk günleri',
    short: 'Her ikindiden sonra üç cemre, ardından Mina',
    detail:
      'Öğleden sonraki her ikindi vaktinde üç cemreyi sırayla — önce küçük, sonra orta, ardından büyük — her birine yedi taş atarak taşlayın ve her atışta “Allâhu ekber” deyin. Bu geceleri Mina’da geçirin. O gün taşlamasını yapıp 12’sinden sonra ayrılan kimseye bir günah yoktur; 13’üne kadar kalan kimseye de bir günah yoktur.',
    counterLabel: 'taş',
  },
  wada: {
    title: 'Veda tavafı',
    short: 'Mekke’den ayrılmadan önce tavafü’l-vedâ‘',
    detail:
      'Memlekete dönmeden önce veda tavafı olarak yedi şavt yapın, ardından iki rekât namaz kılın ve ayrılın. Mekke’den ayrılan herkes için haccın son rüknü budur.',
    counterLabel: 'şavt',
  },
};
