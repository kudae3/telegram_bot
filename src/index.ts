import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx) => ctx.reply('Welcome to Spot Tech!'));
bot.help((ctx) => ctx.reply('Send me a message and I will echo it.'));
bot.on('text', (ctx) => ctx.reply(`You said: ${ctx.message.text}`));

bot.launch()
  .then(() => console.log('🤖 Bot is running'))
  .catch((err) => console.error(err));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
