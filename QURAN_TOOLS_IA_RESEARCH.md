# Quran tools information architecture — implementation note

## Question
How should a feature-rich Quran home organize reading, navigation, study, preferences, and personal progress without becoming a flat tool directory?

## Short research findings

- Quran.com’s product surfaces prioritize continuing a reading session, search, bookmarks, progress, translations, and Tafsir. This supports making “resume/read” the dominant action rather than giving every tool equal visual weight.
- Quran.com product updates and established Quran apps treat Surah/Juz navigation, reading, and study as distinct jobs. A dedicated index or compact navigator is easier to scan than a mixed feature wall.
- The Holy Quran app case study by Volpis similarly emphasizes resume reading, bookmarks, search, customization, and progress as first-class paths.
- The Cinta Quran UI/UX case study identifies dense menus and small targets as practical usability issues.
- Material card guidance supports adapting cards from full-width mobile compositions to multi-column large-screen arrangements. Related secondary content can use horizontal rails.
- W3C carousel guidance supports user-controlled, non-auto-advancing rails with explicit controls and meaningful accessible labels.
- General responsive guidance supports 44 px minimum targets and changing composition at breakpoints rather than merely shrinking desktop grids.

## Implemented hierarchy

1. **Search and continuation** — global Quran search and saved reading position appear first.
2. **Reading hero** — one calm editorial entry into verified Arabic and translation.
3. **Read and navigate** — Mushaf/resume is dominant; Search, Juz, and Hizb are compact peers.
4. **Study and understand** — Topics, Tafsir/Compare, Tajweed, and Vocabulary form a user-controlled horizontal rail.
5. **Reading preferences** — script/display and translation are contextual settings, not competing “tools.”
6. **Your Quran** — bookmarks, notes, plans, Hifz, and offline preparation show live local status.
7. **Recent and all Surahs** — recency and the complete canonical directory remain discoverable below the task shortcuts.

## Responsive decisions

- Narrow phones: full-width primary action, three compact navigation cards, horizontally scrollable study cards, two-column personal status cards.
- Phones: the same hierarchy with all three compact navigation cards on one row.
- Tablets/desktops: primary reader action and compact navigation share one row; three study cards are visible with the fourth discoverable in the rail; personal status expands to five columns.
- The content width is capped for readable desktop measure, while rails retain horizontal affordance.
- Controls/cards exceed 44 px, do not auto-advance, retain graphical icons, and preserve app-level RTL/LTR behavior.

## Sources reviewed

- https://quran.com/apps
- https://quran.com/about-us
- https://quran.com/en/product-updates
- https://volpis.com/projects/the-holy-quran/
- https://bytecrab.com/works/quran-app-rebuild/
- https://medium.com/@ahmadbashirstudio/uiux-case-study-cinta-quran-app-c2bef8fdd301
- https://m2.material.io/components/cards
- https://m3.material.io/components/cards/guidelines
- https://www.w3.org/WAI/tutorials/carousels/
