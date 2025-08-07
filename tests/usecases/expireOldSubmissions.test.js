import { describe, it, expect, vi, beforeEach } from "vitest";
import expireOldSubmissions from "../../src/usecases/expireOldSubmissions";
import logger from "../../src/logger";

describe("expireOldSubmissions", () => {
  let scranRepo;
  let loggerSpy;

  const createSubmission = (id, expired) => ({
    destMsg: { id },
    isExpired: () => expired,
  });

  beforeEach(() => {
    loggerSpy = vi.spyOn(logger, "debug").mockImplementation(() => {});
    scranRepo = {
      getAll: vi.fn(),
      deleteAll: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs and deletes expired submissions", () => {
    const expired1 = createSubmission("123", true);
    const expired2 = createSubmission("456", true);
    const active = createSubmission("789", false);

    scranRepo.getAll.mockReturnValue([expired1, expired2, active]);

    expireOldSubmissions(scranRepo);

    expect(loggerSpy).toHaveBeenCalledWith(
      "🗑 Expiring the following submissions:"
    );
    expect(loggerSpy).toHaveBeenCalledWith("- Message ID: 123");
    expect(loggerSpy).toHaveBeenCalledWith("- Message ID: 456");

    expect(scranRepo.deleteAll).toHaveBeenCalledWith(expect.any(Function));
    const predicate = scranRepo.deleteAll.mock.calls[0][0];

    expect(predicate(expired1)).toBe(true);
    expect(predicate(expired2)).toBe(true);
    expect(predicate(active)).toBe(false);
  });

  it("does nothing if no expired submissions", () => {
    const active1 = createSubmission("111", false);
    const active2 = createSubmission("222", false);

    scranRepo.getAll.mockReturnValue([active1, active2]);

    expireOldSubmissions(scranRepo);

    expect(loggerSpy).not.toHaveBeenCalled();
    expect(scranRepo.deleteAll).toHaveBeenCalledWith(expect.any(Function));
    const predicate = scranRepo.deleteAll.mock.calls[0][0];

    expect(predicate(active1)).toBe(false);
    expect(predicate(active2)).toBe(false);
  });
});
