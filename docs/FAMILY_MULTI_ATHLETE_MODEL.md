# Family Multi-Athlete Model

## Overview

TennisRecap currently supports a single athlete. The architecture should eventually support a family account with multiple athlete profiles — siblings in the same household, potentially playing different sports.

This document defines the data model and UX principles before any implementation.

## Family Account Structure

```
Family Account
├── Parent / Guardian 1
├── Parent / Guardian 2
├── Coach (invited, limited access)
├── Athlete: Daniel (age 13, tennis, athlete-led)
├── Athlete: Sarah (age 9, swimming + gymnastics, parent-managed)
└── Athlete: Mark (age 16, football + tennis, co-managed)
```

### Family Account

- One family account per household
- Contains shared logistics: calendar, cost overview, family notes
- Parents manage the family account
- Family account is not visible to athletes in full cost detail

### Parent / Guardian Users

- Full access to all athlete profiles
- Can create, edit, archive athlete profiles
- Manage coach invitations
- View family dashboard: all athletes, all costs, calendar overlay
- Can set privacy mode per athlete (parent-managed / co-managed / athlete-led)

### Coach Access

- Invited by parent
- Limited to specific athletes
- Can view: training plan, tournament schedule, readiness summary
- Cannot view: private notes (unless shared), full family cost, sibling data
- Can add: training notes, tournament recommendations, readiness feedback

## Athlete Profiles

Each athlete profile is independent:

### Profile Fields

| Field | Description |
|-------|-------------|
| Name | Athlete's preferred name |
| Age / Birth year | For age group classification |
| Photo | Optional avatar |
| Sports | One or more sport profiles (see Multi-Sport Model) |
| Pathway | excellence / education / balanced / health |
| Primary goal | Athlete's own words |
| Management mode | parent-managed / co-managed / athlete-led |

### Athlete Data Isolation

- Each athlete has separate:
  - Training entries
  - Plan activities
  - Readiness data
  - Strength/weakness insights
  - Private notes
  - Tournament history
  - Budget (athlete view)

### Shared Resources

The family shares:
- Family calendar (overlay of all athlete plans)
- Family cost dashboard (parent view only)
- Tournament source inbox (shared)
- Family decision room (for multi-athlete tournament conflicts)

## Management Modes

### Parent-Managed (younger athletes, ~under 12)

- Parent creates and manages all data
- Athlete can view their own dashboard (read-only or limited input)
- Private notes default to "share with parents"
- Cost details hidden from athlete view
- Parent approves all plan changes

### Co-Managed (~ages 12–15)

- Athlete can add training entries and notes
- Athlete can see their own readiness and insights
- Parent reviews and can adjust plans
- Private notes can be "private" or "share with parents"
- Cost shown as supportive summary (not full numbers)
- Tournament decisions require parent + athlete agreement

### Athlete-Led (~ages 16+)

- Athlete manages their own daily entries, plans, and notes
- Parent has dashboard overview but not full edit rights
- Private notes default to "private"
- Cost shown in full to athlete
- Parent can send support messages without forcing access
- Coach collaboration is athlete-initiated

## Privacy by Age

| Age Group | Management | Data Entry | Cost View | Notes Default |
|-----------|-----------|------------|-----------|---------------|
| Under 10 | Parent-managed | Parent only | Hidden | Share with parents |
| 10–12 | Parent-managed | Parent + limited athlete | Hidden | Share with parents |
| 13–15 | Co-managed | Athlete + parent | Summary only | Athlete chooses |
| 16+ | Athlete-led | Athlete primary | Full | Private |

These are defaults, not rigid rules. Families can adjust based on their situation.

## Family Dashboard

When multiple athletes exist, the family dashboard shows:

- **Calendar overlay**: Color-coded by athlete, showing all plans in one view
- **Weekly load summary**: Per athlete, per sport — flag conflicts and overload
- **Cost overview** (parent only): Total monthly, per athlete, per sport
- **Upcoming tournaments**: All athletes, sorted by date
- **Conflict warnings**: Two tournaments same weekend, travel overlap, recovery clash
- **Family notes**: Shared notes visible to parents (not athletes)

## Sibling Comparison Prevention

- **No ranking between siblings**: The product never shows "Daniel trained 12 hours, Sarah trained 8 hours" side by side
- **No cost comparison**: Athletes never see sibling cost data
- **No readiness comparison**: Readiness scores are individual, not ranked
- **Separate dashboards**: Each athlete logs into their own view
- **Supportive language only**: All messaging is athlete-centric, never comparative

## Shared Logistics (Without Comparison)

Areas where the family shares logistics without exposing sensitive data:

- **Shared calendar**: Shows who has what when, without load/cost detail
- **Tournament conflict detection**: Flags when two tournaments overlap, without revealing budgets
- **Travel planning**: Shared travel days and logistics, cost visible to parents only
- **Coach scheduling**: If one coach serves multiple siblings, show availability