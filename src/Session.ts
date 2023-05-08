import { session } from 'telegraf'
import type { Session } from 'src/types.js'

export const createNewSession = (): Session => {
  return {
    messages: [],
  }
}

export const sessionMiddleware = session({
  defaultSession: createNewSession,
})
