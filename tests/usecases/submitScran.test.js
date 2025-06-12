import { describe, it, expect, vi } from "vitest";
import submitScran from "../../src/usecases/submitScran";
import ScranSubmission from "../../src/domain/ScranSubmission";
import emojiMap from "../../src/constants/emojiMap";

describe("submitScran", () => {
  const createMockSourceMsg = () => ({
    content: "Look at this scran",
    author: "User#1234",
    attachments: [
      {
        url: "http://example.com/scran.jpg",
        contentType: "image/jpeg",
      },
    ],
  });

  it("throws an error if no image attachment is found", async () => {
    const sourceMsg = {
      content: "No image",
      author: "User#5678",
      attachments: [],
    };

    const messageSender = { sendMessage: vi.fn() };
    const messageReactor = { addReactions: vi.fn() };
    const scranRepo = { addOrUpdate: vi.fn() };

    await expect(
      submitScran(sourceMsg, messageSender, messageReactor, scranRepo)
    ).rejects.toThrow("No image attachment found.");
  });

  it("forwards a message and adds reactions and saves submission", async () => {
    const sourceMsg = createMockSourceMsg();
    const mockForwardedMessage = { id: "forwarded123" };

    const messageSender = {
      sendMessage: vi.fn().mockResolvedValue(mockForwardedMessage),
    };

    const messageReactor = {
      addReactions: vi.fn().mockResolvedValue(undefined),
    };

    const scranRepo = {
      addOrUpdate: vi.fn(),
    };

    await submitScran(sourceMsg, messageSender, messageReactor, scranRepo);

    expect(messageSender.sendMessage).toHaveBeenCalledWith(
      expect.stringContaining("📨 Forwarded from"),
      ["http://example.com/scran.jpg"]
    );

    expect(messageReactor.addReactions).toHaveBeenCalledWith(
      mockForwardedMessage,
      Object.keys(emojiMap)
    );

    expect(scranRepo.addOrUpdate).toHaveBeenCalled();
    const submission = scranRepo.addOrUpdate.mock.calls[0][0];
    expect(submission).toBeInstanceOf(ScranSubmission);
    expect(submission.sourceMsg).toEqual(sourceMsg);
    expect(submission.destMsg).toEqual(mockForwardedMessage);
  });
});
