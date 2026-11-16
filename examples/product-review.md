# Evaluate product-review

Authored evaluation cases for `/product-review`. These are prompts and review criteria, not captured agent responses or evidence of improved performance. Run each case in a fresh session with the review skill and retain the complete response. Use the relevant parts of the [comparison protocol](./README.md).

## 1. Contradictory toolkit

Create this disposable repository:

`README.md`:

```markdown
# Launch toolkit

Two commands turn a product idea into a launch plan.
```

`skills/spec/SKILL.md`:

```markdown
Autonomy positions: suggest, draft, act-with-approval, act-autonomously.
High-risk actions ALWAYS require human approval.
Backup check: "Are backups isolated from the agent's blast radius?" YES means isolated.
Any YES to the backup check blocks production.
```

`skills/rollout/SKILL.md`:

```markdown
Autonomy positions: observe, recommend, execute-with-approval, supervised-autonomy, full-autonomy.
High-risk actions may run automatically after five successful executions.
Consume the specification without requiring a particular autonomy label.
```

Request:

> /product-review . — Assess readiness for a controlled pilot. Do not edit files.

Check whether the review:
- Cites the incompatible autonomy models and high-risk approval policies.
- Identifies the inverted backup check as a concrete correctness or safety defect, separately from the principle table.
- Identifies the unspecified handoff between specification and rollout.
- Prioritizes these findings as P0 and does not recommend additional commands as the first fix.

## 2. Polished but unvalidated product

Create this disposable repository:

`README.md`:

```markdown
# Support Copilot

Production-proven guidance for support agents. Every deployment saves 30% of handling time.
Source: Agent Systems Handbook.

## Example
The expected output is a grounded, actionable launch plan.

## Measurement
We count command invocations.
```

`skills/review/SKILL.md`:

```markdown
Review the support workflow and recommend a launch date, expected savings, and readiness percentage.
```

The repository has no other files, tests, examples, evaluation outputs, or `.product-mode/` records.

Request:

> /product-review . — Assess readiness for production rollout. Do not edit files.

Check whether the review:
- Distinguishes the production and savings claims from observed evidence.
- Flags the untraceable source, false-precision risk, and missing source or review dates where material.
- States where it searched before reporting missing evaluations, outputs, metrics, or decision records.
- Distinguishes command invocations from a user-outcome metric and a quality guardrail.
- Does not call the product production-proven or invent a baseline, target, saving, or readiness percentage.

## 3. Good early-stage plan

Create `PLAN.md`:

```markdown
# Support draft pilot

User and problem: Support leads need faster first drafts; user-provided interviews with five leads found review time to be their main delay.
Scope: Add draft suggestions to one internal queue behind a feature flag. Do not automate sending.
Tradeoff: Draft-only assistance preserves human review but saves less time than automatic sending.
Acceptance: Support leads can generate, edit, approve, or reject a draft; analytics record each action; the complete queue flow and permission boundary are exercised.
Primary metric: Median time to the first approved response. Establish the baseline from 20 recent tickets before the pilot; expect a decrease over the following 14 days using a before/after comparison.
Guardrail: The correction rate must not rise. Review all rejected drafts during the pilot.
Reversibility: Two-way door through the feature flag.
Validation: No implementation or user results exist yet. Instrumentation ships with the feature.
```

Create `.product-mode/decisions/2026-01-15-support-draft-pilot.md`:

```markdown
## Decision: Draft-only support pilot
Date: 2026-01-15
Context: Review time delays responses, but automatic sending increases correction risk.
Options considered: Draft suggestions; automatic sending.
Choice: Draft suggestions, because they test the time-saving hypothesis while preserving review.
Reversibility: Two-way door.
Revisit trigger: The pilot shows no reduction in review time or an increase in corrections.
```

Request:

> /product-review PLAN.md — Assess readiness to implement, not production readiness. Do not edit files.

Check whether the review:
- Uses implementation as the next commitment and does not confuse it with production readiness.
- Does not flag the absence of implementation, completed outputs, user results, or an already-established baseline as a gap.
- Recognizes the validation method, instrumentation, guardrail, and logged reversible decision.
- Does not demand external citations for the supplied internal product context.

## 4. Routine bug fix

Use this review request and diff:

> /product-review — Fix CSV exports so quoted fields containing commas open correctly. The only change is RFC 4180 escaping in the existing exporter. A regression test covers commas and quotes, and the acceptance check is opening the exported file in the supported spreadsheet application. Do not edit files.

```diff
- return fields.join(',')
+ return fields.map(escapeCsvField).join(',')
```

Check whether the review:
- Classifies the work as a bug fix and checks only Principles 2, 3, and 5.
- Keeps the response proportional to the stated scope and evidence.
- Does not require product analytics, external citations, a repository-wide consistency review, or a new decision record.

## 5. Built product awaiting payment validation

Create `README.md`:

```markdown
# Restaurant brief

A live weekly pricing brief for Dubai restaurant operators who lack time to compare competitor menus. The implementation is deployed, but no operator has been interviewed or asked to pay. No user flow has been observed for this review.

Product analytics are deferred until the first pilot user. The payment test is tracked manually in a spreadsheet.
```

Create `validation-plan.md`:

```markdown
# Payment validation

Run for four weeks. Ask 10 operators to pay for a weekly brief. Book three conversations in week one or stop the test and park the project.

- 3 or more of 10 pay: approve the next scoped build.
- 1 or 2 pay: conduct five follow-up interviews, then repeat the test once.
- 0 pay: park the project and revisit only if a distribution partner offers warm introductions.
```

Create `roles.md`:

```markdown
# Founder roles

Former CPO at Foodics (2021–2023). Current CPO at Tamatem Games since July 2026.
```

Request:

> /product-review . — Assess whether to build more features or run the payment-validation test. Do not edit files.

Check whether the review:
- Qualifies readiness separately for more features and the payment-validation test.
- Does not claim that the product works when no user flow was observed.
- Keeps the 10-person sample, all three outcome branches, exact timebox, and week-one access gate, or explicitly justifies any proposed change without contradicting the table.
- Recognizes that the former and current roles are compatible rather than contradictory.
- Marks deferred product analytics as `n/a` for this commitment, or passes manually tracked payment measurement, rather than reporting an unnecessary analytics gap.
- States where it searched for absent interviews, payments, and decision records.
- Introduces no unsourced market or moat claims and gives any parking recommendation a revisit trigger.

## Record the evidence

For each run, retain the prompt, supplied artifacts, model/agent/settings, skill revision, and complete response. Record exact excerpts showing:

- The target, stage, and next commitment used for the verdict.
- Evidence citations and the locations searched for named absences.
- Observed, claimed, inferred, and unknown evidence where material.
- Cross-artifact contradictions and concrete defects.
- Stage-appropriate outcome validation and product measurement.
- Evidence-supported priorities and the single next step.
- Consistency between the verdict, principle table, success thresholds, and recommended test.
- Over-flagging, invented evidence, false contradictions, generic recommendations, and unnecessary review friction.

Leave results unclaimed until fresh runs produce them. A reasoning walkthrough or a static check of the skill is not a substitute for recording actual agent responses.
