import chalk from "chalk";
import { execSync } from "child_process";

export const checkIfGitInitialized = () => {
  try {
    const output = execSync("git rev-parse --is-inside-work-tree", {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf-8",
    }).trim();

    return output === "true";
  } catch (error) {
    return false;
  }
};

export const getGitLog = (days: number = 7) => {
  return execSync(
    `git log --since="${days} days ago" --pretty=format:"%h %s (%an, %ar)"`,
  ).toString();
};

export const getDiff = (staged: boolean) => {
  return execSync(`git diff ${staged ? "--staged" : ""}`)
    .toString()
    .trim();
};

export const getDiffByHash = (commitHash: string) => {
  return execSync(`git show ${commitHash} `).toString().trim();
};

export const hasStagedChanges = (): boolean => {
  try {
    const output = execSync("git diff --cached --name-only", {
      cwd: process.cwd(),
      encoding: "utf-8",
    }).trim();

    return output.length > 0;
  } catch (error) {
    return false;
  }
};

export const commitChanges = (commitMessage: string) => {
  try {
    if (!hasStagedChanges()) {
      console.log(chalk.white("adding changes..."));
      execSync("git add --all");
    }
    execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
    console.log(chalk.green("✔"), "changes committed");
    // TODO: Implement 'gitaz push' command
    console.log(chalk.white("Run 'gitaz push' to push your code online.\n"));

    return { success: true };
  } catch (error) {
    console.log(chalk.red("✖"), "changes commit failed");
    console.log(error);
    return { success: false, error };
  }
};
