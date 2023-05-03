import process from 'process'
import { message } from 'telegraf/filters'
import { code, italic } from 'telegraf/format'
import { bot } from './Bot.js'
import { ogg } from './Ogg.js'
import { openai } from './Openai.js'
import type { ChatCompletionRequestMessage } from 'openai'
import { Context, session } from 'telegraf'

const INITIAL_SESSON: { messages: ChatCompletionRequestMessage[] } = {
  messages: [],
}

const sessionMiddleware = session<{ messages: ChatCompletionRequestMessage[] }>(
  {
    defaultSession: () => INITIAL_SESSON,
  }
)

type arguments = Parameters<typeof sessionMiddleware>

bot.use(sessionMiddleware)

bot.command('new', async (...[ctx]: arguments) => {
  await ctx.reply(JSON.stringify(ctx.session))
  ctx.session = INITIAL_SESSON
  await ctx.reply(italic('Начнем все с чистого листа'))
})
bot.command('start', async (...[ctx]: arguments) => {
  await ctx.reply(JSON.stringify(ctx.session))
  ctx.session = INITIAL_SESSON
  await ctx.reply(italic('Начнем все с чистого листа'))
})

bot.on(message('text'), async ctx => {
  try {
    const text = ctx.message.text
    // @ts-expect-error
    ctx.session.messages.push({ role: 'user', content: text })
    // @ts-expect-error
    const response = await openai.chat(ctx.session.messages)
    // @ts-expect-error
    ctx.session.messages.push({ role: 'assistant', content: response })
    await ctx.reply(response)
  } catch (e: any) {
    console.log('Error while text message ' + JSON.stringify(e))
  }
})

bot.on(message('voice'), async ctx => {
  // @ts-expect-error
  await ctx.reply(JSON.stringify(ctx.session))
  // @ts-expect-error
  ctx.session ??= INITIAL_SESSON
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = ctx.message.message_id.toString()
    await ctx.reply(code('Начинаю обработку'), { disable_notification: true })
    const oggPath = await ogg.create(link.href, userId)
    const mp3Path = await ogg.toMp3(oggPath, userId)
    const transcriptedText = await openai.transcription(mp3Path)
    await ctx.reply(code(`Услышал как:" ${transcriptedText} "`), {
      disable_notification: true,
    })
    // @ts-expect-error
    ctx.session.messages.push({ role: 'user', content: transcriptedText })
    const messages: ChatCompletionRequestMessage[] = [
      { role: 'user', content: transcriptedText },
    ]

    const response = await openai.chat(messages)
    // @ts-expect-error
    ctx.session.messages.push({ role: 'assistant', content: response })
    await ctx.reply(response)
  } catch (e: any) {
    console.log('Error while voice message ' + JSON.stringify(e))
  }
})

await bot.launch()

process.once('SIGINT', () => {
  bot.stop('SIGINT')
})
process.once('SIGTERM', () => {
  bot.stop('SIGTERM')
})
