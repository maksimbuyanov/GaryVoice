import { Configuration, OpenAIApi } from "openai";
import { createReadStream } from "fs";
import config from "config";
import { unlink } from "fs";
import { ogg } from "./Ogg";

class Openai {
  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  openai: OpenAIApi;

  async transcription(filePath: string): Promise<string> {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filePath),
        "whisper-1"
      );

      const isSuccessDeleted = await ogg.deleteFile(filePath);
      if (isSuccessDeleted) return response.data.text;
      throw new Error("Error while deleted");
    } catch (e: any) {
      if ("message" in e) {
        console.log("Error while transctiption " + e.message);
      } else {
        console.log("Error while transctiption " + JSON.stringify(e));
      }
      throw new Error(e.message);
    }
  }
}

export const openai = new Openai(config.get("OPENAI_KEY"));
