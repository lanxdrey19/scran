import { Message } from "discord.js";
import IMessageReactor from "../interfaces/IReactor.js"; 

class DiscordMessageReactor implements IMessageReactor {
  async addReactions(message: Message, emojis: string[]): Promise<void> {
    for (const emoji of emojis) {
      try {
        await message.react(emoji);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.warn(`Failed to react with ${emoji}:`, err.message);
        } else {
          console.warn(`Failed to react with ${emoji}: Unknown error`, err);
        }
      }
    }
  }
}

export default DiscordMessageReactor;
