# Private Notes and Consent Model

## Overview

Athletes — especially as they grow older — need a private space to record thoughts, feelings, and concerns. The product must protect athlete privacy while still enabling supportive family conversation.

This is not just a feature. It is a trust contract between the product, the athlete, and the family.

## Core Principle

> Private notes must be truly private.

If an athlete writes something marked "private," no parent, coach, or admin should be able to read it — ever. There is no backdoor, no parent override, no "view as parent" mode that bypasses privacy settings.

## Visibility Levels

Each private note has a visibility setting chosen by the athlete (or parent, for parent-managed profiles):

| Visibility | Who Can Read | Use Case |
|------------|-------------|----------|
| **Private** | Athlete only | Personal journal, emotional processing, things not ready to share |
| **Share with parents** | Athlete + parents | Feelings the athlete wants parents to know |
| **Share with coach** | Athlete + coach | Technical concerns, training feedback, coach questions |
| **Summary only** | Everyone sees topic, not content | "I have a concern about my serve" — visible topic, private details |

## Consent Flow

### Draft → Approve → Share

```
Athlete writes note (draft)
        ↓
Athlete chooses visibility
        ↓
Note is saved with chosen visibility
        ↓
If "share with parents" or "share with coach":
  → Designated recipients can see the note
If "private":
  → Only the athlete can see it
If "summary only":
  → Topic/title is visible to family/coach
  → Content is private
```

### Parent-Managed Profiles

For younger athletes (parent-managed mode):

- Parent creates notes on behalf of the athlete
- Visibility defaults to "share with parents"
- Athlete can view notes but may not edit visibility
- As athlete ages, transition to co-managed or athlete-led

### Co-Managed Profiles

- Athlete creates and manages their own notes
- Parent can see notes marked "share with parents"
- Parent cannot see notes marked "private"
- Parent can send a "support message" — a note to the athlete that does not require access to private content

### Athlete-Led Profiles

- Athlete has full control over all notes
- Default visibility is "private"
- Athlete chooses what to share and when
- Parent receives no automatic access

## What Parents Should Never Have

- ❌ A "view all private notes" button
- ❌ A secret override or admin mode
- ❌ Ability to change note visibility without athlete consent
- ❌ Notification when athlete writes a private note
- ❌ Any indication that private notes exist (the count or topic is private too)

## Support Messages (Parent → Athlete)

Instead of forcing access to private notes, parents can send **support messages**:

- A parent writes a message to the athlete
- The message appears in the athlete's notes or dashboard
- It does not require the athlete to share anything
- It does not reference any private content
- It is supportive, not investigative

Example:
> "แม่เห็นว่าช่วงนี้ซ้อมหนัก อยากให้รู้ว่าแม่ภูมิใจในความพยายามของลูกเสมอ ถ้าอยากคุยเรื่องอะไร แม่อยู่ตรงนี้"

Translation: "Mom sees you've been training hard. I want you to know I'm always proud of your effort. If you want to talk about anything, I'm here."

## Privacy by Age (Summary)

| Age Group | Note Creator | Default Visibility | Parent Can See Private? | Athlete Can Change Visibility? |
|-----------|-------------|-------------------|------------------------|-------------------------------|
| Under 10 | Parent | Share with parents | Yes (parent-managed) | No |
| 10–12 | Parent + limited athlete | Share with parents | Yes (parent-managed) | Limited |
| 13–15 | Athlete | Athlete chooses | No (if private) | Yes |
| 16+ | Athlete | Private | No | Yes |

## Data Storage

- Private notes are stored in localStorage (current MVP) or future database
- No special encryption in MVP (single-device localStorage is inherently private to the device user)
- When cloud sync is added: private notes must be encrypted with athlete-controlled keys
- Coach access is read-only and limited to shared notes only

## Design Principles

- The "private" setting should feel safe, not hidden
- The UI should make visibility clear at all times
- Changing visibility should require confirmation
- Athletes should never feel pressured to share
- Parents should never feel excluded — they have support messages
- The product is on the athlete's side

## Note Types

Over time, private notes may support different types:

| Type | Example |
|------|---------|
| **Journal** | Daily reflections, feelings, mood tracking |
| **Training concern** | "My backhand feels off — not sure why" |
| **Coach question** | "Want to ask coach about changing grip" |
| **Goal setting** | Personal goals, not yet shared with family |
| **Match reflection** | Private thoughts after a tournament |
| **Wellbeing check** | Stress, anxiety, motivation tracking |

## Connection to Decision-Making

Private notes can support family decision-making — but only when the athlete consents to share:

- If an athlete shares a note about tournament anxiety → parent sees it → family discussion becomes more informed
- If an athlete keeps it private → the system surfaces no information → decision is based on other data
- The product never uses private note content for automated recommendations