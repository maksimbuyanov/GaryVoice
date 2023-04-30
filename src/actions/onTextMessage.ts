import { Context } from "telegraf";
import { message } from "telegraf/filters";

export const onTextMessage = async (ctx: Context)=> {
    if (ctx.has(message('text'))) {
        const message1 = JSON.stringify(ctx.message)
        ctx.reply('мне показалось ты сказал '+ message1 + "?")
    }

}
