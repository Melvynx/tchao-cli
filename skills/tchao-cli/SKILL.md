---
name: tchao
description: "Manage Tchao live chat via CLI - conversations, messages, websites, analytics. Use when user mentions 'tchao', 'live chat', 'visitor conversations', 'chat widget', or wants to interact with the Tchao API."
category: live-chat
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

### conversations

| Command | Description |
|---------|-------------|
| `tchao-cli conversations list --json` | List all conversations |
| `tchao-cli conversations list --status OPEN --limit 10 --json` | List conversations filtered by status |
| `tchao-cli conversations list --cursor <cursor> --json` | List conversations with pagination |
| `tchao-cli conversations list --fields id,visitor,status --json` | List with specific columns |
| `tchao-cli conversations list-open --json` | List only open conversations |
| `tchao-cli conversations get <conversation-id> --json` | Get conversation with all messages |
| `tchao-cli conversations close <conversation-id> --json` | Close a conversation |

### messages

| Command | Description |
|---------|-------------|
| `tchao-cli messages send <conversation-id> --message "Hello!" --json` | Send agent message |
| `tchao-cli messages send <conversation-id> --message "Thanks for contacting us" --json` | Send message in conversation |

### websites

| Command | Description |
|---------|-------------|
| `tchao-cli websites list --json` | List all configured websites |
| `tchao-cli websites list --fields id,name,url --json` | List websites with specific columns |

### analytics

| Command | Description |
|---------|-------------|
| `tchao-cli analytics get --json` | Get analytics and stats data |
| `tchao-cli analytics get --fields conversations,messages,rate --json` | Get analytics with specific columns |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
