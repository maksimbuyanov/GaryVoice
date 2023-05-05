import { Configuration, OpenAIApi } from 'openai'
import type { ChatCompletionRequestMessage } from 'openai'
import { createReadStream } from 'fs'
import config from 'config'
import { audio } from './Audio.js'

class Openai {
  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey,
    })
    this.openai = new OpenAIApi(configuration)
  }

  openai: OpenAIApi

  async transcription(filePath: string): Promise<string> {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filePath),
        'whisper-1'
      )

      const isSuccessDeleted = await audio.deleteFile(filePath)
      if (isSuccessDeleted) return response.data.text
      throw new Error('Error while deleted')
    } catch (e: unknown) {
      console.log('Error while transcription ' + JSON.stringify(e))
      throw new Error('error')
    }
  }

  async chat(messages: ChatCompletionRequestMessage[]): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      })
      return response.data.choices[0].message?.content ?? 'Чат не ответил...'
    } catch (e) {
      console.log('Error while chat ' + JSON.stringify(e))
      throw new Error('error')
    }
  }
}

export const openai = new Openai(config.get('OPENAI_KEY'))
