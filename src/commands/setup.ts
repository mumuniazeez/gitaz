import chalk from "chalk";
import inquirer from "inquirer";
import { aiProvider } from "../utils/ai.js";
import fs from "fs";

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

  fs.writeFile(
    `${process.cwd()}/.config.json`,
    `
  {
  "model": "${model.modelValue}",
  "serverUrl": "${
    aiProvider.find((ap) => ap.name === aiProviderRes.aiProviderValue)
      ?.serverUrl
  }",
  "apiKey": "${model.apiKey}"
  }
  `.trim(),
    (error) => {
      if (error) {
        console.log(chalk.red("Setup Failed"));
        console.log(error);
        return;
      }
      fs.copyFile(
        `${process.cwd()}/.config.json`,
        `${process.cwd()}/dist/.config.json`,
        () => {},
      );
      fs.copyFile(
        `${process.cwd()}/.config.json`,
        `${process.cwd()}/src/.config.json`,
        () => {},
      );
      console.log(chalk.green("Setup complete, you are ready to go."));
    },
  );
};
