import chalk from "chalk";
import fs from "fs";
import os from "os";
import path from "path";

interface ConfigData {
  model: string;
  serverUrl: string;
  apiKey: string;
}

const CONFIG_PATH = path.join(os.homedir(), ".gitaz.json");

export const saveConfig = (configData: ConfigData) => {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(configData, null, 2), "utf-8");
    console.log(chalk.green("Config saved successfully."));
  } catch (error) {
    console.log(chalk.red("Failed to save config"));
    console.log(error);
    return;
  }
};

export const getConfig = (): ConfigData => {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(data) as ConfigData;
    }
    throw console.log(
      chalk.red("No config found. Run 'gitaz setup' to create one"),
    );
  } catch (error) {
    console.log(chalk.red("Failed to read config"));
    throw console.log(error);
  }
};
