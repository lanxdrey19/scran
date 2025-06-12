import { Message } from "discord.js";

export default interface IMessageSender {
  sendMessage(content: string, imageUrls: string[]): Promise<Message>;
}