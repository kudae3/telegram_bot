import { Telegraf } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { setUpActions } from './bot/actions';
import { setUpCommands } from './bot/commands';
import { setupWebhook } from './webhook';
import { smallTalk } from './smallTalk';
import { env } from './config/env';

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
