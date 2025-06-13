import { Message, TextChannel } from "discord.js";
import ISender from "../interfaces/ISender.js"; 
import IMessage from "../domain/IMessage.js";
import DiscordMessageAdaptor from "./DiscordMessageAdaptor.js";


export default class DiscordMessageSender implements ISender {
  private channel: TextChannel;

  constructor(destinationChannel: TextChannel) {
    this.channel = destinationChannel;
  }

  async sendMessage(content: string, fileUrls: string[] = []): Promise<IMessage> {
    const options: { content: string; files?: string[] } = { content };
    
    if (fileUrls.length > 0) {
      options.files = fileUrls;
    }
    const sentMessage: Message = await this.channel.send(options);
    return new DiscordMessageAdaptor(sentMessage);
  }
}

