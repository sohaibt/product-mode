## Decision: Resolve uncertainty through evidence and proportionate review
Date: 2026-10-10
Context: Product-mode needs to surface costly unknowns without turning routine work into an interview. The CLI also classified route changes, Python indentation, private fields, and agent approval rules as trivial.
Options considered: exhaustive interviews; blanket stopping on ambiguity; material questions with explicit validation steps. For the CLI: language-agnostic cosmetic heuristics; automatically qualify only small ordinary documentation edits.
Choice: inspect accessible facts first, sequence material questions by dependency, and route unknowns to research, a product decision, a prototype, or an experiment. Stop when the next authorized useful step is clear. Keep deeper challenge sessions explicitly requested. Restrict automatic trivial recommendations to small ordinary documentation edits because code semantics cannot be established from line counts or string distance.
Reversibility: two-way door
Revisit trigger: real comparison runs show repeated unnecessary questions or missed product assumptions; contributor reports identify documentation edits that should always require review or demand a language-aware classifier.

The user approved these changes after reviewing the grill-me comparison. The adaptations use original product-focused wording; no third-party skill implementation is copied. CI tests CLI reliability and artifact consistency; it does not establish improved agent behavior. Use examples/uncertainty.md to collect actual comparisons.
