# Multi-Sport Model

## Core Principle

> An athlete is not the same as a sport.

One athlete can play multiple sports. Siblings in the same family may play different sports. The architecture must treat "athlete" as the primary entity and "sport" as a profile attached to an athlete.

## Athlete vs Sport

```
Athlete: Daniel (age 13)
├── Sport Profile: Tennis (main goal sport)
├── Sport Profile: Swimming (support sport)
└── Sport Profile: Basketball (fun sport, school team)
```

Each sport profile is independent but belongs to the same athlete. Body load, fatigue, sleep, and emotional stress are shared across all sports.

## Sport Roles

Each sport attached to an athlete has a role that affects planning and recommendations:

| Role | Description | Example |
|------|-------------|---------|
| **Main Goal Sport** | The sport the athlete is most serious about. Primary training priority. Tournament decisions center here. | Tennis for a ranked junior player |
| **Support Sport** | A sport that helps the main sport — cross-training, complementary fitness. | Swimming for lung capacity, basketball for agility |
| **Fun Sport** | Played for enjoyment, social connection, or family tradition. Low pressure. | Weekend football with friends |
| **School Sport** | Required or encouraged by school. May have fixed schedule. | PE class, school team |
| **Trial Sport** | Exploring a new sport. Short-term, low commitment. | Trying badminton for one term |

## Sport Priority

Athletes (with parent/coach input) set priority per sport:

- **Primary sport**: Main focus — gets training priority, tournament budget priority, recovery planning
- **Secondary sport(s)**: Important but secondary — works around primary sport schedule
- **Recreational**: No performance pressure — flexible, can be dropped if overloaded

Priority can change over time. The system should support re-evaluation (e.g., every 3–6 months).

## Shared Body Load

This is the most critical concept in multi-sport support. The athlete has one body, one sleep schedule, one injury history, and one emotional capacity — regardless of how many sports they play.

### Shared Metrics Across Sports

| Metric | Source | Affects |
|--------|--------|---------|
| **Fatigue** | All sports combined | Recovery recommendations, load warnings |
| **Sleep quality** | Daily check-in | Readiness for all sports |
| **Injury / soreness** | Any sport | Training load limits across all sports |
| **School load** | External (exam periods, projects) | Available energy for all sports |
| **Emotional stress** | Any source (sport, school, social) | Readiness, motivation, injury risk |

### Load Calculation

Total daily/weekly load = sum of all sport activities, not per-sport silos.

A day with:
- Tennis training: 120 min
- Swimming: 60 min
- School PE: 45 min
= **225 min total load** → balanced (not light)

The system must warn when combined load from multiple sports exceeds safe thresholds, even if each individual sport looks fine.

## Sport-Specific Tags

Each sport has domain-specific tags for entries and insights. These are not hardcoded — they grow with the sport profile.

### Tennis Tags (current MVP)

| Category | Tags |
|----------|------|
| Technique | serve, return, forehand, backhand, volley, drop shot, split step |
| Condition | ball condition, court surface, heat, wind |
| Competition | ranking, seeding, match pressure, opponent level |
| Equipment | string tension, grip size, racket, shoes |
| Mental | focus, confidence, frustration, pre-match routine |

### Football Tags (future)

| Category | Tags |
|----------|------|
| Physical | stamina, speed, agility, strength |
| Technical | passing, shooting, dribbling, first touch, heading |
| Tactical | positioning, offside awareness, pressing, formation |
| Team | team training, set piece, communication |
| Condition | pitch condition, weather, boot type |

### Swimming Tags (future)

| Category | Tags |
|----------|------|
| Stroke | freestyle, backstroke, breaststroke, butterfly |
| Metrics | time record, split time, stroke rate, turn time |
| Technique | breathing, streamline, kick, pull |
| Condition | pool type, water temperature, lane sharing |
| Competition | meet preparation, taper, warm-up routine |

### Other Sports (future)

- **Basketball**: shooting, dribbling, defense, court awareness, vertical jump
- **Gymnastics**: flexibility, balance, routine, apparatus, landing
- **Golf**: swing, putting, short game, course management, mental game
- **Badminton**: smash, drop, footwork, rally, serve
- **Athletics/Track**: sprint, distance, jump, throw, PB (personal best)

## Warning Examples

### Support Sport Stealing Recovery

If a support sport's training intensity starts consuming recovery time meant for the primary sport:

> ⚠️ ช่วงนี้ว่ายน้ำใช้ recovery เยอะ — อาจกระทบความพร้อมเทนนิสในสุดสัปดาห์นี้

Translation: "Swimming is using a lot of recovery lately — may affect tennis readiness this weekend."

### Combined Load Too High

> ⚠️ รวมโหลดทุกกีฬาวันนี้ 7 ชม. — เสี่ยงล้าสะสม ควรลดหรือเพิ่ม recovery

Translation: "Combined load across all sports today is 7 hours — risk of accumulated fatigue, should reduce or add recovery."

### School + Sport Overlap

> 📚 ช่วงสอบปลายภาคใกล้เข้ามา — อาจต้องลดความเข้มข้นซ้อมชั่วคราว

Translation: "Final exams approaching — may need to temporarily reduce training intensity."

### Fun Sport Becoming Stress

If a "fun sport" starts showing negative mood tags or fatigue:

> 🏀 บาสเกตบอลที่เคยเล่นสนุก ตอนนี้ดูเหมือนเพิ่มความล้า — ลองคุยกับนักกีฬาว่ายังอยากเล่นต่อไหม

Translation: "Basketball used to be fun but now seems to add fatigue — try talking with the athlete about whether they still want to continue."

## Sport Profile Lifecycle

1. **Add sport**: Athlete or parent adds a sport with a role
2. **Set priority**: Primary / Secondary / Recreational
3. **Active tracking**: Entries, load, insights flow into the shared athlete dashboard
4. **Periodic review**: Every 1–3 months, review whether sport roles and priorities are still correct
5. **Archive**: A sport can be archived (not deleted) — preserves history without affecting current load calculations
6. **Reactivate**: Archived sports can be reactivated

## Data Model Notes

- Sport profiles are stored per athlete
- Tags are per sport (different sports have different tag sets)
- Load is always athlete-level (sum of all sports)
- Insights can be per-sport or cross-sport
- Tournament budget is per sport profile
- Calendar shows all sports color-coded