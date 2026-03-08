import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const websitesResource = new Command("websites")
  .description("Manage configured websites");

// ── LIST ──────────────────────────────────────────────
websitesResource
  .command("list")
  .description("List all configured websites")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  tchao-cli websites list\n  tchao-cli websites list --json")
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.post("", { tool: "list_websites", params: {} });
      const fields = typeof opts.fields === "string" ? opts.fields.split(",") : undefined;
      output(data, { json: !!opts.json, format: opts.format as string, fields });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
