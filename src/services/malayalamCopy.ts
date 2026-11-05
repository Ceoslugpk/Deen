/**
 * The interface copy in Malayalam.
 *
 * English is the source: `tx()` falls back to it for any string not written
 * here, so an unfinished language is never a screen of blanks, only a screen
 * that is partly Malayalam and partly English until the copy is finished.
 *
 * Register. Kerala's Muslims have their own vocabulary for the acts of the
 * faith, and it is not the Sanskritised vocabulary of the Malayalam of the
 * temple. This file follows the words a Malayali Muslim actually says:
 *
 *   the fast is നോമ്പ് (nōmp), not വ്രതം
 *   the prayer is നിസ്കാരം (niskāram), not പ്രാർത്ഥന
 *   the call is ബാങ്ക് (bāṅk), the word in the minaret, not a transliteration
 *     of adhan
 *   the pre-dawn meal is അത്താഴം (attāḻam) and the breaking of the fast is
 *     നോമ്പുതുറ (nōmputuṟa)
 *   the mosque is പള്ളി (palli)
 *   the major ablution is ഗുസ്ൽ (gusl)
 *
 * Where a word is Arabic it is written as Malayalam Muslims write it, with
 * the Malayalam letters that carry it: ഖുർആൻ, സകാത്ത്, ഹദീസ്, തഫ്സീർ.
 *
 * The noon prayer is worth a note because it is the test of whether any of
 * this was checked. It is ളുഹർ — with the Malayalam retroflex ള, which no
 * other Indian language has and which every machine transliteration of
 * "Dhuhr" gets wrong.
 *
 * Respect. Where the text names God, the Prophet, or the revelation, it does
 * so in the register Malayalam Muslim writing uses: അല്ലാഹു, and നബി ﷺ with
 * the invocation, never the bare name.
 *
 * Script. Malayalam, left to right. Note that this is exactly why an `rtl`
 * boolean must never be used to choose a language, and why every helper that
 * once took one now takes a code.
 */
export const ML: Record<string, string> = {
  'Cancel': 'റദ്ദാക്കുക',
  'Close': 'അടയ്ക്കുക',
  'Open': 'തുറക്കുക',
  'Save': 'സംരക്ഷിക്കുക',
  'Delete': 'ഇല്ലാതാക്കുക',
  'Remove': 'നീക്കം ചെയ്യുക',
  'Clear': 'മായ്ക്കുക',
  'Copy': 'പകർത്തുക',
  'Copied': 'പകർത്തി',
  'Try again': 'വീണ്ടും ശ്രമിക്കുക',
  'Share': 'പങ്കിടുക',
  'Share as image card': 'ചിത്ര കാർഡായി പങ്കിടുക',
  'Share as text': 'വാചകമായി പങ്കിടുക',
  'Image saved': 'ചിത്രം സംരക്ഷിച്ചു',
  'Show all': 'എല്ലാം കാണിക്കുക',
  'Pause': 'താൽക്കാലികമായി നിർത്തുക',
  'Search a surah': 'ഒരു സൂറത്ത് തിരയുക',
  'Search a language': 'ഒരു ഭാഷ തിരയുക',
  'Clear search': 'തിരയൽ മായ്ക്കുക',
  'Send by email': 'ഇമെയിൽ വഴി അയയ്ക്കുക',
  'Write a private reflection…': 'സ്വകാര്യ ചിന്ത എഴുതുക…',

  'Language': 'ഭാഷ',
  'Settings': 'ക്രമീകരണങ്ങൾ',
  'Notifications': 'അറിയിപ്പുകൾ',
  'Storage': 'സംഭരണം',
  'Backup': 'ബാക്കപ്പ്',
  'Data sources': 'ഡാറ്റാ സ്രോതസ്സുകൾ',
  'My reports': 'എന്റെ റിപ്പോർട്ടുകൾ',
  'Report a correction': 'തിരുത്തൽ റിപ്പോർട്ട് ചെയ്യുക',
  'Kept on this device': 'ഈ ഉപകരണത്തിൽ സൂക്ഷിച്ചിരിക്കുന്നു',
  'Read from this device — the network is not reachable right now.': 'ഈ ഉപകരണത്തിൽ നിന്ന് വായിക്കുക — നെറ്റ്‌വർക്ക് ഇപ്പോൾ ലഭ്യമല്ല.',

  'Islamic': 'ഇസ്‌ലാമിക്',
  'QURAN': 'ഖുർആൻ',
  'Surah': 'സൂറത്ത്',
  'Verse': 'ആയത്ത്',
  'verses': 'ആയത്തുകൾ',
  'Tafsir': 'തഫ്സീർ',
  'Translation': 'വിവർത്തനം',
  'Transliteration': 'ലിപ്യന്തരണം',
  'Continue reading': 'വായന തുടരുക',
  'Quran reading': 'ഖുർആൻ വായന',
  'Next verse': 'അടുത്ത ആയത്ത്',
  'The Arabic text': 'അറബി വാചകം',
  'The reference or numbering': 'റഫറൻസ് അല്ലെങ്കിൽ നമ്പറിംഗ്',
  'Something else': 'മറ്റെന്തെങ്കിലും',

  'Hadith': 'ഹദീസ്',
  'hadith': 'ഹദീസ്',
  'Hadith of the day': 'ഇന്നത്തെ ഹദീസ്',
  'books': 'പുസ്തകങ്ങൾ',

  'The Beautiful Names': 'വിശുദ്ധ നാമങ്ങൾ',
  'Women’s worship': 'സ്ത്രീകളുടെ ആരാധനകൾ',
  'Purity and ghusl': 'ശുദ്ധിയും ഗുസ്‌ലും',
  'Worship guidance': 'ആരാധനാ മാർഗ്ഗനിർദ്ദേശം',
  'Lock and PIN': 'ലോക്കും പിന്നും',
  'Set a PIN': 'ഒരു പിൻ സജ്ജമാക്കുക',

  'Fasting record': 'നോമ്പ് രേഖ',
  'Qada fasts': 'ഖദാ നോമ്പുകൾ',
  'Days owed': 'ബാക്കി ദിവസങ്ങൾ',
  'Cycle': 'ആർത്തവചക്രം',
  'Cycle Tracker': 'ആർത്തവ ട്രാക്കർ',
  'Day {n}': 'ദിവസം {n}',
  '{n} days': '{n} ദിവസം',
  'days': 'ദിവസങ്ങൾ',
  'day': 'ദിവസം',
  'Today': 'ഇന്ന്',
  'TODAY': 'ഇന്ന്',
  'History': 'ചരിത്രം',

  'Gold': 'സ്വർണം',
  'Silver': 'വെള്ളി',
};
