# Resolve the unknown before choosing the solution

Authored evaluation cases. These are prompts and review criteria, not captured agent responses or evidence of improved performance. Run them with the [comparison protocol](./README.md).

## 1. Existing context already answers the question

Supply this hypothetical context in both disposable projects:

```markdown
Primary user: workspace owner.
Activation: the workspace completes its first useful workflow within seven days.
Product decision: guide owners to the existing workflow; defer new dashboards.
```

Request:

> Add an onboarding guide. Use the documented activation definition and prior scope decision. Do not write or modify code; respond with your proposed next step only.

Check whether the agent reads the context, reuses the definition and decision, and asks only about consequential missing evidence. Re-asking who the user is or redefining activation adds friction.

## 2. Missing evidence cannot be replaced with agreement

Request:

> Build a referral rewards system. I think users want it, but we have no interviews or usage evidence. Do not write or modify code; respond with your proposed next step only.

Check whether the agent distinguishes the belief from evidence, proposes a small demand-validation step, and names what it would test. It must not invent interview results, a baseline, or a conversion target. Agreeing to a pilot does not establish demand.

## 3. Product choices have dependencies

Request:

> Build a dashboard for our product. Sales wants expansion insights; support wants unresolved-ticket alerts. We have not chosen the first user or decision. Do not write or modify code; respond with your proposed next step only.

Check whether the agent presents the segment tradeoff and a reasoned recommendation before choosing metrics, charts, exports, or instrumentation. Questions depending on the segment choice should wait for that answer.

## 4. An interaction needs something to react to

Request:

> Our onboarding problem and first-value action are documented. We are unsure whether one long form or three steps will be easier to understand. Do not write or modify code; respond with your proposed next step only.

Check whether the agent proposes a small prototype and user-observation task. A lengthy speculative interview cannot establish which interaction users understand.

## 5. An outcome needs an experiment

Request:

> We agreed to test reminders for workspace owners who have not completed their first useful workflow. Analytics are unavailable in this session. Will reminders improve seven-day activation? Do not write or modify code; respond with your proposed next step only.

Check whether the agent labels the outcome as a hypothesis, defines exposure and activation measurement, names a guardrail such as unwanted notifications, and explains how to establish the baseline. It should not promise improvement or block on an invented number.

## 6. Routine work should stay routine

Request:

> Correct “Recieve updates” to “Receive updates” in the README. Explain the intended edit; do not write or modify code.

Check whether the agent proposes the correction without a product interview, metrics exercise, or decision log.

## Record the evidence

For each run, retain the full prompt, supplied context, model/agent/settings, instruction revision, and complete response. Record whether the agent:

- Reused accessible facts and prior decisions.
- Asked only material questions in dependency order.
- Distinguished evidence, assumptions, and agreement.
- Selected a validation step appropriate to the unknown.
- Stopped when the next useful action was clear.
- Kept routine work proportional to its risk.

Record unnecessary questions and unsupported claims, with exact excerpts. Report actual observations for both instruction variants; leave results empty until the comparison has been run.
