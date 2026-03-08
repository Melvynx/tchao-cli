import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const analyticsResource = new Command("analytics")
  .description("View analytics and stats");

// ── GET ───────────────────────────────────────────────
analyticsResource
  .command("get")
  .description("Get analytics data")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  tchao-cli analytics get\n  tchao-cli analytics get --json")
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.post("", { tool: "get_analytics", params: {} });
      const fields = typeof opts.fields === "string" ? opts.fields.split(",") : undefined;
      output(data, { json: !!opts.json, format: opts.format as string, fields });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
