import chalk from "chalk";
import ora from "ora";
import { checkIfGitInitialized, getGitLog } from "../utils/git.js";
import client from "../utils/ai.js";

export interface CommitOption {
  autoApply: boolean;
}

export const commit = async (option: CommitOption) => {
  console.log(option);
};
