import { italic } from 'telegraf/format'
import { createNewSession } from './Session.js'
import type { ContextWithSession } from './types.js'

export const commandForNew = async (ctx: ContextWithSession): Promise<void> => {
  await ctx.reply(JSON.stringify(ctx.session))
  ctx.session = createNewSession()
  await ctx.reply(italic('Начнем все с чистого листа'))
}

export const commandForStart = async (
  ctx: ContextWithSession
): Promise<void> => {
  await ctx.reply(JSON.stringify(ctx.session))
  ctx.session = createNewSession()
  await ctx.reply(italic('Начнем все с чистого листа'))
}
