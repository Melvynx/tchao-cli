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

/** Reads text from a file path, or from stdin when path is "-" */
async function readText(path: string): Promise<string> {
  const text = path === "-" ? await Bun.stdin.text() : await Bun.file(path).text();
  if (!text.trim()) throw new Error(`No text in ${path}`);
  return text;
}

websitesResource
  .command("context")
  .description("Get the AI context (knowledge block) of a website")
  .argument("<website-id>", "Website ID")
  .addHelpText("after", "\nExamples:\n  tchao-cli websites context xyz789 --json")
  .action(async (websiteId: string) => {
    try {
      const raw = await client.post("/get_context", { websiteId });
      output(unwrap(raw));
    } catch (err) {
      handleError(err);
    }
  });

websitesResource
  .command("set-context")
  .description("Replace the whole AI context of a website")
  .argument("<website-id>", "Website ID")
  .requiredOption("--file <path>", "Markdown file, or - for stdin")
  .addHelpText("after", "\nExamples:\n  tchao-cli websites set-context xyz789 --file context.md")
  .action(async (websiteId: string, opts: Record<string, string | undefined>) => {
    try {
      const aiContext = await readText(opts.file as string);
      const raw = await client.post("/update_context", { websiteId, aiContext });
      output(unwrap(raw));
    } catch (err) {
      handleError(err);
    }
  });

websitesResource
  .command("append-context")
  .description("Append a section to the AI context of a website, keeping what is there")
  .argument("<website-id>", "Website ID")
  .requiredOption("--file <path>", "Markdown file, or - for stdin")
  .option("--heading <text>", "Optional ## heading for the section")
  .addHelpText(
    "after",
    '\nExamples:\n  tchao-cli websites append-context xyz789 --file tools.md --heading "Admin tools"',
  )
  .action(async (websiteId: string, opts: Record<string, string | undefined>) => {
    try {
      const section = await readText(opts.file as string);
      const raw = await client.post("/append_context", {
        websiteId,
        section,
        ...(opts.heading ? { heading: opts.heading } : {}),
      });
      output(unwrap(raw));
    } catch (err) {
      handleError(err);
    }
  });
