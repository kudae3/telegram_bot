import { config } from "dotenv";

// Load environment variables from .env file
config();

export const env = {
  BOT_TOKEN: process.env.BOT_TOKEN as string,
  WEBHOOK_URL: process.env.WEBHOOK_URL as string,
  PORT: Number(process.env.PORT),
  INSPIRE_API: process.env.INSPIRE_API as string,
};