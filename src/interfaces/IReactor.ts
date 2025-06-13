import IMessage from "../domain/IMessage.js";

export default interface IReactor {
  addReactions(message: IMessage, emojis: string[]): Promise<void>;
}