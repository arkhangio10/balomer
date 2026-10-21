# Adapting football game and broadcast graphics to an original 10-foot Fire TV app, and the legal limits on borrowing them

Scope note: research done 2026-10-21. Amazon's main Fire TV design page is dated 2020 and was written for Fire OS (Android-based). The Vega focus page is current (Sept 2026). Lower-third durations and subtitle reading-speed numbers come mostly from secondary or vendor sources. Part 3 summarises legal sources and is **not legal advice**.

## Q1. What do Amazon's Fire TV / Vega guidelines (and the Android TV / tvOS equivalents) say about safe zones, type sizes, focus and colour for 1080p TV UIs?

### Takeaway
Amazon says to design for a 1920x1080 canvas and keep all UI out of the outer 5% of every edge. Focused items and text must sit inside the inner 90%. Body text should be at least 14sp, which Amazon equates to about 28px at 1080p. Colours should be less saturated and lean cool, and the focused element must be obvious at a glance. Vega's current focus docs add one rule: show focus with a *physical* change (a border, a size change or an added UI element) rather than colour or opacity alone, because physical changes still show in High Contrast mode.

### Cited Findings
**Amazon Fire TV design and UX guidelines (page last updated Oct 29, 2020; written for Fire OS, still the canonical Fire TV design page)**
- Safe zone: "avoid placing any of your app's UI elements within the outer 5% of any edge on the screen." The focused item and on-screen text "should be fully within the inner 90% (the safe zone)." Overscan varies by TV maker and users can adjust it. It can be previewed in Developer Options or System X-Ray. — [Amazon Fire TV Design and UX Guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html)
- Canvas: design "for a full 1080p television screen": 1920x1080px, 320dpi ("xhdpi"), 960x540dp ("large"). — [Amazon Fire TV Design and UX Guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html)
- Typography: body text "at least 14sp", which is about 19px at 720p and 28px at 1080p. System font is Helvetica Neue Regular. Keep descriptions short in content and line width. Use more line spacing than on desktop or tablet. Write short, declarative sentences in chunks. The page gives no weight or line-length numbers. — [Amazon Fire TV Design and UX Guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html)
- Colour: TVs have more contrast than monitors, so colours look more saturated. Use less saturated colours and prefer cool tones (blue, purple, gray) over warm ones (red, orange). No contrast ratios are given. — [Amazon Fire TV Design and UX Guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html)
- Focus and selection: show clearly which element has focus. When a user looks away and back, "it should remain clear what options they have for navigation." On Select, the element should "momentarily change to the selected state." — [Amazon Fire TV Design and UX Guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html)
- D-pad: every actionable element must be reachable with the D-pad. The layout should make the vertical and horizontal axes obvious. 1D lists wrap from the last item to the first. Left moves from content back to the nav menu. — [Amazon Fire TV Design and UX Guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html)
- Density: limit the elements on each screen and space them far enough apart to read from a distance. Minimise text. The page has **no animation or motion guidance**. — [Amazon Fire TV Design and UX Guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html)

