# Where do we stand: product-mode

## RESUME HERE

**State:** CLI is on npm (`product-mode@1.0.1`, https://www.npmjs.com/package/product-mode). README installs via `npx product-mode init`. `trivial` command rewritten and covered by `npm test`. All work pushed to `origin/main`.

**First thing next session:** read the launch metric (see backlog "Measure the npm launch") and pick the next backlog item.

Next-session startup prompt:

```
Working on product-mode (github.com/sohaibt/product-mode, npm: product-mode).
1. git fetch and compare to origin/main; pull --ff-only if behind.
2. Read wheredowestand.md (RESUME HERE) and backlog.md.
3. Check the launch numbers: `gh api repos/sohaibt/product-mode --jq .stargazers_count`,
   `gh api repos/sohaibt/product-mode/traffic/popular/referrers`, and npm weekly downloads
   (`curl -s https://api.npmjs.org/downloads/point/last-week/product-mode`).
   Compare to the baselines in the 2026-10-09 log entry.
4. Propose the next backlog item with a recommendation. Ask before building.
Note: npm login/publish must run in the Mac Terminal app, not via `!` (it needs Enter + browser 2FA).
```

---

## Session log

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
