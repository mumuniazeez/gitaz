import chalk from "chalk";
import ora from "ora";
import { checkIfGitInitialized, getGitLog } from "../utils/git.js";
import client from "../utils/ai.js";

export interface SummarizeOption {
  days: number;
}

export const summary = async (option: SummarizeOption) => {
  // verify if the user actually passed a number
  if (Number.isNaN(Number(option.days)))
    return console.log(
      chalk.red(
        `Error: "${option.days}" is not a valid number. Provide an actually number`,
      ),
    );

  // sanitize days to make sure it's a number
  option.days = Number(option.days);

  const isGitAvailable = checkIfGitInitialized();
  if (!isGitAvailable)
    return console.log(chalk.red("Error: git not initialized. run git init"));

  const log = getGitLog(option.days);

  if (!log)
    return console.log(
      chalk.yellow(`You haven't committed any code in ${option.days} days`),
    );

  const spinner = ora("Generating Summary").start();

  try {
    const res = await client.chat.send({
      chatRequest: {
        messages: [
          {
            role: "system",
            content: `You are an Git AI assistant, you are to help users with their daily git workflows.
              User will provide you with a log of their git commit.
              You are to provide a detailed summary of what changed based on the commits`,
          },
          {
            role: "user",
            content: log,
          },
        ],
      },
    });

    const response = res.choices[0];

    if (!response) {
      spinner.fail("Summary generation failed");
      console.log("AI Provider didn't return any response");
      return;
    }

    spinner.succeed("Summary Generated");
    console.log(response.message);
  } catch (error) {
    spinner.fail("Summary generation failed");
    console.log(error);
  }
};
