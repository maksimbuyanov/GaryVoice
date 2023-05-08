import type { Context } from 'telegraf'
import type { ChatCompletionRequestMessage } from 'openai'

export interface Session {
  messages: ChatCompletionRequestMessage[]
}

export interface ContextWithSession extends Context {
  session: Session
}
