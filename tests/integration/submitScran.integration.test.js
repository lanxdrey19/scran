import submitScran from "../../usecases/submitScran.js";
import InMemoryScranSubmissionRepository from "../../infrastructure/InMemoryScranSubmissionRepository.js";
import ScranSubmission from "../../domain/ScranSubmission.js";
import emojiMap from "../../constants/emojiMap.js";

describe("submitScran", () => {
  let scranRepo;
  let messageSender;
  let messageReactor;
  let sourceMsg;

  beforeEach(() => {
    scranRepo = new InMemoryScranSubmissionRepository();

    messageSender = {
      sendMessage: vi.fn().mockResolvedValue({
        id: "456",
        edit: vi.fn(),
      }),
    };

    messageReactor = {
      addReactions: vi.fn().mockResolvedValue(undefined),
    };

    sourceMsg = {
      id: "123",
      author: "TestUser",
      content: "Delicious scran!",
      attachments: [
        {
          url: "http://example.com/image.jpg",
          contentType: "image/jpeg",
        },
      ],
    };
  });

  it("should save submission and add reactions", async () => {
    await submitScran(sourceMsg, messageSender, messageReactor, scranRepo);

    const submissions = scranRepo.getAll();
    expect(submissions.length).toBe(1);
    expect(submissions[0]).toBeInstanceOf(ScranSubmission);
    expect(submissions[0].sourceMsg.id).toBe("123");
    expect(messageSender.sendMessage).toHaveBeenCalledWith(
      expect.stringContaining("⭐ Average Rating"),
      ["http://example.com/image.jpg"]
    );
    expect(messageReactor.addReactions).toHaveBeenCalledWith(
      expect.objectContaining({ id: "456" }),
      Object.keys(emojiMap)
    );
  });

  it("should throw if no image attachment is present", async () => {
    sourceMsg.attachments = [];

    await expect(() =>
      submitScran(sourceMsg, messageSender, messageReactor, scranRepo)
    ).rejects.toThrow("No image attachment found.");

    expect(scranRepo.getAll()).toHaveLength(0);
    expect(messageSender.sendMessage).not.toHaveBeenCalled();
    expect(messageReactor.addReactions).not.toHaveBeenCalled();
  });
});
