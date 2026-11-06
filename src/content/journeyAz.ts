/**
 * The Umrah and Hajj journey in Azerbaijani.
 *
 * Keyed by the step id, which is the same in every language, so a step that has
 * not been written here yet reads in English rather than showing nothing.
 *
 * Reached through a language code, never through an `rtl` flag. Azerbaijani is
 * written left-to-right, so the old boolean could not reach it at all and
 * these screens would have stayed in English.
 *
 * The wording follows the vocabulary an Azerbaijani Muslim actually uses, in
 * Latin script with the full Azerbaijani alphabet: ihram, miqat, tavaf, səy,
 * dövrə (the circuit), təlbiyə, sütun (the pillar), Ərəfə, Mina, Müzdəlifə,
 * qurban (the sacrifice), İfada tavafı, Təşriq günləri. Where the schools of
 * law differ — on what breaks ihram, on whether the sa'i of Hajj comes before
 * or after Tawaf al-Ifadah — the text says so and sends the reader to someone
 * qualified, instead of quietly picking one ruling and presenting it as the
 * only one.
 *
 * The short lines are the same strings the rest of the interface uses, so the
 * wording a person reads on the journey screen is the wording they meet
 * everywhere else.
 *
 * The Prophet ﷺ is never named without the blessing.
 */

export type JourneyStepAz = { title: string; short: string; detail: string; counterLabel?: string };

export const JOURNEY_META_AZ: Record<string, { intro: string }> = {
  umrah: {
    intro: 'Kiçik həcc: İhram, tavaf, səy və qırxma və ya qısaltma. İlin istənilən vaxtında edilə bilər.',
  },
  hajj: {
    intro: 'Böyük həcc, Zülhiccənin 8-dən 13-ə qədər, mərkəzində Ərəfədə duruşu ilə.',
  },
};

