const ScranSubmission = require("../domain/ScranSubmission");
const InMemoryScranSubmissionRepository = require("../infrastructure/InMemoryScranSubmissionRepository");
const emojiMap = require("../constants/emojiMap");

async function submitScran(
  sourceMsg,
  messageSender,
  messageReactor,
  scranRepo = InMemoryScranSubmissionRepository.getInstance()
) {
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

module.exports = submitScran;
