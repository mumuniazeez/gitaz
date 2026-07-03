import { OpenRouter } from "@openrouter/sdk";
import type { ConfigData } from "./config.js";

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
      "openai/gpt-4o",
      "openai/gpt-4-turbo",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
      "meta-llama/llama-3-8b-instruct:free",
      "meta-llama/llama-3-22b-instruct",
      "anthropic/claude-4",
      "deepseek/deepseek-chat",
    ],
  },
  {
    name: "OpenAI",
    serverUrl: "https://api.openai.com/v1",
    models: [
      "gpt-4o-mini",
      "gpt-4o",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
      "gpt-3.5-turbo-16k",
      "text-davinci-003",
    ],
  },
  {
    name: "Google Gemini (Direct / OpenAI-compatible)",
    serverUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    models: [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.0-pro",
      "gemini-2.5-mini",
    ],
  },
  {
    name: "Anthropic",
    serverUrl: "https://api.anthropic.com/v1",
    models: [
      "claude-4",
      "claude-4.1",
      "claude-3.5",
      "claude-3.5-sonic",
      "claude-instant-v1",
      "claude-3",
    ],
  },
  {
    name: "Cohere",
    serverUrl: "https://api.cohere.ai",
    models: [
      "command-nightly",
      "command-beta",
      "command-light",
      "command-lite",
      "command-xlarge-nightly",
      "command-xlarge-beta",
    ],
  },
  {
    name: "AI21",
    serverUrl: "https://api.ai21.com/studio/v1",
    models: ["j1-jumbo", "j1-large", "j1-grande", "j1-jumbo-premium"],
  },
  {
    name: "Hack Club AI (Free for teenagers [13-18])",
    serverUrl: "https://ai.hackclub.com/proxy/v1",
    models: [
      "qwen/qwen3-32b",
      "anthropic/claude-opus-4.8",
      "deepseek-v3.2",
      "google/gemini-3.5-flash",
    ],
  },
];

export default function getAiClient(config: ConfigData) {
  const client = new OpenRouter({
    apiKey: config.apiKey,
    serverURL: config.serverUrl,
  });

  return client;
}
