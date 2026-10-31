/**
 * The evidence behind each worship guide, kept on the device.
 *
 * These used to be links out to sunnah.com and quran.com. Now the hadith and
 * the verses sit here, so a guide is readable with no connection and nothing
 * leaves the app.
 *
 * Two numberings are in play and they are not the same thing. `label` is the
 * citation you would give someone - "Sahih Muslim 759" - which follows
 * sunnah.com. `number` is the position in the hadith collection the app
 * itself reads, which is what the Hadith Library addresses. For Bukhari the
 * two agree; for Muslim they do not, because the API numbers the introduction
 * separately. Storing both means the citation stays recognisable while the
 * link into the library still lands on the right page.
 *
 * Pulled from the app's own server, which is the same source the Hadith
 * Library and the Quran reader use.
 */

export type GuideHadith = {
  /** Key used by the guides, e.g. 'bukhari-164'. */
  id: string;
  collection: 'bukhari' | 'muslim';
  /** Position in the collection, as the app's Hadith Library numbers it. */
  number: number;
  /** The citation as it would be given to a reader. */
  label: string;
  arabic: string;
  english: string;
};

export type GuideVerse = {
  id: string;
  label: string;
  surah: number;
  name: string;
  nameArabic: string;
  versesCount: number;
  verses: { n: number; ar: string; en: string }[];
};


