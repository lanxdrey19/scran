const rateScran = require("../usecases/rateScran");
const DiscordMessageEditor = require("../infrastructure/DiscordMessageEditor");

module.exports = async (reaction, user, scranRepo) => {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (err) {
      console.error("Failed to fetch reaction:", err);
      return;
    }
  }

  const editor = new DiscordMessageEditor(reaction.message);

  try {
    await rateScran(
      reaction.message.id,
      user.id,
      reaction.emoji.name,
      scranRepo,
      editor
    );
  } catch (err) {
    console.warn(`Could not rate scran: ${err.message}`);
  }
};
