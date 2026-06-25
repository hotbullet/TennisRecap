# Tournament Budget Model

## Overview

TennisRecap currently has an "Investment View" tab that shows cost tracking in a summary format. The Tournament Budget Planner is a distinct future feature: a forward-looking planning tool for individual tournament cost estimation and decision support.

## Difference from Investment View

| | Investment View (current) | Tournament Budget Planner (future) |
|---|---|---|
| **Direction** | Backward-looking | Forward-looking |
| **Scope** | Monthly/yearly totals | Per-tournament estimate |
| **Purpose** | Track what was spent | Decide whether to go |
| **Granularity** | Category aggregates | Line-item budget |
| **Output** | Spending report | Go / Limit / Skip decision |

## Budget Model

### Required Fields

Each tournament budget entry includes:

| Field | Description | Example |
|-------|-------------|---------|
| Tournament name | From source inbox or manual | TCA ชิงชนะเลิศภาคกลาง |
| Date | Tournament date(s) | 2026-07-08 to 2026-07-11 |
| Location | City/province | นครสวรรค์ |
| Venue | Specific venue name | สนามเทนนิสจังหวัดนครสวรรค์ |
| Travel days | Days needed for travel before/after | 1 day before, 1 day after |
| Number of travelers | Athlete + family members | 3 (athlete, แม่, พ่อ) |
| Registration fee | Tournament entry fee | ฿1,500 |
| Travel cost | Transport (fuel/flight/bus) | ฿3,000 |
| Hotel cost | Accommodation for all nights | ฿4,500 (3 nights) |
| Food cost | Meals during tournament | ฿3,000 |
| Court practice cost | Practice court rental before tournament | ฿1,000 |
| Balls / stringing / equipment | Consumables | ฿800 |
| Coach fee | If coach travels with athlete | ฿5,000 |
| Other cost | Miscellaneous | ฿500 |
| **Total** | Sum of all line items | **฿19,300** |

### Budget Levels

Instead of a single number, use three levels to support family decision-making:

| Level | Description | Use |
|-------|-------------|-----|
| **Minimum budget** | Bare minimum — cheapest travel, basic hotel, no extras | Can we afford to go at all? |
| **Likely budget** | Realistic estimate based on typical spending | What will this probably cost? |
| **Max risk budget** | Worst case — unexpected costs, last-minute changes, emergency | What's the most we might spend? |

Example:
- Minimum: ฿12,000 (cheapest bus, budget hotel, basic food)
- Likely: ฿19,300 (comfortable travel, decent hotel, normal meals)
- Max risk: ฿28,000 (last-minute flight change, better hotel, extra equipment)

### Non-Money Cost

Money is not the only cost of a tournament. The budget model must also surface:

| Cost Type | Description | Affects |
|-----------|-------------|---------|
| **Training days lost** | Days the athlete cannot train normally | Readiness, skill progression |
| **Recovery risk** | Physical toll of tournament + travel | Injury risk, next-week planning |
| **School impact** | School days missed, homework backlog | Academic performance, stress |
| **Travel fatigue** | Physical and mental exhaustion from travel | Performance, mood, recovery |
| **Opportunity cost** | What else could this time/money be used for? | Family budget, training alternatives |

## Decision Output

Based on budget + non-money costs + athlete pathway, the system produces a recommendation:

| Recommendation | Meaning | When |
|----------------|---------|------|
| **Go** | Proceed with tournament | Budget fits, recovery is fine, pathway supports it |
| **Go with limit** | Go but set boundaries | Budget is tight, or recovery is moderate risk |
| **Replace with Match Simulation** | Skip tournament, do local match sim instead | Cost too high, or recovery risk too high, or pathway doesn't prioritize this tournament |
| **Skip for Main Goal** | Save resources for a more important tournament | Multiple tournament options — prioritize |
| **Need more info** | Cannot decide yet | Missing key information (cost, date, coach input) |

## Athlete-Friendly Language

Cost information is sensitive. The product must never make the athlete feel guilty about money.

### Parent View (full detail)
- All budget numbers visible
- All three budget levels
- Non-money cost breakdown
- Decision recommendations with full reasoning

### Athlete View (supportive summary)
- No specific money amounts shown to younger athletes
- For older athletes (16+): summary numbers, not line items
- Focus on: "This tournament is a good opportunity for your goals" or "This tournament might be tiring — let's talk about whether it's the right time"
- Never: "This tournament costs too much" or "We can't afford this"

### Language Guidelines

| ❌ Don't Say | ✅ Say Instead |
|-------------|---------------|
| "แพงเกินไป" (Too expensive) | "ทัวร์นาเมนต์นี้มีค่าใช้จ่ายสูง — มาดูกันว่ามีตัวเลือกอื่นไหม" (This tournament has high costs — let's look at other options) |
| "เราไม่มีเงินพอ" (We don't have enough money) | Parent-only view. Athlete never sees this. |
| "เสียเงินเปล่า" (Waste of money) | "ทัวร์นาเมนต์นี้อาจไม่ใช่โอกาสที่ดีที่สุดสำหรับเป้าหมายตอนนี้" (This tournament may not be the best opportunity for your current goals) |
| "ค่าสมัครแพง" (Registration is expensive) | "มีหลายปัจจัยที่ต้องคิด — เราเลือกสิ่งที่ดีที่สุดสำหรับการเติบโตของนักกีฬา" (There are many factors — we'll choose what's best for athlete growth) |

## Connection to Other Systems

The Tournament Budget Planner connects to:

- **Tournament Source Inbox**: Import tournament details → auto-populate budget fields
- **Calendar**: Scheduled tournament dates → calculate training days lost
- **Decision Engine**: Budget + pathway + recovery → recommendation
- **Family Plan Room**: Multi-athlete tournament conflicts, shared travel logistics
- **Investment View**: After tournament, actual costs feed back into investment tracking

## Implementation Notes

- Budget data is per tournament, per athlete
- Budget levels (min/likely/max) are estimates — not accounting
- Non-money costs use simple calculations (e.g., tournament days = training days lost)
- Athlete view filters are applied at the UI level, not the data level
- Parent authorization required for budget visibility settings