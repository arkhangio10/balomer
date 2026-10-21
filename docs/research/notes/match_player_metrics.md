# EA SPORTS FC: how match and player metrics are presented (FC 27, with FC 26 / FC 25 / FIFA 22-23 where FC 27 is thin)

Source-quality legend used below:
- **[EA]**: official EA Pitch Notes or ea.com pages (primary).
- **[Community]**: fan guide sites such as fifauteam.com, fifplay.com, fifagamenews.com, and social posts. These are useful but unofficial.
- **[Press]**: trade or games press.
- **[Snippet]**: the claim comes from a search-result summary; the page itself was not fetched, so its exact wording is unverified.
- Edition labels: every finding names the edition it applies to. FC 27 detail is thin. The FC 27 gameplay Pitch Notes do not cover stats presentation at all, so most UI detail is FC 25/FC 26 carried forward.

## Q1. Which live in-match stat overlays exist, and how are they triggered and animated?

### Takeaway
No source shows a live momentum or attacking-pressure bar, or a live xG ticker, in any FC edition. The live layer is small and HUD-centric, and most of it is toggled in Settings › Visual:
- the player's match rating next to the Player Name Bar (play-as-one-player modes only, FC 26)
- PlayStyles+ icons that "flash/glow" when used
- stamina conveyed by the player indicator fading
- a 2D/3D radar
- a "Player Performance Widget" (contents unknown)
- "HyperMotion Insight Overlays", AR graphics shown during breaks in play rather than during live action

