import { OpenRouter } from "@openrouter/sdk";
import { getConfig } from "./config.js";

interface AIProvider {
  serverUrl: string;
  models: string[];
  name: string;
}

export const aiProvider: AIProvider[] = [
  { name: "OpenAI", serverUrl: "", models: ["gpt-4"] },
  { name: "Google Gen AI", serverUrl: "", models: ["gemini-flash-3"] },
  {
    name: "Hack Club AI (Free AI for teenagers [13-18])",
    serverUrl: "https://ai.hackclub.com/proxy/v1",
    models: ["qwen/qwen3-32b"],
  },
];

export default (function client() {
  const config = getConfig();
  if (!config) {
    throw new Error("No config found. Run 'gitaz setup' to create one");
  }

  const client = new OpenRouter({
    apiKey: config.apiKey,
    serverURL: config.serverUrl,
  });

  return client;
})();
