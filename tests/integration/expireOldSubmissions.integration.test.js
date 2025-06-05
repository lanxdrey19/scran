import InMemoryScranSubmissionRepository from "../../infrastructure/InMemoryScranSubmissionRepository.js";
import expireOldSubmissions from "../../usecases/expireOldSubmissions.js";
import ScranSubmission from "../../domain/ScranSubmission.js";

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

    scranRepo.save(expiredSubmission);
    scranRepo.save(activeSubmission);
  });

  it("removes only expired submissions", () => {
    expireOldSubmissions(scranRepo);

    const remaining = scranRepo.getAll();

    expect(remaining.length).toBe(1);
    expect(remaining[0].destMsg.id).toBe("active");
  });
});
