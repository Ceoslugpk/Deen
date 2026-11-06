/**
 * The Umrah and Hajj journey in Bosnian.
 *
 * Keyed by the step id, which is the same in every language, so a step that has
 * not been written here yet reads in English rather than showing nothing.
 *
 * Reached through a language code, never through an `rtl` flag. Bosnian is
 * written left-to-right, so the old boolean could not reach it at all and
 * these screens would have stayed in English.
 *
 * The wording follows the vocabulary a Bosnian Muslim actually uses: ihram,
 * mikat, tavaf, sa'j, krug (the circuit), telbija, džemret (the pillar),
 * Arefat, Mina, Muzdelifa, kurban (the sacrifice), tavafu-l-ifada, dani
 * tešrika. Where the schools of law differ — on what breaks ihram, on whether
 * the sa'j of Hajj comes before or after Tawaf al-Ifadah — the text says so
 * and sends the reader to someone qualified, instead of quietly picking one
 * ruling and presenting it as the only one.
 *
 * The short lines are the same strings the rest of the interface uses, so the
 * wording a person reads on the journey screen is the wording they meet
 * everywhere else.
 *
 * The Prophet ﷺ is never named without the blessing.
 */

export type JourneyStepBs = { title: string; short: string; detail: string; counterLabel?: string };

export const JOURNEY_META_BS: Record<string, { intro: string }> = {
  umrah: {
    intro: 'Manje hodočašće: ihram, tavaf, sa\'j i brijanje ili šišanje. Može se obaviti u bilo koje doba godine.',
  },
  hajj: {
    intro: 'Veće hodočašće, od 8. do 13. zul-hidždžeta, sa stajanjem na Arefatu u svom središtu.',
  },
};

