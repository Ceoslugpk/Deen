# Islamic — Feature Gap & Privacy Report

**Purpose:** decide what to build next, under the constraint **no account, full privacy**.

**Method:** market/user research (October 2026) + a line-by-line audit of the
codebase. Every "missing" claim below was verified by grepping the source, not
inferred from a feature list.

---

## 1. Executive summary

Three findings, in order of importance:

1. **Privacy is the wedge, and you are already well positioned.** The category
   leader sold its users' location data to a broker that supplied US Special
   Operations Command [1](https://www.aljazeera.com/news/2020/11/18/muslim-pro-app-denies-selling-user-data-to-us-military)
   [3](https://www.middleeasteye.net/news/us-military-data-muslim-pro-app-denounced). The broker, X-Mode, was later
   the subject of a 2024 FTC settlement [10](https://deenytracker.app/). An entire
   generation of privacy-first apps exists *because* of that. Islamic has
   **no ad SDK, no analytics SDK, no advertising ID, and no account** — verified
   in §4. That is a real, defensible, marketable position.

2. **The feature gap is concentrated in the Quran reader — specifically the
   three things users ask for most and the app does not have: word-by-word,
   word roots, and audio follow-along.** All three are verifiably absent from
   the code. All three are repeatedly the top request in competitor reviews.
   All three are privacy-safe (static data, on device).

3. **The 2026 AI wave is a trap for you — and an opportunity.** Every AI
   feature the market is moving toward (recitation correction, fiqh chatbot,
   personalised plans) works by uploading the user's voice or worship data.
   That is incompatible with "no account, full privacy" as normally implemented.
   The privacy-preserving version (on-device models) is achievable and would be
   a genuine differentiator, but it is a large engineering commitment and should
   be a deliberate decision, not a default.

---

## 2. Market context

### The privacy backlash created this category

In November 2020, Motherboard/Vice reported that Muslim Pro was sending location
data to X-Mode, a broker whose customers included US military contractors [1](https://www.aljazeera.com/news/2020/11/18/muslim-pro-app-denies-selling-user-data-to-us-military).
The app had ~98.5 million downloads; Singapore's Personal Data Protection
Commission opened an investigation [2](https://www.zdnet.com/article/singapore-investigating-claims-muslim-app-developer-sold-user-data-to-us-military/).
Users deleted it en masse and publicly recommended alternatives [3](https://www.middleeasteye.net/news/us-military-data-muslim-pro-app-denounced).
A separate app, Salaat First, was found selling precise coordinates with device
details and timestamps [4](https://deenytracker.app/articles/muslim-pro-alternative-private).

What users switched *to* — and what they now expect — is a coherent list. The
privacy-first apps that followed all promise the same four things:
**no ads, no account, no trackers, data stays on device** [4](https://deenytracker.app/articles/muslim-pro-alternative-private)
[10](https://deenytracker.app/) [21](https://salah-streak.vercel.app/).

The closest competitor to your positioning is **islamic.app**, which markets
itself as "No signup. No ads. No tracking… Everything you read, memorise, or
save stays on your device" [9](https://islamic.app/) — 130+ translations,
48,000+ hadith, prayer times, Qibla, Ramadan, 50+ reciters, memorisation.
Your feature set is broader (Zakat, women's cycle, journeys, Umrah, encrypted
backup), but they are the benchmark on message clarity.

### What users actually complain about

From app-store reviews of the incumbents [5](https://play.google.com/store/apps/details?id=com.myIslam.my_islam)
[6](https://apps.apple.com/us/app/muslim-app-azan-qibla-quran/id1137963102)
[7](https://justuseapp.com/en/app/537070378/quran-pro-muslim-%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86-%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85/reviews)
[8](https://mwm.ai/apps/quran-by-quranly/1559233786):

| Complaint | Frequency |
|---|---|
| **Ads** — "the ads are ridiculous"; "I absolutely loove that there are NO ads" | Very high |
| **Paywalls/subscriptions** — Quranly's move to subscription left users "misled or betrayed" | High |
| **Audio doesn't follow the text** — auto-scroll runs at "some predetermined speed that doesn't match the speed of the recitation"; no verse highlighting | High |
| **Can't resume audio** at a specific ayah; surah always restarts | High |
| **No transliteration** — repeatedly requested, especially Roman Urdu/Hindi for South Asia | Very high |
| **Bookmark bugs**, smallest font still too large | Medium |
| **Login problems** — "No reset options for password… it wouldn't let me login" | Medium |

### What users ask for

- **Transliteration** — the single most-requested Quran feature, again and again [8](https://mwm.ai/apps/quran-by-quranly/1559233786) [13](https://halaltrendz.com/the-rise-of-digital-quran-learning-what-busy-families-want-f)
- **Word-by-word** — tap any word for its meaning; "word by word" is now table stakes in study apps [15](https://www.reddit.com/r/Quraniyoon/comments/1radwnz/i_built_a_quran_web_app_openfurqancom_with_2/) [14](https://www.tareequljannah.com/blogs/best-online-quran-app/)
- **Word roots + lexicon** (Lane's Lexicon, Kitab al-Ayn) — the "deep study" tier [15](https://www.reddit.com/r/Quraniyoon/comments/1radwnz/i_built_a_quran_web_app_openfurqancom_with_2/)
- **Tajweed colour coding** [14](https://www.tareequljannah.com/blogs/best-online-quran-app/) [16](https://apps.apple.com/us/app/quran-360-alquran-english/id1613305778)
- **Home & lock screen widgets** for prayer times [20](https://www.reddit.com/r/MuslimLounge/comments/1sdlh7e/top_5_islamic_apps_for_western_muslims_in_2026/) [21](https://salah-streak.vercel.app/)
- **Streaks + gentle habit building** — "a no-shame streak forgives the hard days" [10](https://deenytracker.app/)
- **Reward (hasanat) tracking** — Quranly tracks hasanat per ayah and users find it motivating [8](https://mwm.ai/apps/quran-by-quranly/1559233786)
- **Multiple concurrent khatams** — "my masjid does 2+ khatams… any way to add multiple Quran reading tabs?" [8](https://mwm.ai/apps/quran-by-quranly/1559233786)
- **Qibla with vibration / AR / map view** [20](https://www.reddit.com/r/MuslimLounge/comments/1sdlh7e/top_5_islamic_apps_for_western_muslims_in_2026/)

### The new 2026 category: the adhan app-lock

The most notable new idea isn't a Quran feature at all. Three separate apps —
**FivePrayer**, **Deeny**, and **SalahFirst** — now *lock distracting apps when
adhan begins* [12](https://www.fiveprayer.app/alternatives/muslim-pro)
[10](https://deenytracker.app/) [11](https://github.com/ichbrt/SalahFirst).
FivePrayer calls it "the only Muslim app that does this" and builds its whole
identity on it. SalahFirst, MIT-licensed, is explicit that it is "a commitment
device, not a supervisor… It does not try to verify that you prayed, and it
never traps you on your own phone" [11](https://github.com/ichbrt/SalahFirst).

---

## 3. What "no account, full privacy" should mean

Distilled from what the privacy-first apps actually promise and do. Treat this
as the acceptance criteria for every feature that follows.

**Non-negotiable**
- No account, no sign-in, no email, no phone number.
- No ad SDK, no ad network, no advertising identifier (IDFA/GAID).
- No analytics, no crash reporter that ships user content, no attribution SDK.
- No third-party SDK that the user hasn't been told about.
- Worship data — prayer log, streaks, notes, bookmarks, cycle/hayd records,
  memorisation progress — **stored only on the device**.
- Works offline. Ideally fully functional in airplane mode.
- Deleting the app deletes everything, because there is nothing else to delete.

**Location, specifically** (the Muslim Pro failure mode)
- Location is used **on the device** to compute prayer times and Qibla.
- Coordinates leave only when a feature genuinely requires a remote answer.
- No reverse geocoding — resolving a coordinate to a place name means sending
  that coordinate to a third party. Salah First refuses to do this at all and
  ships a bundled city list instead [11](https://github.com/ichbrt/SalahFirst).
- Reduce precision where you can (they round to ~100 m).
- State plainly, in the app, what leaves and when.

**Worth having**
- Encrypted local backup the user controls. `→` **you already have this.**
- A published, plain-language data-sources list. `→` **you already have this.**
- Open source, or at minimum an auditable network inventory.

---

## 4. Where Islamic stands

### Privacy audit — strong, with two things to tighten

Verified against the source, not the marketing:

| Check | Result |
|---|---|
| Ad SDK / AdMob / ad network | **None** |
| Advertising ID (IDFA/GAID) | **None** |
| Analytics (Firebase, Amplitude, Mixpanel, Segment) | **None** |
| Crash reporting (Sentry, Crashlytics) | **None** |
| Account / sign-in | **None** |
| Reverse geocoding of user coordinates | **None** — Nominatim is listed in the data-sources screen but marked `status: 'unwired'`; the city search sends a *name* to open-meteo, not coordinates |
| Worship data location | On-device, plus the encrypted backup added recently |
| Offline support | Yes — offline Quran, downloads, preload |

Two things leave the device today, both inherent to the feature:
1. **Coordinates → `api.aladhan.com`** for prayer times and the Hijri calendar.
   Unavoidable unless you compute times fully on-device (which is what
   SalahFirst and Deeny do, using calculation libraries).
2. **Coordinates → `api.islamic.app/masajid/near`** for the mosque finder.
   Opt-in by nature, but worth surfacing.

Minor: `ACCESS_FINE_LOCATION` is requested; `ACCESS_COARSE_LOCATION` would be
sufficient for city-level prayer times and is the privacy-reducing choice worth
offering.

Twenty-three hosts are contacted in total, all for content (Quran, hadith,
prayer times, gold price for Zakat, currency, reciters). None is a tracker.

### Feature inventory — already broad

65 routes are registered. You have: Quran reader with mushaf page layout,
translations, tafsir comparison, tajweed study, vocabulary, topics, bookmarks,
notes, Hifz, memorisation mode, audio player with reciters, prayer times, adhan,
Qibla, Hijri calendar, Ramadan, fasting, Qada, Zakat, Tasbih, Adhkar, Duas, 99
Names, Prophet names, hadith (10 collections), women's guides, cycle tracking,
purity, journeys, pilgrimage, Umrah packing, mosques, reading plans, weekly
summary, reports, encrypted backup, privacy lock.

**Present and worth knowing** (I checked, because the research said to):
transliteration (43 references), tajweed including a Tajweed Study screen
(23), streaks (38), prayer tracking (14), Qibla, reading plans, offline.

---

## 5. The gaps

Ranked by demand × effort × privacy-safety.

### Tier 1 — high demand, low risk, no privacy cost

| # | Gap | Evidence it's wanted | Verified missing |
|---|---|---|---|
| **1** | **Word-by-word** — tap an Arabic word for its meaning | "Word-by-word Understanding (Tap any word to reveal its meaning)" is the headline feature of a 4.8★ app [5](https://play.google.com/store/apps/details?id=com.myIslam.my_islam); standard in study apps [14](https://www.tareequljannah.com/blogs/best-online-quran-app/) [15](https://www.reddit.com/r/Quraniyoon/comments/1radwnz/i_built_a_quran_web_app_openfurqancom_with_2/) | ✅ Only 3 matches in the codebase, all in the new adapter's *vocabulary* about edition variants. **No UI feature.** |
| **2** | **Audio follow-along** — highlight the verse being recited | The single most detailed audio complaint: scroll "doesn't match the speed of the recitation"; "I wish there was an option to highlight the verses being read" [7](https://justuseapp.com/en/app/537070378/quran-pro-muslim-%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86-%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85/reviews) | ✅ `autoScroll`, `followAlong`, `currentAyah`: **0 matches** |
| **3** | **Word roots + lexicon** | The "deep study" tier; openfurqan built its whole Study Mode on roots, dictionary and Lane's Lexicon [15](https://www.reddit.com/r/Quraniyoon/comments/1radwnz/i_built_a_quran_web_app_openfurqancom_with_2/) | ✅ `wordRoot`, `lexicon`: **0 matches** |
| **4** | **Home & lock screen widgets** | Named as a feature in the 2026 roundups [20](https://www.reddit.com/r/MuslimLounge/comments/1sdlh7e/top_5_islamic_apps_for_western_muslims_in_2026/); Salah Streak offers streak + times widgets [21](https://salah-streak.vercel.app/) | ✅ `widget`: **0 matches** |
| **5** | **Audio sleep timer** | Standard in Quran audio; "auto-off timer" ships in My Islam 3.0 [5](https://play.google.com/store/apps/details?id=com.myIslam.my_islam) | ✅ **0 matches** |
| **6** | **Multiple concurrent plans** | "My masjid does 2+ khatams… any way to add multiple Quran reading tabs?" [8](https://mwm.ai/apps/quran-by-quranly/1559233786) | ✅ Reading Plans holds **one** plan (`loadPlan()` → single object) |

### Tier 2 — meaningful, slightly more work

| # | Gap | Note |
|---|---|---|
| **7** | **Adhan app-lock / distraction block** | The defining 2026 feature [12](https://www.fiveprayer.app/alternatives/muslim-pro) [11](https://github.com/ichbrt/SalahFirst). iOS needs the Screen Time / FamilyActivityPicker API — which is deliberately privacy-preserving: it runs out-of-process and the app receives opaque tokens, never learning what's installed [11](https://github.com/ichbrt/SalahFirst). Android needs Usage Access. Take SalahFirst's stance: a commitment device, not a supervisor; never trap the user. |
| **8** | **Hasanat / reward tracking** | Quranly's most-praised feature — hasanat per ayah, weekly and daily totals, and Ramadan multipliers [8](https://mwm.ai/apps/quran-by-quranly/1559233786). Purely local arithmetic; zero privacy cost. Handle the fiqh carefully: cite sources, present as encouragement, never as a ledger of deeds. |
| **9** | **Qibla upgrades** — vibration when aligned, map view, optional AR | Yours is a clean numeric compass [20](https://www.reddit.com/r/MuslimLounge/comments/1sdlh7e/top_5_islamic_apps_for_western_muslims_in_2026/). Vibration-on-alignment is the cheapest high-value add. AR is a gimmick for most; skip unless asked. |
| **10** | **Kids / family mode** | Thurayya serves ages 4–12 with a parent dashboard [19](https://iqrawarattel.com/best-ai-quran-apps-2026/); families are named as the growth segment [13](https://halaltrendz.com/the-rise-of-digital-quran-learning-what-busy-families-want-f). Note: a parent dashboard is the one place "no account" gets tempting — keep it local and PIN-locked. |

### Tier 3 — strategic, needs a decision

| # | Gap | Tension |
|---|---|---|
| **11** | **On-device prayer-time calculation** | Removes the last routine coordinate egress. SalahFirst computes 12 methods fully offline and works in airplane mode [11](https://github.com/ichbrt/SalahFirst); Deeny precomputes 30 days on device [12](https://www.fiveprayer.app/blog/best-quran-app). This is how you make "location never leaves" literally true rather than mostly true. |
| **12** | **AI features** | See §6. |

### Deliberately not recommended

- **Community-verified iqamah times** (DeenHub's differentiator [20](https://www.reddit.com/r/MuslimLounge/comments/1sdlh7e/top_5_islamic_apps_for_western_muslims_in_2026/)) — depends on crowdsourcing, which in practice means accounts. Conflicts with your constraint.
- **Social / family leaderboards** — same problem.
- **Cloud sync** — conflicts directly. Your encrypted file backup is the right
  answer to "I got a new phone," and it already exists.
- **AR Qibla** — novelty; low retention.

---

## 6. The AI question

The market is moving hard toward AI: recitation correction with phonetic-level
tajweed feedback, AI fiqh assistants, personalised plans, voice-controlled
dhikr [17](https://www.aarmeh.ae/blog/the-role-of-ai-in-islamic-apps-in-2026/)
[18](https://justprayapp.co/blog/ai-changing-muslim-apps-2026)
[19](https://iqrawarattel.com/best-ai-quran-apps-2026/).

**Every one of these, as built by everyone shipping them, breaks your
constraint.** They work by uploading the user's voice — the most sensitive
input in the app, and for recitation correction it must be uploaded continuously
— or their worship history, to someone else's server. Tarteel built its model
partly from crowdsourced recordings of ordinary users' mistakes [19](https://iqrawarattel.com/best-ai-quran-apps-2026/).

You have three options:

**(a) Skip AI.** Defensible. Your position is privacy, and "the app that doesn't
listen to you recite" is a coherent thing to be.

**(b) On-device AI only.** The genuinely differentiating path. On-device speech
recognition exists and is good enough for verse-level matching. Nothing leaves
the phone. This is expensive: model shipping, size, battery, accuracy work — and
it is a multi-month commitment, not a feature.

**(c) Optional, explicit, off-by-default AI.** A setting the user turns on, with
a plain sentence about what is uploaded and to whom. Honest, but it does soften
the "full privacy" claim to "full privacy until you ask for the smart feature."

**Recommendation:** (a) now, (b) later if it becomes the thing you're known for.
Do not drift into (c) — a single opt-in analytics or AI SDK is exactly how the
category got into trouble. Note also that the experts agree AI does not replace
a teacher: "Apps teach awareness; teachers teach mastery" [19](https://iqrawarattel.com/best-ai-quran-apps-2026/).

There is one AI-adjacent feature with **no** privacy cost worth considering:
**on-device pattern surfacing** from data you already hold — "you've missed Asr
on four of the last seven Tuesdays." The pattern is computed locally from
local data. That is item 18's headline example [18](https://justprayapp.co/blog/ai-changing-muslim-apps-2026)
minus the upload.

---

## 7. Recommended order

Assuming you want the biggest return first:

**Phase A — the reader gaps (all Tier 1, all static data, all privacy-safe)**
1. Word-by-word (data: a word-level corpus; `corpus.quran.com` is already a
   listed source)
2. Audio follow-along verse highlighting
3. Audio sleep timer
4. Word roots + lexicon

**Phase B — habit and surface**
5. Home/lock screen widgets (prayer times, next prayer, streak)
6. Multiple concurrent reading plans
7. Qibla vibration on alignment
8. Hasanat tracking

**Phase C — the differentiators**
9. Adhan app-lock (the 2026 category-defining feature)
10. On-device prayer-time calculation (makes "location never leaves" true)
11. Kids mode, if families are the target

**Later, if at all:** on-device AI (§6b).

Phase A is independent of the Cloudflare work in
`IMPLEMENTATION_REQUIREMENTS.md` and can run in parallel.

---

## 8. Two things to fix regardless of what you build

1. **Say the privacy promise out loud, in the app.** islamic.app leads with
   "No signup. No ads. No tracking" and itemises what stays on the device [9](https://islamic.app/).
   You already *do* all of it — you just don't say it in one place. There is a
   privacy screen with a "no ad tracking" line, but no single statement of the
   full promise. This is the cheapest win available and it is pure positioning.

2. **Offer coarse location, and state what leaves.** Reduce to
   `ACCESS_COARSE_LOCATION` as the default with fine as an opt-in for the mosque
   finder, and put one sentence in Settings: *"Your coordinates go to AlAdhan
   for prayer times, and to the mosque finder when you open it. Nothing else
   leaves your phone."* That single sentence is the difference between claiming
   privacy and demonstrating it.

---

## Appendix — verification

| Claim | How verified |
|---|---|
| No ad/analytics/crash SDK | Grepped App.tsx + all services for AdMob, Firebase, Amplitude, Mixpanel, Segment, Sentry, Crashlytics, IDFA, advert. All zero; the 4 "Sentry" hits are the substring in `NifasEntry`, the "Segment" hit is a haptics comment, the "analytics" hit is the `analytics-outline` icon on the privacy screen. |
| Word-by-word absent | 3 matches, all in `islamicDataApi.ts` describing edition variants |
| Audio follow-along absent | `autoScroll`, `followAlong`, `currentAyah`, `highlight`: 0 matches in App.tsx and `audioService.ts` |
| Word roots absent | `wordRoot`, `lexicon`: 0 matches; the 9 "root" hits are navigation roots |
| Widgets absent | `widget`: 0 matches |
| Hasanat absent | `hasanat`: 0 matches |
| Kids mode absent | `kids`: 0 matches; 30 "children" hits are React props |
| App-lock absent | `lockApp`, "app lock": 0 matches |
| Single reading plan | `loadPlan()` returns one `{days, startedAt, completed}` object under one key |
| Qibla is numeric-only | `QiblaScreen` renders a rotating compass + `direction.toFixed(1)°`; no vibration, map or AR |
| Transliteration present | 43 references across App.tsx, api.ts, tasbihService.ts, namesService.ts |
| Tajweed present | `TajweedText`, `useTajweed`, `tajweedPractice`, `tajweedRule`, `tajweedSwatch`, plus a Tajweed Study route |
| No reverse geocoding | Nominatim entry in `sources.ts` is `status: 'unwired'`; city search sends `?name=`, not coordinates |
