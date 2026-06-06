import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
  apiKey: process.env.HACKCUB_AI_API_KEY,
  serverURL: process.env.HACKCUB_AI_API_URL,
});

export default client;
