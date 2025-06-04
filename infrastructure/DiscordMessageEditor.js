class DiscordMessageEditor {
  constructor(message) {
    this.message = message;
  }
  async editMessage(newContent) {
    try {
      await this.message.edit({ content: newContent });
    } catch (err) {
      console.error("Failed to edit message:", err);
    }
  }
}

export default DiscordMessageEditor;
