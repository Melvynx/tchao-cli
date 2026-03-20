import { Command } from "commander";
import { client } from "../lib/client.js";
import { output, unwrap } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const analyticsResource = new Command("analytics")
  .description("View analytics and stats");

analyticsResource
  .command("get")
  .description("Get conversation stats by status")
  .option("--website-id <id>", "Filter by website ID")
  .option("--fields <cols>", "Comma-separated columns to display")
  .addHelpText("after", "\nExamples:\n  tchao-cli analytics get\n  tchao-cli analytics get --website-id xyz789 --json")
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, unknown> = {};
      if (opts.websiteId) params.websiteId = opts.websiteId;

      const raw = await client.post("/get_conversation_stats", params);
      const data = unwrap(raw);
      const fields = typeof opts.fields === "string" ? opts.fields.split(",") : undefined;
      output(data, { fields });
    } catch (err) {
      handleError(err);
    }
  });
