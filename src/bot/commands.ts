import { Telegraf } from "telegraf";
import { sendRandomQuote } from "../utils.ts";
import { message } from "telegraf/filters";

export const setUpCommands = (bot: Telegraf) => {
  bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /random_quote to receive a random quote');
  ctx.reply('Send /quit to stop the bot');
});

bot.command('/random_quote', async (ctx) => {
  await sendRandomQuote(ctx);
  await sendRandomQuote(ctx);
});

bot.command('/quit', (ctx) => {
  ctx.reply('👋 Goodbye! If you need assistance, just type /start');
});

bot.on(message('text'), (ctx) => {
  const user = ctx.from?.username || 'Unknown User';
  console.log(`Received message from ${user}: ${ctx.message.text}`);
  ctx.reply(`You said: ${ctx.message.text}`);
});
}