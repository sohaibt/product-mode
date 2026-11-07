---
name: product-review
description: Review a plan, spec, or code change against the seven product-mode principles and report the gaps. Use when the user types /product-review.
disable-model-invocation: true
---

# Product review

Review the work against the seven product-mode principles. This is a review: do not edit code or files.

## 1. Find what to review

Use the text after the command:
- A file path: review that file (a plan, spec, or PR description).
- A PR number or branch: review its diff and description.
- Other text: review it as a plan.
- No text: review the plan in the current conversation. If there is none, review `git diff HEAD` plus untracked files. If that is empty too, ask what to review.

Then read the context the review needs: the relevant code, `.product-mode/checklist/` and `.product-mode/decisions/` entries on the same topic, and any linked spec. A filled checklist or decision entry is evidence; cite its path.

## 2. Decide how much rigor applies

Classify the work with the "When to Skip This Rigor" table in the project's product-mode guidelines:

| Change type | Principles to check |
|---|---|
| Typo, comment, obvious one-liner | None: say so and stop |
| Bug fix, small internal refactor | 2, 3, 5 |
| New user-facing feature | All seven |
| Architecture, pricing, public API, data model | All seven, plus one-way-door sign-off |

State the classification and why in one line. Skip the principles that do not apply.

## 3. Check each principle that applies

| # | Principle | The gap to look for |
|---|---|---|
| 1 | Frame the problem | No named user or problem; a symptom stated as the problem; prior art in the codebase ignored |
| 2 | Assumptions visible | Assumptions not listed or not marked validated / assumed / unknown; agreement treated as evidence; an unknown with no way to resolve it |
| 3 | Minimum viable change | Scope beyond the stated problem; speculative config or abstractions; unrelated edits |
| 4 | Tradeoffs named | A non-trivial choice with no stated cost, risk, or rejected alternative |
| 5 | Done by outcome | No acceptance criteria; criteria that only say "merged" or "tests pass"; no user-facing or operational check |
| 6 | Instrumented | No primary metric; an invented baseline; analytics deferred to "later"; no guardrail metric |
| 7 | Decision logged | A one-way-door choice with no sign-off; a non-trivial decision with no entry in `.product-mode/decisions/`; no revisit trigger |

Rules:
- Every gap must point to specific evidence: a file and line, a quote from the plan, or a named absence ("no metric anywhere in the plan or PR"). If you cannot point to evidence, it is not a gap.
- Never invent data, baselines, or user evidence to fill a gap.
- Do not flag a principle as a gap only because it is not written in this artifact. Check the conversation and `.product-mode/` first.

## 4. Report

Lead with one line: **Ready**, **Ready with gaps**, or **Not ready**. "Not ready" means at least one gap makes the work wrong or risky to build or merge: wrong problem, an unapproved one-way door, or no way to tell whether it worked.

Then one row per principle checked:

| # | Principle | Status | Evidence | Smallest fix |
|---|---|---|---|---|

Status is `pass`, `gap`, or `n/a`. Order gaps first, most serious first. Keep each cell to one sentence.

End with the single most important next step. If it is a missing checklist or decision entry, suggest `/preflight` or `/decision`.
