import { Telegraf } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';

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

// Bot commands
bot.start((ctx) => ctx.reply('👋 Welcome to Spot Tech!'));
bot.help((ctx) => ctx.reply('Send me a message and I will echo it.'));
bot.on('text', (ctx) => {
  console.log(`Received message: ${ctx.message.text}`);
  ctx.reply(`You said: ${ctx.message.text}`);
});

// Plug Telegraf into Express
app.use(bot.webhookCallback('/telegram'));

// Set Telegram webhook
bot.telegram.setWebhook(`${WEBHOOK_URL}/telegram`)
  .then(() => console.log(`✅ Webhook set to ${WEBHOOK_URL}/telegram`))
  .catch((err) => console.error('❌ Error setting webhook:', err));

// Root route for health check
app.get('/', (req, res) => {
  res.send('🚀 Spot Tech Bot is running!');
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
