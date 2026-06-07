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

export function getDiff(staged: boolean) {
  return execSync(`git diff ${staged ? "--staged" : ""}`)
    .toString()
    .trim();
}
