# Product-Mode Pre-Flight Checklist

**Work:** Improve uncertainty handling and CLI reliability
**Date:** 2026-10-10

- **Problem:** Users need product guidance that exposes consequential unknowns without unnecessary interviews, and CLI recommendations that do not disguise semantic changes as harmless edits.
- **Why now:** The review of GitHub 1.0.2 reproduced false trivial recommendations for a route change, Python indentation, a private field, and an agent approval rule. Lint lacked configuration; a failed checklist save retained a successful exit status. The user approved fixes and adaptations from grill-me.
- **Scope:** Update the existing seven principles, document evaluation cases, conservatively classify diffs, correct failure statuses, and add focused CLI/package checks with CI. Evaluate demand before adding a separate deeper-review skill.
- **Primary metric:** Zero false automatic trivial recommendations among the reproduced semantic regression cases. Lint, build, package/CLI checks, and instruction-file equality must pass. Agent-behavior improvement is unknown until real comparison runs measure useful decisions, unnecessary questions, and unsupported evidence.
- **Reversibility:** Two-way door through a review branch. Publishing a new npm version requires a separate release decision.

**Verification:** Regression tests must retain the small ordinary-documentation case while rejecting the reproduced semantic cases. Error-path tests must prove a nonzero status. The packed CLI must start and preserve existing instructions on repeated init. Use `examples/uncertainty.md` to record actual agent comparisons separately.