export const JOURNEY_STEPS_BS: Record<string, JourneyStepBs> = {
  // umrah
  prepare: {
    title: 'Priprema i nijet',
    short: 'Obuci ihram prije nego prijeđeš mikat',
    detail:
      'Skrati nokte i dlake, okupaj se i obuci ihramske haljine prije nego prijeđeš mikat koji odgovara tvom smjeru. Zatim srcem zanijeti umru i počni učiti telbiju. Kada uđeš u ihram, ne smiješ rezati kosu ni nokte, (muškarci) ne smiju nositi šivenu odjeću ni stavljati miris, ne smije se loviti ni sklapati brak — a šta kvari ihram i šta je za njega obavezno razlikuje se među mezhebima, pa potvrdi svoj slučaj kod učenjaka kojem vjeruješ.',
  },
  talbiyah: {
    title: 'Telbija',
    short: 'Nastavi je ponavljati dok ne stigneš do Harema',
    detail:
      '„Lebbejkellahumme lebbejk, lebbejke la šerike leke lebbejk, inne-l-hamde ve-n-ni\'mete leke ve-l-mulk, la šerike lek.“ Muškarci je uče glasno; žene je uče tiho. Nastavi dok ne počneš tavaf.',
  },
  tawaf: {
    title: 'Tavaf oko Kabe',
    short: 'Sedam krugova, počevši od Crnog kamena',
    detail:
      'Počni s nijetom kod Crnog kamena i obiđi sedam puta, držeći Kabu sebi s lijeve strane. Svaki put kada prođeš pored Crnog kamena, dotakni ga ili pokaži prema njemu i uči bilo koji zikr ili Kur\'an koji možeš — ne postoji posebna dova određena za svaki krug. Muškarci prva tri kruga hodaju brže. Kada završiš, klanjaj dva rekata iza Mekami-Ibrahima ako možeš, a zatim pij zemzem.',
    counterLabel: 'Krug',
  },
  sai: {
    title: 'Sa\'j između Safe i Merve',
    short: 'Sedam dužina između dva brda',
    detail:
      'Hodaj od Safe do Merve — to je jedna dužina — i nazad, ukupno sedam dužina, završavajući na Mervi. Sa\'j je obred za sebe i ne skraćuje se. Hodaj svojim tempom; samo se dio između dva zelena znaka ubrzava.',
    counterLabel: 'Dužina',
  },
  halq: {
    title: 'Brijanje ili šišanje',
    short: 'Korak koji te oslobađa ihrama',
    detail:
      'Muškarci briju glavu ili skraćuju kosu posvuda; brijanje je bolje. Žene skraćuju dužinu vrha prsta s krajeva kose. Ovim je umra završena i sve što je ihram zabranjivao ponovo postaje dozvoljeno.',
  },
  closing: {
    title: 'Sjeti se i završi putovanje',
    short: 'Klanjaj dva rekata i zahvali se',
    detail:
      'Klanjaj gdje možeš u Haremu, dijeli sadaku ako možeš i čuvaj dovu koja se upućuje poslije završenog obreda. Mnogi zatim ponove umru sa Et-Tan\'ima ili je obave ponovo za nekog drugog — to je pitanje tvoje namjere i mogućnosti.',
  },

  // hajj
  intention: {
    title: 'Odaberi vrstu hadža',
    short: 'Temettu\', kiran ili ifrad',
    detail:
      'Temettu\': obuci ihram za umru i završi je, izađi iz ihrama, pa 8. dana ponovo obuci ihram za hadž; u tom slučaju postoji kurban. Kiran: obavi umru i hadž u jednom ihramu. Ifrad: obuci ihram samo za hadž i ostani u ihramu do kraja. Koji je bolji i šta je za svaki obavezno zavisi od tvoje situacije i tvog mezheba — nauči i odluči prije nego kreneš.',
  },
  ihram: {
    title: 'Ulazak u ihram',
    short: 'Okupaj se, obuci, zanijeti i počni s telbijom',
    detail:
      'Okupaj se i obuci ihramske haljine, pa zanijeti obrede koje si odabrao i počni s telbijom. Zabrane ihrama sada vrijede dok ne kamenuješ, ne zakolješ kurban i ne obriješ ili skratiš kosu.',
  },
  qudum: {
    title: 'Tavafu-l-kudum i sa\'j',
    short: 'Tavafu-l-kudum, pa sa\'j za temettu\'',
    detail:
      'Po dolasku u Mekku, obavi dolazni tavaf od sedam krugova i klanjaj dva rekata. Za temettu\', nakon toga slijedi sa\'j hadža (ili ostavi sa\'j za poslije tavafu-l-ifade — oba smatraju ispravnim različite škole). Zatim ostaješ u ihramu.',
    counterLabel: 'Krug',
  },
  tarwiyah: {
    title: '8. zul-hidždžeta — Mina',
    short: 'Dan tervije, proveden na Mini',
    detail:
      'Obuci ihram za hadž ako si ga skinuo i kreni na Minu, klanjajući tamo podne, ikindiju, akšam, jaciju i sabah, svaki skraćen na dva rekata, ali ne spojen. Provedi noć na Mini prije odlaska na Arefat.',
  },
  arafah: {
    title: '9. zul-hidždžeta — Arefat',
    short: 'Stajanje koje je hadž',
    detail:
      'Poslije izlaska sunca kreni na Arefat i ostani tamo do zalaska sunca, spajajući i skraćujući podne i ikindiju. Cijeli Arefat je mjesto stajanja, ali se ljudi okupljaju kod stijene na brdu Rahme. Ispuni dan telbijom, zikrom, Kur\'anom, pokajanjem i dovom — hadž se oslanja na ovaj dan.',
  },
  muzdalifah: {
    title: 'Noć na Muzdelifi',
    short: 'Kreni poslije zalaska sunca, klanjaj i sakupi kamenčiće',
    detail:
      'Napusti Arefat poslije zalaska sunca — prije zore — i kreni na Muzdelifu, gdje klanjaš akšam i jaciju zajedno i provedeš noć. Ovdje sakupi kamenčiće za kamenovanje, pa kreni na Minu prije ili oko zore.',
  },
  aqaba: {
    title: '10. dan — kamenovanje velikog džemreta',
    short: 'Sedam kamenčića na Džemretu-l-akabi',
    detail:
      'Na Mini, gađaj veliki džemret (el-Akabu, onaj najbliži Mekki) sa sedam kamenčića, govoreći „Allahu ekber“ pri svakom bacanju. Ovim kamenovanjem stupa na snagu veće oslobađanje od ihrama.',
    counterLabel: 'Kamenčić',
  },
  hady: {
    title: '10. dan — kurban i brijanje',
    short: 'Hadij, pa brijanje ili šišanje',
    detail:
      'Zakolji kurban koji je obavezan za temettu\' i kiran — većina hadžija to danas povjeri ovlaštenom predstavniku i to je prihvaćeno. Zatim obrij glavu ili skrati kosu; žene skraćuju dužinu vrha prsta. Kada se kamenovanje, kurban i brijanje završe, sve što je ihram zabranjivao postaje dozvoljeno, osim bračne bliskosti.',
  },
  ifadah: {
    title: '10. do 12. — tavafu-l-ifada',
    short: 'Stub hadža i sa\'j ako se još duguje',
    detail:
      'Vrati se u Mekku za tavafu-l-ifadu, sedam krugova, nakon kojih slijedi sa\'j ako ga već nisi obavio za hadž. Ovaj tavaf je bitni stub: hadž nije potpun bez njega.',
    counterLabel: 'Krug',
  },
  tashreeq: {
    title: '11. do 13. — dani tešrika',
    short: 'Tri džemreta svako poslijepodne, pa Mina',
    detail:
      'Svaki dan poslije podne gađaj tri džemreta redom — mali, pa srednji, pa veliki — sa sedam kamenčića u svaki, govoreći „Allahu ekber“ pri svakom bacanju. Ove noći provedi na Mini. Ko završi kamenovanje i ode 12. dana, oslobođen je; ko ostane do 13., također je oslobođen.',
    counterLabel: 'Kamenčić',
  },
  wada: {
    title: 'Oprosni tavaf',
    short: 'Tavafu-l-veda\' prije nego napustiš Mekku',
    detail:
      'Prije povratka kući, obavi sedam krugova kao oprosni tavaf, pa klanjaj dva rekata i kreni. To je zadnji obred hadža za svakoga ko napušta Mekku.',
    counterLabel: 'Krug',
  },

};
