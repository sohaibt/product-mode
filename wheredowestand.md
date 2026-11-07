# Where do we stand: product-mode

## RESUME HERE

**State:** `product-mode@1.1.0` is on npm (tag `v1.1.0` pushed). 1.0.3 shipped the 2026-10-10 CLI fixes (PR #4). 1.1.0 adds the `/preflight` and `/decision` slash commands (PR #6): `init` copies `skills/*/SKILL.md` into `.claude/skills/` (Claude Code) and `.agents/skills/` (Codex uses `$preflight`; Cursor reads the same folder, not tested live). Decision: `.product-mode/decisions/2026-11-07-slash-commands-via-init.md`.

**First thing next session:** check whether Sohaib has used `/preflight` in his own projects (the decision's revisit trigger is 2 weeks after 1.1.0, so 2026-11-21). Investigate the star drop (209 on 2026-10-09 to 176 on 2026-11-07). Then pick the next backlog item.

Next-session startup prompt:

```
Working on product-mode (github.com/sohaibt/product-mode, npm: product-mode).
1. git fetch and compare to origin/main; pull --ff-only if behind.
2. Read wheredowestand.md (RESUME HERE) and backlog.md.
3. Check the launch numbers: `gh api repos/sohaibt/product-mode --jq .stargazers_count`,
   `gh api repos/sohaibt/product-mode/traffic/popular/referrers`, and npm weekly downloads
   (`curl -s https://api.npmjs.org/downloads/point/last-week/product-mode`).
   Compare to the 2026-11-07 log entry (176 stars, 11 downloads/week).
4. Ask me whether I used /preflight or /decision in my own projects since 1.1.0.
5. Propose the next backlog item with a recommendation. Ask before building.
Note: npm login/publish must run in the Mac Terminal app, not via `!` (it needs Enter + browser 2FA).
`npm publish` E404 = not logged in; run `npm login` first.
```

---

## Session log

### 2026-11-07

**Numbers:** 176 stars (down from 209 on 2026-10-09; cause unknown, possibly GitHub removing spam accounts tied to the aviso.bz promo traffic). npm: 11 downloads in the week 2026-10-31 to 2026-11-06.

**Done:**
- Pulled PRs #4 and #5 (merged on the Mac Mini). Released `1.0.3` to npm with the merged CLI fixes; README no longer says they await a release.
- Built and shipped `/preflight` and `/decision` slash commands (PR #6, released as `1.1.0`). They are SKILL.md files with `disable-model-invocation: true`; `init` installs them for Claude Code and `.agents/skills/` agents and never overwrites an existing skill of the same name. `trivial` stays CLI-only.
- Verified live: Claude Code `/preflight` drafted the boxes, marked guesses *assumed*, asked 3 questions, and waited to save; `/decision` saved a file in CLI format. Codex `$preflight` worked. Cursor not tested.

### 2026-10-10

**Approved scope:** Sohaib approved the product-mode review improvements and the product-focused adaptations from Matt Pocock's grill-me skill. Work starts from GitHub commit `8b545d2` (1.0.2), including the laptop changes.

**Changes for review:**
- Principles 1, 2, 3, 6, and 7: reuse context, sequence material questions, separate evidence from agreement, route unknowns to the appropriate validation step, stop when the next authorized action is clear, handle necessary failures, and record consequential decisions. Deeper challenge sessions remain explicitly requested.
- `trivial`: only small changes to ordinary existing documentation may qualify for lighter rigor. Code, agent policies, sensitive files, new/deleted files, metadata changes, binaries, and unsupported diffs require review. Explicit paths check staged changes before falling back to unstaged changes.
- CLI errors set a failing exit status; async entry-point failures are caught; interactive commands fail clearly without a terminal.
- Added ESLint configuration and CI for Node 20.19, 22, and 24. Tests exercise semantic regressions, failed saves, and the packed executable.
- Added six authored uncertainty evaluation cases and expanded the comparison protocol. No behavioral comparison results are claimed.

**Decision:** see `.product-mode/decisions/2026-10-10-uncertainty-and-conservative-review.md`.

### 2026-10-09 evening (MacBook Air)

**Baselines:** 209 stars. npm weekly-downloads API not yet indexing the package.

**Done:**
- `CLAUDE.md` / `AGENTS.md` tightened for agents: "When to Skip" and "Prior Decisions" moved to the top; "Success metric" renamed "Primary metric" (also in the `checklist` CLI prompt); Principle 6 says ask for a baseline, never invent one; Principle 7 points at `.product-mode/decisions/`; "How to Know It's Working", "Why This Exists", "License" moved to README. 213 -> 188 lines. `init` still detects the moved section (tested).
- Released 1.0.2 (npm + git tag `v1.0.2`). First publish attempt failed with E404 = not logged in.
- Decided to build a product-mode page on sohaibthiab.me (aihero.dev/skills-grill-me style). Goal: Substack signups, small workshop link. Built in its own session/repo (`sohaibthiabpersonal`).

## Decision: Agent file is for agents; human prose lives in README
Date: 2026-10-09
Context: the agent reads CLAUDE.md every turn; motivation/license sections cost context and do nothing for it; the skip table was at the end.
Options considered: keep as is; reorder only; reorder + move human sections out.
Choice: reorder + move out, because shorter, decision-first files get followed better.
Reversibility: two-way door.
Revisit trigger: users say they copy the file and miss the "why" context.

### 2026-10-09 (MacBook Air)

**Baselines:** 207 stars (was 56 about 3-4 weeks earlier), 6 forks. Last 14 days: 389 views / 232 people. Top referrer Google (53 people), then github.com (16), aviso.bz (14, paid-promo site), LinkedIn (~10). npm downloads: 0 (just published).

**Done:**
- Security fix: `trivial` passed file names through a shell (injection + broke on spaces). Now uses `execFileSync` with argv.
- Discoverability: README intro names Claude Code / Cursor / Codex; dash typos fixed. GitHub description updated; topics 14 -> 20 (the max). Social preview image (1280x640, full banner) uploaded by Sohaib.
- npm launch: `package.json` ships 10 files (was 41), repo links, keywords, `engines: node >=20.19` (inquirer 9 is ESM-only). Dropped unused `chalk` / `node-fetch`. Published 1.0.0, then 1.0.1.
- `trivial` rewrite (1.0.1): a new 200-line billing file used to report "trivial". Now code may only change whitespace, comments, or string typos; new/deleted code files and sensitive paths are never trivial; docs allow <= 10 lines; falls back to unstaged changes; prints reasons. 11 jest tests in `test/trivial.test.ts`.

**Decisions:**

## Decision: Publish the CLI to npm as `product-mode`
Date: 2026-10-09
Context: CLI required clone + build; npm name was free; Google is the main traffic source.
Options considered: keep source-only install; publish to npm.
Choice: publish, because one-command install removes the biggest adoption step and adds npm search as a channel.
Reversibility: one-way door (name is held; unpublish only within 72h).
Revisit trigger: weekly downloads still near 0 after 30 days.

## Decision: `trivial` errs toward "non-trivial"
Date: 2026-10-09
Context: a false "trivial" skips the checklist on risky work; a false "non-trivial" only costs a few minutes.
Options considered: keep loose heuristics; strict rules with a sensitive-path list.
Choice: strict, because skipping rigor on billing/auth is the expensive mistake.
Reversibility: two-way door.
Revisit trigger: users report it flags too much (issues or feedback).
