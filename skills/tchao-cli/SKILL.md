---
name: tchao-cli
description: "Manage Tchao live chat - conversations, messages, websites, analytics. Use when user mentions 'tchao', 'live chat', 'visitor conversations', 'chat widget', 'chat support', or wants to check/reply to visitor messages."
category: live-chat
---

# tchao-cli

> **DESTRUCTIVE ACTIONS WARNING**
> NEVER execute these actions without explicit user permission:
> - `messages send` - sends a message visible to the visitor in real-time
> - `conversations close` - permanently closes a conversation
>
> Always ask: "Do you want me to send/close this?" and wait for confirmation.

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
tchao-cli auth show
tchao-cli auth show --raw
tchao-cli auth remove
```

## Resources

### conversations

| Command | Description | Flags |
|---------|-------------|-------|
| `tchao-cli conversations list --json` | List all conversations | `--status <OPEN\|IN_PROGRESS\|CLOSED>`, `--limit <n>`, `--cursor <cursor>`, `--fields <cols>` |
| `tchao-cli conversations list --status OPEN --limit 10 --json` | List open conversations with limit | |
| `tchao-cli conversations list-open --json` | Shortcut for open conversations | `--fields <cols>` |
| `tchao-cli conversations get <id> --json` | Get conversation with all messages | |
| `tchao-cli conversations close <id> --json` | Close a conversation | |

### messages

| Command | Description | Flags |
|---------|-------------|-------|
| `tchao-cli messages send <id> --message "text" --json` | Send agent message in conversation | `--message <text>` (required) |

### websites

| Command | Description | Flags |
|---------|-------------|-------|
| `tchao-cli websites list --json` | List all configured websites | `--fields <cols>` |
| `tchao-cli websites get <id> --json` | Get website details | |

### analytics

| Command | Description | Flags |
|---------|-------------|-------|
| `tchao-cli analytics get --json` | Get conversation counts by status | `--website-id <id>`, `--fields <cols>` |

## Quick Reference

```bash
tchao-cli --help
tchao-cli <resource> --help
tchao-cli <resource> <action> --help
```

## Output Format

`--json` returns:
```json
{"ok": true, "data": {...}, "meta": {"total": 42}}
```

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`

## Conversation Status Values

`OPEN`, `IN_PROGRESS`, `CLOSED`
