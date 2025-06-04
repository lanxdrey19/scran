import submitScran from "../usecases/submitScran.js";
import DiscordMessageSender from "../infrastructure/DiscordMessageSender.js";
import DiscordMessageReactor from "../infrastructure/DiscordMessageReactor.js";

export default async function onMessageCreate(
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
}
