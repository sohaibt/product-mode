# Add a dashboard

Illustrative worked example. This is an authored scenario, not a captured model response or evidence of a customer outcome.

## Starting request

> Add a dashboard to our SaaS app with charts, filters, and export.

## The unresolved question

The request names an interface, but does not say who needs it or which decision it should support.

A useful question before coding:

> Which user needs this, and what decision will they make after looking at it?

## A possible brief after clarification

- **User and problem:** Operations leads need to find overdue jobs before the daily handoff. This is a hypothetical clarification, not customer research.
- **Why now:** Unknown. Ask for the trigger, evidence, or cost of waiting before implementation.
- **Smallest scope:** A list of overdue jobs, sorted by age, linking to the existing job detail page.
- **Tradeoff:** Charts, custom filters, and export wait until there is evidence that they help the handoff.
- **Success metric:** The proportion of overdue jobs assigned an owner before the handoff. Establish the baseline from existing records before setting a target.
- **Measurement:** Track overdue jobs, owner assignment times, and handoff times. Review after two weeks; check whether assignments merely moved work to another queue.
- **Reversibility:** Reversible UI change. Revisit if leads cannot identify the next action from the list.

## What to check in your own agent session

Does the agent distinguish supplied facts from assumptions? Does it offer a smaller scope and identify a meaningful outcome before choosing implementation details? Different agents and prompts may do this without additional instructions; compare actual responses rather than assuming a difference.

[Comparison protocol](./README.md) · [Get product-mode](../README.md#quick-start-add-the-instructions)
