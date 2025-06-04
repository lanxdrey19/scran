import { describe, it, expect, vi, beforeEach } from "vitest";
import rateScran from "../../usecases/rateScran.js";
import ScranScore from "../../domain/ScranScore.js";

describe("rateScran", () => {
  let scranRepo;
  let editor;

  const baseSubmission = () => ({
    sourceMsg: { author: "User#1234", content: "Yum!" },
    destMsg: { id: "msg123" },
    score: new ScranScore(),
    isExpired: () => false,
  });

  beforeEach(() => {
    scranRepo = {
      findByMessageId: vi.fn(),
      addOrUpdate: vi.fn(),
    };

    editor = {
      editMessage: vi.fn(),
    };
  });

  it("does nothing if emoji is not recognized", async () => {
    await rateScran("msg123", "user1", "🍕", scranRepo, editor);
    expect(scranRepo.findByMessageId).not.toHaveBeenCalled();
    expect(editor.editMessage).not.toHaveBeenCalled();
  });

  it("does nothing if submission is not found", async () => {
    scranRepo.findByMessageId.mockReturnValue(undefined);

    await rateScran("msg123", "user1", "1️⃣", scranRepo, editor);

    expect(editor.editMessage).not.toHaveBeenCalled();
  });

  it("does nothing if submission is expired", async () => {
    const expiredSub = baseSubmission();
    expiredSub.isExpired = () => true;
    scranRepo.findByMessageId.mockReturnValue(expiredSub);

    await rateScran("msg123", "user1", "1️⃣", scranRepo, editor);

    expect(editor.editMessage).not.toHaveBeenCalled();
  });

  it("updates score and calls editor when valid", async () => {
    const validSub = baseSubmission();
    scranRepo.findByMessageId.mockReturnValue(validSub);

    await rateScran("msg123", "user1", "2️⃣", scranRepo, editor);

    expect(validSub.score.getNumberOfSubmissions()).toBe(1);
    expect(validSub.score.calculateScore()).toBe(2);
    expect(editor.editMessage).toHaveBeenCalledWith(
      expect.stringContaining("⭐ Average Rating: **2.00** from 1 rating(s)")
    );
    expect(scranRepo.addOrUpdate).toHaveBeenCalledWith(validSub);
  });
});
