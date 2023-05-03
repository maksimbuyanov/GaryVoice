import { Configuration, OpenAIApi } from 'openai'
import { createReadStream } from 'fs'
import config from 'config'
import { ogg } from './Ogg.js'

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

      const isSuccessDeleted = await ogg.deleteFile(filePath)
      if (isSuccessDeleted) return response.data.text
      throw new Error('Error while deleted')
    } catch (e: unknown) {
      console.log('Error while transcription ' + JSON.stringify(e))

      throw new Error('error')
    }
  }
}

export const openai = new Openai(config.get('OPENAI_KEY'))
