/**
 * The twenty-five prophets named in the Qur'an.
 *
 * This is a reference list, not scripture: each entry carries the Arabic name used
 * in the Qur'an, a transliteration, the name as it is commonly rendered in English,
 * one line about how the Qur'an presents him, and a verse reference. The verse itself
 * is never stored here — it is fetched live from Al Quran Cloud when a prophet is
 * opened, so the text on screen always comes from the source.
 */

export type Prophet = {
  id: string;
  arabic: string;
  transliteration: string;
  english: string;
  note: string;
  noteAr: string;
  reference: string;
};

export const PROPHETS: Prophet[] = [
  { id: 'adam', arabic: 'آدَم', transliteration: 'Adam', english: 'Adam', note: 'The first man and the first prophet, taught the names of all things.', noteAr: 'أول البشر وأول الأنبياء، علّمه الله الأسماء كلها.', reference: '2:31' },
  { id: 'idris', arabic: 'إِدْرِيس', transliteration: 'Idris', english: 'Enoch', note: 'Remembered as truthful and patient, raised to a high station.', noteAr: 'ذُكر بالصدق والصبر، ورفعه الله مكانًا عليًّا.', reference: '19:56' },
  { id: 'nuh', arabic: 'نُوح', transliteration: 'Nuh', english: 'Noah', note: 'Called his people for nine hundred and fifty years before the flood.', noteAr: 'دعا قومه تسع مئة وخمسين سنة قبل الطوفان.', reference: '71:1' },
  { id: 'hud', arabic: 'هُود', transliteration: 'Hud', english: 'Hud', note: 'Sent to the people of ‘Ad, who were destroyed by a furious wind.', noteAr: 'أُرسل إلى قوم عاد، الذين أهلكتهم ريحٌ عاتية.', reference: '7:65' },
  { id: 'salih', arabic: 'صَالِح', transliteration: 'Salih', english: 'Salih', note: 'Sent to Thamud with the she-camel as a clear sign.', noteAr: 'أُرسل إلى ثمود، وجُعلت الناقة لهم آيةً مبينة.', reference: '7:73' },
  { id: 'ibrahim', arabic: 'إِبْرَاهِيم', transliteration: 'Ibrahim', english: 'Abraham', note: 'The friend of the Merciful, tested with words and fulfilled them.', noteAr: 'خليل الرحمن، ابتُلي بكلمات فأتمّهن.', reference: '2:124' },
  { id: 'lut', arabic: 'لُوط', transliteration: 'Lut', english: 'Lot', note: 'Sent to a town given over to shameful deeds.', noteAr: 'أُرسل إلى قريةٍ أُسلِمت إلى الفاحشة.', reference: '7:80' },
  { id: 'ismail', arabic: 'إِسْمَاعِيل', transliteration: 'Ismail', english: 'Ishmael', note: 'True to his promise, and the son offered in sacrifice.', noteAr: 'صادق الوعد، وهو الذبيح.', reference: '19:54' },
  { id: 'ishaq', arabic: 'إِسْحَاق', transliteration: 'Ishaq', english: 'Isaac', note: 'Given glad tidings of in old age, a prophet among the righteous.', noteAr: 'بُشّر به على الكِبر، نبيًّا من الصالحين.', reference: '21:72' },
  { id: 'yaqub', arabic: 'يَعْقُوب', transliteration: 'Yaqub', english: 'Jacob', note: 'Father of the twelve tribes, who entrusted his sons to Allah.', noteAr: 'أبو الأسباط الاثني عشر، وأوصى بنيه بعبادة الله.', reference: '2:132' },
  { id: 'yusuf', arabic: 'يُوسُف', transliteration: 'Yusuf', english: 'Joseph', note: 'Given knowledge of the interpretation of dreams and raised in station.', noteAr: 'أُوتي علم تأويل الأحاديث، ورفعه الله مكانًا عليًّا.', reference: '12:4' },
  { id: 'ayyub', arabic: 'أَيُّوب', transliteration: 'Ayyub', english: 'Job', note: 'Steadfast through long affliction, and healed by mercy.', noteAr: 'صبر على البلاء الطويل، ثم شفاه الله برحمته.', reference: '38:41' },
  { id: 'shuaib', arabic: 'شُعَيْب', transliteration: "Shu'aib", english: 'Jethro', note: 'Sent to Midyan to call for fair measure and honest weight.', noteAr: 'أُرسل إلى مدين، يدعو إلى وفاء الكيل والميزان.', reference: '7:85' },
  { id: 'musa', arabic: 'مُوسَىٰ', transliteration: 'Musa', english: 'Moses', note: 'Spoken to directly, given the Torah and nine clear signs.', noteAr: 'كلّمه الله تكليمًا، وأُوتي التوراة وتسع آياتٍ بيّنات.', reference: '20:11' },
  { id: 'harun', arabic: 'هَارُون', transliteration: 'Harun', english: 'Aaron', note: 'The eloquent helper given to his brother as a support.', noteAr: 'الوزير الفصيح، جُعل عضدًا لأخيه.', reference: '20:30' },
  { id: 'dhul-kifl', arabic: 'ذُو ٱلْكِفْل', transliteration: 'Dhul-Kifl', english: 'Ezekiel', note: 'Numbered among the patient and the righteous.', noteAr: 'معدود في الصابرين والصالحين.', reference: '21:85' },
  { id: 'dawud', arabic: 'دَاوُود', transliteration: 'Dawud', english: 'David', note: 'Given the Psalms, and judgement between people in truth.', noteAr: 'أُوتي الزبور، والحكم بين الناس بالحق.', reference: '38:17' },
  { id: 'sulayman', arabic: 'سُلَيْمَان', transliteration: 'Sulayman', english: 'Solomon', note: 'Given authority over wind, jinn and the speech of birds.', noteAr: 'أُوتي مُلكًا على الريح والجن، ومنطق الطير.', reference: '27:16' },
  { id: 'ilyas', arabic: 'إِلْيَاس', transliteration: 'Ilyas', english: 'Elijah', note: 'Called his people to leave the worship of Ba‘l.', noteAr: 'دعا قومه إلى ترك عبادة بعل.', reference: '37:123' },
  { id: 'al-yasa', arabic: 'ٱلْيَسَع', transliteration: 'Al-Yasa', english: 'Elisha', note: 'Counted among the excellent, remembered with favour.', noteAr: 'من الأخيار، مذكورٌ بالفضل.', reference: '38:48' },
  { id: 'yunus', arabic: 'يُونُس', transliteration: 'Yunus', english: 'Jonah', note: 'Swallowed by the great fish, and answered when he called in the darkness.', noteAr: 'التقمه الحوت، فنادى في الظلمات فاستُجيب له.', reference: '37:139' },
  { id: 'zakariyya', arabic: 'زَكَرِيَّا', transliteration: 'Zakariyya', english: 'Zechariah', note: 'Given a son in old age after a prayer made in secret.', noteAr: 'كافل مريم، ورُزق الولد على الكِبر بعد دعاءٍ في السر.', reference: '19:2' },
  { id: 'yahya', arabic: 'يَحْيَىٰ', transliteration: 'Yahya', english: 'John', note: 'Confirmed the word of Allah, and was granted wisdom as a child.', noteAr: 'مُصدّقًا بكلمة من الله، وأُوتي الحُكم صبيًّا.', reference: '19:7' },
  { id: 'isa', arabic: 'عِيسَىٰ', transliteration: 'Isa', english: 'Jesus', note: 'The Messiah, born of Mary, given the Gospel and clear proofs.', noteAr: 'المسيح، وُلد من مريم، وأُوتي الإنجيل والبيّنات.', reference: '3:45' },
  { id: 'muhammad', arabic: 'مُحَمَّد', transliteration: 'Muhammad', english: 'Muhammad', note: 'The final messenger, sent as a mercy to all worlds.', noteAr: 'خاتم المرسلين، أُرسل رحمةً للعالمين.', reference: '47:2' },
];
