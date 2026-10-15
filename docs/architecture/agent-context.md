# Agent context

Purpose: agents load only the context a task needs. Always-loaded files stay small. Know-how loads on demand.

## Rules

- Agreed rules (what must be true) live in `docs/architecture/` and the package `AGENTS.md` files. They are the single source that specs, `implement-spec` and reviews check against. Never move a rule into a skill.
- Know-how (how to do it with a library or tool) lives in a skill: `.agents/skills/<name>/`, symlinked as `.claude/skills/<name>`. Skills link to the rules and never contradict them. A skill that suggests a rule change raises it as a proposal for the user.
- `SKILL.md` stays lean: when to use it, core recipes, pitfalls. Longer material goes into `references/*.md`, linked from `SKILL.md`.
- The frontmatter `description` is always in context, so it gets one or two sentences that name the files or tasks it triggers on. A vague description means the skill never loads.
- Every code recipe is verified against this repo (temporary spec, run, delete) before it goes in. Unverified recipes stay out.
- Recipes use this repo's real imports, helpers and conventions, and the pinned versions from `package.json`. A dependency upgrade means re-checking the skill.
- Claims from web research name their source in a `Sources` section. Official docs first.
- Point to a skill with one line from the closest `AGENTS.md` or architecture index. Don't inline its content there.
- Agents use skills instead of Context7, MCP doc lookups or external `llms.txt` files. A missing recipe is a task for `docs/tasks/agent-skills.md`, not a reason to browse.

## Layout

```
.agents/skills/<name>/
  SKILL.md
  references/<topic>.md
.claude/skills/<name> -> ../../.agents/skills/<name>
```

Reference: `.agents/skills/implement-spec/`.
