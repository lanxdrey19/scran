import InMemoryScranSubmissionRepository from "../../src/infrastructure/InMemoryScranSubmissionRepository";
import expireOldSubmissions from "../../src/usecases/expireOldSubmissions";
import ScranSubmission from "../../src/domain/ScranSubmission";

describe("Integration - expireOldSubmissions", () => {
  let scranRepo;

  beforeEach(() => {
    scranRepo = new InMemoryScranSubmissionRepository();

    const now = Date.now();

    const expiredSubmission = new ScranSubmission(
      { author: "A", content: "Expired" },
      { id: "expired" },
      now - 1000
    );

    const activeSubmission = new ScranSubmission(
      { author: "B", content: "Active" },
      { id: "active" },
      now + 1000
    );

    scranRepo.add(expiredSubmission);
    scranRepo.add(activeSubmission);
  });

  it("removes only expired submissions", () => {
    expireOldSubmissions(scranRepo);

    const remaining = scranRepo.getAll();

    expect(remaining.length).toBe(1);
    expect(remaining[0].destMsg.id).toBe("active");
  });
});
