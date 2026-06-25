# AI Coder Workflow

## Context

The primary contributor to TennisRecap is not a coder. All code changes are made through an AI assistant (Cline) working in VS Code. This document defines the safe workflow that the AI must follow.

## Core Rules

### The User Is Not a Coder

- Explain changes in plain language
- Do not assume technical knowledge
- Report results clearly: pass/fail, what changed, what to test
- Use Thai for user-facing text, English for code and technical terms

### Controlled Phases

- One prompt should contain **maximum 2 phases**
- Each phase follows: inspect → implement → lint → TypeScript check → build → fix errors → commit if clean
- Stop after 2 phases and report
- Do not continue to the next phase until the user explicitly approves

## Phase Workflow

```
Phase Start
  │
  ├── 1. Inspect
  │     Read relevant files
  │     Understand current state
  │     Identify what needs to change
  │
  ├── 2. Implement
  │     Write or edit code
  │     Use replace_in_file for targeted edits
  │     Use write_to_file for new files or complete rewrites
  │
  ├── 3. Verify
  │     npm run lint        → must pass (0 errors, 0 warnings preferred)
  │     npx tsc --noEmit    → must pass (0 errors)
  │     npm run build       → must pass (compiled successfully)
  │
  ├── 4. Fix (if needed)
  │     Fix only the errors from verify step
  │     Re-run checks
  │     Maximum 2 fix attempts
  │     If still failing, stop and report
  │
  └── 5. Commit (if clean)
        git add -A
        git commit -m "descriptive message"
        Report: commit hash, files changed, what was done
```

## Required Safety Checks

Before starting any phase:

```bash
git status --short
git log --oneline -5
```

Confirm:
1. Working tree is clean
2. Latest commit is expected
3. No uncommitted files exist

If not clean, stop and report. Do not proceed.

## Required Quality Checks

After every code change:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three must pass before committing.

## Live URL Check (Safe Method Only)

```bash
curl.exe -I https://tennisrecap.vercel.app/
```

Use `-I` (HEAD request) only. **Never** use full-page curl body checks with `findstr` — this can freeze the terminal.

If you need to verify page content, open the URL in a browser manually.

## What the AI Must Never Do

- ❌ Continue past 2 phases without user approval
- ❌ Edit files without first running `git status --short`
- ❌ Commit when git is not clean (unexpected files)
- ❌ Mix large features in one commit
- ❌ Deploy manually unless explicitly asked
- ❌ Change domain, deployment, or build settings
- ❌ Add backend, auth, database, AI, payment, or external APIs
- ❌ Rewrite unrelated parts of the app
- ❌ Delete existing features (data entry, insights, weekly/monthly/yearly views)
- ❌ Use full-page curl body checks that can freeze the terminal
- ❌ Use `findstr` on Next.js HTML output
- ❌ Add drag-and-drop libraries
- ❌ Continue after 2 failed fix attempts — stop and report

## Commit Message Format

Use short, descriptive English messages:

- `Add plan calendar view switcher`
- `Improve weekly training plan view`
- `Improve daily plan detail view`
- `Add local data entry and strength weakness insights`

Commit messages should describe what changed, not why (the PR/phase description covers why).

## Push Workflow

When the user asks to push:

```bash
git status --short
git log --oneline -5
git push
```

Report:
1. Push result (success/fail)
2. Latest commit hash on origin/master
3. git status (clean?)
4. Confirm Vercel auto-deploy from GitHub

Do not push unless explicitly asked.

## Recovery Check

If the terminal freezes or the AI session is interrupted:

```bash
git status --short
git log --oneline -3
npm run lint
npx tsc --noEmit
npm run build
curl.exe -I https://tennisrecap.vercel.app/
```

Report:
1. git status
2. Latest commit
3. Lint result
4. TypeScript result
5. Build result
6. Live URL HTTP status
7. Confirm no files changed

Do not run full-page curl body checks. Do not use findstr.

## File Scope Rules

When editing:
- Only change files related to the current phase
- Do not touch package.json, tsconfig.json, next.config.ts, or deployment configs
- Do not edit files in other component directories unless the phase requires it
- Prefer `replace_in_file` with targeted SEARCH/REPLACE blocks over complete rewrites
- When a complete rewrite is needed, use `write_to_file` with the full file content

## Error Handling

If lint, TypeScript, or build fails:
1. Read the error message carefully
2. Fix only the specific error
3. Re-run the check
4. If it passes, continue
5. If it fails again, make one more attempt
6. If still failing, stop and report the error to the user

Do not:
- Suppress errors with `// @ts-ignore` or `eslint-disable`
- Change config files to make errors go away
- Remove code that causes errors without understanding why