import { Telegraf } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { setUpActions } from './bot/actions.ts';
import { setUpCommands } from './bot/commands.ts';
import { setupWebhook } from './webhook.ts';

dotenv.config();

// Load environment variables
const BOT_TOKEN = process.env.BOT_TOKEN as string;
const WEBHOOK_URL = process.env.WEBHOOK_URL as string;
const PORT = parseInt(process.env.PORT || '3000', 10);

if (!BOT_TOKEN || !WEBHOOK_URL) {
  throw new Error('BOT_TOKEN and WEBHOOK_URL must be defined in .env');
}

// Initialize Express and Telegraf
const app = express();
const bot = new Telegraf(BOT_TOKEN);

setUpActions(bot);
setUpCommands(bot);
setupWebhook(bot);

// Plug Telegraf into Express
app.use(bot.webhookCallback('/telegram'));

// Root route for health check
app.get('/', (req, res) => {
  res.send('🚀 Your Bot is running!');
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
