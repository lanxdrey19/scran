import IReactor from "../interfaces/IReactor.js"; 
import IMessage from "../domain/IMessage.js";
import logger from "../logger.js";

class DiscordMessageReactor implements IReactor {
  async addReactions(message: IMessage, emojis: string[]): Promise<void> {
    for (const emoji of emojis) {
      try {
        await message.react(emoji);
      } catch (err: unknown) {
        if (err instanceof Error) {
          logger.error(`Failed to react with ${emoji}:`, err.message);
        } else {
          logger.error(`Failed to react with ${emoji}: Unknown error`, err);
        }
      }
    }
  }
}

export default DiscordMessageReactor;
