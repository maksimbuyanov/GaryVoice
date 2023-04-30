import process from "process";
import { message } from "telegraf/filters";
import { bot } from "./Bot";
import { onTextMessage, startFn } from "./actions";
import {ogg} from './Ogg'
import {openai} from './Openai'

bot.on(message("text"), async (ctx) => {
  const text = ctx.message.text;
  // ctx.reply(`мне показалось ты сказал ${text}?`);
});

bot.on(message("voice"), async (ctx) => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = ctx.message.from.id.toString();
    const oggPath = await ogg.create(link.href, userId)
    const mp3Path = await ogg.toMp3(oggPath,userId)
    const transctiptedText = await openai.transcription(mp3Path)
    ctx.reply(transctiptedText)
  } catch (e: any) {
    if ("message" in e) {
      console.log("Error while voice message " + e.message);
    } else {
      console.log("Error while voice message " + JSON.stringify(e));
    }
  }
});

bot.command("start", startFn);

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
