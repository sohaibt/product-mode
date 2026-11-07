# Backlog: product-mode

## Next
- **Dogfood the slash commands.** Use `/preflight` and `/decision` in Sohaib's own projects. Revisit on 2026-11-21 (decision `2026-11-07-slash-commands-via-init.md`): if unused, find out why before building more commands.
- **Investigate the star drop.** 209 (2026-10-09) to 176 (2026-11-07). Check whether removed stars tie to the aviso.bz promo traffic.
- **Measure the npm launch.** Latest: 11 downloads/week, 176 stars (2026-11-07). Google referrers baseline 53 people / 14 days (2026-10-09). GitHub only keeps 14 days of traffic, so record numbers in the session log each time.
- **Announce the one-command install.** LinkedIn post drafted 2026-10-09 (hook: the `trivial` billing-file bug; link in first comment; image `social-preview.png`). Sohaib to post. Substack follow-up still open.

- **product-mode page on sohaibthiab.me.** In progress in the `sohaibthiabpersonal` repo session. Goal metric: Substack signups from the page. Once live, link it from the README and the GitHub "website" field.

## Later
- Run and publish real baseline/product-mode comparisons using `examples/uncertainty.md`, including failures and unnecessary questions. Consider an optional deeper product-review skill only after observing demand.
- Publish from GitHub Actions with npm trusted publishing (npm is restricting 2FA-bypass tokens), so releases don't need the Terminal + browser step.
- `trivial` is advisory and automatically qualifies only small ordinary documentation edits. Consider language-aware cosmetic classification if the conservative rule creates repeated friction.
- GitHub release for each npm version (shows in followers' feeds). 1.0.3 and 1.1.0 have tags but no GitHub releases.
- Test the slash commands in Cursor live (only docs confirm `.agents/skills/` support).
