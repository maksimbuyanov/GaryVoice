import { openai } from './Openai.js'
import { type ContextWithSession } from './types.js'

export const onlyText = async (ctx: any): Promise<void> => {
  try {
    const text = ctx.message.text
    ctx.session.messages.push({ role: 'user', content: text })
    const response = await openai.chat(ctx.session.messages)
    ctx.session.messages.push({ role: 'assistant', content: response })
    await ctx.reply(response)
  } catch (e: any) {
    console.log('Error while text message ' + JSON.stringify(e))
  }
}
