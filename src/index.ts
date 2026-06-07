import "dotenv/config";
import { Command } from "commander";
import { summary } from "./commands/summarize.js";
import { commit } from "./commands/commit.js";
import { setup } from "./commands/setup.js";

const program = new Command();

program
  .name("Gitaz")
  .description(
    "Gitaz is a command-line tool that uses AI to help you with your Git workflow.",
  )
  .version("1.0.0");

program
  .command("setup")
  .description("Setup  your AI provider for Gitaz")
  .action(setup);

program
  .command("summary")
  .description("Summarize recent git activity")
  .option("-d, --days <number>", "Number of days", "7")
  .action(summary);

program
  .command("commit")
  .description("Generate commit message for your changes")
  .option(
    "-s, --staged-changes",
    "Generate commit message for only staged changes",
  )
  .option("-p, --auto-apply", "Automatically push the staged changes")
  .action(commit);

program.parse();
