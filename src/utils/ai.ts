import { OpenRouter } from "@openrouter/sdk";

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
    serverUrl: "",
    models: ["gemini-flash-3"],
  },
];

const client = new OpenRouter({
  apiKey: process.env.HACKCUB_AI_API_KEY,
  serverURL: process.env.HACKCUB_AI_API_URL,
});

export default client;
