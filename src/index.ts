import { Telegraf } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { setUpActions } from './bot/actions.ts';
import { setUpCommands } from './bot/commands.ts';
import { setupWebhook } from './webhook.ts';
import { smallTalk } from './smallTalk.ts';
import { env } from '../config/env.ts';

dotenv.config();

if (!env.BOT_TOKEN || !env.WEBHOOK_URL) {
  throw new Error('BOT_TOKEN and WEBHOOK_URL must be defined in .env');
}

// Initialize Express and Telegraf
const app = express();
const bot = new Telegraf(env.BOT_TOKEN);

setUpActions(bot);
setUpCommands(bot);
setupWebhook(bot);
smallTalk(bot);

// Plug Telegraf into Express
app.use(bot.webhookCallback('/telegram'));

// Root route for health check
app.get('/', (req: any, res: any) => {
  res.send('🚀 Your Bot is running!');
});

// Start Express server
app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
});
