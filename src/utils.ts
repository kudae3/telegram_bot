import axios from "axios";
import { Context, Markup } from "telegraf";
import { env } from "../config/env.ts";

export const sendRandomQuote = async (ctx: Context) => {
    try {
        const url = `${env.INSPIRE_API}/quotes/random`;
        const response = await axios.get(url);
        console.log('Random Quote fetched:', response.data);
        const quote = await response.data[0].content;
        const author = await response.data[0].author;
        await ctx.reply(`💬 "${quote}" - ${author}`);
    } catch (error) {
        console.log('Error fetching quote:', error);
        ctx.reply('Sorry, I could not fetch a quote at the moment.');
    }
}

export const sendFollowUpMsg = async (ctx: Context) => {
    await ctx.reply("Do you like it? If you want more inspiration, just let me know!",
    Markup.inlineKeyboard([
      Markup.button.callback('Yes, another one!', 'random_quote'),
      Markup.button.callback('I want to choose the author', 'choose_author'),
      Markup.button.callback('No, I need a break', 'quit')
    ])
  );
}