### Cited Findings
**FC 27**
- [EA] The FC 27 gameplay deep dive (29 Jul 2026) has no content on overlays, momentum, attacking pressure, player ratings, Match Facts, xG, heatmaps, stamina, HUD or halftime/full-time screens. The only UI items are two screenshot captions: a "new set piece tactics interface" and "kick controls displayed". Its headline changes are all gameplay: defending, corners and crossing, curved and Pass & Follow runs, manual through and dinked passes, off-balance dribbling, PlayStyle rebalancing. — [EA FC 27 Pitch Notes: Gameplay Deep Dive](https://www.ea.com/games/ea-sports-fc/fc-27/news/pitch-notes-fc27-gameplay-deep-dive)
- [Community] FC 27 guide: "No major changes to Match Facts or Player Performance have been announced for FC 27." Its FAQ describes real-time overlay stats that need no menus, with examples like possession, pass accuracy, shot accuracy and player ratings, but gives no layout, toggle or update details. The FAQ appears carried over from earlier editions. — [fifauteam: FC 27 Stats](https://fifauteam.com/fc-27-stats/)
- [EA][Snippet] FC 27 includes the Premier League, WSL, LALIGA, Arkema Première Ligue and NWSL "with league broadcast presentation", meaning licensed scoreboards and graphics packages. — [EA: FC 27 Authenticity](https://www.ea.com/games/ea-sports-fc/fc-27/news/fc-27-authenticity)
- [Press][Snippet] A review credits FC 27 with "fresh broadcast camera angles" but describes no new stat graphics. — [Bleacher Report FC 27 review](https://bleacherreport.com/articles/25501514-ea-sports-fc-27-review-gameplay-impressions-videos-features-career-fut-and-more)
- [Community][Snippet] An FC 27 feedback-forum post asks for "Mini Broadcast Banner widgets" and full-card infographic overlays showing career goals and appearances. This is a user request, not a shipped feature. — [EA Forums: FC 27 feature request](https://forums.ea.com/discussions/fc-27-feedback-en/feature-request-career-mode-player-visual-stats-overhaul-fc27/13708402)

**FC 26: HUD and live indicators**
- [EA] In play-as-a-player modes (Clubs, Player Career), the player's match rating appears "next to the Player Name Bar". This is the only confirmed live, real-time rating display. — [EA FC 26 Pitch Notes: Gameplay Deep Dive](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)
- [EA] Name Bar toggles show:
  - PlayStyles+ icons for the controlled player, which "will flash/glow to indicate their use" when a PlayStyle+ triggers
  - footedness: stronger foot, plus weak foot on a five-point boot scale
  - the controlled player's Skill Moves Rating

  — [EA FC 26 Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)
- [EA] Other FC 26 presentation notes:
  - the Player Indicator was made "more responsive during gameplay"
  - a "new overlay to better display connection status"
  - Rush gets a "refreshed post-match screen highlighting each player and achievements"
  - Rush cameras "zoom in on the goal scorer during celebrations"

  — [EA FC 26 Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)
- [EA] Stamina, Competitive tuning only: "Short-term and long-term fatigue only affects AI-controlled players". A controlled player "acts as if they have full stamina". Authentic tuning keeps the old fatigue system. — [EA FC 26 Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)
- [Community] FC 26 Settings › Visual options include:
  - "Player Indicator Fade" (On/Off): fades indicators as stamina drops. This is the visual stamina cue.
  - "Radar": 2D (top-down) / 3D (angled) / Off, with user and opponent radar colours from 8 choices.
  - "Tactical Chalkboard" (On/Off).
  - "Tactical Suggestions Notifications" (On/Off).
  - "Time/Score Display" and "Score Clock Dropdown" (On/Off).
  - "Scrolling Line Ups" (default Off).
  - "PlayStyles+ Icons" and "PlayStyles+ Overhead Indicators".
  - "Precision Pass/Shot Visuals".
  - "Next Player Switch Indicator".
  - "Underfoot Player Highlighter".

  The same guide lists "HUD", "HyperMotion Insight Overlays" and "Player Performance Widget" as changed since FC 25, without describing their options. — [fifauteam: FC 26 Game Settings](https://fifauteam.com/fc-26-game-settings/)

**FC 25 and FC 26: HyperMotion Insight Overlays**
- [Community][Snippet] In FC 25 the setting controls whether "HyperMotion insight augmented reality overlays" appear "during breaks in gameplay". FC 26 lists it as an On/Off toggle that "displays real-time animation insights", grouped under Visual with HUD and the Player Performance Widget. — [fifauteam: FC 25 Game Settings](https://fifauteam.com/fc-25-game-settings/); [FIFPlay: FC 26 Game Settings](https://www.fifplay.com/fc-26-game-settings/); [fifagamenews: FC 25 Settings Guide](https://www.fifagamenews.com/fc-25-game-settings-guide/)
- [Community] FC 25 guide: with "HyperMotion Insight Overlays" enabled, "additional statistics will be shown to you while playing, without the need to pause the game". It does not list which statistics. — [fifauteam: FC 25 Stats](https://fifauteam.com/fc-25-stats-match-facts-performance/)
- [Community] A FUTWIZ post (Sept 2024, FC 25) recommends "Score Clock Dropdown - OFF", "Scrolling Line Ups - OFF" and turning off HyperMotion Insight Overlays to reduce distraction. It also complains that "Player Role indicators" appear "at the start of every game" with no setting to turn them off. — [FUTWIZ on X](https://x.com/FUTWIZ/status/1837468152839430470)

**FIFA 23: origin of the data overlays (prior edition)**
- [EA][Snippet] FIFA 23's HyperMotion2 "augmented reality replays" show data during shot and free-kick replays, including xG, shot power and distance from goal. These are described as a replay feature, not a live display. — [EA: FIFA 23 HyperMotion2](https://ea.com/games/fifa/fifa-23/hypermotion2); [fifauteam: Official Matchday Experience in FIFA 23](https://fifauteam.com/?p=207088)
- [Press][Snippet] FIFA 23 matchday coverage mentions data overlays for expected goals, shots on target and passing percentages, and a "more stylish display of data in-game". It is unclear whether these appear live or only in replays and stoppages. — [RealSport101: FIFA 23 Matchday Experience](https://realsport101.com/article/fifa-23-news-matchday-experience-new-features-pitch-notes); [VGC: FIFA 23 match day experience](https://videogameschronicle.com/news/ea-reveals-fifa-23-match-day-experience-more-realistic-crowds-and-more) (VGC returned HTTP 403; not read)

### Inferences
- The "insight" overlays are best understood as **stoppage-triggered AR graphics**: after a shot or set piece, during a replay or break, the game overlays numbers such as xG, shot power and distance on the 3D scene. They do not appear as a persistent ticker. This follows from FIFA 23's "AR replays" framing and the FC 25 "during breaks in gameplay" wording.
- Because no source mentions a momentum or attacking-pressure bar, it is likely that EA FC **does not** have one. The well-known momentum graphs are from Sofascore ("Attack Momentum", with columns or a wave that rise toward the dominant team), ESPN and Veo ("Match Momentum"). A Balomer momentum strip would therefore be borrowing the pattern from live-score apps, not from FC. — [Sofascore: Attack Momentum explainer](https://www.sofascore.com/es/news/how-sofascores-attack-momentum-changed-sport-analysis); [Veo: Match Momentum](https://support.veo.com/hc/en-us/articles/11466184981777-How-to-use-Match-Momentum-in-Veo-Analytics). Note that "Attack Momentum" and "Match Momentum" are vendor feature names.
- The live layer is deliberately **user-toggleable and minimal**: nearly every indicator has its own On/Off setting. Community advice is to turn overlays off because they distract. For a TV app, live stats should probably appear at natural pauses (goal, halftime, minute-marker alerts) rather than constantly.

### Gaps
- No source describes the **Player Performance Widget** (FC 26): its contents, position, trigger and animation are unknown. It may be the in-match rating or performance pop-up, but this is unconfirmed.
- No source lists the exact stats or the animation of **HyperMotion Insight Overlays** in FC 25, FC 26 or FC 27.
- No confirmed **live xG**, live team-stat pop-ups during open play, or "on fire"/form indicators were found for any FC edition. FC 27 may have added something not covered by the Pitch Notes; I found no evidence that it did.
- **Broadcast-package stat banners**: licensed league packages typically show possession or shot comparison banners at stoppages. I found no source detailing their FC 27 content or triggers. An EA-sponsored YouTube guide to "broadcast packages, scoreboards, graphics" exists, but it was not reviewed.
- The **Tactical Chalkboard** (FC 26 setting) is named but not described. It may be the closest thing FC has to an in-match "tactical view", but this is unconfirmed.

## Q2. What do the halftime and full-time stats screens contain, and how are heatmaps, shot maps and timelines drawn?

### Takeaway
The stats live in two pause-menu and post-match screens, **Match Facts** (team) and **Performance** (per player). Each is split into tabbed stat groups (Summary / Possession / Shooting / Passing / Defending / Events, plus Goalkeeping for players), and these combine:
- numeric head-to-head comparisons
- zone maps and heat maps on a pitch diagram
- a "Possession over Time" series

The structure dates from FIFA 22's "Deeper Match Analysis" revamp, and FC 27 reportedly carries it over unchanged. No momentum timeline, pass network or dedicated halftime-analysis screen was found.

### Cited Findings
**Access**
- [Community] Stats are viewable during a match from the pause menu and after the final whistle. Some modes show pre-match or historical information separately. FC 27 has "No major changes" announced. — [fifauteam: FC 27 Stats](https://fifauteam.com/fc-27-stats/)

**Match Facts (team-level), FC 25 and FC 27 as listed by community guides**
- **Summary**:
  - "Possession %" and "Ball Recovery Time (Seconds)"
  - shots, "Expected Goals", passes
  - tackles and tackles won, interceptions, saves
  - fouls, offsides, corners, free kicks, penalties, yellow and red cards
  - four defensive line-break measures: through, around, over, and "Def Line Breaks Attempted"

  — [fifauteam: FC 25 Stats](https://fifauteam.com/fc-25-stats-match-facts-performance/); [fifauteam: FC 27 Stats](https://fifauteam.com/fc-27-stats/)
- **Possession**:
  - "Overall Possession" and "Possession over Time" (the only time-series view found)
  - "Overall Possession Heat Map"
  - heat maps for possession won and lost
  - "Beat Opponent Zones"

  — same sources
- **Shooting**:
  - total, on-target, off-target and blocked shots
  - "Shooting by Type": normal, finesse, header, power, volley, chip, set piece
  - "Shooting by Distance": inside or outside the box
  - "Shooting by Aim": near or far side
  - zone maps for shots, goals, off-target, blocked and saved shots, which is the shot-map equivalent

  — same sources
- **Passing**:
  - totals, completed, intercepted, offside
  - "Passing by Type": ground, lob, through, lobbed through, cross, set piece
  - "Passing by Style": key pass, first time, pass and go, down wing, breakaway
  - "Passing Distribution"
  - pass zone maps

  — same sources
- **Defending**:
  - standing and sliding tackles with wins, interceptions, blocks, saves, clearances
  - offensive, defensive and aerial duels won, times beaten
  - fouls, penalties conceded, cards
  - tackle and interception zone maps

  — same sources
- **Events**: Goals, Red Cards, Yellow Cards, Saves, Misses. This is likely a chronological event list. — same sources

**Performance (per player)**: see Q3.

**Origin of the structure (FIFA 22)**
- [Press] FIFA 22 delivered "a complete revamp of the Match Facts and Player Performance screens". It added xG ("everybody's favourite stat xG") and detailed breakdowns for possession, shooting, passing, defending and goalkeeping. "New visuals help you compare performance between you and your opponent in the revamped Summary screen." — [RealSport101: FIFA 22 Deeper Match Analysis](https://realsport101.com/article/fifa-22-deeper-match-analysis-will-revamp-your-player-performance-gameplay-pitch-notes)

**Post-match celebration screens**
- [EA] FC 26 Rush has a "refreshed post-match screen highlighting each player and achievements". — [EA FC 26 Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)

### Inferences
- The layout pattern to borrow is **one screen, horizontal stat-group tabs, a Summary tab first**. The Summary is a two-column, team-vs-team comparison built from paired numbers or bars; the later tabs mix category breakdowns (by type, distance or aim) with pitch-diagram zone maps. This is inferred from the tab and stat names plus the FIFA 22 "compare performance between you and your opponent" line.
- "Possession over Time" is the only timeline FC exposes. A **momentum or xG timeline** of the Sofascore type would be an addition that FC does not have, which makes it a possible point of differentiation for Balomer.
- Using **zone maps** (pitch split into zones, with counts or shading) rather than true point-level shot maps is consistent with the stat names ("Zones", "Zone"). FC does seem to show **heat maps** for overall, won and lost possession and for individual players.

### Gaps
- No source describes the **visual rendering** of heat maps (colour ramp, smoothing), zone maps (grid size, how numbers are shown) or Possession over Time (line, area or bars; per-5-minute buckets?). I found no screenshots with captions.
- I found no source for an automatic **halftime stats card** in broadcast style, or for the full-time results screen layout in FC 26 or FC 27. It is commonly seen in-game but was not verified here.
- No source confirms **pass maps or pass networks** (player-to-player lines) or **average-position maps**. Only pass zone maps are listed.
- The FC 27 Match Facts contents come from a community guide that admits no changes were announced. Real FC 27 changes, if any, are unverified.

## Q3. How are individual player performance metrics shown, and how is a standout performance highlighted?

### Takeaway
Players get a **0–10 match rating**, shown live beside the name bar in single-player-avatar modes. FC 26 made the rating **role-based**, built from weighted groups (Goalkeeping, Defending, Dribbling, Shooting, Passing, plus team outcomes), and the Performance screens break down how each group contributes. A "Player of the Match" sits at the top of the Performance Summary. Each player also gets a stat list compared with the team average and a position heat map.

### Cited Findings
**FC 26 role-based ratings**
- [EA] "Ratings during a match have been changed to be related to the player's active Role." Two players in the same position can be scored differently depending on their Role, for example Playmaker vs Box-to-Box. — [EA FC 26 Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)
- [EA] The rating groups are "Goalkeeping, Defending, Dribbling, Shooting, Passing", plus a group that "includes stats such as Goals scored or conceded by the team, red cards" and individual goals or assists. These "all impact players equally". "The importance of Positioning stats in Match Ratings have been dramatically lowered across the board", and Positioning is "nullified for Clubs". "Ratings and weights depicted above are subject to tuning." — [EA FC 26 Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)
- [EA] "In the Performance screens during a match, you can find a breakdown of these ratings" and how much each group contributes to the total. This is the explainability pattern. — [EA FC 26 Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)
- [EA] The live rating appears "next to the Player Name Bar" in Clubs and Player Career. — same source

**Performance screen (FC 25 and FC 27, community)**
- **Summary**:
  - "Player of the Match" and "Match Ratings"
  - goals, assists, shots, shot and pass accuracy, dribbles, tackles
  - offsides, fouls, possession won and lost
  - "Minutes Played vs Team Average", distance covered, distance sprinted
  - "Overall Position Heat Map"

  Each stat is "compared with the team average". — [fifauteam: FC 27 Stats](https://fifauteam.com/fc-27-stats/); [fifauteam: FC 25 Stats](https://fifauteam.com/fc-25-stats-match-facts-performance/)
- **Possession**:
  - dribble counts and success rates
  - dribble style percentages: regular, shield, strafe, agile
  - dribble types: beat, skill-move beat, nutmeg, knock-on
  - line breaks by zone and type
  - "Ball Possession Heat Map" and dribble heat maps

  — same sources
- **Shooting**:
  - "Goals Excluding Penalties" and "xG Excluding Penalties"
  - shot counts and accuracy
  - free-kick, penalty and shootout goals
  - shot types
  - goal, off-target, blocked and saved heat maps

  — same sources
- **Passing**:
  - assists, "Expected Assists", second assists, key passes
  - players beaten by passes, pass accuracy, crosses
  - "Passes Attempted Under Pressure"
  - line breaks through, around, over and attempted

  — same sources
- **Defending**:
  - tackles, interceptions, blocks, clearances, offsides caused, duels
  - times beaten, including in the defensive third and "Beaten in Box"
  - fouls, penalties, own goals
  - tackle and interception zones

  — same sources
- **Goalkeeping**:
  - shots faced and shots on target, saves, goals conceded
  - "Save Success Rate (%)"
  - punch, rush and penalty saves, shootout saves
  - saves by shot type, "Shots Saved Zone"

  — same sources

**Standout highlighting**
- [EA] FC 26 Rush's post-match screen highlights "each player and achievements". — [EA FC 26 Pitch Notes](https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive)
- [EA] PlayStyles+ icons flash or glow when a PlayStyle+ is used. This is the only confirmed live "trait moment" highlight. — same source

### Inferences
- FC's rating-transparency pattern is worth copying for Balomer's "evidence-based recommendations": a single 0–10 number, plus a breakdown screen showing which groups pushed it up or down. Showing stats against the **team average** gives context without needing league benchmarks.
- "Player of the Match" is a single top-of-summary highlight, not a separate celebration screen, except in Rush. This is inferred from where it sits in the Summary list.

### Gaps
- I did not verify any **radar or hexagon chart** in the match stats screens. FC's six-attribute face stats (pace/shooting/passing/dribbling/defending/physical) appear on player cards in Ultimate Team and squad screens, but no source in this session confirms a radar chart in the in-match Performance screen.
- No source describes **rating-change animations**, such as up/down arrows or colour flashes when the live rating moves, or how often the live rating updates.
- No FC 27 change to match ratings was found. The FC 26 role-based model is presumably carried over, but this is unconfirmed.
- How the Player of the Match is chosen (highest rating or otherwise) is not documented in the sources found.

## Q4. Does the game use real-data partners or real-world metrics like xG, and how are they labelled? Which items are proprietary?

### Takeaway
EA has a long-term deal with **Stats Perform (Opta)**, announced October 2023 for FC 24. It feeds **player ratings and PlayStyles**, which are offline inputs to player attributes. I found no evidence that in-match stats such as xG are Opta-sourced or Opta-labelled. In-game, the metric appears generically as "Expected Goals", "xG Excluding Penalties" and "Expected Assists". Several screen and feature names are EA trademarks or brand terms and should not be copied.

### Cited Findings
- [Press] EA turned to Opta data "to optimise its player ratings and PlayStyles features". Opta data "is at the core of FC24's flagship new PlayStyles and PlayStyles+ features". The deal is described as a "new long-term partnership" with no term given, and an EA executive said that "going into future years we'll see the partnership expand to new heights". The article says nothing about in-game stat display or labelling. — [SVG Europe, Oct 2023](https://www.svgeurope.org/blog/headlines/electronic-arts-turn-to-stats-perform-to-bring-real-world-data-into-fc24/)
- [Press][Snippet] The announcement is dated about 2 October 2023. Stats Perform owns Opta, and Opta data is gathered from 200+ men's and women's competitions. — [Insider Sport](https://insidersport.com/2023/10/02/stats-perform-ea-data-partnership/); [SBC News](https://sbcnews.co.uk/sportsbook/2023/10/03/ea-fc24-stats-perform-opta/); [FC Business](https://fcbusiness.co.uk/news/electronic-arts-links-up-with-stats-performs-opta-data/)
- [Community] In-game labels are generic: "Expected Goals" (Match Facts Summary), "xG Excluding Penalties" and "Expected Assists" (Performance). The guides say nothing about how they are calculated. — [fifauteam: FC 25 Stats](https://fifauteam.com/fc-25-stats-match-facts-performance/)
- [Press] xG first arrived in FIFA 22's Match Facts revamp. — [RealSport101: FIFA 22](https://realsport101.com/article/fifa-22-deeper-match-analysis-will-revamp-your-player-performance-gameplay-pitch-notes)
- [EA][Snippet] FC 26's ratings database covers "Ratings and PlayStyles for the 17,000+ players". — [EA FC 26 Ratings](https://www.ea.com/games/ea-sports-fc/ratings?team=1)
- Context only (not EA): Opta's xG is a per-shot probability model, where summed xG indicates how many goals a team "should have scored on average". — [Stats Perform: xG explainer](https://www.statsperform.com/resource/expected-goals-xg-the-football-metric-changing-analysis-betting-and-fan-engagement/)

### Inferences: proprietary items not to copy into an original app
These names are EA or third-party brand terms, inferred as proprietary from their branding and usage. Trademark status was not checked against a registry:
- "EA SPORTS FC", "Ultimate Team", "Rush", "Clubs" (as an EA mode name), and "FC IQ" (not researched here)
- "HyperMotion", "HyperMotion2" and "HyperMotion Insight Overlays"
- "PlayStyles" and "PlayStyles+", including their icons
- "Player Performance Widget" and "Tactical Chalkboard"
- licensed league broadcast packages, crests and scoreboards
- the "Opta" and "Stats Perform" marks and any Opta-branded xG model, plus Sofascore's "Attack Momentum" and Veo's "Match Momentum"

Generic football terms are safe to use with your own definitions: possession, shots, expected goals (xG), expected assists, heat map, line breaks, match rating, player of the match. "Match Facts" is EA's screen title. It is generic English, but a different label avoids imitation.
- Balomer computes its own metrics at the edge, so any xG it shows must come from its own model and be labelled as such. It should not imply Opta parity.

### Gaps
- I found no source showing **any data-provider credit** (an Opta logo or "powered by") on FC's in-match stats screens, in any edition.
- I did not find how EA's in-game xG model works (inputs, calibration), or whether FC 27 expanded the Opta role, as the 2023 "expand to new heights" line suggested.
- Whether FC 27 adds new real-world metrics (for example xGOT, PPDA or pressing) was not found.

## Q5. How are these screens navigated with a controller, and how does that map to a TV remote D-pad?

### Takeaway
The confirmed pattern is **Pause → choose Match Facts or Performance → L1/LB and R1/RB cycle the stat-group tabs**. Inside a tab, the stick or D-pad moves focus. On Performance it presumably also switches the selected player, but that is not documented. No source documents focus-state visuals.

### Cited Findings
- [Community] FC 25: "Pause a match; Select [Match Facts] or [Performance]; Use L1/LB or R1/RB to toggle between different statistic groups." — [fifauteam: FC 25 Stats](https://fifauteam.com/fc-25-stats-match-facts-performance/)
- [Community] FC 27 guide repeats the same flow: pause, select Match Facts or Performance, and use L1/LB or R1/RB to switch stat groups. The stats are also available after the final whistle. — [fifauteam: FC 27 Stats](https://fifauteam.com/fc-27-stats/)
- [Community] Live HUD elements are configured in Settings › Visual, each as a simple On/Off or cycle option (see Q1), not through in-match buttons. — [fifauteam: FC 26 Game Settings](https://fifauteam.com/fc-26-game-settings/)
- [Community] FC 26 Settings include "Hold to Skip", which, when Off, removes the need to hold the skip button for cinematics and some in-match moments. This shows how interruptive presentation is controlled. — [fifauteam: FC 26 Game Settings](https://fifauteam.com/fc-26-game-settings/)

### Inferences
- For a Fire TV remote, the **shoulder-button tab cycling** maps naturally to a horizontal tab row moved with D-pad left/right when the tab row has focus, then D-pad down into the content. This is a common TV pattern, inferred and not taken from the FC sources. Whether the Fire TV remote's media keys (rewind / fast-forward) can serve as tab shortcuts in Vega OS is an API question this research did not verify.
- FC keeps the in-match overlay layer **non-interactive** (settings toggles only) and puts all exploration behind pause. On a TV that is just watched, this suggests a passive live layer plus a navigable halftime and full-time report.

### Gaps
- No source describes **focus states** (highlight colour, scaling, underline) for tabs or for the player list, nor how the selected player is switched on the Performance screen (D-pad up/down on a roster list, or R2/L2?).
- I found no documentation of **wrap-around** tab navigation, default focus on entry, or back-button behaviour (Circle/B returns to the pause menu?).
- No EA accessibility documentation on stats-screen navigation was reviewed. An EA FC 27 Accessibility Resources page exists but was not fetched: [EA Able: FC 27](https://www.frostbite.com/able/resources/ea-sports-fc/fc-27).
