import { Telegraf } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { message } from 'telegraf/filters'

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
bot.start((ctx) => {
  const user = ctx.from?.username || 'Unknown User';
  ctx.reply(`👋 Hello ${user}, Welcome to Our Bot!`);
});

bot.help((ctx) => {
  ctx.reply('Send me a message and I will echo it.');
});

bot.on(message('text'), (ctx) => {
  const user = ctx.from?.username || 'Unknown User';
  console.log(`Received message from ${user}: ${ctx.message.text}`);
  ctx.reply(`You said: ${ctx.message.text}`);
});

// Set Telegram webhook
bot.telegram.setWebhook(`${WEBHOOK_URL}/telegram`)
  .then(async() => {
    console.log(`Webhook set to ${WEBHOOK_URL}/telegram`)
    const info = await bot.telegram.getWebhookInfo()
    console.log('Current Webhook Info:', info);
  })
  .catch((err) => {
    console.error('Error setting webhook:', err)
  });

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
