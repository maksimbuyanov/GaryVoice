import {Context} from 'telegraf';

export const startFn = async (ctx: Context) => {
    await ctx.reply('hello, ' + ctx.from?.first_name)
}
