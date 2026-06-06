import "dotenv/config";
import { Command } from "commander";
import { summary } from "./commands/summarize.js";

const program = new Command();

program
  .name("Gitaz")
  .description(
    "Gitaz is a command-line tool that uses AI to help you with your Git workflow.",
  )
  .version("1.0.0");

program
  .command("summary")
  .description("Summarize recent git activity")
  .option("-d, --days <number>", "Number of days", "7")
  .action(summary);

program.parse();
