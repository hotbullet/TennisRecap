# Roadmap

## Current State

TennisRecap is a mobile-first tennis planning MVP running entirely in the browser with localStorage. No backend, no auth, no database.

## Roadmap Phases

### Phase 0 — Current MVP ✅

| Feature | Status |
|---------|--------|
| 5-tab navigation (Today, 14-Day Plan, Family, Investment, Notes) | ✅ Done |
| Today dashboard with readiness summary | ✅ Done |
| Tournament impact preview (legacy) | ✅ Done |
| Family plan room with reactions (legacy) | ✅ Done |
| Investment cost tracking (legacy) | ✅ Done |
| Private notes with visibility (legacy) | ✅ Done |
| Mobile-first at 375px | ✅ Done |
| Thai language UI | ✅ Done |
| localStorage only | ✅ Done |

### Phase 1 — Local Data Entry + Insights ✅

| Feature | Status |
|---------|--------|
| Daily entry form (training, match, tournament, fitness, recovery) | ✅ Done |
| Mood, energy, sleep, soreness, heat, ball condition tracking | ✅ Done |
| Strength/weakness/trigger/condition tags | ✅ Done |
| Strength/weakness insight engine | ✅ Done |
| Export/import JSON backup | ✅ Done |
| Clear all data | ✅ Done |
| Data safety banner | ✅ Done |

### Phase 2 — Plan Calendar ✅

| Feature | Status |
|---------|--------|
| Segmented control: วัน | สัปดาห์ | เดือน | ปี | ✅ Done |
| Daily view with single-day focus and navigation | ✅ Done |
| Weekly view with 7 day cards, load bars, summary | ✅ Done |
| Monthly view with week blocks and bar charts | ✅ Done |
| Yearly view with 12-month grid | ✅ Done |
| Add/remove plan activities (localStorage) | ✅ Done |
| Load level indicators (เบา/สมดุล/หนัก/หนักมาก) | ✅ Done |
| Decision helper text per load level | ✅ Done |
| Quick action buttons (เพิ่มกิจกรรม, บันทึกผล, Private Note) | ✅ Done |
| Recovery indicators and warnings | ✅ Done |

### Phase 3 — Design Review Hardening 🔜

**Goal:** Review everything built so far against the design checklist. Fix visual and usability issues before adding more features.

| Task | Status |
|------|--------|
| Full design review using docs/DESIGN_REVIEW.md checklist | ⬜ Pending |
| 375px mobile screenshot review | ⬜ Pending |
| Thai text readability check | ⬜ Pending |
| Touch target audit (44px minimum) | ⬜ Pending |
| Warning tone review | ⬜ Pending |
| Empty state review | ⬜ Pending |
| Fix any issues found | ⬜ Pending |
| Re-review after fixes | ⬜ Pending |

### Phase 4 — Tournament Budget Planner 🔮

**Goal:** Forward-looking tournament cost estimation with decision support.

| Feature | Status |
|---------|--------|
| Per-tournament budget form (line items) | ⬜ Future |
| Budget levels: minimum / likely / max risk | ⬜ Future |
| Non-money cost (training days lost, recovery risk, school impact) | ⬜ Future |
| Decision output: Go / Go with limit / Match Sim / Skip / Need info | ⬜ Future |
| Parent full view vs athlete supportive view | ⬜ Future |
| Integration with existing Investment View | ⬜ Future |

### Phase 5 — Tournament Source Inbox 🔮

**Goal:** Collect tournament announcements from scattered sources into one reviewable inbox.

| Feature | Status |
|---------|--------|
| Manual tournament entry form | ⬜ Future |
| Paste announcement → extract fields | ⬜ Future |
| Draft → verify → plan → register → complete status flow | ⬜ Future |
| Filter by province, age group, date, event type | ⬜ Future |
| Integration with budget planner and calendar | ⬜ Future |

### Phase 6 — Family Multi-Athlete Model 🔮

**Goal:** Support multiple children in one family account.

| Feature | Status |
|---------|--------|
| Family account structure | ⬜ Future |
| Multiple athlete profiles | ⬜ Future |
| Parent-managed / co-managed / athlete-led modes | ⬜ Future |
| Privacy by age | ⬜ Future |
| Coach access | ⬜ Future |
| Family dashboard with calendar overlay | ⬜ Future |
| Shared logistics without sibling comparison | ⬜ Future |
| Cost views: parent full vs athlete supportive | ⬜ Future |

### Phase 7 — Multi-Sport Model 🔮

**Goal:** One athlete playing multiple sports. Siblings playing different sports.

| Feature | Status |
|---------|--------|
| Sport profiles per athlete | ⬜ Future |
| Sport roles: main goal, support, fun, school, trial | ⬜ Future |
| Shared body load across sports | ⬜ Future |
| Sport-specific tags | ⬜ Future |
| Cross-sport warning system | ⬜ Future |
| Sport profile lifecycle (add, review, archive, reactivate) | ⬜ Future |

### Phase 8 — Supabase / Auth (Later) 🔮

**Goal:** Add cloud persistence and user accounts — but only after the data model is stable.

| Feature | Status |
|---------|--------|
| Supabase project setup | ⬜ Future |
| Family account authentication | ⬜ Future |
| Role-based access (parent, athlete, coach) | ⬜ Future |
| Data migration from localStorage | ⬜ Future |
| Cross-device sync | ⬜ Future |
| Encrypted private notes | ⬜ Future |

**⚠️ Do not add backend until all Phase 3–7 data models are proven with real family usage in localStorage.**

### Phase 9 — Real Family Collaboration (Much Later) 🔮

**Goal:** Multi-user real-time features.

| Feature | Status |
|---------|--------|
| Parent-athlete shared dashboard | ⬜ Future |
| Coach remote access | ⬜ Future |
| Family decision room with voting/comments | ⬜ Future |
| Shared calendar with conflict detection | ⬜ Future |
| Support messages (parent → athlete) | ⬜ Future |

### Phase 10 — AI Assistance (Much Later) 🔮

**Goal:** AI-powered insights and recommendations — but only after manual workflows are proven useful.

| Feature | Status |
|---------|--------|
| Training load pattern detection | ⬜ Future |
| Recovery recommendation engine | ⬜ Future |
| Tournament selection assistant | ⬜ Future |
| Natural language entry ("ซ้อมเทนนิส 2 ชม. วันนี้") | ⬜ Future |

**⚠️ Do not add AI until manual workflows are proven useful and the human decision process is well understood.**

## Key Principles

1. **LocalStorage until stable** — Do not add a backend until the data model has been validated with real family usage
2. **Human-first** — AI assistance comes after manual workflows are proven
3. **One athlete first** — Multi-athlete and multi-sport come after single-athlete tennis is solid
4. **Design review gates** — Every phase must pass design review before the next begins
5. **No premature scaling** — Build for one family, one athlete, one sport first. Scale when needed.

## Current Scope Boundaries (Do Not Cross Yet)

| Area | Boundary |
|------|----------|
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