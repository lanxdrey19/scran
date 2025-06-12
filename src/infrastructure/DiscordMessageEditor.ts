import IEditor from "../interfaces/IEditor.js"; 
import { Message, PartialMessage } from "discord.js"; 

class DiscordMessageEditor implements IEditor {
  private message: PartialMessage | Message<boolean>;

  constructor(message: PartialMessage | Message<boolean>) {
    this.message = message;
  }

  async editMessage(newContent: string): Promise<void> {
    try {
      await this.message.edit({ content: newContent });
    } catch (err) {
      console.error("Failed to edit message:", err);
    }
  }
}

export default DiscordMessageEditor;
