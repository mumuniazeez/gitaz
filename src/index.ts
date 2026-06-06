import "dotenv/config";
import { Command } from "commander";
import { summarize, type SummarizeOption } from "./commands/summarize.js";

const program = new Command();

program.name("Gitaz").description("AI Powered Git").version("1.0.0");

program
  .command("summary")
  .description("Summarize recent git activity")
  .option("-d, --days <number>", "Number of days", "7")
  .action((option: SummarizeOption) => {
    return summarize(option);
  });

program.parse();
