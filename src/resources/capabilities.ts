import { Command } from "commander";
import { client } from "../lib/client.js";
import { output, unwrap } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const capabilitiesResource = new Command("capabilities")
  .description("Manage custom HTTP tools (capabilities) the website AI can call");

/** Reads a JSON spec from a file path, or from stdin when path is "-" */
async function readJsonSpec(path: string): Promise<Record<string, unknown>> {
  const text = path === "-" ? await Bun.stdin.text() : await Bun.file(path).text();
  const parsed = JSON.parse(text) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Spec in ${path} must be a JSON object`);
  }
  return parsed as Record<string, unknown>;
}

/** Resolves the auth secret from an env var so it never lands in shell history */
function readSecretFromEnv(name: string | undefined): string | undefined {
  if (!name) return undefined;
  const value = process.env[name];
  if (!value) throw new Error(`Environment variable ${name} is empty or not set`);
  return value;
}

capabilitiesResource
  .command("list")
  .description("List capabilities (with enabled state when --website is set)")
  .option("--website <id>", "Website ID to include enabled state")
  .option("--fields <cols>", "Comma-separated columns to display")
  .addHelpText(
    "after",
    "\nExamples:\n  tchao-cli capabilities list --json\n  tchao-cli capabilities list --website xyz789 --json",
  )
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const raw = await client.post("/list_capabilities", {
        websiteId: opts.website,
      });
      const data = unwrap(raw) as { capabilities: unknown[] };
      const fields = typeof opts.fields === "string" ? opts.fields.split(",") : undefined;
      output(data.capabilities, { fields });
    } catch (err) {
      handleError(err);
    }
  });

capabilitiesResource
  .command("create")
  .description("Create a capability from a JSON spec (create_capability input)")
  .requiredOption("--file <path>", "JSON spec file, or - for stdin")
  .option("--auth-secret-env <var>", "Read the auth secret from this env var")
  .option("--website <id>", "Also enable it for this website")
  .addHelpText(
    "after",
    "\nSpec fields: name, description, method, urlTemplate, params[], bodyTemplate,\n" +
      "headerTemplate, responsePath, authType, authHeaderName, urlAllowlist[].\n" +
      "\nExamples:\n  tchao-cli capabilities create --file spec.json --json\n" +
      "  LUMAIL_KEY=... tchao-cli capabilities create --file spec.json --auth-secret-env LUMAIL_KEY",
  )
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const spec = await readJsonSpec(opts.file as string);
      const authSecret = readSecretFromEnv(opts.authSecretEnv);
      const raw = await client.post("/create_capability", {
        ...spec,
        ...(authSecret ? { authSecret } : {}),
        ...(opts.website ? { websiteId: opts.website, enabled: true } : {}),
      });
      output(unwrap(raw));
    } catch (err) {
      handleError(err);
    }
  });

capabilitiesResource
  .command("update")
  .description("Patch a capability. Secrets are kept unless a new one is provided")
  .argument("<capability-id>", "Capability ID")
  .option("--file <path>", "JSON patch file, or - for stdin")
  .option("--auth-secret-env <var>", "Replace the auth secret with this env var's value")
  .option("--auth-type <type>", "Auth type: none, bearer or header")
  .option("--clear-secret", "Remove the stored auth secret")
  .addHelpText(
    "after",
    "\nExamples:\n  tchao-cli capabilities update abc123 --file patch.json\n" +
      "  LUMAIL_KEY=... tchao-cli capabilities update abc123 --auth-type bearer --auth-secret-env LUMAIL_KEY",
  )
  .action(async (capabilityId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const patch = typeof opts.file === "string" ? await readJsonSpec(opts.file) : {};
      const authSecret = readSecretFromEnv(opts.authSecretEnv as string | undefined);
      if (authSecret) patch.authSecret = authSecret;
      if (opts.authType) patch.authType = opts.authType;
      if (opts.clearSecret) patch.clearSecret = true;
      if (Object.keys(patch).length === 0) {
        throw new Error(
          "Nothing to update: pass --file, --auth-secret-env, --auth-type or --clear-secret",
        );
      }
      const raw = await client.post("/update_capability", { capabilityId, patch });
      output(unwrap(raw));
    } catch (err) {
      handleError(err);
    }
  });

for (const [name, enabled] of [
  ["enable", true],
  ["disable", false],
] as const) {
  capabilitiesResource
    .command(name)
    .description(`${enabled ? "Enable" : "Disable"} a capability for one website's AI`)
    .argument("<capability-id>", "Capability ID")
    .requiredOption("--website <id>", "Website ID")
    .addHelpText("after", `\nExamples:\n  tchao-cli capabilities ${name} abc123 --website xyz789`)
    .action(async (capabilityId: string, opts: Record<string, string | undefined>) => {
      try {
        const raw = await client.post("/set_website_capability", {
          capabilityId,
          websiteId: opts.website,
          enabled,
        });
        output(unwrap(raw));
      } catch (err) {
        handleError(err);
      }
    });
}

capabilitiesResource
  .command("delete")
  .description("Permanently delete a capability from the organization")
  .argument("<capability-id>", "Capability ID")
  .addHelpText("after", "\nExamples:\n  tchao-cli capabilities delete abc123")
  .action(async (capabilityId: string) => {
    try {
      const raw = await client.post("/delete_capability", { capabilityId });
      output(unwrap(raw));
    } catch (err) {
      handleError(err);
    }
  });