export const GUIDE_HADITH: Record<string, GuideHadith> = {
  'bukhari-164': {
    id: 'bukhari-164', collection: 'bukhari', number: 164,
    label: 'Sahih al-Bukhari 164',
    english: 'Narrated Humran:(the freed slave of `Uthman bin `Affan) I saw `Uthman bin `Affan asking (for a tumbler of water) to perform ablution (and when it was brought) he poured water from it over his hands and washed them thrice and then put his right hand in the water container and rinsed his mouth and washed his nose by putting water in it and then blowing it out. Then he washed his face thrice and (then) forearms up to the elbows thrice, then passed his wet hands over his head and then washed each foot thrice. After that `Uthman said, "I saw the Prophet (ﷺ) performing ablution like this of mine, and he said, \'If anyone performs ablution like that of mine and offers a two-rak`at prayer during which he does not think of anything else (not related to the present prayer) then his past sins will be forgiven',
    arabic: 'حَدَّثَنَا أَبُو الْيَمَانِ، قَالَ أَخْبَرَنَا شُعَيْبٌ، عَنِ الزُّهْرِيِّ، قَالَ أَخْبَرَنِي عَطَاءُ بْنُ يَزِيدَ، عَنْ حُمْرَانَ، مَوْلَى عُثْمَانَ بْنِ عَفَّانَ أَنَّهُ رَأَى عُثْمَانَ دَعَا بِوَضُوءٍ، فَأَفْرَغَ عَلَى يَدَيْهِ مِنْ إِنَائِهِ، فَغَسَلَهُمَا ثَلاَثَ مَرَّاتٍ، ثُمَّ أَدْخَلَ يَمِينَهُ فِي الْوَضُوءِ، ثُمَّ تَمَضْمَضَ، وَاسْتَنْشَقَ، وَاسْتَنْثَرَ، ثُمَّ غَسَلَ وَجْهَهُ ثَلاَثًا وَيَدَيْهِ إِلَى الْمِرْفَقَيْنِ ثَلاَثًا، ثُمَّ مَسَحَ بِرَأْسِهِ، ثُمَّ غَسَلَ كُلَّ رِجْلٍ ثَلاَثًا، ثُمَّ قَالَ رَأَيْتُ النَّبِيَّ صلى الله عليه وسلم يَتَوَضَّأُ نَحْوَ وُضُوئِي هَذَا وَقَالَ ‏ "‏ مَنْ تَوَضَّأَ نَحْوَ وُضُوئِي هَذَا ثُمَّ صَلَّى رَكْعَتَيْنِ، لاَ يُحَدِّثُ فِيهِمَا نَفْسَهُ، غَفَرَ اللَّهُ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ ‏"‏‏.‏',
  },
  'bukhari-631': {
    id: 'bukhari-631', collection: 'bukhari', number: 631,
    label: 'Sahih al-Bukhari 631',
    english: 'Narrated Malik:We came to the Prophet (ﷺ) and stayed with him for twenty days and nights. We were all young and of about the same age. The Prophet (ﷺ) was very kind and merciful. When he realized our longing for our families, he asked about our homes and the people there and we told him. Then he asked us to go back to our families and stay with them and teach them (the religion) and to order them to do good things. He also mentioned some other things which I have (remembered or [??] ) forgotten. The Prophet (ﷺ) then added, "Pray as you have seen me praying and when it is the time for the prayer one of you should pronounce the Adhan and the oldest of you should lead the prayer',
    arabic: 'حَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى، قَالَ حَدَّثَنَا عَبْدُ الْوَهَّابِ، قَالَ حَدَّثَنَا أَيُّوبُ، عَنْ أَبِي قِلاَبَةَ، قَالَ حَدَّثَنَا مَالِكٌ، أَتَيْنَا إِلَى النَّبِيِّ صلى الله عليه وسلم وَنَحْنُ شَبَبَةٌ مُتَقَارِبُونَ، فَأَقَمْنَا عِنْدَهُ عِشْرِينَ يَوْمًا وَلَيْلَةً، وَكَانَ رَسُولُ اللَّهِ صلى الله عليه وسلم رَحِيمًا رَفِيقًا، فَلَمَّا ظَنَّ أَنَّا قَدِ اشْتَهَيْنَا أَهْلَنَا أَوْ قَدِ اشْتَقْنَا سَأَلَنَا عَمَّنْ تَرَكْنَا بَعْدَنَا فَأَخْبَرْنَاهُ قَالَ ‏ "‏ ارْجِعُوا إِلَى أَهْلِيكُمْ فَأَقِيمُوا فِيهِمْ وَعَلِّمُوهُمْ وَمُرُوهُمْ ـ وَذَكَرَ أَشْيَاءَ أَحْفَظُهَا أَوْ لاَ أَحْفَظُهَا ـ وَصَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي، فَإِذَا حَضَرَتِ الصَّلاَةُ فَلْيُؤَذِّنْ لَكُمْ أَحَدُكُمْ وَلْيَؤُمَّكُمْ أَكْبَرُكُمْ ‏"‏‏.‏',
  },
  'bukhari-1335': {
    id: 'bukhari-1335', collection: 'bukhari', number: 1335,
    label: 'Sahih al-Bukhari 1335',
    english: 'Narrated Talha bin `Abdullah bin `Auf:I offered the funeral prayer behind Ibn `Abbas and he recited Al-Fatiha and said, "You should know that it (i.e. recitation of Al-Fatiha) is the tradition of the Prophet Muhammad (ﷺ)',
    arabic: 'حَدَّثَنَا مُحَمَّدُ بْنُ بَشَّارٍ، حَدَّثَنَا غُنْدَرٌ، حَدَّثَنَا شُعْبَةُ، عَنْ سَعْدٍ، عَنْ طَلْحَةَ، قَالَ صَلَّيْتُ خَلْفَ ابْنِ عَبَّاسٍ ـ رضى الله عنهما ـ‏.‏ حَدَّثَنَا مُحَمَّدُ بْنُ كَثِيرٍ، أَخْبَرَنَا سُفْيَانُ، عَنْ سَعْدِ بْنِ إِبْرَاهِيمَ، عَنْ طَلْحَةَ بْنِ عَبْدِ اللَّهِ بْنِ عَوْفٍ، قَالَ صَلَّيْتُ خَلْفَ ابْنِ عَبَّاسٍ ـ رضى الله عنهما ـ عَلَى جَنَازَةٍ فَقَرَأَ بِفَاتِحَةِ الْكِتَابِ قَالَ لِيَعْلَمُوا أَنَّهَا سُنَّةٌ‏.‏',
  },
  'bukhari-953': {
    id: 'bukhari-953', collection: 'bukhari', number: 953,
    label: 'Sahih al-Bukhari 953',
    english: 'Narrated Anas bin Malik:Allah\'s Messenger (ﷺ) never proceeded (for the prayer) on the Day of `Id-ul-Fitr unless he had eaten some dates. Anas also narrated: The Prophet (ﷺ) used to eat odd number of dates',
    arabic: 'حَدَّثَنَا مُحَمَّدُ بْنُ عَبْدِ الرَّحِيمِ، حَدَّثَنَا سَعِيدُ بْنُ سُلَيْمَانَ، قَالَ حَدَّثَنَا هُشَيْمٌ، قَالَ أَخْبَرَنَا عُبَيْدُ اللَّهِ بْنُ أَبِي بَكْرِ بْنِ أَنَسٍ، عَنْ أَنَسٍ، قَالَ كَانَ رَسُولُ اللَّهِ صلى الله عليه وسلم لاَ يَغْدُو يَوْمَ الْفِطْرِ حَتَّى يَأْكُلَ تَمَرَاتٍ‏.‏ وَقَالَ مُرَجَّى بْنُ رَجَاءٍ حَدَّثَنِي عُبَيْدُ اللَّهِ قَالَ حَدَّثَنِي أَنَسٌ عَنِ النَّبِيِّ صلى الله عليه وسلم وَيَأْكُلُهُنَّ وِتْرًا‏.‏',
  },
  'bukhari-956': {
    id: 'bukhari-956', collection: 'bukhari', number: 956,
    label: 'Sahih al-Bukhari 956',
    english: 'Narrated Abu Sa`id Al-Khudri:The Prophet (ﷺ) used to proceed to the Musalla on the days of Id-ul-Fitr and Id-ul-Adha; the first thing to begin with was the prayer and after that he would stand in front of the people and the people would keep sitting in their rows. Then he would preach to them, advise them and give them orders, (i.e. Khutba). And after that if he wished to send an army for an expedition, he would do so; or if he wanted to give an order, he would do so, and then depart. The people followed this tradition till I went out with Marwan, the Governor of Medina, for the prayer of Id-ul-Adha or Id-ul-Fitr. When we reached the Musalla, there was a pulpit made by Kathir bin As-Salt. Marwan wanted to get up on that pulpit before the prayer. I got hold of his clothes but he pulled them and ascended the pulpit and delivered the Khutba before the prayer. I said to him, "By Allah, you have changed (the Prophet\'s tradition)." He replied, "O Abu Sa`id! Gone is that which you know." I said, "By Allah! What I know is better than what I do not know." Marwan said, "People do not sit to listen to our Khutba after the prayer, so I delivered the Khutba before the prayer',
    arabic: 'حَدَّثَنَا سَعِيدُ بْنُ أَبِي مَرْيَمَ، قَالَ حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، قَالَ أَخْبَرَنِي زَيْدٌ، عَنْ عِيَاضِ بْنِ عَبْدِ اللَّهِ بْنِ أَبِي سَرْحٍ، عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ، قَالَ كَانَ رَسُولُ اللَّهِ صلى الله عليه وسلم يَخْرُجُ يَوْمَ الْفِطْرِ وَالأَضْحَى إِلَى الْمُصَلَّى، فَأَوَّلُ شَىْءٍ يَبْدَأُ بِهِ الصَّلاَةُ ثُمَّ يَنْصَرِفُ، فَيَقُومُ مُقَابِلَ النَّاسِ، وَالنَّاسُ جُلُوسٌ عَلَى صُفُوفِهِمْ، فَيَعِظُهُمْ وَيُوصِيهِمْ وَيَأْمُرُهُمْ، فَإِنْ كَانَ يُرِيدُ أَنْ يَقْطَعَ بَعْثًا قَطَعَهُ، أَوْ يَأْمُرَ بِشَىْءٍ أَمَرَ بِهِ، ثُمَّ يَنْصَرِفُ‏.‏ قَالَ أَبُو سَعِيدٍ فَلَمْ يَزَلِ النَّاسُ عَلَى ذَلِكَ حَتَّى خَرَجْتُ مَعَ مَرْوَانَ وَهْوَ أَمِيرُ الْمَدِينَةِ فِي أَضْحًى أَوْ فِطْرٍ، فَلَمَّا أَتَيْنَا الْمُصَلَّى إِذَا مِنْبَرٌ بَنَاهُ كَثِيرُ بْنُ الصَّلْتِ، فَإِذَا مَرْوَانُ يُرِيدُ أَنْ يَرْتَقِيَهُ قَبْلَ أَنْ يُصَلِّيَ، فَجَبَذْتُ بِثَوْبِهِ فَجَبَذَنِي فَارْتَفَعَ، فَخَطَبَ قَبْلَ الصَّلاَةِ، فَقُلْتُ لَهُ غَيَّرْتُمْ وَاللَّهِ‏.‏ فَقَالَ أَبَا سَعِيدٍ، قَدْ ذَهَبَ مَا تَعْلَمُ‏.‏ فَقُلْتُ مَا أَعْلَمُ وَاللَّهِ خَيْرٌ مِمَّا لاَ أَعْلَمُ‏.‏ فَقَالَ إِنَّ النَّاسَ لَمْ يَكُونُوا يَجْلِسُونَ لَنَا بَعْدَ الصَّلاَةِ فَجَعَلْتُهَا قَبْلَ الصَّلاَةِ‏.‏',
  },
  'bukhari-1166': {
    id: 'bukhari-1166', collection: 'bukhari', number: 1166,
    label: 'Sahih al-Bukhari 1166',
    english: 'Narrated Jabir bin `Abdullah:The Prophet (ﷺ) used to teach us the way of doing Istikhara (Istikhara means to ask Allah to guide one to the right sort of action concerning any job or a deed), in all matters as he taught us the Suras of the Qur\'an. He said, "If anyone of you thinks of doing any job he should offer a two rak`at prayer other than the compulsory ones and say (after the prayer): -- \'Allahumma inni astakhiruka bi\'ilmika, Wa astaqdiruka bi-qudratika, Wa as\'alaka min fadlika Al-`azlm Fa-innaka taqdiru Wala aqdiru, Wa ta\'lamu Wala a\'lamu, Wa anta \'allamu l-ghuyub. Allahumma, in kunta ta\'lam anna hadha-lamra Khairun li fi dini wa ma\'ashi wa\'aqibati `Amri (or \'ajili `Amri wa\'ajilihi) Faqdirhu wa yas-sirhu li thumma barik li Fihi, Wa in kunta ta\'lamu anna hadha-lamra shar-run li fi dini wa ma\'ashi wa\'aqibati `Amri (or fi\'ajili `Amri wa ajilihi) Fasrifhu anni was-rifni anhu. Waqdir li al-khaira haithu kana Thumma ardini bihi.\' (O Allah! I ask guidance from Your knowledge, And Power from Your Might and I ask for Your great blessings. You are capable and I am not. You know and I do not and You know the unseen. O Allah! If You know that this job is good for my religion and my subsistence and in my Hereafter--(or said: If it is better for my present and later needs)--Then You ordain it for me and make it easy for me to get, And then bless me in it, and if You know that this job is harmful to me In my religion and subsistence and in the Hereafter--(or said: If it is worse for my present and later needs)--Then keep it away from me and let me be away from it. And ordain for me whatever is good for me, And make me satisfied with it). The Prophet (ﷺ) added that then the person should name (mention) his need',
    arabic: 'حَدَّثَنَا قُتَيْبَةُ، قَالَ حَدَّثَنَا عَبْدُ الرَّحْمَنِ بْنُ أَبِي الْمَوَالِي، عَنْ مُحَمَّدِ بْنِ الْمُنْكَدِرِ، عَنْ جَابِرِ بْنِ عَبْدِ اللَّهِ ـ رضى الله عنهما ـ قَالَ كَانَ رَسُولُ اللَّهِ صلى الله عليه وسلم يُعَلِّمُنَا الاِسْتِخَارَةَ فِي الأُمُورِ كَمَا يُعَلِّمُنَا السُّورَةَ مِنَ الْقُرْآنِ يَقُولُ ‏ "‏ إِذَا هَمَّ أَحَدُكُمْ بِالأَمْرِ فَلْيَرْكَعْ رَكْعَتَيْنِ مِنْ غَيْرِ الْفَرِيضَةِ ثُمَّ لِيَقُلِ اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ وَتَعْلَمُ وَلاَ أَعْلَمُ وَأَنْتَ عَلاَّمُ الْغُيُوبِ، اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي ـ أَوْ قَالَ عَاجِلِ أَمْرِي وَآجِلِهِ ـ فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي ـ أَوْ قَالَ فِي عَاجِلِ أَمْرِي وَآجِلِهِ ـ فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِي الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ ـ قَالَ ـ وَيُسَمِّي حَاجَتَهُ ‏"‏‏.‏',
  },
  'bukhari-1503': {
    id: 'bukhari-1503', collection: 'bukhari', number: 1503,
    label: 'Sahih al-Bukhari 1503',
    english: 'Narrated Ibn `Umar:Allah\'s Messenger (ﷺ) enjoined the payment of one Sa\' of dates or one Sa\' of barley as Zakat-ul-Fitr on every Muslim slave or free, male or female, young or old, and he ordered that it be paid before the people went out to offer the `Id prayer. (One Sa\' = 3 Kilograms approx)',
    arabic: 'حَدَّثَنَا يَحْيَى بْنُ مُحَمَّدِ بْنِ السَّكَنِ، حَدَّثَنَا مُحَمَّدُ بْنُ جَهْضَمٍ، حَدَّثَنَا إِسْمَاعِيلُ بْنُ جَعْفَرٍ، عَنْ عُمَرَ بْنِ نَافِعٍ، عَنْ أَبِيهِ، عَنِ ابْنِ عُمَرَ ـ رضى الله عنهما ـ قَالَ فَرَضَ رَسُولُ اللَّهِ صلى الله عليه وسلم زَكَاةَ الْفِطْرِ صَاعًا مِنْ تَمْرٍ، أَوْ صَاعًا مِنْ شَعِيرٍ عَلَى الْعَبْدِ وَالْحُرِّ، وَالذَّكَرِ وَالأُنْثَى، وَالصَّغِيرِ وَالْكَبِيرِ مِنَ الْمُسْلِمِينَ، وَأَمَرَ بِهَا أَنْ تُؤَدَّى قَبْلَ خُرُوجِ النَّاسِ إِلَى الصَّلاَةِ‏.‏',
  },
  'bukhari-1923': {
    id: 'bukhari-1923', collection: 'bukhari', number: 1923,
    label: 'Sahih al-Bukhari 1923',
    english: 'Narrated Anas bin Malik:The Prophet (ﷺ) said, "Take Suhur as there is a blessing in it',
    arabic: 'حَدَّثَنَا آدَمُ بْنُ أَبِي إِيَاسٍ، حَدَّثَنَا شُعْبَةُ، حَدَّثَنَا عَبْدُ الْعَزِيزِ بْنُ صُهَيْبٍ، قَالَ سَمِعْتُ أَنَسَ بْنَ مَالِكٍ ـ رضى الله عنه ـ قَالَ قَالَ النَّبِيُّ صلى الله عليه وسلم ‏ "‏ تَسَحَّرُوا فَإِنَّ فِي السَّحُورِ بَرَكَةً ‏"‏‏.‏',
  },
  'bukhari-2009': {
    id: 'bukhari-2009', collection: 'bukhari', number: 2009,
    label: 'Sahih al-Bukhari 2009',
    english: 'Narrated Abu Huraira: Allah\'s Messenger (ﷺ) said, "Whoever prayed at night the whole month of Ramadan out of sincere Faith and hoping for a reward from Allah, then all his previous sins will be forgiven." Ibn Shihab (a sub-narrator) said, "Allah\'s Messenger (ﷺ) died and the people continued observing that (i.e. Nawafil offered individually, not in congregation), and it remained as it was during the Caliphate of Abu Bakr and in the early days of \'Umar\'s Caliphate',
    arabic: 'حَدَّثَنَا عَبْدُ اللَّهِ بْنُ يُوسُفَ، أَخْبَرَنَا مَالِكٌ، عَنِ ابْنِ شِهَابٍ، عَنْ حُمَيْدِ بْنِ عَبْدِ الرَّحْمَنِ، عَنْ أَبِي هُرَيْرَةَ ـ رضى الله عنه ـ أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ ‏"‏‏.‏ قَالَ ابْنُ شِهَابٍ فَتُوُفِّيَ رَسُولُ اللَّهِ صلى الله عليه وسلم وَالأَمْرُ عَلَى ذَلِكَ، ثُمَّ كَانَ الأَمْرُ عَلَى ذَلِكَ فِي خِلاَفَةِ أَبِي بَكْرٍ وَصَدْرًا مِنْ خِلاَفَةِ عُمَرَ ـ رضى الله عنهما.‏',
  },
  'bukhari-2017': {
    id: 'bukhari-2017', collection: 'bukhari', number: 2017,
    label: 'Sahih al-Bukhari 2017',
    english: 'Narrated `Aisha:Allah\'s Messenger (ﷺ) said, "Search for the Night of Qadr in the odd nights of the last ten days of Ramadan',
    arabic: 'حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، حَدَّثَنَا إِسْمَاعِيلُ بْنُ جَعْفَرٍ، حَدَّثَنَا أَبُو سُهَيْلٍ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ ـ رضى الله عنها ـ أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ تَحَرَّوْا لَيْلَةَ الْقَدْرِ فِي الْوِتْرِ مِنَ الْعَشْرِ الأَوَاخِرِ مِنْ رَمَضَانَ ‏"‏‏.‏',
  },
  'muslim-136': {
    id: 'muslim-136', collection: 'muslim', number: 136,
    label: 'Sahih Muslim 26',
    english: 'It is narrated on the authority of \'Uthman that the Messenger of Allah (ﷺ) said. He who died knowing (fully well) that there is no god but Allah entered Paradise',
    arabic: 'حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، وَزُهَيْرُ بْنُ حَرْبٍ، كِلاَهُمَا عَنْ إِسْمَاعِيلَ بْنِ إِبْرَاهِيمَ، - قَالَ أَبُو بَكْرٍ حَدَّثَنَا ابْنُ عُلَيَّةَ، - عَنْ خَالِدٍ، قَالَ حَدَّثَنِي الْوَلِيدُ بْنُ مُسْلِمٍ، عَنْ حُمْرَانَ، عَنْ عُثْمَانَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ مَنْ مَاتَ وَهُوَ يَعْلَمُ أَنَّهُ لاَ إِلَهَ إِلاَّ اللَّهُ دَخَلَ الْجَنَّةَ ‏"‏ ‏.‏',
  },
  'muslim-1779': {
    id: 'muslim-1779', collection: 'muslim', number: 1779,
    label: 'Sahih Muslim 759',
    english: 'Abu Huraira reported Allah\'s Messenger (ﷺ) as saying:He who observed prayer at night during Ramadan, because of faith and seeking his reward from Allah, his previous sins would be forgiven',
    arabic: 'حَدَّثَنَا يَحْيَى بْنُ يَحْيَى، قَالَ قَرَأْتُ عَلَى مَالِكٍ عَنِ ابْنِ شِهَابٍ، عَنْ حُمَيْدِ بْنِ عَبْدِ الرَّحْمَنِ، عَنْ أَبِي هُرَيْرَةَ، أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ ‏"‏ ‏.‏',
  },
  'muslim-2278': {
    id: 'muslim-2278', collection: 'muslim', number: 2278,
    label: 'Sahih Muslim 984',
    english: 'Ibn Umar said that Allah\'s Messenger (way peace be upon him) prescribed the payment of Zakat-ul-Fitr (on breaking the fast) of Ramadan for people, for every freeman, or slave, male and female among the Muslims-one sa\' of dried dates, or one sa\' of barley',
    arabic: 'حَدَّثَنَا عَبْدُ اللَّهِ بْنُ مَسْلَمَةَ بْنِ قَعْنَبٍ، وَقُتَيْبَةُ بْنُ سَعِيدٍ، قَالاَ حَدَّثَنَا مَالِكٌ، ح وَحَدَّثَنَا يَحْيَى بْنُ يَحْيَى، - وَاللَّفْظُ لَهُ - قَالَ قَرَأْتُ عَلَى مَالِكٍ عَنْ نَافِعٍ عَنِ ابْنِ عُمَرَ أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم فَرَضَ زَكَاةَ الْفِطْرِ مِنْ رَمَضَانَ عَلَى النَّاسِ صَاعًا مِنْ تَمْرٍ أَوْ صَاعًا مِنْ شَعِيرٍ عَلَى كُلِّ حُرٍّ أَوْ عَبْدٍ ذَكَرٍ أَوْ أُنْثَى مِنَ الْمُسْلِمِينَ ‏.‏',
  },
};

