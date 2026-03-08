#!/usr/bin/env bun
import { Command } from "commander";
import { globalFlags } from "./lib/config.js";
import { authCommand } from "./commands/auth.js";
import { conversationsResource } from "./resources/conversations.js";
import { messagesResource } from "./resources/messages.js";
import { websitesResource } from "./resources/websites.js";
import { analyticsResource } from "./resources/analytics.js";

const program = new Command();

program
  .name("tchao-cli")
  .description("CLI for the Tchao API - live chat platform")
  .version("0.1.0")
  .option("--json", "Output as JSON", false)
  .option("--format <fmt>", "Output format: text, json, csv, yaml", "text")
  .option("--verbose", "Enable debug logging", false)
  .option("--no-color", "Disable colored output")
  .option("--no-header", "Omit table/csv headers (for piping)")
  .hook("preAction", (_thisCmd, actionCmd) => {
    const root = actionCmd.optsWithGlobals();
    globalFlags.json = root.json ?? false;
    globalFlags.format = root.format ?? "text";
    globalFlags.verbose = root.verbose ?? false;
    globalFlags.noColor = root.color === false;
    globalFlags.noHeader = root.header === false;
  });

program.addCommand(authCommand);
program.addCommand(conversationsResource);
program.addCommand(messagesResource);
program.addCommand(websitesResource);
program.addCommand(analyticsResource);

program.parse();
