import submitScran from "../../src/usecases/submitScran";
import rateScran from "../../src/usecases/rateScran";
import expireOldSubmissions from "../../src/usecases/expireOldSubmissions";
import InMemoryScranSubmissionRepository from "../../src/infrastructure/InMemoryScranSubmissionRepository";

describe("Full Discord lifecycle integration", () => {
  let scranRepo;
  let messageSender;
  let messageReactor;
  let editor;
  let forwardedMsg;

  beforeEach(() => {
    scranRepo = new InMemoryScranSubmissionRepository();

    forwardedMsg = {
      id: "dest-msg-id",
      edit: vi.fn(),
    };

    messageSender = {
      sendMessage: vi.fn().mockResolvedValue(forwardedMsg),
    };

    messageReactor = {
      addReactions: vi.fn().mockResolvedValue(undefined),
    };

    editor = {
      editMessage: vi.fn(),
    };
  });

  it("submits, rates, and expires scran submission end-to-end", async () => {
    const sourceMsg = {
      id: "src-id",
      author: "UserA",
      content: "Test scran!",
      attachments: [
        {
          url: "http://example.com/image.jpg",
          contentType: "image/jpeg",
        },
      ],
    };

    await submitScran(sourceMsg, messageSender, messageReactor, scranRepo);

    await rateScran("dest-msg-id", "user1", "5️⃣", scranRepo, editor);
    await rateScran("dest-msg-id", "user2", "9️⃣", scranRepo, editor);

    const sub = scranRepo.findByMessageId("dest-msg-id");
    expect(sub).toBeDefined();
    expect(sub.score.getNumberOfSubmissions()).toBe(2);

    sub.expiresAt = Date.now() - 1000;

    expireOldSubmissions(scranRepo);

    expect(scranRepo.findByMessageId("dest-msg-id")).toBeUndefined();
  });

  it("updates a user's rating when they rate again", async () => {
    const sourceMsg = {
      id: "src-id-2",
      author: "UserA",
      content: "Yum!",
      attachments: [
        { url: "http://example.com/pie.jpg", contentType: "image/png" },
      ],
    };

    await submitScran(sourceMsg, messageSender, messageReactor, scranRepo);

    await rateScran("dest-msg-id", "user1", "4️⃣", scranRepo, editor);
    await rateScran("dest-msg-id", "user1", "8️⃣", scranRepo, editor);

    const sub = scranRepo.findByMessageId("dest-msg-id");
    expect(sub.score.getNumberOfSubmissions()).toBe(1);
    expect(sub.score.calculateScore()).toBe(8);
  });

  it("ignores rating for an expired submission", async () => {
    const sourceMsg = {
      id: "src-id-3",
      author: "UserB",
      content: "Old meal",
      attachments: [
        { url: "http://example.com/old.jpg", contentType: "image/jpeg" },
      ],
    };

    await submitScran(sourceMsg, messageSender, messageReactor, scranRepo);

    const sub = scranRepo.findByMessageId("dest-msg-id");
    sub.expiresAt = Date.now() - 10000;

    await rateScran("dest-msg-id", "user1", "6️⃣", scranRepo, editor);

    expect(sub.score.getNumberOfSubmissions()).toBe(0);
  });

  it("ignores emoji not in emojiMap", async () => {
    const sourceMsg = {
      id: "src-id-4",
      author: "UserC",
      content: "Fish curry",
      attachments: [
        { url: "http://example.com/fish.jpg", contentType: "image/jpeg" },
      ],
    };

    await submitScran(sourceMsg, messageSender, messageReactor, scranRepo);

    await rateScran("dest-msg-id", "userX", "🍕", scranRepo, editor);

    const sub = scranRepo.findByMessageId("dest-msg-id");
    expect(sub.score.getNumberOfSubmissions()).toBe(0);
  });
});
