import { describe, it, expect, vi, beforeEach } from "vitest";
import rateScran from "../../src/usecases/rateScran";
import InMemoryScranSubmissionRepository from "../../src/infrastructure/InMemoryScranSubmissionRepository";
import ScranSubmission from "../../src/domain/ScranSubmission";

const createMockEditor = () => ({
  editMessage: vi.fn().mockResolvedValue(undefined),
});

describe("rateScran integration", () => {
  let scranRepo, submission, editor;

  beforeEach(() => {
    scranRepo = new InMemoryScranSubmissionRepository();
    editor = createMockEditor();

    const sourceMsg = {
      author: "AuthorName",
      content: "Yum",
    };

    const destMsg = {
      id: "123",
      edit: vi.fn(),
    };

    submission = new ScranSubmission(sourceMsg, destMsg, Date.now() + 60000);
    scranRepo.add(submission);
  });

  it("should update score, calculate average, and edit message", async () => {
    await rateScran("123", "user1", "5️⃣", scranRepo, editor);

    const updated = scranRepo.findByMessageId("123");
    expect(updated.score.getNumberOfSubmissions()).toBe(1);
    expect(updated.score.calculateScore()).toBe(5);

    expect(editor.editMessage).toHaveBeenCalledWith(
      expect.stringContaining("⭐ Average Rating: **5.00** from 1 rating(s)")
    );
  });

  it("should do nothing for expired submission", async () => {
    submission.expiresAt = Date.now() - 1000;
    scranRepo.addOrUpdate(submission);

    await rateScran("123", "user1", "4️⃣", scranRepo, editor);

    expect(editor.editMessage).not.toHaveBeenCalled();
    expect(submission.score.getNumberOfSubmissions()).toBe(0);
  });

  it("should correctly average multiple ratings from different users", async () => {
    await rateScran("123", "user1", "4️⃣", scranRepo, editor);
    await rateScran("123", "user2", "6️⃣", scranRepo, editor);

    const updated = scranRepo.findByMessageId("123");
    expect(updated.score.getNumberOfSubmissions()).toBe(2);
    expect(updated.score.calculateScore()).toBe(5);

    expect(editor.editMessage).toHaveBeenLastCalledWith(
      expect.stringContaining("⭐ Average Rating: **5.00** from 2 rating(s)")
    );
  });

  it("should update the user's rating if they rate again", async () => {
    await rateScran("123", "user1", "4️⃣", scranRepo, editor);
    await rateScran("123", "user1", "7️⃣", scranRepo, editor);

    const updated = scranRepo.findByMessageId("123");
    expect(updated.score.getNumberOfSubmissions()).toBe(1);
    expect(updated.score.calculateScore()).toBe(7);

    expect(editor.editMessage).toHaveBeenLastCalledWith(
      expect.stringContaining("⭐ Average Rating: **7.00** from 1 rating(s)")
    );
  });

  it("should not update score if submission is expired", async () => {
    submission.expiresAt = Date.now() - 1000;
    scranRepo.addOrUpdate(submission);

    await rateScran("123", "user1", "5️⃣", scranRepo, editor);

    expect(submission.score.getNumberOfSubmissions()).toBe(0);
    expect(editor.editMessage).not.toHaveBeenCalled();
  });

  it("should ignore reactions with unknown emojis", async () => {
    await rateScran("123", "user1", "🍕", scranRepo, editor);

    const updated = scranRepo.findByMessageId("123");
    expect(updated.score.getNumberOfSubmissions()).toBe(0);
    expect(editor.editMessage).not.toHaveBeenCalled();
  });
});
