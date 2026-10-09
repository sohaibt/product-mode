# Backlog: product-mode

## Next
- **Measure the npm launch.** Check on 2026-10-16 and 2026-11-08: npm weekly downloads (baseline 0), stars (baseline 207), Google referrers (baseline 53 people / 14 days). GitHub only keeps 14 days of traffic, so record numbers in the session log each time.
- **Announce the one-command install.** Short LinkedIn / Substack post: `npx product-mode init`.

## Later
- CI: GitHub Action that runs `npm test` on PRs.
- Publish from GitHub Actions with npm trusted publishing (npm is restricting 2FA-bypass tokens), so releases don't need the Terminal + browser step.
- `trivial` limits: sensitive-file check is by path name only; `#` counts as a comment, so C `#define` edits look trivial.
- GitHub release for each npm version (shows in followers' feeds).
