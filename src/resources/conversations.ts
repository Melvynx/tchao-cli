import { Command } from "commander";
import { client } from "../lib/client.js";
import { output, unwrap } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const conversationsResource = new Command("conversations")
  .description("Manage live chat conversations");

conversationsResource
  .command("list")
  .description("List conversations")
  .option("--status <status>", "Filter by status (OPEN, IN_PROGRESS, CLOSED)")
  .option("--limit <n>", "Max results to return")
  .option("--cursor <cursor>", "Pagination cursor")
  .option("--fields <cols>", "Comma-separated columns to display")
  .addHelpText("after", "\nExamples:\n  tchao-cli conversations list\n  tchao-cli conversations list --status OPEN --limit 10 --json")
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, unknown> = {};
      if (opts.status) params.status = opts.status;
      if (opts.limit) params.limit = Number(opts.limit);
      if (opts.cursor) params.cursor = opts.cursor;

      const raw = await client.post("/list_conversations", params);
      const data = unwrap(raw);
      const fields = typeof opts.fields === "string" ? opts.fields.split(",") : undefined;
      output(data, { fields });
    } catch (err) {
      handleError(err);
    }
  });

conversationsResource
  .command("list-open")
  .description("List open conversations")
  .option("--fields <cols>", "Comma-separated columns to display")
  .addHelpText("after", "\nExamples:\n  tchao-cli conversations list-open\n  tchao-cli conversations list-open --json")
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const raw = await client.post("/list_conversations", { status: "OPEN" });
      const data = unwrap(raw);
      const fields = typeof opts.fields === "string" ? opts.fields.split(",") : undefined;
      output(data, { fields });
    } catch (err) {
      handleError(err);
    }
  });

conversationsResource
  .command("get")
  .description("Get a conversation with its messages")
  .argument("<conversation-id>", "Conversation ID")
  .addHelpText("after", "\nExamples:\n  tchao-cli conversations get abc123\n  tchao-cli conversations get abc123 --json")
  .action(async (conversationId: string) => {
    try {
      const raw = await client.post("/get_conversation", { conversationId });
      output(unwrap(raw));
    } catch (err) {
      handleError(err);
    }
  });

conversationsResource
  .command("close")
  .description("Close a conversation")
  .argument("<conversation-id>", "Conversation ID")
  .addHelpText("after", "\nExamples:\n  tchao-cli conversations close abc123\n  tchao-cli conversations close abc123 --json")
  .action(async (conversationId: string) => {
    try {
      const raw = await client.post("/close_conversation", { conversationId });
      output(unwrap(raw));
    } catch (err) {
      handleError(err);
    }
  });
