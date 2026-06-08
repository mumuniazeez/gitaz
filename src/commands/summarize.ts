import chalk from "chalk";
import ora from "ora";
import { checkIfGitInitialized, getGitLog } from "../utils/git.js";
import client from "../utils/ai.js";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { getConfig } from "../utils/config.js";

// Configure marked to use marked-terminal
marked.use(markedTerminal() as any);

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

  const config = getConfig();

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
        model: config.model,
        messages: [
          {
            role: "system",
            content: `You are an Git AI assistant, you are to help users with their daily git workflows.
              User will provide you with a log of their git commit.
              You are to provide a detailed summary of what changed based on the commits`,
          },
          {
            role: "user",
            content: `
              Here is the git log of the my commits:
              ${log}
              Now provide a summary of what I did in the last ${option.days} days.
            `,
          },
        ],
        stream: false,
      },
    });

    const response = res.choices[0];

    if (!response) {
      spinner.fail("Summary generation failed");
      console.log("AI Provider didn't return any response");
      return;
    }

    spinner.succeed("Summary Generated");
    console.log(chalk.white(marked.parse(response.message.content)));
  } catch (error) {
    spinner.fail("Summary generation failed");
    console.log(error);
  }
};
