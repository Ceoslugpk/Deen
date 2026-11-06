/**
 * The Umrah and Hajj journey in French.
 *
 * Keyed by the step id, which is the same in every language, so a step that has
 * not been written here yet reads in English rather than showing nothing.
 *
 * Reached through a language code, never through an `rtl` flag. French is
 * written left-to-right, so the old boolean could not reach it at all and these
 * screens stayed in English.
 *
 * The wording follows French Muslim pilgrimage usage (ihram, miqat, tawaf,
 * sa‘i, circuit, station, jamarat) rather than a calque from English. Where the
 * schools of law differ — on what breaks ihram, on whether the sa‘i of Hajj
 * comes before or after Tawaf al-Ifada — the text says so and sends the reader
 * to someone qualified, instead of quietly picking one ruling and presenting it
 * as the only one.
 */

export type JourneyStepFr = { title: string; short: string; detail: string; counterLabel?: string };

export const JOURNEY_META_FR: Record<string, { intro: string }> = {
  umrah: {
    intro:
      'Le petit pèlerinage : ihram, tawaf, Sa‘i, et rasage ou taille. Il peut être accompli à tout moment de l’année.',
  },
  hajj: {
    intro:
      'Le grand pèlerinage, du 8 au 13 de Dhou al-Hijja, avec sa station à Arafat en son centre.',
  },
};

