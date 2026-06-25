# Tournament Source Inbox

## Overview

Tournament announcements in Thailand come from many scattered sources — association pages, provincial groups, club Line messages, coach forwards, PDF posters. There is no unified API.

The Tournament Source Inbox is a future feature that collects tournament announcements from these sources into one place, where families can review, verify, and decide which tournaments to plan for.

## No API Assumption

The architecture assumes there will never be a reliable, structured tournament API. All data entry starts from human-imported content.

## Sources

| Source Type | Example | Import Method |
|-------------|---------|---------------|
| Official association page | LTAT website, provincial tennis association | Manual entry, link paste |
| Provincial pages | "สมาคมกีฬาเทนนิสจังหวัด..." Facebook pages | Copy-paste text, screenshots |
| Club announcements | Local tennis club Line groups | Coach forward → parent copies |
| Coach forwarded posts | Coach shares tournament poster in chat | Forward to inbox |
| Copied text | Someone shares tournament details as text | Paste into inbox |
| PDF announcements | Tournament poster/flyer as PDF | Manual entry from PDF |
| Manual entry | Nothing shared — parent types details | Direct entry |

## Import Levels (Phased)

### Phase 1: Manual Entry
- Parent or coach types all fields by hand
- Fields: title, organizer, date, deadline, venue, age groups, fee, contact

### Phase 2: Paste Announcement
- Paste raw text from a post or message
- System attempts to extract: name, date, location, fee, contact
- Extracted fields are pre-filled but editable
- Always marked as "draft" until human verified

### Phase 3: Link Parser
- Paste a URL to an announcement page
- System attempts to scrape public information (title, date, venue)
- Limited to public pages — no login, no bypass
- Always marked as "draft"

### Phase 4: Page Watcher (much later)
- Monitor known association pages for new announcements
- Flag new items for review
- Never auto-import without human approval
- Respect robots.txt and rate limits

## Verification Requirement

Every imported tournament item is **draft first**. Human verification is required before it becomes an active tournament option.

### Status Flow

```
draft → verified → planned → registered → completed
  ↓        ↓
skipped  skipped
```

| Status | Meaning |
|--------|---------|
| **Draft** | Imported but not yet checked by a human |
| **Verified** | Human confirmed details are correct |
| **Planned** | Added to calendar and/or budget planning |
| **Skipped** | Reviewed and decided not to pursue |
| **Registered** | Athlete is officially registered |
| **Completed** | Tournament is over |

## Fields Per Tournament Item

| Field | Description | Required |
|-------|-------------|----------|
| Title | Tournament name | Yes |
| Organizer | Association/club hosting | No |
| Source URL | Link to original announcement | Recommended |
| Date | Tournament date(s) | Yes |
| Registration deadline | Last date to register | Recommended |
| Province | Location province | Recommended |
| Venue | Specific venue | Recommended |
| Age groups | U10, U12, U14, etc. | Recommended |
| Singles / Doubles | Event types | Recommended |
| Registration fee | Entry fee amount | Optional |
| Contact | Phone/Line/email for registration | Recommended |
| Verified by | Who checked this (parent/coach) | Auto-set on verify |
| Verified date | When verified | Auto-set on verify |
| Notes | Any additional information | Optional |

## Integration Points (Future)

The Tournament Source Inbox must connect to:

- **Tournament Budget Planner**: Verified tournament → create budget estimate
- **Calendar**: Planned tournament → add to athlete calendar
- **Decision Engine**: Tournament options → compare and recommend
- **Family Plan Room**: Multiple tournament options → family discussion

## Scraping Caution

If any automated data collection is added in the future:

- ❌ Do not bypass login pages
- ❌ Do not scrape aggressively (rate limit, respect robots.txt)
- ❌ Do not store copyrighted content — extract facts only
- ✅ Use public information only
- ✅ Cache responsibly (re-check once per day max)
- ✅ Always mark auto-imported items as "draft"
- ✅ Always require human verification

## Design Principles

- The inbox is a tool for awareness, not a recommendation engine
- Every item is "maybe" until the family decides
- No auto-registration, no auto-commitment
- The inbox should reduce stress (one place to check), not add stress (too many options)
- Items can be filtered by: province, age group, date range, event type
- Skipped items are preserved (they may become relevant later or for next year)

## Example Entry

```
Title:       PTT ลอนเทนนิสพัฒนาฝีมือ ครั้งที่ 3
Organizer:   สมาคมกีฬาเทนนิสแห่งประเทศไทย
Source:      https://www.ltat.org/tournament/ptt-2026-3
Date:        2026-07-15 to 2026-07-18
Deadline:    2026-06-30
Province:    นนทบุรี
Venue:       ศูนย์พัฒนากีฬาเทนนิสแห่งชาติ เมืองทองธานี
Age Groups:  U10, U12, U14, U16
Events:      Singles, Doubles
Fee:         ฿1,500 (singles), ฿2,000 (doubles per pair)
Contact:     02-xxx-xxxx, Line: @ltat
Verified by: แม่ (Parent)
Verified:    2026-06-15
Status:      Planned