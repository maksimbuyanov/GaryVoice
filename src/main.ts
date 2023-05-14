import process from 'process'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'
import { bot } from './Bot.js'
import { audio } from './Audio.js'
import { openai } from './Openai.js'
import type { ChatCompletionRequestMessage } from 'openai'
import { sessionMiddleware } from './Session.js'
import { commandForNew, commandForStart } from './Command.js'

bot.use(sessionMiddleware)

bot.command('new', commandForNew)
bot.command('start', commandForStart)

bot.on(message('text'), async ctx => {
  try {
    const text = ctx.message.text
    const { message_id } = await ctx.reply(code('Начинаю обработку'), {
      disable_notification: true,
    })
    ctx.session.messages.push({ role: 'user', content: text })
    const response = await openai.chat(ctx.session.messages)

    ctx.session.messages.push({ role: 'assistant', content: response })
    await ctx.deleteMessage(message_id)

    await ctx.reply(response)
  } catch (e: any) {
    console.log('Error while text message ' + JSON.stringify(e))
    await ctx.reply(code(`Ошибка :(`), {
      disable_notification: true,
    })
  }
})

bot.on(message('voice', 'forward_from'), async ctx => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const messageId = ctx.message.message_id.toString()
    const { message_id } = await ctx.reply(code('Начинаю обработку'), {
      disable_notification: true,
    })

    const oggPath = await audio.create(link.href, messageId)
    const mp3Path = await audio.toMp3(oggPath, messageId)
    const transcriptedText = await openai.transcription(mp3Path)
    await ctx.deleteMessage(message_id)
    await ctx.reply(code(`Я разобрал:" ${transcriptedText} "`), {
      disable_notification: true,
    })
  } catch (e: any) {
    console.log('Error while voice message ' + JSON.stringify(e))
  }
})

bot.on(message('voice'), async ctx => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = ctx.message.message_id.toString()
    const { message_id } = await ctx.reply(code('Начинаю обработку'), {
      disable_notification: true,
    })

    const oggPath = await audio.create(link.href, userId)
    const mp3Path = await audio.toMp3(oggPath, userId)
    const transcriptedText = await openai.transcription(mp3Path)
    await ctx.deleteMessage(message_id)
    await ctx.reply(code(`Услышал как:" ${transcriptedText} "`), {
      disable_notification: true,
    })

    const messages: ChatCompletionRequestMessage[] = [
      { role: 'user', content: transcriptedText },
    ]
    ctx.session.messages.push(messages[0])
    const response = await openai.chat(messages)
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
