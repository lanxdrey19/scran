import { describe, it, expect, vi, beforeEach } from "vitest";
import ScranSubmission from "../../src/domain/ScranSubmission";

vi.stubGlobal(
  "Date",
  class extends Date {
    constructor(...args) {
      if (args.length === 0) {
        super(ScranSubmissionTest.now);
      } else {
        super(...args);
      }
    }

    static now() {
      return ScranSubmissionTest.now;
    }
  }
);

const ScranSubmissionTest = {
  now: 1_000_000,
};

describe("ScranSubmission", () => {
  beforeEach(() => {
    ScranSubmissionTest.now = 1_000_000;
    process.env.SCRAN_EXPIRY_MS = (60 * 1000).toString();
  });

  it("should initialize with provided sourceMsg and destMsg", () => {
    const sourceMsg = { content: "hello" };
    const destMsg = { content: "forwarded" };
    const sub = new ScranSubmission(sourceMsg, destMsg);

    expect(sub.sourceMsg).toBe(sourceMsg);
    expect(sub.destMsg).toBe(destMsg);
    expect(sub.score).toBeDefined();
    expect(sub.expiresAt).toBe(1_000_000 + 60 * 1000);
  });

  it("should allow overriding expiresAt", () => {
    const sourceMsg = {};
    const destMsg = {};
    const sub = new ScranSubmission(sourceMsg, destMsg, 123456);

    expect(sub.expiresAt).toBe(123456);
  });

  it("should return false if not expired", () => {
    const sourceMsg = {};
    const destMsg = {};
    const sub = new ScranSubmission(sourceMsg, destMsg);

    ScranSubmissionTest.now = sub.expiresAt - 1;

    expect(sub.isExpired()).toBe(false);
  });

  it("should return true if expired", () => {
    const sourceMsg = {};
    const destMsg = {};
    const sub = new ScranSubmission(sourceMsg, destMsg);

    ScranSubmissionTest.now = sub.expiresAt + 1;

    expect(sub.isExpired()).toBe(true);
  });
});
