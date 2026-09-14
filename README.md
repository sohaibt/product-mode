# product-mode

![product-mode](./banner.png)

**Give your coding agent product judgment before it starts building.**

Free, MIT-licensed instructions for framing the problem, cutting scope, naming tradeoffs, and defining success. Use the `CLAUDE.md` file or the equivalent `AGENTS.md` file with an agent that reads it. The CLI is optional.

The PM-team counterpart to [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills). Credit to [@karpathy](https://x.com/karpathy) for naming the failure modes that inspired this work.

---

## Quick start: add the instructions

No npm install is needed for the instruction files.

**If you already have a `CLAUDE.md` or `AGENTS.md`:** open [CLAUDE.md](./CLAUDE.md) or [AGENTS.md](./AGENTS.md), copy the guidelines you need into your existing file, and resolve any conflicting instructions. Keep your project context and coding conventions. Commit or back up your current file before editing.

**For a project without `CLAUDE.md`:** run this from the project root. It refuses to overwrite an existing file.

```bash
if [ -e CLAUDE.md ]; then
  echo "CLAUDE.md already exists. Merge the guidelines into it instead."
else
  curl -fL https://raw.githubusercontent.com/sohaibt/product-mode/main/CLAUDE.md -o CLAUDE.md
fi
```

For an agent that reads `AGENTS.md`, use the same command with both occurrences of `CLAUDE.md` changed to `AGENTS.md`. Check your agent's instructions for supported file names and locations.

Start a fresh agent session and try:

> Add a dashboard to our SaaS app. Before coding, help me frame the problem, surface unknowns, choose the smallest useful scope, and define how we'll know it worked.

Look for an explicit user and problem, visible assumptions, a limited first step, a success measure, and a reversibility check. Supply missing evidence; the file cannot know your users or business on its own.

## See the thinking in practice

These are **illustrative worked examples**, not model transcripts or measured performance claims.

| Request | What the example works through |
|---|---|
| [“Add a dashboard”](./examples/dashboard.md) | Clarify whose decision the dashboard supports before choosing charts. |
| [“Build a complete referral system”](./examples/referrals.md) | Separate testing referral demand from building rewards infrastructure. |
| [“Add an onboarding checklist”](./examples/onboarding.md) | Define activation and measurement before treating checklist completion as success. |

[Run your own comparison](./examples/README.md) using the same request in fresh sessions with and without the guidelines.

---

## The Two Problems

Karpathy named the problem for engineers working with LLMs:

> "The models make wrong assumptions on your behalf and just run along with them... They don't manage their confusion, don't seek clarifications, don't surface inconsistencies, don't present tradeoffs, don't push back when they should."

His CLAUDE.md fixes this for solo engineers. It's excellent.

But there's a failure mode it doesn't touch, the one that kills product teams:

> **Shipping the wrong thing, well.**

A beautifully implemented feature for a problem that doesn't matter is still waste. And in mixed PM + engineering teams working with Claude Code, that's the more expensive mistake.

**product-mode** adds the missing layer: problem framing, scope discipline, tradeoff articulation, outcome measurement, and decision logging- applied *before* the code gets written.

---

## The Seven Principles

| # | Principle | What it prevents |
|---|---|---|
| 1 | **Frame the Problem Before the Solution** | Building for the wrong user |
| 2 | **Make Assumptions & Unknowns Visible** | Silent guessing |
| 3 | **Ship the Minimum Viable Change** | Scope creep, gold-plating |
| 4 | **Name the Tradeoffs** | Invisible costs, political decisions |
| 5 | **Define Done by Outcome, Not Output** | "Merged" mistaken for "done" |
| 6 | **Instrument Before You Ship** | Shipping blind |
| 7 | **Log the Decision, Flag Reversibility** | Repeating mistakes, calcifying defaults |

Plus a **pre-flight checklist** (5 questions before any non-trivial change) and a **when-to-skip-this-rigor** table: because not every typo needs a decision log.

Full file: [`CLAUDE.md`](./CLAUDE.md). Same file, other name: [`AGENTS.md`](./AGENTS.md).

---

## Optional CLI: save checklists and decisions

The instruction files work on their own. The CLI provides interactive commands that save checklists and decision logs in your project.

### Installation

```bash
# Clone and build the CLI from source
git clone https://github.com/sohaibt/product-mode
cd product-mode
npm install
npm link
```

### Usage

#### Initialize (once per project)
```bash
product-mode init
```

Creates `.product-mode/checklist/` and `.product-mode/decisions/`, and appends a "Prior Decisions & Checklists" section to your `CLAUDE.md` / `AGENTS.md` (if present) so agents read existing decisions before starting non-trivial work. Safe to re-run.

#### Pre-flight Checklist
Run before starting any non-trivial work:

```bash
product-mode checklist
# Or with work description
product-mode checklist "Add user profile feature"
```

This will prompt you through the 5-question pre-flight checklist and save your answers to `.product-mode/checklist/`.

#### Decision Logging
Log important decisions following Principle #7:

```bash
product-mode decision
# Or with title
product-mode decision "Choose database technology"
```

Creates a structured decision log in `.product-mode/decisions/`.

#### Trivial Change Detection
Check if your changes are trivial (can skip full rigor):

```bash
product-mode trivial
# Or check specific files
product-mode trivial src/app.js src/utils.js
```

Uses heuristics to detect typos, comment changes, and other trivial modifications.

### Example Workflow

```bash
# 1. Think about starting work
product-mode checklist "Implement dark mode toggle"
# → Answers questions and saves checklist

# 2. Do the work
# ... write code ...

# 3. Check if changes are trivial before committing
product-mode trivial
# → If non-trivial, consider running checklist again
# → If trivial, you can proceed with lighter rigor

# 4. Log important decisions
product-mode decision "Dark mode implementation approach"
# → Logs your choice of CSS variables vs separate stylesheet, etc.
```

---

## Who This Is For

- **PMs who vibe-code** with Claude Code, Cursor, or Lovable and want their AI to think like a product partner
- **Engineering teams** working alongside product, tired of re-shipping because the problem was wrong
- **Solo founders** building SaaS who want guardrails against their own scope creep

If you're shipping with AI and your bottleneck is *what to build*, not *how to build it*  this is for you.

---

## Why This Exists

I've spent 20+ years in product leadership (Booking.com, Foodics, Eneco, Tamatem Games). I am now building products, one specifically to help solve the problem of not building the right thing (not announced yet) and write about Product Management and AI-assisted product building at [Mastering Product HQ](https://masteringproducthq.substack.com).

Every week I see the same pattern: teams using Claude Code to ship faster- and shipping the wrong thing faster. Karpathy nailed the engineering half. This file tries to nail the product half.

---

## Customization

These principles are meant to be merged with your project's own CLAUDE.md. Add project-specific context below the seven principles:

```markdown
## Project-Specific Context

- Our primary user is [X]
- Success metric for this quarter is [Y]
- We intentionally avoid [Z]
```

---

## Tradeoff Note

These guidelines bias toward **rigor over speed**. For trivial changes (typos, obvious fixes), use judgment- the file includes a *when to skip this rigor* table at the end.

---

## More From the Same Author

product-mode is the *thinking* layer. These are the *doing* layers:

| Tool | What it does |
|---|---|
| [strategy-mcp](https://github.com/sohaibt/strategy-mcp) | MCP server that gives Claude 12 product strategy frameworks as tools (RICE, JTBD, assumption mapping, TAM/SAM/SOM, Wardley) |
| [founder-mode](https://github.com/sohaibt/founder-mode) | Claude Code plugin that turns it into an AI co-founder: strategy review, competitor scan, stress-test, stakeholder updates |
| [agent-pm](https://github.com/sohaibt/agent-pm) | Claude Code plugin with 12 commands for building AI agent products, from "should this even be an agent?" to production readiness |

---

## License

MIT. Fork, adapt, make it your team's own. If it helps, a star is appreciated.

---

*Inspired by [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) and [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.*