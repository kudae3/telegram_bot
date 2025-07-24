import { Context, Markup, Telegraf } from "telegraf";

export const smallTalk = (bot: Telegraf) => {
    bot.hears(/hi|hello|hey/i, (ctx) => {
      ctx.reply("👋 Hi there! Would you like a random quote to start?", 
        Markup.inlineKeyboard([
            Markup.button.callback('Yes, please!', 'random_quote'),
            Markup.button.callback('No, thanks', 'quit')
        ])
      );
    });
    
    bot.hears(/thank(s| you)/i, (ctx: Context) => {
      ctx.reply("You're welcome! 😊");
    });
    
    bot.hears(/bye|goodbye/i, (ctx: Context) => {
      ctx.reply("👋 Goodbye! Come back if you need inspiration by typing /start.");
    });
}

