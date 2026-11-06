# Bengali (Bangladesh Bangla) register — settled for round 46

## Code and label
- `bn`, native **বাংলা**, english "Bengali". Already present in the
  `SupportedLanguage` union (languages.ts line 20) and in `HADITH_LANGUAGES`.
- No `bn` row in the main `LANGUAGES` list yet — one must be added.

## Text edition
- 12 Bengali translations in the catalogue. Pick: **`tr_bn_muhiuddin_khan`**
  (মুহিউদ্দীন খান) — the standard Bangladesh translation (Islamic Foundation
  Bangladesh). Alternatives kept in mind: `tr_bn_zohurul_hoque` (জহুরুল হক),
  also highly respected.

## Audio
- **None.** All probes 403 (`bn.bn_bn`, `bn.bengali`, `bn.abdullah_bn`,
  `bn.zakaria`, `bn.muhiuddin`, `bn.arif`, `bn.nasir`); controls `ar.alafasy`,
  `fr.leclerc`, `ru.kuliev-audio`, `tr.vakfi-audio` all 200 on the same path,
  so the 403s are a real negative. No Bengali audio edition anywhere in the
  484. → **no `voice` entry** (as with Persian and Urdu, round 35 rule).

## Vocabulary — the terms Bangladeshi Muslims actually use

The standing rule (round 33) is that a language keeps the religious register
its own community prays in, not a calque from English. For Bangladesh that
means the Perso-Arabic vocabulary carried through Urdu/Persian into Bangla:

| English | Bengali | Roman |
|---|---|---|
| Quran | কুরআন | Quran |
| surah | সূরা | sura |
| ayah / verse | আয়াত | ayat |
| **juz** | **পারা** | **para** |  ← subcontinent term, not a transliteration of juz |
| hizb | হিজব | hizb |
| prayer (salah) | **নামাজ** | **namaz** |  ← not সালাত; this is what people say |
| rak'ah | রাকাত | rakat |
| wudu | **অজু** | **oju** |
| ghusl | **গোসল** | **gosol** |
| fasting | **রোজা** | **roza** |
| iftar | ইফতার | iftar |
| suhoor | **সেহরি** | **sehri** |
| zakat | যাকাত | zakat |
| zakat al-fitr | **ফিতরা** | **fitra** |  ← the Bangladeshi word for it |
| charity / sadaqa | সাদাকা | sadaqa |
| adhan | আজান | ajan |
| dhikr | **জিকির** | **jikir** |
| dua | দোয়া | doa |
| taraweeh | তারাবিহ | tarabih |
| witr | **বিতর** | **bitar** |
| istikhara | ইস্তিখারা | istikhara |
| janazah | জানাজা | janaza |
| eid | ঈদ | Eid |
| Laylat al-Qadr | লাইলাতুল কদর | Lailatul Qadr |
| ihram | ইহরাম | ihram |
| tawaf | তাওয়াফ | tawaf |
| sa'i | সাঈ | sa'i |
| miqat | মিকাত | miqat |
| talbiyah | তালবিয়া | talbiya |
| Kaaba | কাবা | Kaba |
| masjid | মসজিদ | mosjid |
| qibla | কিবলা | qibla |
| mushaf | মুসহাফ | mushaf |
| tafsir | তাফসির | tafsir |
| hadith | হাদিস | hadis |
| sunnah | সুন্নাহ | sunnah |
| Rasul / Messenger | রাসূল | Rasul |
| takbir | তাকবির | takbir |
| salam | সালাম | salam |
| tashahhud | তাশাহহুদ | tashahhud |
| ruku | রুকু | ruku |
| sajdah | সিজদা | sijdah |
| **qada / make-up** | **কাজা** | **kaza** |
| madhab | মাজহাব | majhab |
| Hanafi / Shafi'i | হানাফি / শাফিঈ | Hanafi / Shafi'i |
| Ramadan | **রমজান** | **Romjan** |  ← Bangladeshi pronunciation |
| Shawwal | শাওয়াল | Shawwal |
| Shaban | শাবান | Shaban |
| Dhul-Hijjah | **জিলহজ** | **Jilhaj** |  ← subcontinent pronunciation |
| Muharram | মুহররম | Muharram |
| Ashura | আশুরা | Ashura |
| Hijri | হিজরি | Hijri |
| Arafah | আরাফা | Arafah |
| Mina | মিনা | Mina |
| Muzdalifah | মুজদালিফা | Muzdalifah |
| jamarat | জামারাত | jamarat |

## Fiqh of menstruation
- hayd → হায়েজ (hayez), but where English says "period"/"menstruation" in
  ordinary terms, use **ঋতুস্রাব** (ritusrab) or **মাসিক** (masik).
- nifas → নেফাস (nefas); post-natal bleeding in ordinary terms → প্রসবোত্তর রক্তস্রাব.
- istihada → ইস্তেহাজা (istehaja)
- tuhr → তুহর (tuhr)
- nisab → নিসাব (nisab); fidyah → ফিদইয়া (fidya)

## Typography
- Bengali script, left-to-right. Bengali uses **।** (daṛi) as its full stop,
  not ".". Sentences end with। — this matters for correctness.
- Numbers: Bengali digits (০১২৩৪৫৬৭৮৯) exist but the app uses Latin digits
  in placeholders ({n}, {p}), so keep Latin digits inside placeholders and use
  Bengali punctuation around them.
- No apostrophe issue: Bengali uses no apostrophes, so the escaping concern
  that drove the French decision does not apply here.
- Prophet ﷺ never bare.
