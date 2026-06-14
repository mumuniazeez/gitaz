import chalk from "chalk";
import ora from "ora";
import { checkIfGitInitialized, getGitLog } from "../utils/git.js";
import getAiClient from "../utils/ai.js";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { getConfig } from "../utils/config.js";
import inquirer from "inquirer";

// Configure marked to use marked-terminal
marked.use(markedTerminal() as any);

export interface SummarizeOption {
  days: number;
  format?: "Brief" | "Conventional" | "Detailed";
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

  if (!config)
    return console.log(
      chalk.red("Error: AI Provider not set. run gitaz setup"),
    );

  const isGitAvailable = checkIfGitInitialized();
  if (!isGitAvailable)
    return console.log(chalk.red("Error: git not initialized. run git init"));

  const log = getGitLog(option.days);

  if (!log)
    return console.log(
      chalk.yellow(`You haven't committed any code in ${option.days} days`),
    );

  if (!option.format) {
    const summaryFormatResponce = await inquirer.prompt({
      type: "select",
      name: "summaryFormat",
      message: "Select summary format:",
      choices: ["Brief", "Conventional", "Detailed"],
    });
    option.format = summaryFormatResponce.summaryFormat as any;
  } else {
    if (
      option.format !== "Brief" &&
      option.format !== "Conventional" &&
      option.format !== "Detailed"
    ) {
      return console.log(
        chalk.red(
          `Error: "${option.format}" is not a valid format. Run gitaz summary --help to see the valid formats`,
        ),
      );
    }
  }

  const spinner = ora("Generating Summary").start();

  const client = getAiClient(config);

  try {
    const res = await client.chat.send({
      chatRequest: {
        model: config.model,
        messages: [
          {
            role: "system",
            content: `You are an Git AI assistant, you are to help users with their daily git workflows.
              User will provide you with a log of their git commit.
              You are to provide a ${option.format} summary of what changed based on the commits
              Summary should be in ${option.format} format
              Do not ask any further question at all (like can i do this... or do you want to...)`,
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
