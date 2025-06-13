import IMessage from "../domain/IMessage.js";

export default interface ISender {
  sendMessage(content: string, imageUrls: string[]): Promise<IMessage>;
}