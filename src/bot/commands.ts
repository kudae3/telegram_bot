import { Markup, Telegraf } from "telegraf";
import { fetchAuthors, fetchQuoteByAuthor, sendRandomQuote } from "../utils.ts";
import { message } from "telegraf/filters";

export const setUpCommands = async(bot: Telegraf) => {

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

const authors = await fetchAuthors();
authors.forEach((author: { name: string }) => {
  bot.hears(author.name, async (ctx) => {
    const quote = await fetchQuoteByAuthor(author.name);
    
    if (quote) {
      await ctx.reply(`"${quote.content}" — ${quote.author}`);
      await ctx.reply(`Want to get another quote from ${quote.author}?`,
        Markup.keyboard([
          ['Yes', 'No']
        ]).oneTime().resize()
      )
    } else {
      await ctx.reply(`No quotes found for ${author.name}.`);
    }
  });
});

bot.hears('No', async(ctx) => {
  await ctx.reply('Okay, type /authors if you want to choose a specific author!');
});

// bot.on(message('text'), (ctx) => {
//   const user = ctx.from?.username || 'Unknown User';
//   console.log(`Received message from ${user}: ${ctx.message.text}`);
//   ctx.reply(`You said: ${ctx.message.text}`);
// });
}