import chalk from "chalk";
import inquirer from "inquirer";
import { aiProvider } from "../utils/ai.js";
import { saveConfig } from "../utils/config.js";

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

  console.log(chalk.green("Setup completed successfully."));
};
