import chalk from "chalk";
import ora from "ora";
import { checkIfGitInitialized, getDiff, getGitLog } from "../utils/git.js";
import client from "../utils/ai.js";

export interface CommitOption {
  autoApply?: boolean;
  stagedChanges?: true;
}

export const commit = async (option: CommitOption) => {
  const isGitAvailable = checkIfGitInitialized();
  if (!isGitAvailable)
    return console.log(chalk.red("Error: git not initialized. run git init"));

  const diff = getDiff(option.stagedChanges || false);

  if (!diff)
    return console.log(chalk.yellow("No changes detected in your workspace."));
};
