import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const conversationsResource = new Command("conversations")
  .description("Manage live chat conversations");

// ── LIST ──────────────────────────────────────────────
conversationsResource
  .command("list")
  .description("List conversations")
  .option("--status <status>", "Filter by status (e.g. OPEN, CLOSED)")
  .option("--limit <n>", "Max results to return")
  .option("--cursor <cursor>", "Pagination cursor")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  tchao-cli conversations list\n  tchao-cli conversations list --status OPEN --limit 10 --json")
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, unknown> = {};
      if (opts.status) params.status = opts.status;
      if (opts.limit) params.limit = Number(opts.limit);
      if (opts.cursor) params.cursor = opts.cursor;

      const data = await client.post("", { tool: "list_conversations", params });
      const fields = typeof opts.fields === "string" ? opts.fields.split(",") : undefined;
      output(data, { json: !!opts.json, format: opts.format as string, fields });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// ── LIST-OPEN ─────────────────────────────────────────
conversationsResource
  .command("list-open")
  .description("List open conversations")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  tchao-cli conversations list-open\n  tchao-cli conversations list-open --json")
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.post("", { tool: "list_open_conversations", params: {} });
      const fields = typeof opts.fields === "string" ? opts.fields.split(",") : undefined;
      output(data, { json: !!opts.json, format: opts.format as string, fields });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
conversationsResource
  .command("get")
  .description("Get a conversation with its messages")
  .argument("<conversation-id>", "Conversation ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  tchao-cli conversations get abc123\n  tchao-cli conversations get abc123 --json")
  .action(async (conversationId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.post("", { tool: "get_conversation", params: { conversationId } });
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// ── CLOSE ─────────────────────────────────────────────
conversationsResource
  .command("close")
  .description("Close a conversation")
  .argument("<conversation-id>", "Conversation ID")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExamples:\n  tchao-cli conversations close abc123\n  tchao-cli conversations close abc123 --json")
  .action(async (conversationId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.post("", { tool: "close_conversation", params: { conversationId } });
      output(data, { json: !!opts.json });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
