import process from "process";
import { bot } from "./Bot";
import { startFn } from "./actions/start";

bot.command("start", startFn);

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
