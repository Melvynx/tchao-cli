import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const messagesResource = new Command("messages")
  .description("Send messages in conversations");

// ── SEND ──────────────────────────────────────────────
messagesResource
  .command("send")
  .description("Send a message as agent in a conversation")
  .argument("<conversation-id>", "Conversation ID")
  .requiredOption("--message <text>", "Message content to send")
  .option("--json", "Output as JSON")
  .addHelpText("after", '\nExamples:\n  tchao-cli messages send abc123 --message "Hello!"\n  tchao-cli messages send abc123 --message "Thanks for reaching out" --json')
  .action(async (conversationId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.post("", {
        tool: "send_message",
        params: { conversationId, message: opts.message as string },
      });
      output(data, { json: !!opts.json });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