export const GUIDE_VERSES: Record<string, GuideVerse> = {
  '5:6': {
    id: '5:6', label: 'Qur’an 5:6', surah: 5, name: 'Al-Maaida',
    nameArabic: 'سُورَةُ المَائـِدَةِ', versesCount: 120,
    verses: [
      { n: 6, en: 'O YOU who have attained to faith! When you are about to pray, wash your face, and your hands and arms up to the elbows, and pass your [wet] hands lightly over your head, and [wash] your feet up to the ankles. And if you are in a state. requiring total ablution, purify yourselves. But if you are ill, or are travelling, or have just satisfied a want of nature, or have cohabited with a woman, and can find no water-then take resort to pure dust, passing therewith lightly over your face and your hands. God does not want to impose any hardship on you, but wants to make you pure, and to bestow upon you the full measure of His blessings, so that you might have cause to be grateful.', ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا قُمْتُمْ إِلَى ٱلصَّلَوٰةِ فَٱغْسِلُوا۟ وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى ٱلْمَرَافِقِ وَٱمْسَحُوا۟ بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى ٱلْكَعْبَيْنِ ۚ وَإِن كُنتُمْ جُنُبًۭا فَٱطَّهَّرُوا۟ ۚ وَإِن كُنتُم مَّرْضَىٰٓ أَوْ عَلَىٰ سَفَرٍ أَوْ جَآءَ أَحَدٌۭ مِّنكُم مِّنَ ٱلْغَآئِطِ أَوْ لَٰمَسْتُمُ ٱلنِّسَآءَ فَلَمْ تَجِدُوا۟ مَآءًۭ فَتَيَمَّمُوا۟ صَعِيدًۭا طَيِّبًۭا فَٱمْسَحُوا۟ بِوُجُوهِكُمْ وَأَيْدِيكُم مِّنْهُ ۚ مَا يُرِيدُ ٱللَّهُ لِيَجْعَلَ عَلَيْكُم مِّنْ حَرَجٍۢ وَلَٰكِن يُرِيدُ لِيُطَهِّرَكُمْ وَلِيُتِمَّ نِعْمَتَهُۥ عَلَيْكُمْ لَعَلَّكُمْ تَشْكُرُونَ' },
    ],
  },
  '2:238': {
    id: '2:238', label: 'Qur’an 2:238', surah: 2, name: 'Al-Baqara',
    nameArabic: 'سُورَةُ البَقَرَةِ', versesCount: 286,
    verses: [
      { n: 238, en: 'BE EVER mindful of prayers, and of praying in the most excellent way; and stand before God in devout obedience.', ar: 'حَٰفِظُوا۟ عَلَى ٱلصَّلَوَٰتِ وَٱلصَّلَوٰةِ ٱلْوُسْطَىٰ وَقُومُوا۟ لِلَّهِ قَٰنِتِينَ' },
    ],
  },
  '3:18': {
    id: '3:18', label: 'Qur’an 3:18', surah: 3, name: 'Aal-i-Imraan',
    nameArabic: 'سُورَةُ آلِ عِمۡرَانَ', versesCount: 200,
    verses: [
      { n: 18, en: 'GOD [Himself] proffers evidence - and [so do] the angels and all who are endowed with knowledge - that there is no deity save Him, the Upholder of Equity: there is no deity save Him, the Almighty, the Truly Wise.', ar: 'شَهِدَ ٱللَّهُ أَنَّهُۥ لَآ إِلَٰهَ إِلَّا هُوَ وَٱلْمَلَٰٓئِكَةُ وَأُو۟لُوا۟ ٱلْعِلْمِ قَآئِمًۢا بِٱلْقِسْطِ ۚ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ' },
    ],
  },
  '2:183-187': {
    id: '2:183-187', label: 'Qur’an 2:183-187', surah: 2, name: 'Al-Baqara',
    nameArabic: 'سُورَةُ البَقَرَةِ', versesCount: 286,
    verses: [
      { n: 183, en: 'O YOU who have attained to faith! Fasting is ordained for you as it was ordained for those before you, so that you might remain conscious of God:', ar: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ كَمَا كُتِبَ عَلَى ٱلَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ' },
      { n: 184, en: '[fasting] during a certain number of days. But whoever of you is ill, or on a journey, [shall fast instead for the same] number of other days; and [in such cases] it is incumbent upon those who can afford it to make sacrifice by feeding a needy person. And whoever does more good than he is bound to do does good unto himself thereby; for to fast is to do good unto yourselves - if you but knew it.', ar: 'أَيَّامًۭا مَّعْدُودَٰتٍۢ ۚ فَمَن كَانَ مِنكُم مَّرِيضًا أَوْ عَلَىٰ سَفَرٍۢ فَعِدَّةٌۭ مِّنْ أَيَّامٍ أُخَرَ ۚ وَعَلَى ٱلَّذِينَ يُطِيقُونَهُۥ فِدْيَةٌۭ طَعَامُ مِسْكِينٍۢ ۖ فَمَن تَطَوَّعَ خَيْرًۭا فَهُوَ خَيْرٌۭ لَّهُۥ ۚ وَأَن تَصُومُوا۟ خَيْرٌۭ لَّكُمْ ۖ إِن كُنتُمْ تَعْلَمُونَ' },
      { n: 185, en: 'It was the month of Ramadan in which the Qur\'an was [first] bestowed from on high as a guidance unto man and a self-evident proof of that guidance, and as the standard by which to discern the true from the false. Hence, whoever of you lives to see this month shall fast throughout it; but he that is ill, or on a journey, [shall fast instead for the same] number of other days. God wills that you shall have ease, and does not will you to suffer hardship; but [He desires] that you complete the number [of days required], and that you extol God for His having guided you aright, and that you render your thanks [unto Him].', ar: 'شَهْرُ رَمَضَانَ ٱلَّذِىٓ أُنزِلَ فِيهِ ٱلْقُرْءَانُ هُدًۭى لِّلنَّاسِ وَبَيِّنَٰتٍۢ مِّنَ ٱلْهُدَىٰ وَٱلْفُرْقَانِ ۚ فَمَن شَهِدَ مِنكُمُ ٱلشَّهْرَ فَلْيَصُمْهُ ۖ وَمَن كَانَ مَرِيضًا أَوْ عَلَىٰ سَفَرٍۢ فَعِدَّةٌۭ مِّنْ أَيَّامٍ أُخَرَ ۗ يُرِيدُ ٱللَّهُ بِكُمُ ٱلْيُسْرَ وَلَا يُرِيدُ بِكُمُ ٱلْعُسْرَ وَلِتُكْمِلُوا۟ ٱلْعِدَّةَ وَلِتُكَبِّرُوا۟ ٱللَّهَ عَلَىٰ مَا هَدَىٰكُمْ وَلَعَلَّكُمْ تَشْكُرُونَ' },
      { n: 186, en: 'AND IF My servants ask thee about Me - behold, I am near; I respond to the call of him who calls, whenever he calls unto Me: let them, then, respond unto Me, and believe in Me, so that they might follow the right way.', ar: 'وَإِذَا سَأَلَكَ عِبَادِى عَنِّى فَإِنِّى قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ ٱلدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا۟ لِى وَلْيُؤْمِنُوا۟ بِى لَعَلَّهُمْ يَرْشُدُونَ' },
      { n: 187, en: 'IT IS lawful for you to go in unto your wives during the night preceding the [day\'s] fast: they are as a garment for you, and you are as a garment for them. God is aware that you would have deprived yourselves of this right, and so He has turned unto you in His mercy and removed this hardship from you. Now, then, you may lie with them skin to skin, and avail yourselves of that which God has ordained for you, and eat and drink until you can discern the white streak of dawn against the blackness of night, and then resume fasting until nightfall; but do not lie with them skin to skin when you are about to abide in meditation in houses of worship. These are the bounds set by God: do not, then, offend against them - [for] it is thus that God makes clear His messages unto mankind, so that they might remain conscious of Him.', ar: 'أُحِلَّ لَكُمْ لَيْلَةَ ٱلصِّيَامِ ٱلرَّفَثُ إِلَىٰ نِسَآئِكُمْ ۚ هُنَّ لِبَاسٌۭ لَّكُمْ وَأَنتُمْ لِبَاسٌۭ لَّهُنَّ ۗ عَلِمَ ٱللَّهُ أَنَّكُمْ كُنتُمْ تَخْتَانُونَ أَنفُسَكُمْ فَتَابَ عَلَيْكُمْ وَعَفَا عَنكُمْ ۖ فَٱلْـَٰٔنَ بَٰشِرُوهُنَّ وَٱبْتَغُوا۟ مَا كَتَبَ ٱللَّهُ لَكُمْ ۚ وَكُلُوا۟ وَٱشْرَبُوا۟ حَتَّىٰ يَتَبَيَّنَ لَكُمُ ٱلْخَيْطُ ٱلْأَبْيَضُ مِنَ ٱلْخَيْطِ ٱلْأَسْوَدِ مِنَ ٱلْفَجْرِ ۖ ثُمَّ أَتِمُّوا۟ ٱلصِّيَامَ إِلَى ٱلَّيْلِ ۚ وَلَا تُبَٰشِرُوهُنَّ وَأَنتُمْ عَٰكِفُونَ فِى ٱلْمَسَٰجِدِ ۗ تِلْكَ حُدُودُ ٱللَّهِ فَلَا تَقْرَبُوهَا ۗ كَذَٰلِكَ يُبَيِّنُ ٱللَّهُ ءَايَٰتِهِۦ لِلنَّاسِ لَعَلَّهُمْ يَتَّقُونَ' },
    ],
  },
  '2:184-185': {
    id: '2:184-185', label: 'Qur’an 2:184-185', surah: 2, name: 'Al-Baqara',
    nameArabic: 'سُورَةُ البَقَرَةِ', versesCount: 286,
    verses: [
      { n: 184, en: '[fasting] during a certain number of days. But whoever of you is ill, or on a journey, [shall fast instead for the same] number of other days; and [in such cases] it is incumbent upon those who can afford it to make sacrifice by feeding a needy person. And whoever does more good than he is bound to do does good unto himself thereby; for to fast is to do good unto yourselves - if you but knew it.', ar: 'أَيَّامًۭا مَّعْدُودَٰتٍۢ ۚ فَمَن كَانَ مِنكُم مَّرِيضًا أَوْ عَلَىٰ سَفَرٍۢ فَعِدَّةٌۭ مِّنْ أَيَّامٍ أُخَرَ ۚ وَعَلَى ٱلَّذِينَ يُطِيقُونَهُۥ فِدْيَةٌۭ طَعَامُ مِسْكِينٍۢ ۖ فَمَن تَطَوَّعَ خَيْرًۭا فَهُوَ خَيْرٌۭ لَّهُۥ ۚ وَأَن تَصُومُوا۟ خَيْرٌۭ لَّكُمْ ۖ إِن كُنتُمْ تَعْلَمُونَ' },
      { n: 185, en: 'It was the month of Ramadan in which the Qur\'an was [first] bestowed from on high as a guidance unto man and a self-evident proof of that guidance, and as the standard by which to discern the true from the false. Hence, whoever of you lives to see this month shall fast throughout it; but he that is ill, or on a journey, [shall fast instead for the same] number of other days. God wills that you shall have ease, and does not will you to suffer hardship; but [He desires] that you complete the number [of days required], and that you extol God for His having guided you aright, and that you render your thanks [unto Him].', ar: 'شَهْرُ رَمَضَانَ ٱلَّذِىٓ أُنزِلَ فِيهِ ٱلْقُرْءَانُ هُدًۭى لِّلنَّاسِ وَبَيِّنَٰتٍۢ مِّنَ ٱلْهُدَىٰ وَٱلْفُرْقَانِ ۚ فَمَن شَهِدَ مِنكُمُ ٱلشَّهْرَ فَلْيَصُمْهُ ۖ وَمَن كَانَ مَرِيضًا أَوْ عَلَىٰ سَفَرٍۢ فَعِدَّةٌۭ مِّنْ أَيَّامٍ أُخَرَ ۗ يُرِيدُ ٱللَّهُ بِكُمُ ٱلْيُسْرَ وَلَا يُرِيدُ بِكُمُ ٱلْعُسْرَ وَلِتُكْمِلُوا۟ ٱلْعِدَّةَ وَلِتُكَبِّرُوا۟ ٱللَّهَ عَلَىٰ مَا هَدَىٰكُمْ وَلَعَلَّكُمْ تَشْكُرُونَ' },
    ],
  },
  '97': {
    id: '97', label: 'Qur’an 97', surah: 97, name: 'Al-Qadr',
    nameArabic: 'سُورَةُ القَدۡرِ', versesCount: 5,
    verses: [
      { n: 1, en: 'BEHOLD, from on high have We bestowed this [divine writ] on Night of Destiny.', ar: 'بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ إِنَّآ أَنزَلْنَٰهُ فِى لَيْلَةِ ٱلْقَدْرِ' },
      { n: 2, en: 'And what could make thee conceive what it is, that Night of Destiny?', ar: 'وَمَآ أَدْرَىٰكَ مَا لَيْلَةُ ٱلْقَدْرِ' },
      { n: 3, en: 'The Night of Destiny is better than a thousand months:', ar: 'لَيْلَةُ ٱلْقَدْرِ خَيْرٌۭ مِّنْ أَلْفِ شَهْرٍۢ' },
      { n: 4, en: 'in hosts descend in it the angels, bearing divine inspiration by their Sustainer\'s leave; from all [evil] that may happen', ar: 'تَنَزَّلُ ٱلْمَلَٰٓئِكَةُ وَٱلرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍۢ' },
      { n: 5, en: 'does it make secure, until the rise of dawn.', ar: 'سَلَٰمٌ هِىَ حَتَّىٰ مَطْلَعِ ٱلْفَجْرِ' },
    ],
  },
};
