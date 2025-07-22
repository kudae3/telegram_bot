import { Context, Markup, Telegraf } from "telegraf";
import { sendFollowUpMsg, sendRandomQuote } from "../utils.ts";

export const setUpActions = (bot: Telegraf) => {

    bot.start(async (ctx: Context) => {
      const username = ctx.from?.first_name || 'there';
      console.log('User Data', ctx.from);
      
      await ctx.reply(`👋 Hello ${username}, Welcome to the Moti Hub Bot!`);
      await ctx.reply("How are you feeling today?", 
        Markup.inlineKeyboard([
          Markup.button.callback('😊 Good', 'feeling_good'),
          Markup.button.callback('😐 Okay', 'feeling_okay'),
          Markup.button.callback('😔 Not Great', 'feeling_bad')
        ]),
      );
    });
    
    bot.action('feeling_good', async(ctx: Context) => {
      await ctx.answerCbQuery();
      await ctx.reply("That's awesome! Want me to inspire you with a random quote? 🌟",
        Markup.inlineKeyboard([
          Markup.button.callback('Yes, please!', 'random_quote'),
          Markup.button.callback('Maybe later', 'quit')
        ])
      );
    });
    
    bot.action('feeling_okay', async(ctx: Context) => {
      await ctx.answerCbQuery();
      await ctx.reply("I hear you. How about a motivational quote to brighten your day? 🌞", 
        Markup.inlineKeyboard([
          Markup.button.callback('yes 🙂‍↔️', 'random_quote'),
          Markup.button.callback('nope 😐', 'quit')
        ])
      );
    });
    
    bot.action('feeling_bad', async(ctx: Context) => {
      ctx.answerCbQuery();
      await sendRandomQuote(ctx);
      await ctx.reply("Do you like it? If you want more inspiration, just let me know!",
        Markup.inlineKeyboard([
          Markup.button.callback('Yes, another one!', 'random_quote'),
          Markup.button.callback('I want to choose the category', 'choose_category'),
          Markup.button.callback('No, I need a break', 'quit')
        ])
      );
    });

    bot.action('quit', (ctx: Context) => {
      ctx.answerCbQuery();
      ctx.reply('👋 Goodbye! If you need assistance, just type /start');
    });

    bot.action('random_quote', async (ctx: Context) => {
        await ctx.answerCbQuery();
        await sendRandomQuote(ctx);
        await sendFollowUpMsg(ctx);
    })

    bot.action('choose_author', async (ctx: Context) => {
        await ctx.answerCbQuery();
        await ctx.reply("Please choose the name of the author you want to hear quotes from.", 
            Markup.keyboard([
                ['Albert Einstein', 'Maya Angelou'],
                ['Nelson Mandela', 'Steve Jobs'],
                ['Oprah Winfrey', 'Mark Twain']
            ])
        );
    })
}