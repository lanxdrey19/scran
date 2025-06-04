const emojiMap = require("../constants/emojiMap");

module.exports = async function rateScran(
  messageId,
  userId,
  emoji,
  scranRepo,
  editor
) {
  const score = emojiMap[emoji];
  if (score === undefined) return;

  const submission = scranRepo.findByMessageId(messageId);
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
};
