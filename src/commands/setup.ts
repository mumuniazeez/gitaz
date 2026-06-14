import chalk from "chalk";
import inquirer from "inquirer";
import getAiClient, { aiProvider } from "../utils/ai.js";
import { saveConfig } from "../utils/config.js";
import ora from "ora";

export const setup = async () => {
  console.log(chalk.green("Let's setup Gitaz"));
  const aiProviderRes = await inquirer.prompt({
    type: "select",
    choices: aiProvider.map((ap) => ap.name),
    message: "Select your AI provider",
    name: "provider",
  });

  const model = await inquirer.prompt([
    {
      type: "select",
      choices: aiProvider
        .find((ap) => ap.name === aiProviderRes.provider)
        ?.models.map((model) => model),
      message: "Select the model you want to use",
      name: "model",
    },
    {
      type: "input",
      name: "apiKey",
      message: "Provide your API key",
      validate: (value) => {
        if (!value || value.trim().length === 0) {
          return "API key is required";
        }
        return true;
      },
    },
  ]);

  saveConfig({
    ...model,
    serverUrl: aiProvider.find((ap) => ap.name === aiProviderRes.provider)
      ?.serverUrl!,
  });

  const promptRes = await inquirer.prompt({
    type: "confirm",
    name: "testAI",
    message: "Do you want to test your AI provider?",
  });

  if (promptRes.testAI) {
    const client = getAiClient({
      ...model,
      serverUrl: aiProvider.find((ap) => ap.name === aiProviderRes.provider)
        ?.serverUrl!,
    });

    const spinner = ora("Testing AI provider...").start();
    const response = await client.chat.send({
      chatRequest: {
        model: model.model,
        messages: [
          {
            role: "user",
            content:
              "Hello there, you are an AI Git workflow assistant called Gitaz, this is a test message to check if the AI provider is working fine. Just respond if you are working, and do not ask any further question",
          },
        ],
      },
    });

    const res = response.choices[0];

    if (!res) {
      console.log(chalk.red("AI Provider didn't return any response"));
      spinner.fail("AI Provider didn't return any response");
      return;
    }

    spinner.succeed("AI Provider test successful");
    console.log(
      chalk.green("AI Provider test successful. Here's the response:"),
    );
    console.log(res.message.content);
  }
  console.log(chalk.green("Setup completed successfully."));
};
