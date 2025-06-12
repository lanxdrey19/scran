import { Message } from "discord.js";

export default interface IMessageReactor {
  addReactions(message: Message, emojis: string[]): Promise<void>;
}