/**
 * The worship guides in Bosnian.
 *
 * The English guides in `worshipGuides.ts` stay the source of truth: they carry
 * the ids, the reference links and the order. This file holds only the
 * Bosnian wording, so a guide that has not been written here yet simply
 * reads in English rather than showing an empty screen.
 *
 * The register is the one a Bosnian Muslim prays in, and it is the terminology
 * of the Besim Korkut edition the reader is given (`tr_bs_besim_korkut`):
 * namaz for the prayer, abdest for the washing and gusul for the full one,
 * ruku', sedžda and tešehhud for its parts, dženaza-namaz for the funeral
 * prayer, teravih for the Ramadan night prayer, istihara, sehur and iftar,
 * and sadakatul-fitr for the Eid charity. The testimony is Šehadet — the word
 * the copy table uses elsewhere, so the guides and the rest of the interface
 * agree. Vitr, dova, zekat and zikr stay in the form the Bosnian editions
 * carry them, and the prayer is the five the prayer-time screens name: Sabah,
 * Podne, Ikindija, Akšam and Jacija.
 *
 * The Prophet ﷺ is never named without the blessing.
 *
 * Bosnian is written left-to-right, so these guides are only reachable through
 * a language code: the old `rtl` boolean could never have found them.
 *
 * Arabic numerals are kept, as the rest of the Bosnian interface keeps them —
 * no digit conversion belongs here.
 */

export type WorshipGuideBs = {
  title: string;
  subtitle: string;
  introduction: string;
  steps: string[];
  note?: string;
};

