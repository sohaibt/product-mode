# Add product-mode to an existing instruction file

You already have build commands, architecture notes, and coding conventions in your agent's instruction file. Keep them. Add product guidance where it resolves a missing decision, then check whether it helps on a real request.

This walkthrough uses an **illustrative project and authored snippets**. It is not a captured agent session or evidence of a performance improvement. No CLI installation is needed.

## 1. Save the starting point

Commit or back up your current instruction file. Open [product-mode's guidelines](../CLAUDE.md) beside it. Work in the file your agent is configured to read, such as `CLAUDE.md` or `AGENTS.md`; confirm the supported location in your agent's documentation.

For example, a project might already contain:

```markdown
# Team workspace app

## Development
- Use the existing UI components.
- Run the project's documented checks before proposing a merge.
- Do not change the public API without approval.

## Working style
- Move quickly. Avoid unnecessary questions.
```

Those conventions still matter. The missing information is who the app serves, what problem is worth solving, and how a change will be evaluated.

**Check:** the saved version contains all existing instructions, so you can review or undo your edits.

## 2. Resolve conflicting instructions

“Never ask questions” would conflict with product-mode's instruction to surface ambiguity. “Build everything requested” could conflict with choosing the minimum useful scope. Resolve those differences explicitly instead of appending a second set of rules and hoping the agent chooses well.

For the example above, replace the working-style sentence with:

```markdown
## Working style
- Move quickly on routine, reversible edits.
- For a non-trivial request, identify missing information that would change
  the user, scope, success measure, or an irreversible decision.
- Ask for that information before implementing the affected part.
- Keep validated facts, assumptions, and unknowns distinct.
```

Now merge the product-mode sections you want to use. Start with the pre-flight checklist and the principles relevant to your work. Read the “When to Skip This Rigor” section too. This selective merge is a customization; it is not the unmodified full file.

**Check:** each conflicting instruction has one clear resolution. Build commands, coding conventions, and approval boundaries remain intact.

## 3. Add the context the file cannot infer

Product-mode supplies questions. Your team supplies evidence. Put the answers you already know next to the guidelines, and mark gaps rather than inventing answers.

Here is hypothetical context for an operations app:

```markdown
## Product context
- Primary user: operations lead preparing the daily handoff.
- Problem hypothesis: overdue jobs are missed because ownership is unclear.
- Evidence: unknown; review handoff records and speak with the team.
- Candidate outcome: proportion of overdue jobs assigned before handoff.
- Baseline and target: unknown; establish them before implementation.
- First scope to consider: an overdue-jobs list using existing job data.
- Not in the first scope: custom charting, export, or a new reporting API.
```

Do not copy those business facts into an unrelated project. Replace them with your own context. A plausible metric is still a proposal until the team agrees that it represents value.

**Check:** another person can tell which claims are established and what still needs validation.

## 4. Try one request without changing code

Start a fresh session with the edited instructions and use a request from your actual backlog. For the illustrative project:

> Add a dashboard with charts, filters, and export. Do not write or modify code; respond with your proposed next step only.

Inspect the response:

| Look for | Evidence you should be able to point to |
|---|---|
| Problem framing | The user and the decision they need to make. |
| Visible uncertainty | A distinction between supplied facts and untested assumptions. |
| Limited scope | A first step tied to the problem, with deferred work explained. |
| Meaningful outcome | A proposed measure of user value, with missing baseline acknowledged. |
| Tradeoffs | What the smaller scope costs or leaves unanswered. |
| Reversibility | Any approval or commitment needed before proceeding. |

If the agent invents research or a conversion target, correct the unsupported claim. If it asks about a decision already documented, point it to that context. If a routine edit turns into a long questionnaire, tighten the guidance on when to skip rigor.

**Check:** save the response and identify one useful change in the proposed work, or one source of unnecessary friction. A longer response alone is not evidence of improvement.

## 5. Compare before adopting more broadly

Use the [comparison protocol](../examples/README.md) to test the same request in fresh sessions with your original and edited instructions. Keep the model, project context, settings, and permissions the same. Save full responses, including cases where the original instructions work as well or better.

If the comparison is useful, keep the edited file in version control and record why you adopted it. Revisit it when it repeatedly adds ceremony, misses a costly assumption, or conflicts with how the team works.

If it does not help, remove or revise the added sections. Keep the evidence from the trial so the next revision addresses a specific failure rather than adding more instructions by default.

[Get the guidelines](../CLAUDE.md) · [Worked examples](../examples/README.md) · [Share feedback](https://github.com/sohaibt/product-mode/issues)
