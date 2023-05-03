import { type Context } from 'telegraf'

export const startFn = async (ctx: Context): Promise<void> => {
  await ctx.reply(`hello, ${ctx.from?.first_name ?? 'unknown'}`)
}
