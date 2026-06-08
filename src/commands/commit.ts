import chalk from "chalk";
import ora from "ora";
import { checkIfGitInitialized, commitChanges, getDiff } from "../utils/git.js";
import client from "../utils/ai.js";
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
}

export const commit = async (option: CommitOption) => {
  const config = getConfig();

  const isGitAvailable = checkIfGitInitialized();
  if (!isGitAvailable)
    return console.log(chalk.red("Error: git not initialized. run git init"));

  const diff = getDiff(option.stagedChanges || false);

  if (!diff)
    return console.log(chalk.yellow("No changes detected in your workspace."));

  const generationSpinner = ora("Generating Commit Message").start();

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
              `,
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

    if (!option.autoApply) {
      const userRes = await inquirer.prompt({
        type: "select",
        choices: ["Copy to Clipboard", "Commit changes", "Do both"],
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
        case "Do both":
          await clipboard.write(response.message.content);
          console.log(chalk.green("Commit message copied to clipboard"));
          option.autoApply = true;
          break;
      }
    }

    if (option.autoApply) {
      const applyChangesSpinner = ora("Applying changes").start();
      console.log("\n");
      const applyResult = commitChanges(response.message.content);

      if (applyResult.success) {
        applyChangesSpinner.succeed("changes applied");
      } else {
        applyChangesSpinner.fail("changes not applied");
        return console.log("done");
      }
    } else {
    }
  } catch (error) {
    generationSpinner.fail("Commit message generation failed");
    console.log(error);
  }
};
