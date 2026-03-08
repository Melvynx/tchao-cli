# tchao-cli

CLI for the tchao API. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npx api2cli install <user>/tchao-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add <user>/tchao-cli
```

## Usage

```bash
tchao-cli auth set "your-token"
tchao-cli auth test
tchao-cli --help
```

## Resources

Run `tchao-cli --help` to see available resources.

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
