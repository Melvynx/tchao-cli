import { Command } from "commander";
import { client } from "../lib/client.js";
import { output, unwrap } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const messagesResource = new Command("messages")
  .description("Send messages in conversations");

messagesResource
  .command("send")
  .description("Send a message as agent in a conversation")
  .argument("<conversation-id>", "Conversation ID")
  .requiredOption("--message <text>", "Message content to send")
  .addHelpText("after", '\nExamples:\n  tchao-cli messages send abc123 --message "Hello!"\n  tchao-cli messages send abc123 --message "Thanks for reaching out" --json')
  .action(async (conversationId: string, opts: Record<string, string | undefined>) => {
    try {
      const raw = await client.post("/send_message", {
        conversationId,
        content: opts.message as string,
      });
      output(unwrap(raw));
    } catch (err) {
      handleError(err);
    }
  });
