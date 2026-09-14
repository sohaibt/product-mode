# Try product-mode on the same request

The three examples in this folder are authored teaching scenarios. They are not benchmarks, testimonials, or model transcripts.

## Reproduce a comparison

1. Pick the starting request from [dashboard](./dashboard.md), [referrals](./referrals.md), or [onboarding](./onboarding.md).
2. Use two disposable copies of the same project. Keep the agent version, model, project context, settings, and tool permissions identical. Record those details and the product-mode commit used.
3. In the first copy, use your existing instructions. In the second, add product-mode to those instructions and resolve conflicts. Use fresh sessions for both, without prior conversation history.
4. Send the exact same request. Save the full first response from both sessions before answering clarification questions. Allow no code changes for this comparison.
5. Compare whether each response identifies the user/problem, labels assumptions, limits scope, names a tradeoff, defines an outcome measure, and considers reversibility. Quote evidence for each observation; record omissions too.
6. Repeat across requests and runs. Publish the full prompts, settings, and outputs alongside any excerpts, including runs where the baseline performs equally well or better. A few examples cannot establish a general productivity gain.

For a no-code first-response test, append the same sentence to each request: “Do not write or modify code; respond with your proposed next step only.”

## Share what happened

If you try this, a useful issue includes the request, agent/model/version, relevant instructions, the response, and what helped or added unnecessary friction. Remove private project details before sharing. [Open an issue](https://github.com/sohaibt/product-mode/issues).
