import process from 'process'
import { message } from 'telegraf/filters'
import { bot } from './Bot.js'
import { onTextMessage, startFn } from './actions/index.js'
import { ogg } from './Ogg.js'
import { openai } from './Openai.js'

bot.on(message('text'), async ctx => {
  const text = ctx.message.text
  // ctx.reply(`мне показалось ты сказал ${text}?`);
})

bot.on(message('voice'), async ctx => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = ctx.message.message_id.toString()
    await ctx.reply('Начинаю обработку', { disable_notification: true })
    const oggPath = await ogg.create(link.href, userId)
    const mp3Path = await ogg.toMp3(oggPath, userId)
    const transctiptedText = await openai.transcription(mp3Path)
    await ctx.reply(transctiptedText)
  } catch (e: any) {
    console.log('Error while voice message ' + JSON.stringify(e))
  }
})

bot.command('start', startFn)

await bot.launch()

process.once('SIGINT', () => {
  bot.stop('SIGINT')
})
process.once('SIGTERM', () => {
  bot.stop('SIGTERM')
})
