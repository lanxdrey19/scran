import IAttachment from "./IAttachment.js";

export default interface IMessage {
  id: string;
  content: string;
  author: string;
  attachments: IAttachment[];
  react(emoji: string): Promise<void>;
}