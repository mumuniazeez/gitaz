import chalk from "chalk";
import ora from "ora";
import { checkIfGitInitialized, commitChanges, getDiff } from "../utils/git.js";
import getAiClient from "../utils/ai.js";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import inquirer from "inquirer";
import { getConfig } from "../utils/config.js";
import clipboard from "clipboardy";
// Configure marked to use marked-terminal
marked.use(markedTerminal() as any);

export interface CommitOption {
  autoApply?: boolean;
  stagedChanges?: true;
  format?: "Brief" | "Anuglar-style" | "Gitmoji" | "Conventional" | "Detailed";
}

export const commit = async (option: CommitOption) => {
  const config = getConfig();

  if (!config)
    return console.log(
      chalk.red("Error: AI Provider not set. run gitaz setup"),
    );

  const isGitAvailable = checkIfGitInitialized();
  if (!isGitAvailable)
    return console.log(chalk.red("Error: git not initialized. run git init"));

  const diff = getDiff(option.stagedChanges || false);

  if (!diff)
    return console.log(chalk.yellow("No changes detected in your workspace."));

  if (!option.format) {
    const summaryFormatResponce = await inquirer.prompt({
      type: "select",
      name: "summaryFormat",
      message: "Select commit format:",
      choices: [
        "Brief",
        "Anuglar-style",
        "Gitmoji",
        "Conventional",
        "Detailed",
      ],
    });
    option.format = summaryFormatResponce.summaryFormat as any;
  } else {
    if (
      option.format !== "Brief" &&
      option.format !== "Conventional" &&
      option.format !== "Detailed" &&
      option.format !== "Anuglar-style" &&
      option.format !== "Gitmoji"
    ) {
      return console.log(
        chalk.red(
          `Error: "${option.format}" is not a valid format. Run gitaz commit --help to see the valid formats`,
        ),
      );
    }
  }

  const generationSpinner = ora("Generating Commit Message").start();

  const client = getAiClient(config);

  try {
    const res = await client.chat.send({
      chatRequest: {
        model: config.model,
        messages: [
          {
            role: "system",
            content: `You are an Git AI assistant, you are to help users with their daily git workflows.
                User will provide you with a diff of their git. You are to provide a 
                comprehensive commit message for the diff. The commit message should be concise and informative.
                Do not include any additional information in the commit message and return only the commit message text.
                The commit message should be in ${option.format} format.
                Do not ask any further question at all (like can i do this... or do you want to...)`,
          },
          {
            role: "user",
            content: `
              Here is the git diff of my commits:
              ${diff}
              Now provide a commit message for the diff.
            `,
          },
        ],
        stream: false,
      },
    });

    const response = res.choices[0];

    if (!response) {
      generationSpinner.fail("Commit message generation failed");
      console.log("AI Provider didn't return any response");
      return;
    }

    generationSpinner.succeed("Commit message Generated");
    console.log(marked.parse(response.message.content));

    let commitMessage = response.message.content;

    if (!option.autoApply) {
      const userRes = await inquirer.prompt({
        type: "select",
        choices: [
          "Copy to Clipboard",
          "Commit changes",
          "Edit before commit",
          "Do both (Copy & Commit)",
        ],
        name: "nextAction",
        message: "Do you want to?",
      });

      switch (userRes.nextAction) {
        case "Copy to Clipboard":
          await clipboard.write(response.message.content);
          console.log(chalk.green("Commit message copied to clipboard"));
          break;
        case "Commit changes":
          option.autoApply = true;
          break;
        case "Edit before commit":
          console.log("Press Enter whe you're done");
          const res = await inquirer.prompt({
            type: "input",
            name: "newCommitMessage",
            message: "Edit commit message",
            default: commitMessage,
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return "A commit message is required";
              }
              return true;
            },
          });
          commitMessage = res.newCommitMessage;
          option.autoApply = true;
          break;
        case "Do both (Copy & Commit)":
          await clipboard.write(response.message.content);
          console.log(chalk.green("Commit message copied to clipboard"));
          option.autoApply = true;
          break;
      }
    }

    if (option.autoApply) {
      const applyChangesSpinner = ora("Applying changes").start();
      console.log("\n");
      const applyResult = commitChanges(commitMessage);

      if (applyResult.success) {
        applyChangesSpinner.succeed("changes committed");
      } else {
        applyChangesSpinner.fail("changes not committed");
      }
    }
  } catch (error) {
    generationSpinner.fail("Commit message generation failed");
    console.log(error);
  }
};
