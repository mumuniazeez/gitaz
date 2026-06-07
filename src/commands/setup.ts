import chalk from "chalk";
import inquirer from "inquirer";
import { aiProvider } from "../utils/ai.js";

export const setup = async () => {
  console.log(chalk.green("Let's setup Gitaz"));
  const aiProviderRes = await inquirer.prompt({
    type: "select",
    choices: aiProvider.map((ap) => ap.name),
    message: "Select your AI provider",
    name: "aiProviderValue",
  });

  const model = await inquirer.prompt([
    {
      type: "select",
      choices: aiProvider
        .find((ap) => ap.name === aiProviderRes.aiProviderValue)
        ?.models.map((model) => model),
      message: "Select the model you want to use",
      name: "modelValue",
    },
    { type: "input", name: "apiKey", message: "Provide your API key" },
  ]);

  console.log(aiProviderRes.aiProviderValue, model.modelValue, model.apiKey);
};
