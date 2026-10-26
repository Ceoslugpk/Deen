export type WorshipGuide = {
  id: string;
  title: string;
  subtitle: string;
  arabic?: string;
  introduction: string;
  steps: string[];
  references: { label: string; url: string }[];
  note?: string;
};

export const WORSHIP_GUIDES: WorshipGuide[] = [
  {
    id: 'Wudu Guide', title: 'Wudu Guide', subtitle: 'Prepare for prayer with care',
    introduction: 'A concise sequence based on the Qur’anic command and the reported practice of the Prophet ﷺ.',
    steps: ['Begin with intention and say Bismillah.', 'Wash both hands.', 'Rinse the mouth and nose.', 'Wash the face.', 'Wash the arms through the elbows, beginning with the right.', 'Wipe the head and ears.', 'Wash the feet through the ankles, beginning with the right.'],
    references: [{ label: 'Qur’an 5:6', url: 'https://quran.com/5/6' }, { label: 'Sahih al-Bukhari 164', url: 'https://sunnah.com/bukhari:164' }],
    note: 'Water must reach the required areas. Consult a qualified scholar for casts, wounds, wiping over footwear, or persistent doubt.'
  },
  {
    id: 'Salah Guide', title: 'Salah Guide', subtitle: 'A clear overview of the prayer',
    introduction: 'Learn the main sequence before studying the detailed rulings of your school of jurisprudence.',
    steps: ['Face the Qibla with intention.', 'Begin with the opening takbir.', 'Stand and recite Al-Fatihah and additional Qur’an where prescribed.', 'Bow in ruku with calmness.', 'Rise and stand upright.', 'Perform two prostrations with a seated pause.', 'Complete the required units, tashahhud, and salawat.', 'End with salam to the right and left.'],
    references: [{ label: 'Qur’an 2:238', url: 'https://quran.com/2/238' }, { label: 'Sahih al-Bukhari 631', url: 'https://sunnah.com/bukhari:631' }],
    note: 'This overview is not a replacement for learning prayer directly from a qualified teacher.'
  },
  {
    id: 'Janazah Guide', title: 'Janazah Guide', subtitle: 'The funeral prayer at a glance',
    introduction: 'Salat al-Janazah is a communal obligation and is performed standing, without bowing or prostration.',
    steps: ['Form the intention and face the Qibla.', 'After the first takbir, recite Al-Fatihah.', 'After the second, send blessings upon the Prophet ﷺ.', 'After the third, supplicate sincerely for the deceased.', 'After the fourth, pause briefly and conclude with salam.'],
    references: [{ label: 'Sahih Muslim 963', url: 'https://sunnah.com/muslim:963' }],
    note: 'Details differ between legal schools; follow the imam and seek local scholarly guidance.'
  },
  {
    id: 'Eid Prayer Guide', title: 'Eid Prayer Guide', subtitle: 'Prepare for the congregational prayer',
    introduction: 'Eid is marked by remembrance, gratitude, communal prayer, and generosity.',
    steps: ['Perform ghusl and wear clean clothing.', 'For Eid al-Fitr, eat before leaving; for Eid al-Adha, local practice may differ.', 'Recite the takbir on the way.', 'Follow the imam for the two-rakah prayer and additional takbirs.', 'Listen to the khutbah and leave respectfully.'],
    references: [{ label: 'Sahih al-Bukhari 956', url: 'https://sunnah.com/bukhari:956' }, { label: 'Sahih al-Bukhari 953', url: 'https://sunnah.com/bukhari:953' }]
  },
  {
    id: 'Istikhara Guide', title: 'Istikhara Guide', subtitle: 'Seek Allah’s guidance in a decision',
    introduction: 'Istikhara combines two voluntary rakahs with the prophetic supplication for what is best.',
    steps: ['Consider the lawful options and seek sound advice.', 'Pray two non-obligatory rakahs.', 'Recite the reported dua of istikhara, naming the matter.', 'Proceed with trust; a dream is not required.', 'Remain open to how Allah facilitates or turns away the matter.'],
    references: [{ label: 'Sahih al-Bukhari 1166', url: 'https://sunnah.com/bukhari:1166' }]
  },
  {
    id: 'Taraweeh Guide', title: 'Taraweeh Guide', subtitle: 'Night prayer during Ramadan',
    introduction: 'Ramadan night prayer is a voluntary act of worship performed after Isha.',
    steps: ['Pray after Isha, individually or with the congregation.', 'Pray in sets of two rakahs.', 'Recite with attentiveness rather than haste.', 'Rest when needed and preserve concentration.', 'Conclude with Witr according to your practice.'],
    references: [{ label: 'Sahih al-Bukhari 2009', url: 'https://sunnah.com/bukhari:2009' }, { label: 'Sahih Muslim 759', url: 'https://sunnah.com/muslim:759' }]
  },
  {
    id: 'Shahada', title: 'Shahada', subtitle: 'The testimony of faith',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ',
    introduction: 'I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad is the Messenger of Allah.',
    steps: ['Understand the meaning of the testimony.', 'Affirm it sincerely and willingly.', 'For formally entering Islam, connect with a trusted local mosque for support and learning.'],
    references: [{ label: 'Qur’an 3:18', url: 'https://quran.com/3/18' }, { label: 'Sahih Muslim 26', url: 'https://sunnah.com/muslim:26' }]
  },
  {
    id: 'Ramadan Guide', title: 'Ramadan Guide', subtitle: 'A month of fasting and Qur’an',
    introduction: 'Ramadan centers fasting, prayer, Qur’an, charity, repentance, and good character.',
    steps: ['Set a realistic worship plan.', 'Observe the fast from true dawn to sunset.', 'Guard speech and conduct as well as food and drink.', 'Use suhoor, prayers, and iftar as anchors.', 'Increase Qur’an, dua, charity, and service.', 'Seek Laylatul Qadr in the final ten nights.'],
    references: [{ label: 'Qur’an 2:183–187', url: 'https://quran.com/2/183-187' }]
  },
  {
    id: 'Fasting Guide', title: 'Fasting Guide', subtitle: 'Essential fasting guidance',
    introduction: 'A valid fast requires sincere intention and abstention from invalidators during the fasting day.',
    steps: ['Know whether the fast is obligatory or voluntary.', 'Make the required intention before its applicable time.', 'Take suhoor and stop by true dawn.', 'Avoid food, drink, marital relations, and deliberate invalidators until sunset.', 'Break the fast promptly at sunset.', 'Seek qualified advice for illness, travel, pregnancy, medication, or chronic conditions.'],
    references: [{ label: 'Qur’an 2:184–185', url: 'https://quran.com/2/184-185' }, { label: 'Sahih al-Bukhari 1923', url: 'https://sunnah.com/bukhari:1923' }],
    note: 'Health circumstances differ. Consult both a qualified scholar and clinician when appropriate.'
  },
  {
    id: 'Laylatul Qadr', title: 'Laylatul Qadr', subtitle: 'Seek the Night of Decree',
    introduction: 'The Night of Decree is better than a thousand months and is sought in Ramadan’s final nights.',
    steps: ['Increase night prayer in the last ten nights.', 'Recite and reflect on the Qur’an.', 'Make abundant dua and remembrance.', 'Give charity and reconcile with others.', 'Avoid claiming certainty about a particular night.'],
    references: [{ label: 'Qur’an 97', url: 'https://quran.com/97' }, { label: 'Sahih al-Bukhari 2017', url: 'https://sunnah.com/bukhari:2017' }]
  },
  {
    id: 'Zakat al-Fitr', title: 'Zakat al-Fitr', subtitle: 'Charity before the Eid prayer',
    introduction: 'Zakat al-Fitr is due at the end of Ramadan for eligible Muslims and should reach recipients before Eid prayer.',
    steps: ['Confirm responsibility for yourself and dependants.', 'Use the locally accepted staple-food measure or monetary view followed by trusted local scholars.', 'Identify eligible recipients.', 'Give early enough to reach them before Eid prayer.', 'Keep a private local record if helpful.'],
    references: [{ label: 'Sahih al-Bukhari 1503', url: 'https://sunnah.com/bukhari:1503' }, { label: 'Sahih Muslim 984', url: 'https://sunnah.com/muslim:984' }],
    note: 'The amount and whether cash is accepted differ by scholarly view and locality.'
  }
];
