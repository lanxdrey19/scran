import ScranSubmission from "../domain/ScranSubmission.js";
import emojiMap from "../constants/emojiMap.js";
import IRepository from "../interfaces/IRepository.js";
import ISender from "../interfaces/ISender.js";
import IReactor from "../interfaces/IReactor.js";
import IMessage from "../domain/IMessage.js";

export default async function submitScran(
  sourceMsg: IMessage,
  messageSender: ISender,
  messageReactor: IReactor,
  scranRepo: IRepository
): Promise<void> {
  const imageAttachment = sourceMsg.attachments.find((att) =>
    att.contentType?.startsWith("image/")
  );
  if (!imageAttachment) throw new Error("No image attachment found.");

  const content =
    `📨 Forwarded from ${sourceMsg.author}:\n` +
    `${sourceMsg.content || "*[no text]*"}\n\n` +
    `⭐ Average Rating: **0** from 0 rating(s)`;

  const forwardedMsg = await messageSender.sendMessage(content, [
    imageAttachment.url,
  ]);

  const emojiReactions = Object.keys(emojiMap);
  await messageReactor.addReactions(forwardedMsg, emojiReactions);

  const submission = new ScranSubmission(sourceMsg, forwardedMsg);
  scranRepo.addOrUpdate(submission);
}
