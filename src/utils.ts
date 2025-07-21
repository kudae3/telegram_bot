import axios from "axios";
import { Context } from "telegraf";



export const sendRandomQuote = async (ctx: Context) => {
    const ZENQUOTE_API = process.env.ZENQUOTE_API as string;
    try {
        const response = await axios.get(ZENQUOTE_API);
        console.log('Random Quote fetched:', response.data);
        const quote = response.data[0].q;
        const author = response.data[0].a;
        await ctx.reply(`💬 "${quote}" - ${author}`);
    } catch (error) {
        console.error('Error fetching quote:', error);
        ctx.reply('Sorry, I could not fetch a quote at the moment.');
    }
}

export const sendTodayQuote = async(ctx: Context) => {
  const TODAY_ZENQUOTE_API = process.env.TODAY_ZENQUOTE_API as string;
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
}