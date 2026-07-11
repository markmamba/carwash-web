# AI Instructions — Derivation Strategy

## Architecture

```
.ai/
  instructions.md          <-- SINGLE SOURCE OF TRUTH for conventions (edit this)
  README.md                <-- This file
  skills/                  <-- Reusable task prompts (portable across tools)
    admin-domain-page/
      SKILL.md             <-- Scaffold admin portal CRUD pages
      templates/
    creating-api-clients/
      SKILL.md             <-- Generate ky-based API client modules
      templates/
    creating-domain-forms/
      SKILL.md             <-- Domain forms, schemas, select-search fields
      templates/
    creating-domain-views/
      SKILL.md             <-- Domain list/detail views
      templates/
    creating-route-pages/
      SKILL.md             <-- Route pages, loaders, meta, submit/error flows
      templates/
  scripts/
    add-skill.sh           <-- Helper to generate LLM-specific pointers for a skill

.claude/skills/            <-- Claude Code skill pointers
  admin-domain-page/
  creating-api-clients/
  creating-domain-forms/
  creating-domain-views/
  creating-route-pages/

.cursor/rules/             <-- Cursor rule pointers
  carwash-conventions.mdc  <-- Core conventions (always-on)
  routes-api-forms.mdc     <-- Route/API/form conventions
  skills-navigation.mdc    <-- Skill navigation
  admin-domain-page.mdc
  creating-api-clients.mdc
  creating-domain-forms.mdc
  creating-domain-views.mdc
  creating-route-pages.mdc

CLAUDE.md                  <-- Claude Code (reads .ai/instructions.md)
AGENTS.md                  <-- OpenAI Codex (reads .ai/instructions.md)
```

## How It Works

All conventions live in **`.ai/instructions.md`**. All reusable task prompts live in **`.ai/skills/<skill-name>/SKILL.md`**.

Tool-specific files (`.claude/skills/`, `.cursor/rules/`) are thin pointers that say:
> "Read and follow the instructions in `.ai/skills/<skill-name>/SKILL.md`"

### Available Skills

| Skill | Directory | Purpose |
| ----- | --------- | ------- |
| `/admin-domain-page` | `.ai/skills/admin-domain-page/` | Full CRUD page scaffold for a finance resource |
| `/creating-api-clients` | `.ai/skills/creating-api-clients/` | New `admin-*-api.js` module |
| `/creating-route-pages` | `.ai/skills/creating-route-pages/` | Dashboard, report, login, or standalone pages |
| `/creating-domain-forms` | `.ai/skills/creating-domain-forms/` | Form + schema |
| `/creating-domain-views` | `.ai/skills/creating-domain-views/` | List/detail views |

### Adding a New Skill

1. Create `.ai/skills/{skill-name}/SKILL.md` with frontmatter (`name`, `description`) and instructions
2. Run `.ai/scripts/add-skill.sh {skill-name}` to generate pointer files
3. Commit all files

## Related docs

Project documentation lives in `carwash-docs/`:

| Document | Purpose |
| -------- | ------- |
| `carwash-docs/web/conventions.md` | Frontend coding patterns |
| `carwash-docs/web/routes-and-pages.md` | Route map and file sets |
| `carwash-docs/business-rules.md` | Domain logic and UX rules |
