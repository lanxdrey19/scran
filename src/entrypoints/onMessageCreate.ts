import { Message, TextChannel } from "discord.js";
import submitScran from "../usecases/submitScran.js";
import DiscordMessageSender from "../infrastructure/DiscordMessageSender.js";
import DiscordMessageReactor from "../infrastructure/DiscordMessageReactor.js";
import IScranRepo from "../interfaces/IRepository.js"; 
import { toIMessage } from "../infrastructure/DiscordMessageAdaptor.js";
import logger from "../logger.js";


export default async function onMessageCreate(
  message: Message,
  scranRepo: IScranRepo,
  destinationChannel: TextChannel
): Promise<void> {
  if (message.author.bot) return;

  const hasImage = message.attachments.some((att) =>
    att.contentType?.startsWith("image/")
  );
  if (!hasImage) return;

  const oversizedImages = message.attachments.filter((att) => att.size > parseInt(process.env.MAX_IMAGE_SIZE_BYTES ??  "10485760", 10));
  if (oversizedImages.size > 0) {
    await message.reply("❌ One or more images are too large. Please upload images under 10 MB.");
    return;
  }

  const allowedChannelId = process.env.SCRAN_SOURCE_CHANNEL_ID;
  if (!allowedChannelId || message.channel.id !== allowedChannelId) return;

  const messageSender = new DiscordMessageSender(destinationChannel);
  const messageReactor = new DiscordMessageReactor();

  try {
    await submitScran(toIMessage(message), messageSender, messageReactor, scranRepo);
  } catch (err: unknown) {
    logger.error("Failed to submit scran:", err);
    await message.reply("Failed to submit image for rating.");
  }
}
