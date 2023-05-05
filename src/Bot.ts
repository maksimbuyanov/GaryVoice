import { Telegraf } from 'telegraf'
import config from 'config'
import type { ContextWithSession } from './types.js'

export const bot = new Telegraf<ContextWithSession>(config.get('TOKEN'))
