// TODO: Implement feature for AI to explain what happened/changed by a commit hash or id
import chalk from "chalk";
import ora from "ora";
import { checkIfGitInitialized, getDiffByHash } from "../utils/git.js";
import getAiClient from "../utils/ai.js";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { getConfig } from "../utils/config.js";

// Configure marked to use marked-terminal
marked.use(markedTerminal() as any);

export const explain = async (commitHash: string) => {
  console.log(commitHash);
  const config = getConfig();

  if (!config)
    return console.log(
      chalk.red("Error: AI Provider not set. run gitaz setup"),
    );

  const isGitAvailable = checkIfGitInitialized();
  if (!isGitAvailable)
    return console.log(chalk.red("Error: git not initialized. run git init"));

  const diff = getDiffByHash(commitHash);

  if (!diff)
    return console.log(chalk.yellow("No changes detected in your workspace."));

  const client = getAiClient(config);

  const generationSpinner = ora(
    `Generating explanation for ${commitHash}...`,
  ).start();

  const res = await client.chat.send({
    chatRequest: {
      model: config.model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that explains git commits. You will be given a git commit diff and you are to explain what happened in the commit in detail.",
        },
        {
          role: "user",
          content: `Explain the following git commit diff in detail:\n\n${diff}`,
        },
      ],
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
};
