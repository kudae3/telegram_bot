import { Context, Markup, Telegraf } from "telegraf";
import { fetchAuthors, fetchQuoteByAuthor, sendFollowUpMsg, sendRandomQuote } from "../utils";

export const setUpCommands = async(bot: Telegraf) => {

const authors = await fetchAuthors();

bot.help( async(ctx: Context) => {
  await ctx.reply('Send /start to receive a greeting');
  await ctx.reply('Send /random_quote to receive a random quote');
  await ctx.reply('Send /choose_author to select an author and receive quotes from them');
  await ctx.reply('Send /quit to stop the bot');
});

bot.command('random_quote', async (ctx: Context) => {
  console.log('User requested a random quote');
  await sendRandomQuote(ctx);
  await sendFollowUpMsg(ctx);
});

bot.command('choose_author', async(ctx: Context) => {
  console.log('User requested to choose an author');
  await ctx.reply("Please choose the name of the author you want to hear quotes from.", 
    Markup.keyboard(
      authors.map((author: {name: string}) => [author.name])
    ).oneTime().resize()
  );
});

bot.command('quit', async(ctx: Context) => {
  console.log('User requested to quit');
  
  await ctx.reply('👋 Goodbye! If you need assistance, just type /start');
});

authors.forEach((author: { name: string, bio: string }) => {
  bot.hears(author.name, async (ctx: Context) => {
    const quote = await fetchQuoteByAuthor(author.name);
    
    if (quote) {
      await ctx.reply(`"${quote.content}" — ${quote.author}`);
      await ctx.reply(`I hope you like this quote! If you want to hear another one, just type the author's name again or send /random_quote.`,
        Markup.keyboard([
          [`About ${author.name}`],
          [`One More Quote by ${author.name}`],
          ['Choose Author'],
          ['Random Quote'],
          ['Quit'],
        ]).oneTime().resize()
      )
    } else {
      await ctx.reply(`No quotes found for ${author.name}.`);
    }
  });

  bot.hears(`About ${author.name}`, async (ctx: Context) => {
  await ctx.reply(`${author.bio}`, 
      Markup.keyboard([
        [`About ${author.name}`],
        [`One More Quote by ${author.name}`],
        ['Choose Author'],
        ['Random Quote'],
        ['Quit'],
      ]).oneTime().resize()
    )
  });

  bot.hears(`One More Quote by ${author.name}`, async (ctx: Context) => {
    const quote = await fetchQuoteByAuthor(author.name);
    if (quote) {
      await ctx.reply(`${quote.content} - ${quote.author}`, 
        Markup.keyboard([
          [`About ${author.name}`],
          [`One More Quote by ${author.name}`],
          ['Choose Author'],
          ['Random Quote'],
          ['Quit'],
        ]).oneTime().resize()
      );
    } else {
      await ctx.reply(`No more quotes found for ${author.name}.`);
    }
  });
});

bot.hears('Choose Author', async (ctx: Context) => {
    const authors = await fetchAuthors();
    
    await ctx.reply("Please choose the name of the author you want to hear quotes from.", 
        Markup.keyboard(
          authors.map((author: {name: string}) => [author.name])
        ).oneTime().resize()
    );
})

bot.hears('Random Quote', async (ctx: Context) => {
  await sendRandomQuote(ctx);
  await sendFollowUpMsg(ctx);
});

bot.hears('Quit', async(ctx: Context) => {
  await ctx.reply('👋 Goodbye! If you need assistance, just type /start');
});

}