**Amazon Vega focus management (v0.24, "Last modified on September 10, 2026")**
- Focus indicators should be physical changes, "such as adding borders, modifying element size, or introducing additional UI components," because "physical alterations remain detectable even with accessibility setting such as High Contrast mode enabled." Colour and opacity changes are described as "purely visual." — [Vega Focus Management 0.24](https://developer.amazon.com/docs/vega/0.24/focus-management.html)
- Defaults: Touchables drop to opacity 0.2 on focus, adjustable with `activeOpacity`. The custom example uses `onFocus`/`onBlur` state to add `borderWidth: 2`. Scale and elevation are not covered. — [Vega Focus Management 0.24](https://developer.amazon.com/docs/vega/0.24/focus-management.html)
- Navigation model: Cartesian by default, meaning focus moves to the nearest item in the pressed direction. Overrides are `nextFocusUp/Down/Left/Right`, `hasTVPreferredFocus` (initial render only), `FocusManager` (`setNextFocus`, `setFocusRoot`, `focus`, `blur`, `getFocused`) and `TVFocusGuideView` (with a `destination` prop, ported from react-native-tvos). Hidden containers should set `pointerEvents: 'none'` and `accessibilityElementsHidden: true`. Keep `onFocus`/`onBlur` light, and "shorten animations that might be skipped during rapid key presses." — [Vega Focus Management 0.24](https://developer.amazon.com/docs/vega/0.24/focus-management.html)

**Amazon Ads specs (ads only, not app guidance, but the only Amazon numbers on TV font size and contrast)**
- Sponsored Tiles: minimum font size 24px "for the living-room experience". Text of 24px/18pt or larger may use a 3:1 contrast ratio; smaller text needs 4.5:1. Inline banners keep content 27px from each edge. — [Amazon Ads Sponsored Tiles](https://advertising.amazon.com/resources/ad-specs/fire-tv/sponsored-tiles); [Amazon Ads Inline](https://advertising.amazon.com/ad-specs/en/fire-tv/inline)

**Android TV (Google) guidance**
- Overscan-safe margin of 5%: 48dp left and right, 27dp top and bottom. Background elements may extend past it. (Taken from a search summary of the page, which was not opened in full.) — [Android: Build TV layouts](https://developer.android.com/training/tv/playback/compose/layouts)
- Focus system: scale on focus, with defaults of **1.025, 1.05 and 1.1x** ("scaling values ... can vary based on their size"). Glow/shadow elevation runs 2dp–32dp. Outline (width, inset, colour), border, background/content colour change and tonal elevation +1 to +5 are also options. An element stays "pressed" until the remote button is released. No durations are given. — [Android TV Focus system](https://developer.android.com/design/ui/tv/guides/styles/focus-system)
- Colour on TV: "Avoid using white background unless necessary", since darker colours also save power. Design and test for **Standard** picture mode, because Vivid boosts saturation. Use sRGB for UI. Prevent banding with high-bit-depth gradients and dithering, or use solid colours or subtle patterns instead of gradients. "Avoid relying solely on color to convey information." Users watch "at varying distances, and in low-light." — [Android TV Color on TV](https://developer.android.com/design/ui/tv/guides/foundations/color-on-tv)
- Typography: Roboto is the default. Choose fonts with large counters, avoid thin strokes ("thinner lines are not instantly recognisable"), use sans-serif for body and labels, and avoid decorative fonts for body text. The 15-style scale's sp values only appear in an image. — [Android TV Typography](https://developer.android.com/design/ui/tv/guides/styles/typography)

**tvOS and general TV design (secondary)**
- Apple (quoted in Smashing): "Inset primary content 60 points from the top/bottom of the screen, and 80 points from the sides." The same article recommends a 24px base size on TV (16–18px on the web), a 5–6 step type scale, avoiding pure white `#ffffff` in dim rooms, and focus shown by scaling, background inversion and/or borders. (Smashing Magazine, Sept 4, 2025.) — [Smashing Magazine, Designing for TV Part 2](https://smashingmagazine.com/2025/09/designing-tv-principles-patterns-practical-guidance/)

**WCAG 2.2 (W3C Recommendation)**
- 1.4.3 Contrast (Minimum): 4.5:1 for text, 3:1 for "large-scale" text, defined as "at least 18 point or 14 point bold". 1.4.11 Non-text Contrast: 3:1 for "visual information required to identify user interface components and states". 1.4.1: colour must not be "the only visual means of conveying information". 2.4.7: focus indicator must be visible. 2.4.13 (AAA): the focus indicator should be at least as large as a 2 CSS px perimeter and have 3:1 contrast between focused and unfocused states. — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

### Inferences
- In 1920x1080 px, the 5% margin is **96px left/right and 54px top/bottom**. The Android 48dp/27dp figures are the same margin at Fire TV's 960x540dp density. All of Balomer's interactive and text elements (radar frame, stats panel, minute-alert banner, report text) should sit inside x 96→1824, y 54→1026. A decorative pitch texture or background may bleed to the edges.
- Floor of **28px** for any text (Amazon's 14sp at 1080p). Every TV text size then counts as WCAG "large text" (18pt ≈ 24px), which technically only needs 3:1. Glare, distance and Vivid picture modes argue for **≥4.5:1 for all text and numbers anyway**, with 3:1 as the floor for non-text marks (player dots, lines, hull strokes, focus rings).
- Amazon's "cool tones, less saturation" and Android's "no white backgrounds, test in Standard mode" fit the dark tactical-board style. Use an off-white such as `#E8ECEF` rather than `#FFFFFF` for primary text, and use solid fills or a coarse binned grid instead of smooth gradients, which band on TVs.
- Focus on Vega, within the "transform/opacity only on the native driver" constraint: make the outline a separate pre-rendered View and animate only its `opacity`, together with `transform: scale` (1.05 for small buttons and tabs, 1.025 for large panels, following Android's defaults). Animating `borderWidth` is not a transform or opacity and would break the constraint. This gives the *physical* change Vega asks for: a ring appears and the element grows.
- Balomer is mostly a display app with few focusable elements (tabs or buttons such as Live / Radar / Report / Dismiss alert). `hasTVPreferredFocus` for the initial target and `TVFocusGuideView` / `setFocusRoot` to keep focus inside an open halftime report are the documented tools for this.

### Gaps
- No Vega-specific *visual design* guideline (type scale, safe area, colour) was found that replaces the 2020 Fire TV page. Whether Vega apps at 1080p lay out in 1920x1080 px or 960x540 dp logical units, and which system font Vega ships, were **not verified**. Check the Vega docs ([dev guides overview](https://developer.amazon.com/docs/vega/0.24/dev-guides-overview.html)) before fixing sizes in code.
- The Apple tvOS HIG was not fetched directly (JS-rendered). Apple's values come from a Smashing Magazine quote.
- Android's exact TV type-scale sp values are in an image that could not be read.
- No Amazon source gives animation or motion guidance for Fire TV or Vega apps.

## Q2. What durations and easing do broadcast graphics use for in/out animations, and how long should an alert or stat pop-up stay on screen to be readable?

### Takeaway
No public broadcast-industry timing standard was found; broadcaster graphic packages are proprietary. The best-supported numbers come from three places:
- **UI motion research:** 100–500 ms overall. Entrances take about 300 ms with ease-out; exits are shorter, about 200–250 ms.
- **Subtitle reading norms:** BBC 160–180 wpm, roughly 0.3 s minimum per word.
- **Lower-third practice:** 3–7 s on screen, with 5 s a common default.

WCAG adds one constraint: content that moves automatically for more than 5 seconds alongside other content needs a way to pause, stop or hide it.

### Cited Findings
- NN/g (Page Laubheimer, Feb 9, 2020): UI animations should run **100–500 ms** depending on complexity and distance. Simple feedback takes about **100 ms**. A substantial change (such as a modal entering) takes **200–300 ms**. Large movements across big screens go up to about **400 ms**, and around 500 ms "start[s] to feel like a real drag." Entering should be slightly longer than exiting (popup **300 ms** in, **200–250 ms** out). Use **ease-out for entering** ("starts quickly but slows down"); ease-in or ease-in-out for exits can feel sluggish. Avoid linear motion. "The more often an animation appears, the shorter and more subtle it should be." Respect reduce-motion. Opacity changes on many elements at once can be expensive. — [NN/g, Executing UX Animations: Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/)
- Ease-out suits entrances and ease-in suits exits. Ease-out *feels* faster than ease-in at the same duration. (Secondary skill-summary page, low authority.) — [playbooks.com slow-in/out](https://playbooks.com/skills/dylantarre/animation-principles/slow-in-out-mastery)
- Lower-third on-screen time: **3–7 s** "so viewers have enough time to absorb the information" — [Riverside glossary](https://riverside.com/video-editor/video-editing-glossary/lower-third). Rule of thumb: time yourself reading the text and leave it up for **2–2.5×** that time — [Epidemic Sound](https://www.epidemicsound.com/blog/lower-thirds/). Tool default of **5 s** — [Articulate Replay 360](https://community.articulate.com/series/119/articles/replay-360-adding-lower-thirds). All three are vendor or blog sources, not broadcast standards.
- BBC subtitle guidance: **160–180 words per minute**, minimum on-screen time of about **0.3 s per word** (for example, 1.2 s for 4 words), at most 2 lines, about 37 characters per line on broadcast. This is summarised by a third party; the official BBC document was not reached, and secondary sources cite different versions (v1.2.3 and v1.2.5). — [Clevercast summary of BBC Subtitling Guidelines](https://clevercast.com/bbc-subtitling-guidelines)
- WCAG 2.2.2 Pause, Stop, Hide: any "moving, blinking or scrolling information that (1) starts automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content" needs a mechanism to pause, stop or hide it. 2.2.1 has a real-time-event exception for time limits. 2.3.1 forbids anything that flashes "more than three times in any one second period." — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- Vega Animated: with `useNativeDriver: true` the whole animation is sent to native before it starts, so "the JS thread can be blocked without affecting the animation." In the 0.83 docs the option is marked required for `timing()`/`decay()`. Only Animated wrappers (Animated.View, Text, Image, ScrollView, FlatList) animate, and they do "targeted native updates" that skip React reconciliation. — [Vega Animated 0.83](https://developer.amazon.com/docs/react-native-vega/0.83/animated.html)
- Vega focus doc: shorten animations that may be skipped during rapid D-pad presses, and keep focus handlers light. — [Vega Focus Management 0.24](https://developer.amazon.com/docs/vega/0.24/focus-management.html)
- A sports-graphics template (Epic Games / Capacity Studios, Unreal) ships ten animations for live playout, driven by one controller so team names can be swapped. This shows the broadcast pattern of reusable in/hold/out templates, but the listing gives no timing numbers. — [Fab listing](https://fab.com/s/0d3553fc0080)

### Inferences
Suggested timing table for Balomer. These are derived from the sources above and are **not** a published standard. The stagger numbers in particular have no source.

| Element | In | Hold | Out | Easing / transform |
|---|---|---|---|---|
| D-pad focus ring + scale | 100–150 ms | while focused | 100 ms | ease-out; `scale` + ring `opacity` |
| Stat value update (possession %, line height) | 150–200 ms crossfade | until next update | — | opacity crossfade between two Text layers. Avoid "counting up" tickers, which are hard to read at a distance. |
| Possession / compactness bar change | 300–400 ms | — | — | `transform: scaleX` from a fixed origin, never `width` |
| Minute alert banner (15'/30'/60'/75') | 300 ms (translateY 24–40px + opacity 0→1) | max(5 s, 0.33 s × words + 2 s orientation buffer). A 12–15 word alert gives about **6–7 s**. | 200–250 ms (opacity + small translate) | ease-out in, ease-in out |
| Staggered list (3 halftime recommendations, stat rows) | 300 ms each, **50–80 ms** stagger, whole sequence ≤ ~500 ms | user-paced | 200 ms all together | ease-out |
| Radar dots | interpolate translateX/Y over the data interval (e.g. 100–200 ms for 5–10 Hz updates) | continuous | — | linear or light ease to avoid stepping. This continuous motion is "essential" live content, not decorative. |

- **Halftime report:** do not auto-dismiss. A coach reads three recommendations at their own pace, and WCAG 2.2.2 points the same way. A visible "Back / Continue" focus target is the D-pad equivalent of pause or hide.
- **Minute alerts:** the hold time should be a computed function of word count, `max(5, 0.33*words + 2)` seconds, so it is testable and not a magic number. Alerts should also be dismissable with Back or Select and retrievable from an alert log, which avoids WCAG 2.2.2 problems.
- **Frequency rule (NN/g):** alerts are rare, so they can afford a 300 ms entrance. Radar and stats update constantly, so their transitions should be short or close to instant.
- **Easing on Vega:** React Native's `Easing.out(Easing.cubic)` for entrances and `Easing.in(Easing.cubic)` for exits are the standard RN APIs. On stock RN, the native driver pre-samples JS easing functions. That this works the same way on Vega was **not verified**.
- **Flashing:** never blink an alert or a "danger zone" more than 3 times per second (WCAG 2.3.1). A single 300 ms pulse (scale 1.0→1.04→1.0) is safer than flashing colour.

### Gaps
- No primary broadcast-vendor (Vizrt, Chyron, Hawk-Eye, Sky, Premier League) timing or easing spec was found; these packages are proprietary.
- The official BBC Subtitle Guidelines document was not reached directly. Secondary sources conflict on gap timing (1 s vs 1.5 s).
- No source was found for stagger intervals, or for reading time of *numbers* (as opposed to words) on TV.
- No Vega-specific statement was found on which style properties the native driver supports, beyond the Animated page. Check the Vega "Animations" guide linked from [Vega Animated](https://developer.amazon.com/docs/react-native-vega/0.83/animated.html).

## Q3. Which colour pairs reliably separate two teams on a dark background, including for colour-blind viewers?

### Takeaway
The Okabe-Ito palette, also called the "Wong" palette, is the standard colour-blind-safe set. On a near-black tactical board, **Orange `#E69F00` vs Sky Blue `#56B4E9`** is the strongest two-team pair by this session's computation: both are above 8:1 against `#0E1116`, and they stay well separated under simulated protan, deutan and tritan vision. The two have almost identical lightness, though, so a second, non-colour cue is still needed (WCAG 1.4.1, Android TV). Avoid red-vs-green team pairs.

### Cited Findings
- Okabe-Ito hex values: Black `#000000`, Orange `#E69F00`, Sky Blue `#56B4E9`, Bluish Green `#009E73`, Yellow `#F0E442`, Blue `#0072B2`, Vermillion `#D55E00`, Reddish Purple `#CC79A7`. Devised by Masataka Okabe and Kei Ito; sometimes called the Wong palette after Bang Wong's 2011 Nature Methods article; in R as `palette.colors(palette = "Okabe-Ito")`. — [ConceptViz Okabe-Ito reference](https://conceptviz.app/es/blog/okabe-ito-palette-hex-codes-complete-reference); [Siegal Lab colour palette](https://siegal.bio.nyu.edu/color-palette/); [factoextra palette docs](https://rdrr.io/cran/factoextra/man/factoextra_palette.html)
- Do not rely on colour alone, and test legibility in low light and in Standard picture mode. — [Android TV Color on TV](https://developer.android.com/design/ui/tv/guides/foundations/color-on-tv); WCAG 1.4.1 in [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- Amazon prefers cool, less saturated colours on TV, because TVs make colours look more saturated. — [Amazon Fire TV Design and UX Guidelines](https://developer.amazon.com/docs/fire-tv/design-and-user-experience-guidelines.html)
- Non-text UI marks need 3:1 against adjacent colours, and text needs 4.5:1 (3:1 if large). — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

### Inferences
These are **computed in this session**, not taken from a source. Method: WCAG relative-luminance contrast; colour-vision deficiency simulated with Machado et al. (2009) full-severity matrices in linear RGB; colour difference as CIE76 ΔE in CIELAB. This is an approximation: matrices were applied without a gamut-mapping step, and nothing was tested on a real TV panel.
- Contrast against near-black `#0E1116`:

  | Colour | Contrast vs `#0E1116` |
  |---|---|
  | Yellow | 14.3 |
  | Orange | 8.4 |
  | Sky Blue | 8.2 |
  | Reddish Purple | 6.18 |
  | Bluish Green | 5.53 |
  | Vermillion | 4.89 |
  | **Blue `#0072B2`** | **3.65** |

  Against a dark pitch green `#10261C`, every value drops by about 15% (Orange 7.08, Sky Blue 6.92, Blue 3.08). The deep Blue therefore passes 3:1 for dots and fills but **fails 4.5:1 for small text** on either background.
- Worst-case ΔE across protan, deutan and tritan (higher means easier to tell apart; about 2–3 is the just-noticeable difference):

  | Pair | Worst-case ΔE | Weakest under |
  |---|---|---|
  | Blue vs Vermillion | 91.9 | — |
  | Sky Blue vs Vermillion | 88.7 | — |
  | **Orange vs Sky Blue** | **86.9** | tritan |
  | Orange vs Blue | 79.1 | — |
  | Bluish Green vs Vermillion (red-vs-green) | 37.2 | protan |
  | Orange vs Vermillion | 18.3 | deutan |
  | Orange vs Yellow | 17.0 | deutan |
  | Sky Blue vs Bluish Green | 16.1 | tritan |

  The classic red-vs-green pair is the weakest of the common choices under protan. Orange vs Vermillion, Orange vs Yellow and Sky Blue vs Bluish Green should never be used for opposing teams.
- **Recommended default pair: Orange `#E69F00` (team A) vs Sky Blue `#56B4E9` (team B)** on near-black. Both pass 4.5:1 for text labels, and they separate well under all three deficiencies. Their luminance ratio to each other is only **1.02:1**, so in greyscale or full achromatopsia they look the same. Add a redundant cue: for example, team A as filled dots and team B as rings (or a different marker shape), a team letter or label on the stats panel, and a fixed left/right side convention. This also satisfies WCAG 1.4.1 and the Android "don't rely on colour alone" rule.
- Alternative with built-in lightness difference: **Yellow `#F0E442` vs Blue `#0072B2`** (luminance ratio 3.92:1 between them, worst-case ΔE 61 under tritan). Blue is too dark for small text on near-black, so put labels in a lighter tint or in off-white.
- Amazon's "prefer cool tones" conflicts mildly with orange. A slightly desaturated orange keeps the colour-blind benefit, but its contrast and ΔE should be re-checked after any adjustment.
- The edge worker detects real kit colours, but the radar should **map teams to fixed palette slots** (home = A, away = B), not paint dots in kit colours. Two kits can be indistinguishable to colour-blind viewers, or clash with the dark board. A small kit-colour swatch next to each team name can keep the real-world link.
- Keep the ball and alerts out of both team hues: off-white ball, and Reddish Purple or Yellow for alert accents only if neither is a team colour.

### Gaps
- No TV-specific study of team-colour discrimination for colour-vision deficiency was found. The simulation is approximate and ignores TV picture modes (Vivid raises saturation) and panel gamut.
- The script lives in the session scratchpad and is not part of the repo; numbers would need re-checking against the final background token.

## Q4. Which sports-analytics visual conventions are standard, and how are they styled?

### Takeaway
The standard vocabulary is shared by academic analytics, scouting vendors and broadcast analysis tools. It includes:
- a top-down 2D pitch with team-coloured player dots;
- a **defensive line** drawn across the pitch at the depth of the last outfield defenders;
- **team block / compactness** shown as a convex hull, or a bounding rectangle for width and depth, of outfield players with the goalkeeper excluded;
- **average-position** maps;
- a split **possession bar**;
- a per-minute **momentum** bar chart in which taller bars mean more threat;
- broadcast "L-bar" stat panels.

Exact vendor styling (stroke widths, opacities, palettes) is not published.

### Cited Findings
- Compactness as a convex hull: Guan, Cao and Swartz use the team's convex-hull area as a proxy for defensive style. A small hull means a deeper, more defensive posture, and an extreme defensive style is negatively associated with generating shots (JQAS 2023, per search summary; full text not reviewed). — [SFU paper (Swartz et al.)](https://www.sfu.ca/~tswartz/papers/bus.pdf)
- Back-four "Stretch Index": hull area of the four deepest defenders blended with attacker proximity. Lower means tighter, better-coordinated lines. (Search summary.) — [arXiv 2511.06191](https://arxiv.org/pdf/2511.06191)
- Team-block hull built from outfield players' X/Y with the **goalkeeper excluded**. Players are modelled as three lines by clustering defenders' X coordinates. (Search summary.) — [arXiv 2204.02313](https://arxiv.org/pdf/2204.02313)
- The area covered by outfield players when attacking was about **twice** the area when defending. — [Using Data to Analyse Team Formations](https://cur.at/hDVWSGT)
- A commercial scouting product, Driblab Spatial Coverage, quantifies "shape, line height, compactness, and width" by game phase. These are the same metric family Balomer computes. — [Driblab](https://www.driblab.com/blog/arrigo-spatial-coverage)
- Broadcast tactical analysis: Vizrt Viz Libero offers 70+ telestration tools including "player marking, defensive lines, and spaces". Broadcast customers include Sky and Warner Bros. Discovery. Fox Sports Australia used it for half-time key-play reviews and studio explanations of strategy. — [Vizrt Viz Libero Teams](https://www.vizrt.com/products/viz-libero-teams/); [SVG on Fox Sports Australia](https://www.sportsvideo.org/2017/04/07/fox-sports-australia-kicks-off-winter-sports-season-with-vizrt/)
- Average-position graphics are data-generated, distinct from static line-up graphics, and commonly used by broadcasters to show where players sat in a formation. — [The Analyst, Shape analysis](https://theanalyst.com/articles/shape-analysis-automatically-detecting-formations/)
- Momentum (Opta model, Flashscore "Match Momentum"): **one bar per minute**, and bar height is the team's probability of scoring in that minute. Only the team with the higher value in a minute is shown, so the chart diverges around a midline. A run of tall bars means a spell of dominance. The formula is not public. — [Flashscore, Introducing Match Momentum](https://www.flashscore.com/news/momentum/W82o7eCa/). At World Cup 2026 broadcasts, the graphic sat bottom-left at less than a third of the screen's height and width. — [Defector](https://defector.com/what-on-earth-is-match-momentum)
- Premier League "Data Zone" augmented broadcasts (Premier League Productions with Genius Sports / Second Spectrum, trialled with NBC and Optus): an **"L" bar** of stats (passing accuracy, shot speed, sprints, distance, final-third touches, pitch maps), a live player-movement tracker, on-ball player name graphics and on-pitch shot-speed graphics. — [Broadcast Now, Data Zone](https://www.broadcastnow.co.uk/broadcasting/premier-league-productions-to-deliver-data-zone-broadcasts/5186505.article); [Broadcast Now trial](https://www.broadcastnow.co.uk/tech-innovation/premier-league-productions-trials-augmented-broadcasts/5181397.article)
- Gradients band on TVs. Use high bit-depth or dithering, or prefer "solid colors or subtle patterns". — [Android TV Color on TV](https://developer.android.com/design/ui/tv/guides/foundations/color-on-tv)

### Inferences
Styling proposals for Balomer, built from the conventions above. Specific widths and opacities are design choices, not sourced values.
- **Make each overlay draw exactly what its metric measures**, so the picture and the number agree:
  - Line height: a line across the pitch at the computed defensive-line x, labelled in metres ("34 m").
  - Width: the y-extent of the block.
  - Depth: the x-extent of the block.
  - Compactness: hull area, or the bounding rectangle, whichever definition the spec uses. Exclude the goalkeeper, as the academic sources do.
- **Defensive line:** a 3–4px line across the pitch width in the team colour at about 80% opacity. Optionally add a faint band between the defensive and forward lines to show depth, plus a label pill inside the safe zone. Draw it as a View with a transform (translateX for line height), never as an animated `left`/`width`.
- **Team block:** translucent hull or rectangle fill (team colour at about 15–20% opacity) with a 2px stroke at about 60%. Keep hull vertices outside text areas. A rectangle is far cheaper to animate with transforms (translate plus scaleX/scaleY on a unit box) than an arbitrary polygon, which may need re-rendering. That favours the **bounding rectangle for the live radar and the convex hull for static halftime and full-time figures**.
- **Possession:** one horizontal split bar (team A on the left, team B on the right) with large numerals outside the bar ends, animated via `scaleX` from a fixed origin.
- **Momentum:** Balomer has no xG or event data, only coordinates. A per-minute diverging bar chart of a coordinate-derived measure (for example, share of time with the block in the opponent's half, or average line height) can use the same visual idiom. It must be named generically (for example "territory by minute"), not "Match Momentum", which is a product name (see Q5).
- **Heatmap:** a binned grid (for example 12x8 or coarser zones) with 4–5 discrete steps of one hue per team, instead of a smooth kernel-density gradient, which bands on TVs.
- **Stats panel:** an L-bar style side or bottom panel is a common broadcast layout and a generic one. Keep it within the 96/54px safe margins and limit it to the five core metrics, in line with Amazon's density guidance.
- **Video stays local:** Balomer's 2D radar is the "augmented" view. Broadcast AR (overlays drawn on the video) is out of scope by design.

### Gaps
- No public style guide was found for Opta / Stats Perform, Second Spectrum, Sky or EA Sports FC graphics. No stroke, opacity or colour specs could be sourced.
- No source confirmed a live **defensive-line overlay** in Premier League Data Zone broadcasts specifically. Vizrt documents defensive-line *telestration* tools, not a live auto-line.
- The academic findings come from search-result summaries; the full papers were not reviewed, so check the exact metric definitions before citing them in the product.

## Q5. What is legally safe to borrow from a video game's or broadcaster's UI, and what must be avoided? (summary of sources, not legal advice)

### Takeaway
In US and EU law, **ideas, rules, methods of operation and elements dictated by function** are free to use. That covers chart types, a top-down radar, possession bars, line and hull overlays, focus-and-select interaction, and the stats-panel layout. What is protected:
- **specific expression:** artwork, icons, animations, and the overall look and feel when it is copied wholesale (*Tetris v. Xio*);
- **trademarks:** names and logos such as EA SPORTS FC, Premier League, Sky Sports, Opta and product names;
- **trade dress:** only if distinctive or with secondary meaning, non-functional, and likely to confuse;
- **font software licences**, even though typeface *designs* are generally not copyrightable in the US.

### Cited Findings
- **Methods of operation and analytic dissection (US):** in *Lotus v. Borland* a menu command hierarchy was held a "method of operation" that "could not be copyrighted." In *Apple v. Microsoft* the court "dissected the Apple GUI into individual elements," filtered out unprotectable parts, and where protection was "thin" required "virtual identity" for infringement. The author concludes that copyright "may not adequately protect a company's GUI." (WilmerHale, May 6, 2002; older, but these cases remain the leading GUI precedents.) — [WilmerHale, Protecting a Company's GUI](http://www.wilmerhale.com/insights/publications/protecting-a-companys-graphical-user-interface-may-6-2002)
- **Game look and feel (US):** in *Tetris Holding v. Xio Interactive*, 863 F. Supp. 2d 394 (D.N.J. 2012), the court held the rules and mechanics unprotectable. It still granted summary judgment on copyright and trade dress because Xio copied the game's entire "look and feel" as expressed in its audiovisual display. The colour and style of the pieces were "arbitrary flourishes" unrelated to how the game works, so they were protectable trade dress. — [Loeb & Loeb summary](https://www.loeb.com/en/insights/publications/2012/06/tetris-holding-llc-v-xio-interactive-inc); [Fenwick](https://www.fenwick.com/insights/publications/how-trade-dress-can-help-game-developers-level-up)
- **Functional elements (US):** in *Incredible Technologies v. Virtual Technologies* (7th Cir. 2005), the defendant had seen and copied the plaintiff's materials. The control-panel expressions were still simple explanations of how the trackball works, and the trade dress was functional, so an injunction was denied. Case-brief takeaway: functional and standard game features are not protected "unless they are virtually identical." — [WSGR appeal PDF](https://www.wsgr.com/publications/PDFSearch/IncrediblevGlobalVRappeal.pdf); [Studicata brief](https://www.studicata.com/case-briefs/case/incredible-technologies-v-virtual-tech)
- **Trade dress test (US):** a plaintiff must prove non-functionality, secondary meaning and likelihood of confusion. Non-functionality weighs utilitarian advantage, available alternatives, advertising of utilitarian benefits, and cheap manufacture. A "vague description is normally not enough." Trade dress does "not cover functional elements." (Fenwick, Aug 9, 2016.) — [Fenwick & West](https://www.fenwick.com/insights/publications/how-trade-dress-can-help-game-developers-level-up)
- GUIs struggle to get trade dress protection because interfaces "may appear operational rather than ornamental". — [WilmerHale](http://www.wilmerhale.com/insights/publications/protecting-a-companys-graphical-user-interface-may-6-2002)
- **Scènes à faire in game clones:** commentary on *Glu Mobile v. Hothead* argues that many visual similarities may be scènes à faire (standard elements of a genre). The outcome was not reported. — [Legal Moves Law Firm](https://legalmoveslawfirm.com/new-lawsuits-mobile-game-clones/)
- **EU:** in *BSA v. Ministry of Culture* (C-393/09, CJEU, Dec 2010), a GUI is not a "computer program" under the Software Directive. It can be a copyright work under Directive 2001/29 if it is the author's own intellectual creation. Originality is judged on the arrangement of all components, and "components differentiated only by their technical function" cannot meet that test. — [Fieldfisher](https://www.fieldfisher.com/en/insights/graphical-user-interfaces-can-be-protected-by-copyright-rules-european-court); [Husovec commentary](https://husovec.eu/2011/11/functionality-expression-idea-dichotomy-under-new-european-doctrine-of-work/)
- **Trademarks:** a trademark is "A word, phrase, design, or a combination that identifies your goods or services". Names and logos qualify. Copyright covers original works "in a tangible medium" and gives exclusive rights to reproduce, distribute and display them. — [USPTO, Trademark, patent, or copyright?](https://www.uspto.gov/trademarks/basics/trademark-patent-copyright)
- **Fonts:** under the Copyright Office Compendium (§ 906.4), typefaces and lettering are generally *not* registrable in the US. Font *software* may be protected (recognised since 1992; *Adobe v. Southern Software*, 1998). Monotype reports that the Office has recently started rejecting font-software applications, which was not verified here. Rules differ by country. — [National Law Review](https://natlawreview.com/node/89245/printable/pdf); [Monotype](https://www.monotype.com/resources/update-application-copyright-law-typeface-design-and-font-software)
- **Design patents** can cover on-screen icons and type fonts, so a typeface's design may be patented even where it is not copyrightable. — [WilmerHale](http://www.wilmerhale.com/insights/publications/protecting-a-companys-graphical-user-interface-may-6-2002)

### Inferences
**Generally safe to borrow** (ideas, conventions, function), per the cases above:
- Chart and overlay *types*: top-down 2D pitch radar, team-coloured dots, defensive-line overlay, convex hull or rectangle team block, possession split bar, per-minute diverging momentum-style bars, binned heatmaps, average positions, L-bar or side stats panels.
- Interaction patterns: D-pad focus with scale and ring, tabbed sections, timed alert banners, staggered reveals, halftime and full-time report screens.
- General motion *principles*: ease-out in, faster out, short durations. These are generic UI practice, not anyone's expression.
- Standard football terms and metrics (possession, line height, width, depth, compactness, PPDA, xG) as descriptive words.

**Avoid:**
- **Names and logos:** EA SPORTS FC / FC 27, Premier League, Sky Sports, Opta / Stats Perform, Second Spectrum, Hawk-Eye or Vizrt names and logos anywhere in the UI, store listing, demo video or app icon. Product names such as "Match Momentum" should not be reused as feature names. Describing a feature as "similar to broadcast analytics" in a write-up is lower risk than branding it with their names (nominative-use nuances not researched).
- **Copied artwork:** tracing or recreating specific HUD artwork, icons, pitch-radar art, badges, textures, transition animations or colour-plus-shape combinations from FC 27 or a broadcaster package. *Tetris* shows that copying the *aggregate* look and feel can infringe even when each idea is free.
- **Screenshots and footage:** using FC 27 or broadcast screenshots and clips in the app, the README, the submission video or slides (copyrighted audiovisual works).
- **Unlicensed fonts:** fonts without a licence for app embedding. Commercial broadcast and game typefaces are usually licensed per platform. Use fonts with explicit embedding permission; the licences of specific open-licence candidates such as Inter, Barlow and Roboto were **not verified here**.
- **Imitated colour identity:** a colour and layout identity that imitates a specific broadcaster (for example Sky Sports' signature palette and bar shapes), since that increases trade dress and confusion risk.

**Practical originality steps:**
- Define Balomer's own design tokens: a dark board, the Okabe-Ito team slots, its own type pairing and its own corner radius and shape language.
- Keep a short "design provenance" note in `docs/` that lists the conventions used as generic ideas and the assets created from scratch or under an open licence, with licence links. This also helps the Open Source mini-challenge.

### Gaps
- No case law was found on **sports broadcast graphics packages** or **sports-game HUDs** specifically. The cases are puzzle, arcade and mobile games and desktop GUIs.
- Jurisdiction: the developer is in Peru and the hackathon is run by Amazon (US). Peruvian and Andean Community copyright (Decision 351) and the hackathon's own IP and originality rules were **not researched**. Check the official rules.
- Not verified: the trademark status of "Match Momentum"; EA's terms on using FC game screenshots; whether the Copyright Office's reported change on font-software registration is current.
- Most legal sources are law-firm summaries dated 2002–2016. More recent case law on GUI or game trade dress after 2016 was not found in this search.
