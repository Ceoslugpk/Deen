/**
 * The worship guides in French.
 *
 * The English guides in `worshipGuides.ts` stay the source of truth: they carry
 * the ids, the reference links and the order. This file holds only the French
 * wording, so a guide that has not been written here yet simply reads in
 * English rather than showing an empty screen.
 *
 * French is written left-to-right, like English, which is exactly why the old
 * `rtl` flag could not reach it: a boolean reads every LTR language as English.
 * These are reached through a language code. See `localizeGuide`.
 *
 * The register follows French Muslim usage: le Coran, la prière, les ablutions,
 * le jeûne, la zakât. Terms that have no settled French form are transliterated
 * into a French reading (ghusl, souhour, iftar, witr, istikhara, zichr) rather
 * than calqued from English.
 */

export type WorshipGuideFr = {
  title: string;
  subtitle: string;
  introduction: string;
  steps: string[];
  note?: string;
};

export const WORSHIP_GUIDES_FR: Record<string, WorshipGuideFr> = {
  'Wudu Guide': {
    title: 'Guide des ablutions',
    subtitle: 'Se préparer à la prière avec soin',
    introduction:
      'Une séquence concise fondée sur le commandement coranique et la pratique rapportée du Prophète ﷺ.',
    steps: [
      'Commencez par l’intention et dites Bismillah.',
      'Lavez les deux mains.',
      'Rincez la bouche et le nez.',
      'Lavez le visage.',
      'Lavez les bras jusqu’aux coudes, en commençant par la droite.',
      'Essuyez la tête et les oreilles.',
      'Lavez les pieds jusqu’aux chevilles, en commençant par la droite.',
    ],
    note:
      'L’eau doit atteindre les zones requises. Consultez un savant qualifié pour les plâtres, les plaies, l’essuyage des chaussures ou le doute persistant.',
  },
  'Salah Guide': {
    title: 'Guide de la prière',
    subtitle: 'Un aperçu clair de la prière',
    introduction:
      'Apprenez la séquence principale avant d’étudier les règles détaillées de votre école de jurisprudence.',
    steps: [
      'Formez l’intention et tournez-vous vers la qibla.',
      'Commencez par le takbir d’ouverture.',
      'Debout, récitez Al-Fatiha et le Coran supplémentaire là où c’est prescrit.',
      'Inclinez-vous en ruku avec calme.',
      'Redressez-vous et tenez-vous debout.',
      'Accomplissez deux prosternations avec une pause assise.',
      'Accomplissez les unités requises, le tachahhud et les salawat.',
      'Terminez par le salam à droite et à gauche.',
    ],
    note:
      'Cet aperçu ne remplace pas l’apprentissage de la prière directement auprès d’un enseignant qualifié.',
  },
  'Janazah Guide': {
    title: 'La prière funéraire',
    subtitle: 'La prière funéraire en un coup d’œil',
    introduction:
      'La salat al-janaza est une obligation collective et s’accomplit debout, sans inclinaison ni prosternation.',
    steps: [
      'Formez l’intention et tournez-vous vers la qibla.',
      'Après le premier takbir, récitez Al-Fatiha.',
      'Après le deuxième, invoquez les bénédictions sur le Prophète ﷺ.',
      'Après le troisième, invoquez sincèrement pour le défunt.',
      'Après le quatrième, faites une courte pause et terminez par le salam.',
    ],
    note:
      'Les détails diffèrent selon les écoles juridiques ; suivez l’imam et cherchez un avis savant local.',
  },
  'Eid Prayer Guide': {
    title: 'La prière de l’Aïd',
    subtitle: 'Se préparer à la prière en congrégation',
    introduction:
      'L’Aïd est marqué par le rappel, la gratitude, la prière collective et la générosité.',
    steps: [
      'Accomplissez le ghusl et portez des vêtements propres.',
      'Pour l’Aïd al-Fitr, mangez avant de partir ; pour l’Aïd al-Adha, la pratique locale peut différer.',
      'Récitez le takbir en chemin.',
      'Suivez l’imam pour la prière de deux rakats et les takbirs supplémentaires.',
      'Écoutez la khutba et partez avec respect.',
    ],
  },
  'Istikhara Guide': {
    title: 'L’istikhara',
    subtitle: 'Chercher la guidance d’Allah dans une décision',
    introduction:
      'L’istikhara associe deux rakats volontaires à l’invocation prophétique pour ce qui est meilleur.',
    steps: [
      'Examinez les options licites et demandez un avis solide.',
      'Priez deux rakats volontaires.',
      'Nommez l’affaire et récitez l’invocation rapportée de l’istikhara.',
      'Avancez avec confiance ; un rêve n’est pas requis.',
      'Restez ouvert à la manière dont Allah facilite ou détourne l’affaire.',
    ],
  },
  'Taraweeh Guide': {
    title: 'Les tarawih',
    subtitle: 'Prière de nuit pendant le Ramadan',
    introduction:
      'La prière de nuit du Ramadan est un acte d’adoration volontaire accompli après l’icha.',
    steps: [
      'Priez après l’icha, seul ou en congrégation.',
      'Priez par séries de deux rakats.',
      'Récitez avec attention plutôt qu’avec hâte.',
      'Reposez-vous si besoin et préservez votre concentration.',
      'Terminez par le Witr selon votre pratique.',
    ],
  },
  Shahada: {
    title: 'La chahada',
    subtitle: 'L’attestation de foi',
    introduction:
      'J’atteste qu’il n’est de divinité digne d’adoration qu’Allah, et j’atteste que Muhammad est le Messager d’Allah.',
    steps: [
      'Comprenez le sens du témoignage.',
      'Affirmez-la sincèrement et de plein gré.',
      'Pour entrer formellement en islam, adressez-vous à une mosquée locale de confiance pour être accompagné et apprendre.',
    ],
  },
  'Ramadan Guide': {
    title: 'Guide du Ramadan',
    subtitle: 'Un mois de jeûne et de Coran',
    introduction:
      'Le Ramadan est centré sur le jeûne, la prière, le Coran, l’aumône, le repentir et le bon caractère.',
    steps: [
      'Établissez un plan d’adoration réaliste.',
      'Observez le jeûne de l’aube véritable au coucher du soleil.',
      'Veillez sur la parole et la conduite autant que sur la nourriture et la boisson.',
      'Faites du souhour, des prières et de l’iftar vos repères.',
      'Augmentez le Coran, les invocations, l’aumône et le service.',
      'Recherchez Laylat al-Qadr dans les dix dernières nuits.',
    ],
  },
  'Fasting Guide': {
    title: 'Guide du jeûne',
    subtitle: 'Le jeûne, dans ses grandes lignes',
    introduction:
      'Un jeûne valide exige une intention sincère et l’abstention de ce qui l’annule durant la journée de jeûne.',
    steps: [
      'Sachez si le jeûne est obligatoire ou volontaire.',
      'Formez l’intention requise avant son heure applicable.',
      'Prenez le souhour et arrêtez-vous à l’aube véritable.',
      'Jusqu’au coucher du soleil, évitez nourriture, boisson, rapports conjugaux et ce qui annule délibérément le jeûne.',
      'Rompez le jeûne sans tarder au coucher du soleil.',
      'Demandez un avis qualifié en cas de maladie, voyage, grossesse, médication ou affection chronique.',
    ],
    note:
      'Les situations de santé diffèrent. Consultez à la fois un savant qualifié et un médecin lorsque c’est pertinent.',
  },
  'Laylatul Qadr': {
    title: 'Laylat al-Qadr',
    subtitle: 'La Nuit du Destin',
    introduction:
      'La Nuit du Destin vaut mieux que mille mois et est recherchée dans les dernières nuits du Ramadan.',
    steps: [
      'Augmentez la prière de nuit dans les dix dernières nuits.',
      'Récitez le Coran et méditez-le.',
      'Multipliez les invocations et le rappel.',
      'Donnez l’aumône et réconciliez-vous avec les autres.',
      'Évitez d’affirmer avec certitude une nuit précise.',
    ],
  },
  'Zakat al-Fitr': {
    title: 'La zakât al-fitr',
    subtitle: 'Aumône avant la prière de l’Aïd',
    introduction:
      'La zakât al-fitr est due à la fin du Ramadan pour les musulmans qui y sont tenus et doit parvenir aux bénéficiaires avant la prière de l’Aïd.',
    steps: [
      'Confirmez votre responsabilité pour vous-même et vos personnes à charge.',
      'Utilisez la mesure en denrée de base admise localement ou l’approche monétaire suivie par les savants locaux de confiance.',
      'Identifiez les bénéficiaires éligibles.',
      'Donnez assez tôt pour que cela leur parvienne avant la prière de l’Aïd.',
      'Tenez un registre local privé si cela vous aide.',
    ],
    note:
      'Le montant et l’acceptation de l’espèce diffèrent selon l’avis savant et la localité.',
  },
};

/** The citation forms used in the guide references: "Qur’an 5:6", "Sahih al-Bukhari 164". */
export function frenchReference(label: string): string {
  return label
    .replace('Qur’an', 'Coran')
    .replace('Sahih al-Bukhari', 'Sahih al-Bukhari')
    .replace('Sahih Muslim', 'Sahih Muslim');
}
