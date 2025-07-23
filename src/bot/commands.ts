import { Markup, Telegraf } from "telegraf";
import { fetchAuthors, fetchQuoteByAuthor, sendFollowUpMsg, sendRandomQuote } from "../utils.ts";
import { message } from "telegraf/filters";

export const setUpCommands = async(bot: Telegraf) => {

bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /random_quote to receive a random quote');
  ctx.reply('Send /quit to stop the bot');
});

bot.command('/random_quote', async (ctx) => {
  await sendRandomQuote(ctx);
  await sendFollowUpMsg(ctx);
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
      await ctx.reply(`I hope you like this quote! If you want to hear another one, just type the author's name again or send /random_quote.`,
        Markup.keyboard([
          ['Choose Author', 'Random Quote', 'Quit'],
        ]).oneTime().resize()
      )
    } else {
      await ctx.reply(`No quotes found for ${author.name}.`);
    }
  });
});

bot.hears('Choose Author', async (ctx) => {
    const authors = await fetchAuthors();
    
    await ctx.reply("Please choose the name of the author you want to hear quotes from.", 
        Markup.keyboard(
          authors.map((author: {name: string}) => [author.name])
        ).oneTime().resize()
    );
})

bot.hears('Random Quote', async (ctx) => {
  await sendRandomQuote(ctx);
  await sendFollowUpMsg(ctx);
});

bot.hears('Quit', (ctx) => {
  ctx.reply('👋 Goodbye! If you need assistance, just type /start');
});

// bot.on(message('text'), (ctx) => {
//   const user = ctx.from?.username || 'Unknown User';
//   console.log(`Received message from ${user}: ${ctx.message.text}`);
//   ctx.reply(`You said: ${ctx.message.text}`);
// });
}