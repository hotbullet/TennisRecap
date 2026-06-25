# Design Review Process

## Overview

Building the feature and passing automated checks (lint, TypeScript, build) is not enough. Every change must pass a manual design review before it is considered complete and before the next phase begins.

This document defines the design review checklist and process.

## When to Review

Design review is required after:

- Every new feature or major UI change
- Every new component
- Every layout change affecting mobile readability
- Every text/language change visible to users
- After Vercel deploys from a new commit

## Review Checklist

### 1. Mobile Readability (375px)

- [ ] Content fits within 375px width without horizontal overflow
- [ ] Text is readable at default font sizes
- [ ] No truncated text (unless intentional with ellipsis)
- [ ] Images and icons scale correctly
- [ ] Tables/grids collapse or scroll appropriately

### 2. Thai Text Readability

- [ ] All Thai text renders correctly (no tofu boxes, no broken characters)
- [ ] Line height is sufficient for Thai script (taller characters need more space)
- [ ] Font weight is readable for Thai characters
- [ ] No mixed-language formatting issues
- [ ] Dates use Thai locale correctly (พ.ศ. or ค.ศ. as appropriate)

### 3. Touch Target Size

- [ ] All tappable elements have minimum 44px height
- [ ] Buttons have enough spacing to avoid accidental taps
- [ ] Interactive elements are not too close together
- [ ] Scroll areas work smoothly on touch
- [ ] No elements require precision tapping

### 4. Emotional Tone

- [ ] Warnings use supportive, not alarming language
- [ ] No guilt-inducing messages about cost, performance, or training load
- [ ] Success messages celebrate effort, not just results
- [ ] Empty states are friendly, not accusatory
- [ ] Error states explain what happened without blame
- [ ] Cost information is handled sensitively

### 5. Bottom Navigation

- [ ] All tabs are reachable
- [ ] Active tab is clearly indicated
- [ ] Tab labels are readable
- [ ] Bottom nav does not overlap content
- [ ] Navigation feels natural for the task flow

### 6. Calendar Clarity

- [ ] Dates are clearly readable
- [ ] Week/month/year views render correctly
- [ ] Today indicator is visible
- [ ] Navigation between time periods works
- [ ] Activity colors are distinguishable

### 7. Private Note Trust

- [ ] Visibility settings are clear and unambiguous
- [ ] "Private" label inspires confidence, not suspicion
- [ ] No indication of hidden content to unauthorized viewers
- [ ] Sharing controls are simple and intentional

### 8. Warning Tone

- [ ] Load warnings use "ควร" (should) not "ต้อง" (must)
- [ ] Recovery suggestions are invitations, not commands
- [ ] Overtraining warnings explain risk without fear
- [ ] Cost warnings are parent-only or summarized for athlete
- [ ] No red text without context explaining why

### 9. Clarity Without Explanation

- [ ] A parent with no training can understand each screen
- [ ] An athlete can understand their own data
- [ ] Icons have meaning or text labels
- [ ] Numbers have context (not just raw values)
- [ ] Actions have clear outcomes

## Screenshot Review

For each review, capture screenshots at 375px width of:

1. Every tab in the bottom navigation
2. Every view in the plan calendar (วัน, สัปดาห์, เดือน, ปี)
3. Every state: empty, normal, warning, error
4. Any new or changed component

Review screenshots against the checklist before approving.

## Review Outcome

| Outcome | Meaning | Next Step |
|---------|---------|-----------|
| **Approved** | All checklist items pass | Proceed to next phase |
| **Approved with notes** | Minor issues found, not blocking | Fix in next iteration |
| **Changes required** | One or more items fail | Fix before continuing |

## Process Rule

> No new feature should start before the previous feature's design review is accepted.

This prevents accumulating design debt and ensures every increment is usable before building on top of it.

## Who Reviews

Since this is a small project without a dedicated designer:

- **Primary reviewer:** The product owner (user)
- **AI assists:** Surface checklist items, note potential issues
- **Decision:** Human approves based on actual mobile usage

## Review Log

| Date | Feature | Reviewer | Outcome |
|------|---------|----------|---------|
| — | Plan calendar view switcher | Pending | — |
| — | Weekly training plan view | Pending | — |
| — | Daily plan detail view | Pending | — |