import { OpenRouter } from "@openrouter/sdk";
import { getConfig, type ConfigData } from "./config.js";

export interface AIProvider {
  serverUrl: string;
  models: string[];
  name: string;
}

export const aiProvider: AIProvider[] = [
  {
    name: "OpenRouter",
    serverUrl: "https://openrouter.ai/api/v1",
    models: [
      "openai/gpt-4o-mini",
      "google/gemini-2.5-flash",
      "meta-llama/llama-3-8b-instruct:free",
      "deepseek/deepseek-chat",
    ],
  },
  {
    name: "OpenAI (Direct)",
    serverUrl: "https://api.openai.com/v1",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-4"],
  },
  {
    name: "Google Gemini (Direct / OpenAI-compatible)",
    serverUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    models: [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ],
  },
  {
    name: "Hack Club AI (Free for teenagers [13-18])",
    serverUrl: "https://ai.hackclub.com/proxy/v1",
    models: ["qwen/qwen3-32b"],
  },
];

export default function getAiClient(config: ConfigData) {
  const client = new OpenRouter({
    apiKey: config.apiKey,
    serverURL: config.serverUrl,
  });

  return client;
}
