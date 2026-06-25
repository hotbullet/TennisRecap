# Athlete Pathway Model

## Overview

Not every athlete wants to become a professional. The product must support different athlete goals — each with different training recommendations, tournament decision logic, and parent/coach conversation guidance.

The pathway is set per athlete (not per sport) and can be reviewed and changed.

## Pathway Types

### 1. Excellence / Performance

**Goal:** Compete at the highest level the athlete can reach. Rankings, tournament results, and skill progression are central.

**Typical profile:** Ranked junior player, national team aspirant, athlete training 5–6 days per week.

**Recommendation style:**
- Prioritize ranking and seeding opportunities
- Match pressure is valuable — encourage tournament participation
- Recovery is critical to avoid burnout
- Skill gap analysis is detailed
- Budget is treated as investment

**Tournament decision factors:**
| Factor | Weight |
|--------|--------|
| Ranking points available | High |
| Seeding benefit | High |
| Match pressure / experience | High |
| Recovery risk | Medium |
| Travel cost | Low (justified as investment) |
| School impact | Low (planned around) |
| Skill gap vs opponents | High (want challenging matches) |

### 2. Education / Scholarship / Portfolio

**Goal:** Use sport as part of an education pathway — scholarship applications, portfolio building, school admissions.

**Typical profile:** Athlete balancing strong academics with competitive sport, aiming for university sports programs or international school admissions.

**Recommendation style:**
- Tournament results matter but so does the story
- Portfolio value: results record, highlight reel, coach note, character evidence
- School load is protected — not sacrificed for sport
- Budget is balanced against education costs

**Tournament decision factors:**
| Factor | Weight |
|--------|--------|
| Portfolio value | High |
| School load / exam schedule | High |
| Results record | High |
| Coach note / recommendation potential | Medium |
| Highlight / recap quality | Medium |
| Ranking points | Low-Medium |
| Travel cost | Medium |

### 3. Balanced

**Goal:** Enjoy sport, stay healthy, develop life skills — without pressure to compete at an elite level.

**Typical profile:** Athlete who loves the sport, trains regularly, competes sometimes, but has other priorities (school, friends, other interests).

**Recommendation style:**
- Training is for growth and enjoyment, not ranking
- Tournaments are optional — choose based on fun and learning
- Recovery and rest are prioritized
- Cost is a family decision, not an investment calculation
- No pressure to increase training load

**Tournament decision factors:**
| Factor | Weight |
|--------|--------|
| Athlete interest / excitement | High |
| Fun and experience | High |
| Cost to family | High |
| School / life balance | High |
| Ranking points | Low |
| Match pressure | Low (optional) |

### 4. Health / Discipline

**Goal:** Build discipline, fitness, and healthy habits through sport. Competition is not the focus.

**Typical profile:** Younger athlete starting sport, or athlete using sport for physical and mental wellbeing.

**Recommendation style:**
- Consistency over intensity
- Celebrate habit-building and effort
- Tournaments are rare and only if the athlete wants to try
- Recovery and injury prevention are high priority
- No ranking pressure, no performance comparison

**Tournament decision factors:**
| Factor | Weight |
|--------|--------|
| Athlete readiness / interest | High |
| Fun and low pressure | High |
| Cost to family | High |
| Health / injury risk | High |
| Any performance metric | Low |

## Pathway Review

Pathways are not permanent. Athletes change, goals shift, and life circumstances evolve.

**Review cadence:** Every 1–3 months

**Review questions for family conversation:**
1. Does this pathway still feel right for the athlete right now?
2. Has anything changed — interest, health, school, family situation?
3. Is the current training load appropriate for this pathway?
4. Are tournament decisions aligned with pathway goals?
5. Does the athlete feel supported, not pressured?

**Who participates in review:**
- Athlete (always — voice matters at every age)
- Parent(s)
- Coach (if available)

## Alignment Questions

Before making major decisions (adding tournaments, increasing training load, changing sports), the family should check alignment:

### Athlete Check
- Do I want to do this?
- Do I understand what this means for my time and energy?
- Am I excited or anxious about this?

### Parent Check
- Can we support this financially and logistically?
- Does this fit our family values and capacity?
- Are we pushing or supporting?

### Coach Check
- Is the athlete ready for this level?
- What are the risks?
- What would success look like?

The product should surface these questions at decision points — not as a quiz, but as gentle conversation prompts.

## Important Assumptions to Avoid

- ❌ "Every athlete wants to go pro"
- ❌ "More training is always better"
- ❌ "If you're not competing, you're not serious"
- ❌ "Ranking is the only measure of success"
- ❌ "Parents should push harder"
- ❌ "Recovery is for the weak"

## Implementation Notes

- Pathway selection is per athlete (stored in athlete profile)
- Decision engine reads pathway to weight tournament recommendations differently
- UI language adapts to pathway (e.g., "investment" language for excellence, "fun and learning" for balanced)
- Pathway can be changed — history is preserved, current pathway drives active recommendations