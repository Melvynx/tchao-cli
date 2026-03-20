import { Command } from "commander";
import { client } from "../lib/client.js";
import { output, unwrap } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const websitesResource = new Command("websites")
  .description("Manage configured websites");

websitesResource
  .command("list")
  .description("List all configured websites")
  .option("--fields <cols>", "Comma-separated columns to display")
  .addHelpText("after", "\nExamples:\n  tchao-cli websites list\n  tchao-cli websites list --json")
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const raw = await client.post("/list_websites", {});
      const data = unwrap(raw);
      const fields = typeof opts.fields === "string" ? opts.fields.split(",") : undefined;
      output(data, { fields });
    } catch (err) {
      handleError(err);
    }
  });

websitesResource
  .command("get")
  .description("Get website details")
  .argument("<website-id>", "Website ID")
  .addHelpText("after", "\nExamples:\n  tchao-cli websites get xyz789\n  tchao-cli websites get xyz789 --json")
  .action(async (websiteId: string) => {
    try {
      const raw = await client.post("/get_website", { websiteId });
      output(unwrap(raw));
    } catch (err) {
      handleError(err);
    }
  });
