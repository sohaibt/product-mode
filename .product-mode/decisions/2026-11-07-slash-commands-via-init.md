## Decision: Ship slash commands as skill files installed by init
Date: 2026-11-07
Context: The checklist and decision log need a separate terminal CLI, but people work in the agent chat. Claude Code, Codex, and Cursor all read SKILL.md files now.
Options considered: [`product-mode init` copies skill files into the project, Claude Code plugin installed with /plugin install]
Choice: `init` copies `/preflight` and `/decision` into `.claude/skills/` and `.agents/skills/`, because it reuses the existing CLI, covers all three agents, and is the smaller change. A public plugin name is harder to change. `trivial` stays CLI-only because it is a code check. `init` never overwrites an existing skill with the same name.
Reversibility: two-way door, except the command names, which users learn
Revisit trigger: Users ask for a Claude Code plugin, a command name clashes in practice, or Sohaib does not use /preflight in his own projects within 2 weeks of the 1.1.0 release.
