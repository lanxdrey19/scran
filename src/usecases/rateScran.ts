import emojiMap from "../constants/emojiMap.js";
import ScranSubmission from "../domain/ScranSubmission.js";
import IRepository from "../interfaces/IRepository.js";
import IEditor from "../interfaces/IEditor.js";

export default async function rateScran(
  messageId: string,
  userId: string,
  emoji: string,
  scranRepo: IRepository,
  editor: IEditor
): Promise<void> {
  const score = emojiMap[emoji];
  if (score === undefined) return;

  const submission: ScranSubmission | undefined = scranRepo.findByMessageId(messageId);
  if (!submission || submission.isExpired()) return;

  submission.score.addOrUpdate(userId, score);
  scranRepo.addOrUpdate(submission);

  const avg = submission.score.calculateScore().toFixed(2);
  const count = submission.score.getNumberOfSubmissions();

  const editedContent =
    `📨 Forwarded from ${submission.sourceMsg.author}:\n` +
    `${submission.sourceMsg.content || "*[no text]*"}\n\n` +
    `⭐ Average Rating: **${avg}** from ${count} rating(s)`;

  await editor.editMessage(editedContent);
}
