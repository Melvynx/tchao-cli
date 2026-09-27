# tchao-cli

CLI for the Tchao API - live chat platform. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npx api2cli install Melvynx/tchao-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add Melvynx/tchao-cli
```

## Authentication

```bash
tchao-cli auth set sk-abc123xyz
tchao-cli auth test
tchao-cli auth show
tchao-cli auth show --raw
tchao-cli auth remove
```

| Command | Description |
|---------|-------------|
| `auth set <token>` | Save your API token |
| `auth show` | Display current token (masked by default) |
| `auth show --raw` | Show the full unmasked token |
| `auth remove` | Delete the saved token |
| `auth test` | Verify your token works |

## Resources

### conversations

Manage live chat conversations.

```bash
tchao-cli conversations list
tchao-cli conversations list --status OPEN --limit 10
tchao-cli conversations list-open
tchao-cli conversations get <conversation-id>
tchao-cli conversations close <conversation-id>
```

| Command | Flags |
|---------|-------|
| `list` | `--status <status>`, `--limit <n>`, `--cursor <cursor>`, `--fields <cols>` |
| `list-open` | `--fields <cols>` |
| `get <conversation-id>` | |
| `close <conversation-id>` | |

### messages

Send messages in conversations.

```bash
tchao-cli messages send <conversation-id> --message "Hello!"
```

| Command | Flags |
|---------|-------|
| `send <conversation-id>` | `--message <text>` (required) |

### websites

Manage configured websites.

```bash
tchao-cli websites list
tchao-cli websites list --json
tchao-cli websites context xyz789 --json
tchao-cli websites append-context xyz789 --file tools.md --heading "Admin tools"
```

| Command | Flags |
|---------|-------|
| `list` | `--fields <cols>` |
| `get <website-id>` | |
| `context <website-id>` | |
| `set-context <website-id>` | `--file <path>` (required, replaces everything) |
| `append-context <website-id>` | `--file <path>` (required), `--heading <text>` |

### analytics

View analytics and stats.

```bash
tchao-cli analytics get
tchao-cli analytics get --json
```

| Command | Flags |
|---------|-------|
| `get` | `--fields <cols>` |

### capabilities

Manage custom HTTP tools the website AI can call. Specs use the `create_capability` input shape (JSON file or `-` for stdin). Secrets are read from an env var so they never land in shell history.

```bash
tchao-cli capabilities list --website xyz789 --json
tchao-cli capabilities create --file spec.json
LUMAIL_KEY=... tchao-cli capabilities update abc123 --auth-type bearer --auth-secret-env LUMAIL_KEY
tchao-cli capabilities enable abc123 --website xyz789
```

| Command | Flags |
|---------|-------|
| `list` | `--website <id>`, `--fields <cols>` |
| `create` | `--file <path>` (required), `--auth-secret-env <var>`, `--website <id>` |
| `update <id>` | `--file <path>`, `--auth-type <type>`, `--auth-secret-env <var>`, `--clear-secret` |
| `enable <id>` / `disable <id>` | `--website <id>` (required) |
| `delete <id>` | |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
