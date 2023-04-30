import axios from "axios";
import { createWriteStream, unlink } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";

const rootPath = dirname("./");

class OggConvertor {
  constructor() {
    this.voicesPath = resolve(rootPath, "voices");
    ffmpeg.setFfmpegPath(installer.path);
  }

  voicesPath: string;

  deleteFile(path: string):Promise<boolean> {
    try {
      return new Promise((res) => {
        unlink(path, () => res(true));
      });
    } catch (e: any) {
      if ("message" in e) {
        console.log("Error while delete ogg " + e.message);
      } else {
        console.log("Error while delete ogg " + JSON.stringify(e));
      }
      return Promise.resolve(false)
    }
  }

  async create(url: string, fileName: string): Promise<string> {
    try {
      const oggPath = this.voicesPath + `/${fileName}.ogg`;
      const response = await axios.get(url, {
        method: "GET",
        responseType: "stream",
      });
      return new Promise((resolve, reject) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on("finish", () => resolve(oggPath));
      });
    } catch (e: any) {
      if ("message" in e) {
        console.log("Error while create ogg " + e.message);
      } else {
        console.log("Error while create ogg " + JSON.stringify(e));
      }
      throw new Error("Error while create ogg");
    }
  }

  toMp3(filePath: string, fileName: string): Promise<string> {
    try {
      const outputPath = this.voicesPath + `/${fileName}.mp3`;
      return new Promise(async (resolve, reject) => {
        ffmpeg(filePath)
          .inputOption("-t 30")
          .output(outputPath)
          .on("end", async () => {
            const result = await this.deleteFile(filePath);
            if (result) {
              resolve(outputPath);
            }
          })
          .on("error", (error) => reject(error.message))
          .run();
      });
    } catch (e: any) {
      if ("message" in e) {
        console.log("Error while create ogg " + e.message);
      } else {
        console.log("Error while create ogg " + JSON.stringify(e));
      }
      throw new Error("Error while create ogg");
    }
  }
}

export const ogg = new OggConvertor();
