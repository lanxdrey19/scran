import { Message } from "discord.js";
import IMessage from "../domain/IMessage.js";
import IAttachment from "../domain/IAttachment.js";
import DiscordAttachmentAdaptor from "./DiscordAttachmentAdaptor.js";


export default class DiscordMessageAdapter implements IMessage {
  private message: Message;

  constructor(message: Message) {
    this.message = message;
  }

  get id(): string {
    return this.message.id;
  }

  get content(): string {
    return this.message.content;
  }

  get author(): string {
    return this.message.author.username;
  }

  get attachments(): IAttachment[] {
    return this.message.attachments.map(
      (attachment) => new DiscordAttachmentAdaptor(attachment)
    );
  }

  async react(emoji: string): Promise<void> {
    await this.message.react(emoji);
  }
}

export function toIMessage(message: Message): IMessage {
  return new DiscordMessageAdapter(message);
}