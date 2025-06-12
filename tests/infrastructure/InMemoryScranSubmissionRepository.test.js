import { describe, it, expect, beforeEach } from "vitest";
import InMemoryScranSubmissionRepository from "../../src/infrastructure/InMemoryScranSubmissionRepository";

function createMockSubmission(id, content = "mock") {
  return {
    destMsg: { id },
    sourceMsg: { id: `source-${id}`, content },
    score: {
      addOrUpdate: () => {},
      calculateScore: () => 5,
      getNumberOfSubmissions: () => 1,
    },
    isExpired: () => false,
  };
}

describe("InMemoryScranSubmissionRepository", () => {
  let repo;

  beforeEach(() => {
    repo = new InMemoryScranSubmissionRepository();
  });

  it("should add and retrieve a submission by message ID", () => {
    const submission = createMockSubmission("123");
    repo.add(submission);

    const result = repo.findByMessageId("123");
    expect(result).toBe(submission);
  });

  it("should return undefined for non-existent message ID", () => {
    const result = repo.findByMessageId("999");
    expect(result).toBeUndefined();
  });

  it("should delete submissions matching predicate", () => {
    const a = createMockSubmission("a");
    const b = createMockSubmission("b");
    repo.add(a);
    repo.add(b);

    repo.deleteAll((sub) => sub.destMsg.id === "a");

    const all = repo.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].destMsg.id).toBe("b");
  });

  it("getAll should return a shallow copy of submissions", () => {
    const s = createMockSubmission("x");
    repo.add(s);

    const all = repo.getAll();
    expect(all).toEqual([s]);
    expect(all).not.toBe(repo.submissions);
  });

  it("addOrUpdate should add new if not existing", () => {
    const s = createMockSubmission("new");
    repo.addOrUpdate(s);
    expect(repo.getAll()).toContain(s);
  });

  it("addOrUpdate should update existing submission", () => {
    const original = createMockSubmission("123", "original");
    const updated = createMockSubmission("123", "updated");

    repo.add(original);
    repo.addOrUpdate(updated);

    const stored = repo.findByMessageId("123");
    expect(stored.sourceMsg.content).toBe("updated");
  });
});
