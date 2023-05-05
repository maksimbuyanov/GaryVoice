import type { Context } from 'telegraf'
import type { ChatCompletionRequestMessage } from 'openai'

export interface ContextWithSession extends Context {
  session: { messages: ChatCompletionRequestMessage[] }
}
