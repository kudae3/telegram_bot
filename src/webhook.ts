import { Telegraf } from "telegraf";
import { env } from "./config/env";

export const setupWebhook = (bot: Telegraf) => {
    bot.telegram.setWebhook(`${env.WEBHOOK_URL}/telegram`)
    .then(async() => {
        console.log(`Webhook set to ${env.WEBHOOK_URL}/telegram`)
        const info = await bot.telegram.getWebhookInfo()
        console.log('Current Webhook Info:', info);
    })
    .catch((err: any) => {
        console.error('Error setting webhook:', err)
    });
}