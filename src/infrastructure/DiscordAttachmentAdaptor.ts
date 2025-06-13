import { Attachment } from "discord.js";
import IAttachment from "../domain//IAttachment.js";

export default class DiscordAttachmentAdaptor implements IAttachment {
  url: string;
  contentType?: string;

  constructor(attachment: Attachment) {
    this.url = attachment.url;
    this.contentType = attachment.contentType || undefined;
  }
}

export function toIAttachment(attachment: Attachment): IAttachment {
  return new DiscordAttachmentAdaptor(attachment);
}