export const JOURNEY_STEPS_AZ: Record<string, JourneyStepAz> = {
  // umrah
  prepare: {
    title: 'Hazırlıq və niyyət',
    short: 'Miqatı keçməzdən əvvəl ihrama girin',
    detail:
      'Dırnaqları kəsin və tükləri qısaldın, qüsl alın və öz istiqamətinizə uyğun miqatı keçməzdən əvvəl ihram geyimlərini geyinin. Sonra qəlbinizdə Ümrəyə niyyət edin və təlbiyə deməyə başlayın. İhrama girdikdən sonra saç və dırnaq kəsmək olmaz, (kişilər) tikilmiş paltar geyinmək və ətir vurmaq olmaz, ov etmək və nikah bağlamaq olmaz — ihramı nəyin pozduğu və onun üçün nəyin vacib olduğu məzhəblər arasında fərqlənir, ona görə öz halınızı etibar etdiyiniz alimlə təsdiq edin.',
  },
  talbiyah: {
    title: 'Təlbiyə',
    short: 'Hərəmə çatana qədər onu təkrar etməyə davam edin',
    detail:
      '“Ləbbeykə Allahummə ləbbeyk, ləbbeykə la şərikə ləkə ləbbeyk, innə əl-həmdə vən-ni‘mətə ləkə vəl-mülk, la şərikə lək.” Kişilər onu ucadan, qadınlar səssiz deyir. Tavafa başlayana qədər davam edin.',
  },
  tawaf: {
    title: 'Kəbənin ətrafında tavaf',
    short: 'Qara daşdan başlayan yeddi dövrə',
    detail:
      'Qara daşda niyyətlə başlayın və Kəbəni sol tərəfinizdə saxlayaraq yeddi dəfə dövrə edin. Hər dəfə Qara daşın yanından keçəndə ona toxunun və ya işarə edin və bacardığınız istənilən zikri və ya Quran oxuyun — hər dövrə üçün təyin edilmiş xüsusi dua yoxdur. Kişilər ilk üç dövrədə sürətlə yeriyir. Bitirdikdə, bacarırsınızsa, Məqami-İbrahimin arxasında iki rükət namaz qılın, sonra Zəmzəm suyu için.',
    counterLabel: 'Dövrə',
  },
  sai: {
    title: 'Səfa və Mərva arasında səy',
    short: 'İki təpə arasında yeddi dəfə',
    detail:
      'Səfadan Mərvaya gedin — bu bir uzunluqdur — və geri, cəmi yeddi uzunluq, Mərvada bitirərək. Səy öz ritualıdır və qısaldılmır. Öz tempiylə yeriyin; yalnız iki yaşıl işarə arasındakı məsafə sürətlə keçilir.',
    counterLabel: 'Uzunluq',
  },
  halq: {
    title: 'Qırxma və ya qısaltma',
    short: 'Sizi ihramdan azad edən addım',
    detail:
      'Kişilər başı qırxır və ya saçı hər yerdən qısaldır; qırxmaq üstünlük verilir. Qadınlar saçın uclarından bir barmaq ucu qədər kəsir. Bununla Ümrə tamamlanır və ihramın qadağan etdiyi hər şey yenidən halal olur.',
  },
  closing: {
    title: 'Xatırlayın və səfəri bitirin',
    short: 'İki rükət namaz qılın və şükür edin',
    detail:
      'Hərəmdə bacardığınız yerdə namaz qılın, bacarırsınızsa sədəqə verin və tamamlanmış ritualdan sonra edilən duanı saxlayın. Bir çoxları sonra Ümrəni Tənimdən təkrar edir və ya başqası üçün yenidən edir — bu, sizin öz niyyətiniz və imkanınız məsələsidir.',
  },

  // hajj
  intention: {
    title: 'Həcc növünü seçin',
    short: 'Təməttü, Qiran və ya İfrad',
    detail:
      'Təməttü: Ümrə üçün ihrama girin və onu bitirin, ihramdan çıxın, sonra 8-ci gün Həcc üçün yenidən ihrama girin; bu halda qurban var. Qiran: Ümrə və Həcci bir ihramda edin. İfrad: yalnız Həcc üçün ihrama girin və sona qədər ihramda qalın. Hansının daha üstün olduğu və hər biri üçün nəyin vacib olduğu sizin şəraitinizdən və məzhəbinizdən asılıdır — yola çıxmazdan əvvəl öyrənin və qərar verin.',
  },
  ihram: {
    title: 'İhrama girmək',
    short: 'Yuyunun, geyinin, niyyət edin və Təlbiyəyə başlayın',
    detail:
      'Yuyunun və ihram geyimlərini geyinin, sonra seçdiyiniz rituallar üçün niyyət edin və Təlbiyəyə başlayın. Daşlayıb, qurban kəsib və qırxıb və ya qısaldana qədər ihram qadağaları qüvvədədir.',
  },
  qudum: {
    title: 'Qüduəm tavafı və səy',
    short: 'Qüduəm tavafı, sonra Təməttü üçün səy',
    detail:
      'Məkkəyə çatanda yeddi dövrəlik qüduəm tavafını edin və iki rükət namaz qılın. Təməttü üçün ardınca Həcc səyini edin (və ya səyi İfada tavafından sonraya saxlayın — hər ikisi fərqli məktəblər tərəfindən keçərli sayılır). Sonra ihramda qalırsınız.',
    counterLabel: 'Dövrə',
  },
  tarwiyah: {
    title: 'Zülhiccənin 8-i — Mina',
    short: 'Minada keçirilən Tərviyə günü',
    detail:
      'Çıxmısınızsa, Həcc üçün yenidən ihrama girin və Minaya gedin; orada Zöhr, Əsr, Məğrib, İşa və Sübh namazlarını qılın — hər biri iki rükətə qısaldılır, lakin birləşdirilmir. Ərəfəyə getməzdən əvvəl gecəni Minada keçirin.',
  },
  arafah: {
    title: 'Zülhiccənin 9-u — Ərəfə',
    short: 'Həccin özü olan duruş',
    detail:
      'Günəş doğduqdan sonra Ərəfəyə gedin və Zöhrdən sonra gün batana qədər orada qalın; Zöhrlə Əsri birləşdirin və qısaldın. Ərəfənin hamısı duruş yeridir, lakin insanlar Rəhmə təpəsindəki qayanın yanında toplaşır. Günü təlbiyə, zikr, Quran, tövbə və duayla doldurun — Həcc bu günə söykənir.',
  },
  muzdalifah: {
    title: 'Müzdəlifədə gecə',
    short: 'Gün batdıqdan sonra çıxın, namaz qılın və daş toplayın',
    detail:
      'Ərəfəni gün batdıqdan sonra — dan yeri sökülməzdən əvvəl — tərk edin və Müzdəlifəyə gedin; orada Məğriblə İşanı birləşdirib qılın və gecəni keçirin. Daşlama üçün daşları burada toplayın, sonra dan yeri sökülməzdən və ya o vaxt Minaya yollanın.',
  },
  aqaba: {
    title: '10-cu gün — böyük sütunun daşlanması',
    short: 'Cəmərətül-Əqəbədə yeddi daş',
    detail:
      'Minada böyük sütunu (Məkkəyə ən yaxın olan Əqəbəni) yeddi daşla daşlayın, hər atışda “Allahu əkbər” deyin. Bu daşlama ilə ihramdan böyük azadolma qüvvəyə minir.',
    counterLabel: 'Daş',
  },
  hady: {
    title: '10-cu gün — qurban və qırxma',
    short: 'Hədy, sonra qırxın və ya qısaldın',
    detail:
      'Təməttü və Qiran üçün vacib olan qurbanı kəsin — bu gün zəvvarların əksəriyyəti bunu səlahiyyətli nümayəndəyə həvalə edir və bu qəbul edilir. Sonra başı qırxın və ya saçı qısaldın; qadınlar bir barmaq ucu qədər kəsir. Daşlama, qurban və qırxma tamamlandıqda, ailə yaxınlığından başqa ihramın qadağan etdiyi hər şey halal olur.',
  },
  ifadah: {
    title: '10-dan 12-yə — İfada tavafı',
    short: 'Həccin sütunu, və hələ borcdursa səy',
    detail:
      'İfada tavafı üçün Məkkəyə qayıdın, yeddi dövrə, ardınca əgər onu Həcc üçün etməmisinizsə səy. Bu tavaf əsas sütundur: Həcc onsuz tamamlanmır.',
    counterLabel: 'Dövrə',
  },
  tashreeq: {
    title: '11-dən 13-ə — Təşriq günləri',
    short: 'Hər günortadan sonra üç sütun, sonra Mina',
    detail:
      'Hər gün Zöhrdən sonra üç sütunu ardıcıllıqla daşlayın — kiçik, sonra orta, sonra böyük — hər birinə yeddi daş, və hər atışda “Allahu əkbər” deyin. Bu gecələri Minada keçirin. Daşlamanı bitirib 12-də çıxan günahsız çıxır; 13-ə qədər qalan da günahsızdır.',
    counterLabel: 'Daş',
  },
  wada: {
    title: 'Vida tavafı',
    short: 'Məkkədən çıxmazdan əvvəl Vida tavafı',
    detail:
      'Eve yollanmazdan əvvəl vida tavafı olaraq yeddi dövrə edin, sonra iki rükət namaz qılın və yola düşün. Məkkədən çıxan hər kəs üçün bu, Həccin son ritualıdır.',
    counterLabel: 'Dövrə',
  },

};
