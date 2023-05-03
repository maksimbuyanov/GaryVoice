import { type Context } from 'telegraf'
import { message } from 'telegraf/filters'

export const onTextMessage = async (ctx: Context): Promise<void> => {
  if (ctx.has(message('text'))) {
    const message1 = JSON.stringify(ctx.message)
    await ctx.reply('мне показалось ты сказал ' + message1 + '?')
  }
}
