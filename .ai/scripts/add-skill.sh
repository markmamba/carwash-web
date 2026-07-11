#!/bin/bash
#
# .ai/scripts/add-skill.sh — Add an external skill to .ai/skills/ and generate LLM-specific pointers.
#
# Usage:
#   .ai/scripts/add-skill.sh <skill-name>
#
# Workflow:
#   1. Install the skill to a temp location using npx:
#        npx skills add <repo-url> --skill <skill-name> --path /tmp/skills-staging
#      Or clone the repo and copy the skill folder manually.
#
#   2. Place the skill directory at:
#        .ai/skills/<skill-name>/SKILL.md
#
#   3. Run this script to generate pointer files for all LLM tools:
#        .ai/scripts/add-skill.sh <skill-name>
#
# What this script creates:
#   - .claude/skills/<skill-name>/SKILL.md        (Claude Code pointer)
#   - .cursor/rules/<skill-name>.mdc              (Cursor rule pointer)
#
# Tools without native skill systems (Copilot, Gemini/IDX, Codex) use .ai/skills/ directly.
# See .ai/README.md for details.

set -euo pipefail

SKILL_NAME="${1:-}"

if [ -z "$SKILL_NAME" ]; then
  echo "Usage: .ai/scripts/add-skill.sh <skill-name>"
  echo ""
  echo "The skill must already exist at .ai/skills/<skill-name>/SKILL.md"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SKILL_SOURCE="$REPO_ROOT/.ai/skills/$SKILL_NAME/SKILL.md"

if [ ! -f "$SKILL_SOURCE" ]; then
  echo "Error: Skill not found at .ai/skills/$SKILL_NAME/SKILL.md"
  echo ""
  echo "Steps:"
  echo "  1. Download or copy the skill to .ai/skills/$SKILL_NAME/"
  echo "  2. Ensure SKILL.md exists in that directory"
  echo "  3. Run this script again"
  exit 1
fi

# Extract description from SKILL.md frontmatter
DESCRIPTION=$(sed -n '/^---$/,/^---$/p' "$SKILL_SOURCE" | grep '^description:' | sed 's/^description: *//' | head -1)
if [ -z "$DESCRIPTION" ]; then
  DESCRIPTION="$SKILL_NAME skill"
fi

echo "Generating pointers for skill: $SKILL_NAME"
echo "  Description: $DESCRIPTION"
echo ""

# --- Claude Code ---
CLAUDE_DIR="$REPO_ROOT/.claude/skills/$SKILL_NAME"
mkdir -p "$CLAUDE_DIR"
cat > "$CLAUDE_DIR/SKILL.md" <<EOF
---
name: $SKILL_NAME
description: $DESCRIPTION
---

Read and follow the instructions in \`.ai/skills/$SKILL_NAME/SKILL.md\`.

User input: \$ARGUMENTS
EOF
echo "  Created: .claude/skills/$SKILL_NAME/SKILL.md"

# --- Cursor ---
CURSOR_DIR="$REPO_ROOT/.cursor/rules"
mkdir -p "$CURSOR_DIR"
cat > "$CURSOR_DIR/$SKILL_NAME.mdc" <<EOF
---
description: $DESCRIPTION
globs: []
alwaysApply: false
---

# /$SKILL_NAME

Read and follow the instructions in \`.ai/skills/$SKILL_NAME/SKILL.md\`.
EOF
echo "  Created: .cursor/rules/$SKILL_NAME.mdc"

echo ""
echo "Done. Pointer files generated for: Claude Code, Cursor"
echo "Tools without native skills (Copilot, Gemini/IDX, Codex) read .ai/skills/ directly."
echo ""
echo "Next steps:"
echo "  git add .ai/skills/$SKILL_NAME/ .claude/skills/$SKILL_NAME/ .cursor/rules/$SKILL_NAME.mdc"
echo "  git commit -m 'Add $SKILL_NAME skill'"