export const WORSHIP_GUIDES_BS: Record<string, WorshipGuideBs> = {
  'Wudu Guide': {
    title: 'Vodič za abdest',
    subtitle: 'Pripremi se za namaz pažljivo',
    introduction: 'Kratak slijed zasnovan na kur\'anskoj naredbi i prenešenoj praksi Poslanika ﷺ.',
    steps: [
      'Počni s nijetom i reci Bismillah.',
      'Operi obje ruke.',
      'Isperi usta i nos.',
      'Operi lice.',
      'Operi ruke do lakata, počevši od desne.',
      'Potri glavu i uši.',
      'Operi stopala do članaka, počevši od desne.',
    ],
    note: 'Voda mora doprijeti do potrebnih mjesta. Konsultuj stručnog učenjaka za gips, rane, potiranje preko obuće ili stalnu sumnju.'
  },
  'Salah Guide': {
    title: 'Vodič za namaz',
    subtitle: 'Jasan pregled namaza',
    introduction: 'Nauči osnovni slijed prije proučavanja detaljnih propisa svoje pravne škole.',
    steps: [
      'Formiraj nijet i okreni se prema kibli.',
      'Počni s početnim tekbirom.',
      'Stani i prouči El-Fatihu i dodatni Kur\'an gdje je propisano.',
      'Učini ruku\' sa smirenošću.',
      'Ustani i ispravi se.',
      'Učini dvije sedžde s pauzom u sjedenju.',
      'Upotpuni obavezne rekate, tešehud i salavat.',
      'Završi selamom na desnu i lijevu stranu.',
    ],
    note: 'Ovaj pregled nije zamjena za učenje namaza direktno od stručnog učitelja.'
  },
  'Janazah Guide': {
    title: 'Vodič za dženazu',
    subtitle: 'Dženaza-namaz ukratko',
    introduction: 'Dženaza-namaz je kolektivna obaveza i obavlja se stojeći, bez rukua i sedžde.',
    steps: [
      'Formiraj nijet i okreni se prema kibli.',
      'Poslije prvog tekbira, prouči El-Fatihu.',
      'Poslije drugog, donesi salavat na Poslanika ﷺ.',
      'Poslije trećeg, iskreno dovi za umrlog.',
      'Poslije četvrtog, nakratko zastani i završi selamom.',
    ],
    note: 'Detalji se razlikuju među pravnim školama; slijedi imama i potraži lokalni učenjački savjet.'
  },
  'Eid Prayer Guide': {
    title: 'Vodič za bajram-namaz',
    subtitle: 'Pripremi se za džemat-namaz',
    introduction: 'Bajram se obilježava sjećanjem na Allaha, zahvalnošću, džemat-namazom i darežljivošću.',
    steps: [
      'Obavi gusul i obuci čistu odjeću.',
      'Za ramazanski bajram, jedi prije polaska; za kurbanski bajram, lokalna praksa se može razlikovati.',
      'Uči tekbir na putu.',
      'Slijedi imama za dvorekatni namaz i dodatne tekbire.',
      'Slušaj hutbu i otiđi s poštovanjem.',
    ],
  },
  'Istikhara Guide': {
    title: 'Vodič za istiharu',
    subtitle: 'Traži Allahovo uputstvo za odluku',
    introduction: 'Istihara spaja dva dobrovoljna rekata sa poslaničkom dovom za ono što je najbolje.',
    steps: [
      'Razmotri dozvoljene opcije i potraži ispravan savjet.',
      'Klanjaj dva dobrovoljna rekata.',
      'Prouči prenešenu dovu istihare, spominjući stvar.',
      'Nastavi s pouzdanjem; san nije potreban.',
      'Ostani otvoren za to kako Allah olakšava ili odvraća stvar.',
    ],
  },
  'Taraweeh Guide': {
    title: 'Vodič za teravih',
    subtitle: 'Ramazanski noćni namaz',
    introduction: 'Ramazanski noćni namaz je dobrovoljni ibadet koji se obavlja poslije jacije.',
    steps: [
      'Klanjaj poslije jacije, pojedinačno ili u džematu.',
      'Klanjaj u nizovima od dva rekata.',
      'Uči s pažnjom, a ne u žurbi.',
      'Odmori se kad je potrebno i očuvaj usredotočenost.',
      'Završi vitrom prema svom običaju.',
    ],
  },
  Shahada: {
    title: 'Šehadet',
    subtitle: 'Svjedočenje vjere',
    introduction: 'Svjedočim da nema boga koji zaslužuje da se obožava osim Allaha, i svjedočim da je Muhammed Allahov Poslanik.',
    steps: [
      'Razumij značenje svjedočenja.',
      'Potvrdi to iskreno i dobrovoljno.',
      'Za formalni ulazak u islam, poveži se s pouzdanom lokalnom džamijom radi podrške i učenja.',
    ],
  },
  'Ramadan Guide': {
    title: 'Vodič za ramazan',
    subtitle: 'Mjesec posta i Kur\'ana',
    introduction: 'Ramazan se usmjerava na post, namaz, Kur\'an, sadaku, pokajanje i lijepu narav.',
    steps: [
      'Postavi realan plan ibadeta.',
      'Posti od prave zore do zalaska sunca.',
      'Čuvaj govor i ponašanje, kao i hranu i piće.',
      'Koristi sehur, namaze i iftar kao oslonce.',
      'Povećaj Kur\'an, dovu, sadaku i služenje.',
      'Traži Lejletul-kadr u zadnjih deset noći.',
    ],
  },
  'Fasting Guide': {
    title: 'Vodič za post',
    subtitle: 'Osnovne smjernice za post',
    introduction: 'Ispravan post zahtijeva iskren nijet i suzdržavanje od kvaritelja tokom dana posta.',
    steps: [
      'Znaj je li post obavezan ili dobrovoljan.',
      'Formiraj potrebni nijet prije njegovog vremena.',
      'Uzmi sehur i prestani pred pravi zoru.',
      'Izbjegavaj hranu, piće, bračne odnose i namjerne kvaritelje do zalaska sunca.',
      'Iftari odmah po zalasku sunca.',
      'Potraži stručan savjet za bolest, putovanje, trudnoću, lijekove ili hronična stanja.',
    ],
    note: 'Zdravstvene okolnosti se razlikuju. Konsultuj i stručnog učenjaka i ljekara kada je prikladno.'
  },
  'Laylatul Qadr': {
    title: 'Lejletul-kadr',
    subtitle: 'Traži noć Kadra',
    introduction: 'Noć Kadr je bolja od hiljadu mjeseci i traži se u zadnjim noćima ramazana.',
    steps: [
      'Povećaj noćni namaz u zadnjih deset noći.',
      'Uči i razmišljaj o Kur\'anu.',
      'Čini mnogo dove i zikra.',
      'Dijeli sadaku i pomiri se s drugima.',
      'Ne tvrdi sa sigurnošću za određenu noć.',
    ],
  },
  'Zakat al-Fitr': {
    title: 'Sadakatul-fitr',
    subtitle: 'Sadaka prije bajram-namaza',
    introduction: 'Zakatul-fitr je obavezan na kraju ramazana za muslimane koji ispunjavaju uslove i trebao bi stići primaocima prije bajram-namaza.',
    steps: [
      'Potvrdi odgovornost za sebe i izdržavane.',
      'Koristi lokalno prihvaćenu mjeru osnovne hrane ili novčani stav koji slijede pouzdani lokalni učenjaci.',
      'Utvrdi one koji imaju pravo na primanje.',
      'Daj dovoljno rano da stigne prije bajram-namaza.',
      'Vodi privatnu lokalnu evidenciju ako pomaže.',
    ],
    note: 'Iznos i to da li se gotovina prihvata razlikuju se po učenjačkom stavu i mjestu.'
  },
};

/**
 * Reference labels in Bosnian.
 *
 * The numbers are left as they are: Bosnian is written in Arabic numerals
 * throughout this app, so a reference reads "Kur'an 5:6" and not some other
 * digits. Only the words before the number change.
 */
export function bosnianReference(label: string): string {
  return label
    .replace('Qur’an', 'Kur\'an')
    .replace('Sahih al-Bukhari', 'Sahih Buharija')
    .replace('Sahih Muslim', 'Sahih Muslima');
}
