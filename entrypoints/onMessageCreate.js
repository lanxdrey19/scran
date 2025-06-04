const submitScran = require("../usecases/submitScran");
const DiscordMessageSender = require("../infrastructure/DiscordMessageSender");
const DiscordMessageReactor = require("../infrastructure/DiscordMessageReactor");

module.exports = async function onMessageCreate(
  message,
  scranRepo,
  destinationChannel
) {
  if (message.author.bot) return;

  const hasImage = message.attachments.some((att) =>
    att.contentType?.startsWith("image/")
  );
  if (!hasImage) return;

  const allowedChannelId = process.env.SCRAN_SOURCE_CHANNEL_ID;
  if (message.channel.id !== allowedChannelId) return;

  const messageSender = new DiscordMessageSender(destinationChannel);
  const messageReactor = new DiscordMessageReactor();

  try {
    await submitScran(message, messageSender, messageReactor, scranRepo);
  } catch (err) {
    console.error("Failed to submit scran:", err);
    await message.reply("Failed to submit image for rating.");
  }
};