export const JOURNEY_STEPS_FR: Record<string, JourneyStepFr> = {
  prepare: {
    title: 'Préparation et intention',
    short: 'Prenez l’ihram avant de franchir le miqat',
    detail:
      'Avant de franchir le miqat qui correspond à votre itinéraire, coupez vos ongles et vos cheveux, accomplissez le ghusl et revêtez les vêtements de l’ihram. Formez ensuite l’intention de l’omra dans votre cœur et commencez la talbiya. Une fois en ihram : ne coupez ni cheveux ni ongles, ne portez pas de vêtement cousu et n’utilisez pas de parfum (pour les hommes), ne chassez pas et ne concluez pas de mariage — les détails de ce qui rompt l’ihram et de ce qui est dû en réparation diffèrent selon les écoles, confirmez donc votre cas auprès d’un savant en qui vous avez confiance.',
  },
  talbiyah: {
    title: 'La talbiya',
    short: 'Continuez à la répéter jusqu’à atteindre le Haram',
    detail:
      '« Labbayka Allāhumma labbayk, labbayka lā sharīka laka labbayk, inna al-ḥamda wa an-ni‘mata laka wa al-mulk, lā sharīka lak. » Les hommes la récitent à voix haute ; les femmes la récitent à voix basse. Continuez jusqu’à commencer le tawaf.',
  },
  tawaf: {
    title: 'Le tawaf autour de la Kaaba',
    short: 'Sept circuits, en partant de la Pierre noire',
    detail:
      'Formez l’intention de commencer, placez-vous face à la Pierre noire et faites sept fois le tour de la Kaaba en la gardant à votre gauche. En passant devant la Pierre noire, saluez-la d’un contact ou d’un geste, et récitez le dhikr et le Coran qui vous sont faciles — il n’y a pas d’invocation particulière fixée pour chaque circuit. Les hommes font le ramal dans les trois premiers circuits, c’est-à-dire qu’ils marchent d’un pas vif. Une fois terminé, priez deux rakats derrière le Maqam Ibrahim si vous le pouvez, puis buvez de l’eau de Zamzam.',
    counterLabel: 'circuits',
  },
  sai: {
    title: 'Le Sa‘i entre Safa et Marwa',
    short: 'Sept traversées entre les deux collines',
    detail:
      'Marchez de Safa à Marwa — c’est une traversée — et retour, soit sept traversées en tout, en terminant à Marwa. Le Sa‘i est un rite à part entière et ne se raccourcit pas. Marchez à votre rythme, avec dignité ; seul le tronçon entre les deux repères verts se fait plus vite.',
    counterLabel: 'traversées',
  },
  halq: {
    title: 'Le rasage ou la taille des cheveux',
    short: 'L’étape qui vous libère de l’ihram',
    detail:
      'Les hommes rasent la tête ou taillent les cheveux sur toute la tête ; le rasage est préférable. Les femmes coupent la longueur d’un bout de doigt sur les pointes des cheveux. Par là, l’omra est complète et tout ce que l’ihram interdisait redevient licite.',
  },
  closing: {
    title: 'Se rappeler, et clore le parcours',
    short: 'Priez deux rakats et rendez grâce',
    detail:
      'Priez où vous pouvez dans le Haram, donnez l’aumône si vous le pouvez, et gardez l’invocation offerte après un rite accompli. Beaucoup répètent ensuite l’omra depuis At-Tan‘im ou l’accomplissent à nouveau pour quelqu’un d’autre — c’est affaire de votre propre intention et de votre capacité.',
  },
  intention: {
    title: 'Choisir le type de Hajj',
    short: 'Tamattu‘, Qiran ou Ifrad',
    detail:
      'Tamattu‘ : entrez en ihram pour l’omra, achevez-la, sortez de l’ihram, puis entrez à nouveau en ihram pour le Hajj le 8 ; ce type exige un sacrifice. Qiran : réunissez l’omra et le Hajj dans un seul ihram. Ifrad : entrez en ihram pour le Hajj seul et demeurez en ihram tout le temps. Lequel est le meilleur, et ce que chacun exige, dépend de votre situation et de votre école — décidez-le en connaissance de cause avant le départ.',
  },
  ihram: {
    title: 'L’entrée en ihram',
    short: 'Se laver, se vêtir, former l’intention et commencer la talbiya',
    detail:
      'Lavez-vous et revêtez les vêtements de l’ihram, puis formez l’intention pour les rites choisis et commencez la talbiya. Les interdits de l’ihram s’appliquent désormais jusqu’à ce que vous ayez lapidé, sacrifié et rasé ou taillé.',
  },
  qudum: {
    title: 'Le Tawaf al-Qudum et le Sa‘i',
    short: 'Tawaf d’arrivée, puis le Sa‘i pour le Tamattu‘',
    detail:
      'En arrivant à La Mecque, accomplissez le tawaf d’arrivée de sept circuits et deux rakats. Pour le Tamattu‘, faites-le suivre du Sa‘i du Hajj (ou gardez le Sa‘i pour après le Tawaf al-Ifada — les deux sont tenus pour valides par différentes écoles). Vous demeurez ensuite en ihram.',
    counterLabel: 'circuits',
  },
  tarwiyah: {
    title: '8 Dhou al-Hijja — Mina',
    short: 'Le jour de Tarwiya, passé à Mina',
    detail:
      'Entrez en ihram pour le Hajj si vous en êtes sorti, et allez à Mina en y priant Dhouhr, Asr, Maghrib, Icha et Fajr. Chacune est raccourcie à deux rakats (qasr) mais non regroupée (jam‘). Passez la nuit à Mina avant de partir pour Arafat.',
  },
  arafah: {
    title: '9 Dhou al-Hijja — Arafat',
    short: 'Le stationnement qui est le Hajj',
    detail:
      'Après le lever du soleil, rendez-vous à Arafat et tenez-vous-y de midi au coucher du soleil, en accomplissant Dhouhr et Asr regroupées et raccourcies. Arafat tout entier est un lieu de stationnement, même si les gens se rassemblent au rocher de Jabal ar-Rahma. Remplissez la journée de talbiya, de dhikr, de Coran, de repentir et d’invocations — le Hajj tient à ce jour.',
  },
  muzdalifah: {
    title: 'La nuit à Mouzdalifa',
    short: 'Partez après le coucher du soleil, priez et ramassez des cailloux',
    detail:
      'Quittez Arafat après le coucher du soleil — avant l’aube — et allez à Mouzdalifa, où vous priez Maghrib et Icha ensemble et passez la nuit. Ramassez ici les cailloux de la lapidation, puis partez pour Mina avant ou autour de l’aube.',
  },
  aqaba: {
    title: '10 — La lapidation de la grande stèle',
    short: 'Sept cailloux à Jamarat al-Aqaba',
    detail:
      'À Mina, lapidez la grande stèle (al-Aqaba, la plus proche de La Mecque) de sept cailloux, en disant « Allāhu akbar » à chaque lancer. Par cette lapidation, la libération majeure de l’ihram prend effet.',
    counterLabel: 'cailloux',
  },
  hady: {
    title: '10 — Sacrifice et rasage',
    short: 'Le Hady, puis raser ou tailler',
    detail:
      'Offrez le sacrifice requis pour le Tamattu‘ et le Qiran — aujourd’hui la plupart des pèlerins désignent un mandataire, et cela est accepté. Rasez ensuite la tête ou taillez les cheveux ; les femmes coupent la longueur d’un bout de doigt. Une fois la lapidation, le sacrifice et le rasage accomplis, tout ce que l’ihram interdisait redevient licite, sauf les rapports conjugaux.',
  },
  ifadah: {
    title: '10–12 — Tawaf al-Ifada',
    short: 'Le pilier du Hajj, et le Sa‘i s’il reste dû',
    detail:
      'Retournez à La Mecque pour le Tawaf al-Ifada — sept circuits — suivi du Sa‘i si vous ne l’avez pas déjà accompli pour le Hajj. Ce tawaf est le pilier essentiel : le Hajj n’est pas complet sans lui.',
    counterLabel: 'circuits',
  },
  tashreeq: {
    title: '11–13 — Les jours de Tachriq',
    short: 'Trois stèles chaque après-midi, puis Mina',
    detail:
      'Après chaque Asr de l’après-midi, lapidez les trois stèles dans l’ordre — la petite, puis la moyenne, puis la grande — en lançant sept cailloux sur chacune et en disant « Allāhu akbar » à chaque lancer. Passez ces nuits à Mina. Nul grief sur celui qui lapide et part après le 12, et nul grief sur celui qui reste jusqu’au 13.',
    counterLabel: 'cailloux',
  },
  wada: {
    title: 'Le tawaf d’adieu',
    short: 'Tawaf al-Wada avant de quitter La Mecque',
    detail:
      'Avant de rentrer chez vous, accomplissez sept circuits comme tawaf d’adieu, puis priez deux rakats et partez. C’est le dernier rite du Hajj pour quiconque quitte La Mecque.',
    counterLabel: 'circuits',
  },
};
