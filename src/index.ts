import { Markup, Telegraf } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
import { message } from 'telegraf/filters'
import axios from 'axios';

dotenv.config();

// Load environment variables
const BOT_TOKEN = process.env.BOT_TOKEN as string;
const WEBHOOK_URL = process.env.WEBHOOK_URL as string;
const PORT = parseInt(process.env.PORT || '3000', 10);
const ZENQUOTE_API = process.env.ZENQUOTE_API as string;
const TODAY_ZENQUOTE_API = process.env.TODAY_ZENQUOTE_API as string;

if (!BOT_TOKEN || !WEBHOOK_URL) {
  throw new Error('BOT_TOKEN and WEBHOOK_URL must be defined in .env');
}

// Initialize Express and Telegraf
const app = express();
const bot = new Telegraf(BOT_TOKEN);

// Bot commands
bot.start(async(ctx) => {
  const user = ctx.from?.username || 'Unknown User';
  await ctx.reply(`👋 Hello ${user}, Welcome to the Moti Hub Bot!`);
  await ctx.reply('Please choose an option: ', 
    Markup.inlineKeyboard([
      Markup.button.callback('random Quote', 'random_quote'),
      Markup.button.callback('Today Quote', 'today_quote'),
      Markup.button.callback('Help', 'help')
    ])
  )
});

bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /keyboard to receive a message with a keyboard');
  ctx.reply('Send /quit to stop the bot');
});

bot.command('/quote', async (ctx) => {
  try {
    const response = await axios.get(ZENQUOTE_API);
    console.log('Quote fetched:', response.data);
    
    const quote = response.data[0].q;
    const author = response.data[0].a;
    ctx.reply(`💬 "${quote}" - ${author}`);
  } catch (error) {
    console.error('Error fetching quote:', error);
    ctx.reply('Sorry, I could not fetch a quote at the moment.');
  }
});

bot.command('/main', (ctx) => {
  ctx.reply(
    'Please choose an option:',
    Markup.keyboard([
      ['Random Quote', 'Today Quote'],
    ]).resize().oneTime()
  );
});

bot.action('random_quote', async (ctx) => {
  try {
    const response = await axios.get(ZENQUOTE_API);
    console.log('Random Quote fetched:', response.data);
    const quote = response.data[0].q;
    const author = response.data[0].a;
    ctx.reply(`💬 "${quote}" - ${author}`);
  } catch (error) {
    console.error('Error fetching quote:', error);
    ctx.reply('Sorry, I could not fetch a quote at the moment.');
  }
})

bot.action('today_quote', async (ctx) => {
  try {
    const response = await axios.get(TODAY_ZENQUOTE_API);
    console.log('Toady Quote fetched:', response.data);
    const quote = response.data[0].q;
    const author = response.data[0].a;
    ctx.reply(`💬 "${quote}" - ${author}`);
  } catch (error) {
    console.error('Error fetching quote:', error);
    ctx.reply('Sorry, I could not fetch a quote at the moment.');
  }
})

bot.action('quit', (ctx) => {
  ctx.reply('👋 Goodbye! If you need assistance, just type /start');
})

bot.hears('Random Quote', async (ctx) => {
  try {
    const response = await axios.get(ZENQUOTE_API);
    console.log('Quote fetched:', response.data);
    const quote = response.data[0].q;
    const author = response.data[0].a;
    ctx.reply(`💬 "${quote}" - ${author}`);
  } catch (error) {
    console.error('Error fetching quote:', error);
    ctx.reply('Sorry, I could not fetch a quote at the moment.');
  }
});

bot.hears('Today Quote', async (ctx) => {
  try {
    const response = await axios.get(TODAY_ZENQUOTE_API);
    console.log('Quote fetched:', response.data);
    const quote = response.data[0].q;
    const author = response.data[0].a;
    ctx.reply(`💬 "${quote}" - ${author}`);
  } catch (error) {
    console.error('Error fetching quote:', error);
    ctx.reply('Sorry, I could not fetch a quote at the moment.');
  }
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
