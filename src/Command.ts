import { italic } from 'telegraf/format'
import { INITIAL_SESSION } from './Session.js'
import type { ContextWithSession } from './types.js'

export const commandForNew = async (ctx: ContextWithSession): Promise<void> => {
  await ctx.reply(JSON.stringify(ctx.session))
  ctx.session = INITIAL_SESSION
  await ctx.reply(italic('Начнем все с чистого листа'))
}

export const commandForStart = async (
  ctx: ContextWithSession
): Promise<void> => {
  await ctx.reply(JSON.stringify(ctx.session))
  ctx.session = INITIAL_SESSION
  await ctx.reply(italic('Начнем все с чистого листа'))
}
