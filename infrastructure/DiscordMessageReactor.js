class DiscordMessageReactor {
  async addReactions(message, emojis) {
    for (const emoji of emojis) {
      try {
        await message.react(emoji);
      } catch (err) {
        console.warn(`Failed to react with ${emoji}:`, err.message);
      }
    }
  }
}

module.exports = DiscordMessageReactor;
