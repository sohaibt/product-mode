---
name: product-review
description: Review a plan, spec, code change, or product/repository against the seven product-mode principles and report the gaps. Use when the user types /product-review.
disable-model-invocation: true
---

# Product review

Review the work against the seven product-mode principles. This is a review: do not edit code or files.

## 1. Find what to review

Use the text after the command:
- A file path: review that file (a plan, spec, or PR description).
- A directory, repository, or product name: review it as a product. Inspect its README, primary user workflow, relevant implementation, tests or evaluations, examples, and `.product-mode/` records as applicable.
- A PR number or branch: review its diff and description.
- Other text: review it as a plan.
- No text: review the plan in the current conversation. If there is none, review `git diff HEAD` plus untracked files. If that is empty too, ask what to review.

Then read the context the review needs: the relevant code, `.product-mode/checklist/` and `.product-mode/decisions/` entries on the same topic, and any linked spec. A filled checklist or decision entry is evidence; cite its path.

Identify the review target, product stage, and next commitment. Stages include plan, implementation, controlled pilot, and production; commitments include build, merge, pilot, release, and broader adoption. Infer them from accessible evidence when possible and label the inference. Ask only when the answer would change the verdict.

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
| 2 | Assumptions visible | Assumptions not listed or not marked validated / assumed / unknown; agreement treated as evidence; an unknown with no way to resolve it; material external or numerical claims without verifiable sources; illustrative values presented as facts; missing source dates or review dates where freshness matters |
| 3 | Minimum viable change | Scope beyond the stated problem; speculative config or abstractions; unrelated edits |
| 4 | Tradeoffs named | A non-trivial choice with no stated cost, risk, or rejected alternative |
| 5 | Done by outcome | No acceptance criteria or validation method for a plan; criteria that only say "merged" or "tests pass"; no user-facing or operational check; no evidence that an implementation's real user flow and relevant edge cases were exercised; no representative scenarios, actual outputs, or grading rubric for an existing prompt, toolkit, or knowledge product |
| 6 | Instrumented | No primary metric for the intended user outcome; an invented baseline or no plan to establish an unavailable baseline; no expected direction, time horizon, or measurement method; analytics deferred to "later"; no quality guardrail; no repeat-use or downstream-adoption measure where relevant |
| 7 | Decision logged | A one-way-door choice with no sign-off; a non-trivial decision with no entry in `.product-mode/decisions/`; no revisit trigger |

Rules:
- Every gap must point to specific evidence: a file and line, a quote from the plan, or a named absence ("no metric anywhere in the plan or PR"). If you cannot point to evidence, it is not a gap.
- For a named absence, state where you searched. Do not claim that a product has no evaluations, metrics, examples, or decision records until you have inspected the relevant locations.
- Never invent data, baselines, targets, or user evidence to fill a gap. Apply the same source-traceability standard to your own claims and recommendations; do not introduce uncited costs, market shares, capabilities, or absolute strategic claims such as "no moat."
- Do not assert that a product "works" or is validated merely because it is built or deployed. State which user flows and operational checks were actually observed, and leave the rest unknown.
- Do not flag a principle as a gap only because it is not written in this artifact. Check the conversation and `.product-mode/` first.
- Match evidence requirements to the target and stage. A plan needs acceptance criteria and a validation method, not completed outputs or user results. An existing product cannot claim validation only because it describes expected outputs.
- A capability that is unnecessary for the next commitment is `n/a`, not a gap. If the smallest fix says the capability is not needed, change the status rather than reporting a gap.
- Do not turn missing customer validation into a Principle 1 gap when the user and problem are clearly framed. Record unvalidated demand under the applicable assumption, outcome, or measurement principle.
- Apply source-traceability checks where external claims or numerical guidance matter, not to every product decision or ordinary code change.
- Distinguish **observed** (directly verified), **claimed** (stated but not demonstrated), **inferred** (your product judgment), and **unknown** (evidence unavailable) when the distinction affects readiness. Do not add a label to every sentence.

## 4. Check cross-artifact coherence and material defects

When the review includes multiple artifacts, compare them rather than assessing each in isolation. Look for:
- Contradictory terminology, thresholds, approval rules, or recommendations.
- Outputs from one step that cannot be consumed by the next, or missing shared definitions and artifact handoffs.
- Overlapping frameworks that redefine a canonical policy instead of refining it.
- Concrete correctness or safety defects, including inverted positive/negative logic.

Different roles, dates, or versions are not contradictions unless they cannot both be true. For example, former and current roles at different companies are compatible; report an unclear timeline as unknown rather than asking which role is real.

Report material defects separately from the principle table when they are not product-principle gaps. This is a targeted check for defects encountered while reviewing the product workflow, not an exhaustive code review or an eighth principle. Do not invent extra principle numbers or rows such as "2b."

## 5. Report

Lead with one line: **Ready**, **Ready with gaps**, or **Not ready**, qualified by the next commitment. "Not ready" means at least one gap makes that commitment wrong or risky: wrong problem, an unapproved one-way door, contradictory requirements that could cause harm, or no way to tell whether it worked. Readiness for one commitment does not imply readiness for another; a product can be suitable for a controlled pilot without being validated for production.

For example:

> **Ready with gaps — suitable for a controlled pilot; not yet validated for production rollout.**

Then one row per principle checked:

| # | Principle | Status | Evidence | Smallest fix |
|---|---|---|---|---|

Status is `pass`, `gap`, or `n/a`. Order gaps first, most serious first. Keep each cell to one sentence.

Group material fixes by priority, omitting empty groups:
- **P0:** Correctness, safety, contradictory requirements, or unapproved one-way doors.
- **P1:** Validation, workflow coherence, and measurement needed before broader adoption.
- **P2:** Onboarding, distribution, and polish.

Include only priorities supported by findings; do not add generic improvements. Keep routine reviews short and do not repeat the principle table in the priority list.

When recommending a validation test:
- Preserve agreed sample sizes and pass/fail thresholds unless you explicitly propose a change with a reason. Keep the table and recommendation consistent, and state the action for every outcome, including an indeterminate middle range.
- Give an exact duration or end date. A long deadline is not a substitute for an early access or recruitment gate when reaching users is the key unknown.
- Treat parking as reversible and give a revisit trigger. Do not recommend stopping "for good" without explicit one-way-door sign-off.

Before answering, check the verdict, table, material defects, priorities, and recommendation against one another. Remove unsupported claims, unnecessary gaps, changed thresholds, and contradictions between the evidence and the proposed next step.

End with the single most important next step. If it is a missing checklist or decision entry, suggest `/preflight` or `/decision`.
