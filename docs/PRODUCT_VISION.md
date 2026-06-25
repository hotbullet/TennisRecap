# Product Vision

## Current Product

**TennisRecap** is the current product — a mobile-first tennis planning MVP for junior athletes and their families. It runs entirely in the browser with localStorage and has no backend, no auth, and no database.

TennisRecap helps one athlete and their family plan training, tournaments, recovery, cost, school load, and athlete growth in a single, calm interface.

## Possible Future Platform

The long-term platform may become a **family athlete operating system** supporting:

- Multiple children in one family
- One child playing multiple sports
- Children playing different sports
- Parent-managed profiles for younger athletes
- Athlete-led profiles for older athletes
- Different athlete pathways (performance, education, balanced, health)

**GoalRecap** is an umbrella brand candidate but has not been applied yet. No renaming, rebranding, or restructuring should happen until the product direction is validated with real family usage data.

## Core Promise

> Help families plan training, tournaments, recovery, cost, school load, and athlete growth.

The product exists to support family conversation and decision-making — not to replace parent, coach, or athlete judgment.

## Product Principles

### Supportive Tone

- Not guilt-based
- Not pressure-based
- No leaderboard between siblings
- No comparison metrics unless the athlete chooses to track them
- Warnings use supportive language (e.g., "ควรเพิ่ม recovery" not "คุณพักไม่พอ")

### Data Should Help Conversation

- Every number and recommendation should be explainable in a family conversation
- The product does not make final decisions — it provides clarity for humans to decide
- Parent view and athlete view may show different levels of detail (especially cost)

### Local First

- Current MVP stores all data in localStorage
- No cloud sync, no accounts, no passwords
- This is intentional — the data model must be stable before adding persistence

### Mobile First at 375px

- Every screen is designed for 375px wide mobile phones first
- Touch targets: minimum 44px height
- Thai language UI throughout
- No horizontal scrolling unless explicitly a calendar/time strip

### Athlete Growth Over Metrics

- The primary goal is athlete growth — physical, mental, emotional, and life skills
- Rankings, scores, and win/loss records are context, not identity
- The product should help families see progress that numbers alone cannot capture

## What TennisRecap Is Not

- Not a coaching platform
- Not a tournament registration system
- Not a social network for athletes
- Not a replacement for coach judgment
- Not a talent identification/scouting tool
- Not a gambling or odds system

## Current Scope Boundaries

| Area | Status |
|------|--------|
| Backend | None — localStorage only |
| Auth | None |
| Database | None |
| AI features | None |
| Payments | None |
| External APIs | None |
| Drag-and-drop | None |
| Multi-user | Not yet |
| Multi-sport | Not yet |
| Multi-athlete | Not yet |

These boundaries are intentional. Each will be evaluated in the roadmap before being added.