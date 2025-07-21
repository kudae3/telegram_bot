import { Markup, Telegraf } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { message } from 'telegraf/filters'
import axios from 'axios';
import { sendRandomQuote, sendTodayQuote } from './utils.ts';

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

bot.start(async (ctx) => {
  const username = ctx.from?.first_name || 'there';
  await ctx.reply(`👋 Hello ${username}, Welcome to the Moti Hub Bot!`);
  await ctx.reply("How are you feeling today?", 
    Markup.inlineKeyboard([
      Markup.button.callback('😊 Good', 'feeling_good'),
      Markup.button.callback('😐 Okay', 'feeling_okay'),
      Markup.button.callback('😔 Not Great', 'feeling_bad')
    ]),
  );
});

bot.action('feeling_good', (ctx) => {
  ctx.reply("That's awesome! Want me to inspire you with a random quote? 🌟",
    Markup.inlineKeyboard([
      Markup.button.callback('Yes, please!', 'random_quote'),
      Markup.button.callback('Maybe later', 'quit')
    ])
  );
});

bot.action('feeling_okay', (ctx) => {
  ctx.reply("I hear you. How about a motivational quote to brighten your day? 🌞", 
    Markup.inlineKeyboard([
      Markup.button.callback('yes 🙂‍↔️', 'today_quote'),
      Markup.button.callback('nope 😐', 'quit')
    ])
  );
});

bot.action('feeling_bad', (ctx) => {
  ctx.reply("Sorry to hear that 😢. Here's something uplifting for you:");
  sendRandomQuote(ctx);
});

bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /random_quote to receive a random quote');
  ctx.reply('Send /today_quote to receive a message with a keyboard');
  ctx.reply('Send /quit to stop the bot');
});

// bot.command('/main', (ctx) => {
//   ctx.reply(
//     'Please choose an option:',
//     Markup.keyboard([
//       ['Random Quote', 'Today Quote'],
//     ]).resize().oneTime()
//   );
// });

bot.command('/random_quote', async (ctx) => {
  await sendRandomQuote(ctx);
});

bot.command('/today_quote', async (ctx) => {
  await sendTodayQuote(ctx);
});

bot.command('/quit', (ctx) => {
  ctx.reply('👋 Goodbye! If you need assistance, just type /start');
});

bot.action('random_quote', async (ctx) => {
  await sendRandomQuote(ctx);
});

bot.action('today_quote', async (ctx) => {
  await sendTodayQuote(ctx);
})

bot.action('quit', (ctx) => {
  ctx.reply('👋 Goodbye! If you need assistance, just type /start');
})

// bot.hears('Random Quote', async (ctx) => {
//   await sendRandomQuote(ctx);
// });

// bot.hears('Today Quote', async (ctx) => {
//   await sendTodayQuote(ctx);
// });

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
