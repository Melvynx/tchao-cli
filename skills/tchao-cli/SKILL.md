---
name: tchao
description: "Manage tchao via CLI - {{RESOURCES_LIST}}. Use when user mentions 'tchao' or wants to interact with the tchao API."
category: {{CATEGORY}}
---

# tchao-cli

## Setup

If `tchao-cli` is not found, install and build it:
```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle tchao
npx api2cli link tchao
```

`api2cli link` adds `~/.local/bin` to PATH automatically. The CLI is available in the next command.

Always use `--json` flag when calling commands programmatically.

## Authentication

```bash
tchao-cli auth set "your-token"
tchao-cli auth test
```

## Resources

{{RESOURCES_HELP}}

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
