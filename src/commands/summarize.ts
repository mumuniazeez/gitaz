import chalk from "chalk";
import { checkIfGitInitialized, getGitLog } from "../utils/git.js";

export interface SummarizeOption {
  days: number;
}

export const summarize = async (option: SummarizeOption) => {
  const isGitAvailable = checkIfGitInitialized();
  if (!isGitAvailable)
    return console.log(chalk.red("Error: git not initialized. run git init"));

  const log = getGitLog(option.days);

  if (!log) return console.log(chalk.yellow("No commit found"));
};
