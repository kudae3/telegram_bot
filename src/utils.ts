import axios from "axios";
import { Context, Markup } from "telegraf";
import { env } from "../config/env.ts";

export const sendRandomQuote = async (ctx: Context) => {
    try {
        const url = `${env.INSPIRE_API}/quotes/random`;
        const response = await axios.get(url);
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
      Markup.button.callback('Choose author', 'choose_author'),
      Markup.button.callback('No, I need a break', 'quit')
    ])
  );
}

export const fetchAuthors = async () => {
    try {
        const response = await axios.get(`${env.INSPIRE_API}/authors`);
        const authors = response.data.results;
        return authors;
    } catch (error) {
        console.log('Error fetching authors:', error);
        return [];
    }
}

export const fetchQuoteByAuthor = async(author: string) => {
   try {
        const url = `${env.INSPIRE_API}/quotes?author=${encodeURIComponent(author)}`;
        const response = await axios.get(url);
        const quotes = response.data.results;
        if (quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            return quotes[randomIndex];
        } else {
            return null;
        }
    } catch (error) {
        console.log(`Error fetching quotes by ${author}:`, error);
        return [];
    }
}