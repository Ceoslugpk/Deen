# Home-screen research and implementation direction

## Product hierarchy

A worship companion home screen should answer the most time-sensitive question first: **what is the next prayer, when is it, and are these times for the correct location?** Current prayer products such as Pillars emphasize at-a-glance next-prayer countdowns, the full five-prayer day, Hijri date, and prayer tracking. Athan similarly centers prayer times and daily goals. The home experience should then expose a small set of timely actions rather than reproduce the whole feature library.

Sources:
- Pillars prayer widgets: https://thepillarsapp.com/prayer-times-widget
- Pillars App Store listing: https://apps.apple.com/us/app/pillars-prayer-times-qibla/id1559086853
- Athan App Store listing: https://apps.apple.com/us/app/athan-prayer-times-dua-azkar/id505858403

## Recommended home hierarchy

1. Calm greeting and current worship context.
2. Next-prayer card with countdown, date, location, and direct schedule access.
3. Today’s five prayers and completion progress.
4. A short, contextual action rail: Quran, Qibla, time-appropriate Adhkar, Tasbih, and audio.
5. A reflection rail for verified Ayah, Divine Name, Dua, and private quick Tasbih.
6. Weekly progress, Quran continuation, and sourced Hadith as secondary content further down.

This keeps live/time-sensitive information above the fold and uses progressive disclosure for the large toolset.

## Sliding-card findings

A horizontal rail is preferable to an auto-rotating hero carousel. It keeps peer items available without hiding a critical primary message. The next card should visibly “peek” at the edge to communicate that the row continues; dots alone are weak signifiers. Nielsen Norman Group recommends keeping a carousel to five or fewer frames. Mobile carousel guidance also recommends avoiding automatic rotation and providing a non-gesture alternative.

Sources:
- NN/G mobile carousel discoverability: https://www.nngroup.com/articles/mobile-carousels/
- NN/G effective carousels: https://www.nngroup.com/articles/designing-effective-carousels/
- Smashing Magazine carousel UX: https://www.smashingmagazine.com/2022/04/designing-better-carousel-ux/
- ACM Queue mobile accessibility: https://queue.acm.org/detail.cfm?id=3704628

## Accessibility requirements

- Do not auto-advance.
- Support swipe/trackpad and explicit Previous/Next controls.
- Give controls descriptive accessibility labels and disabled states.
- Announce the current card position.
- Keep controls at least 40–44 points and preserve visible focus behavior.
- Respect RTL direction and reduced-motion expectations.

Sources:
- W3C carousel tutorial: https://www.w3.org/WAI/tutorials/carousels/
- WAI-ARIA carousel pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

## Responsive rules implemented

- 320–359 px: stacked location prompt, compact tab labels/icons, full primary card with a controlled next-card peek.
- 360–759 px: one primary card plus a visible next-card edge.
- 760 px and above: approximately three cards visible while preserving the rail interaction.
- Content is capped at a readable desktop width rather than stretched edge-to-edge.
- The next-prayer hero grows on wide screens and retains a compact phone composition.
- Horizontal document overflow is blocked while nested card rails remain independently scrollable.
