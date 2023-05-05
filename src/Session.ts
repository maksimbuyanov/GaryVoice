import type { ChatCompletionRequestMessage } from 'openai'
import { session } from 'telegraf'

export const INITIAL_SESSION: { messages: ChatCompletionRequestMessage[] } = {
  messages: [],
}
export const sessionMiddleware = session({
  defaultSession: () => INITIAL_SESSION,
})
