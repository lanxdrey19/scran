import { MessageReaction, PartialMessageReaction, User, PartialUser } from "discord.js";
import rateScran from "../usecases/rateScran.js";
import DiscordMessageEditor from "../infrastructure/DiscordMessageEditor.js";
import IScranRepo from "../interfaces/IRepository.js"; 
import logger from "../logger.js";

export default async function onReactionAdd(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  scranRepo: IScranRepo
): Promise<void> {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (err: unknown) {
      logger.error("Failed to fetch reaction:", err);
      return;
    }
  }

  const editor = new DiscordMessageEditor(reaction.message);

  try {
    await rateScran(
      reaction.message.id,
      user.id,
      reaction.emoji.name ?? "",
      scranRepo,
      editor
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`Could not rate scran: ${err.message}`);
    } else {
      logger.error("Could not rate scran due to unknown error.");
    }
  }
}
