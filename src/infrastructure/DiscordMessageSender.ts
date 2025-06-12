import { Message, TextChannel } from "discord.js";
import ISender from "../interfaces/ISender.js"; 

class DiscordMessageSender implements ISender {
  private channel: TextChannel;

  constructor(destinationChannel: TextChannel) {
    this.channel = destinationChannel;
  }

  async sendMessage(content: string, fileUrls: string[] = []): Promise<Message> {
    const options: { content: string; files?: string[] } = { content };
    
    if (fileUrls.length > 0) {
      options.files = fileUrls;
    }

    return await this.channel.send(options);
  }
}

export default DiscordMessageSender;
