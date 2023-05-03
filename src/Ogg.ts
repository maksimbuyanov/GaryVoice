import axios from 'axios'
import { createWriteStream, unlink } from 'fs'
import { dirname, resolve } from 'path'
// import { fileURLToPath } from "url";
import ffmpeg from 'fluent-ffmpeg'
import installer from '@ffmpeg-installer/ffmpeg'

const rootPath = dirname('./')

class OggConvertor {
  constructor() {
    this.voicesPath = resolve(rootPath, 'voices')
    ffmpeg.setFfmpegPath(installer.path)
  }

  voicesPath: string

  async deleteFile(path: string): Promise<boolean> {
    try {
      return await new Promise(resolve => {
        unlink(path, () => {
          resolve(true)
        })
      })
    } catch (e: any) {
      console.log('Error while delete ogg ' + JSON.stringify(e))
      return await Promise.resolve(false)
    }
  }

  async create(url: string, fileName: string): Promise<string> {
    try {
      const oggPath = this.voicesPath + `/${fileName}.ogg`
      const response = await axios.get(url, {
        method: 'GET',
        responseType: 'stream',
      })
      return await new Promise((resolve, reject) => {
        const stream = createWriteStream(oggPath)
        response.data.pipe(stream)
        stream.on('finish', () => {
          resolve(oggPath)
        })
      })
    } catch (e: any) {
      console.log('Error while create ogg ' + JSON.stringify(e))
      throw new Error('Error while create ogg')
    }
  }

  async toMp3(filePath: string, fileName: string): Promise<string> {
    try {
      const outputPath = this.voicesPath + `/${fileName}.mp3`
      return await new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .inputOption('-t 30')
          .output(outputPath)
          .on('end', async () => {
            const result = await this.deleteFile(filePath)
            if (result) {
              resolve(outputPath)
            }
          })
          .on('error', error => {
            reject(error.message)
          })
          .run()
      })
    } catch (e: any) {
      console.log('Error while create ogg ' + JSON.stringify(e))

      throw new Error('Error while create ogg')
    }
  }
}

export const ogg = new OggConvertor()
