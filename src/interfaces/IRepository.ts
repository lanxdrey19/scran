import ScranSubmission from "../domain/ScranSubmission.js";

export default interface IRepository {
  add(submission: ScranSubmission): void;
  getAll(): ScranSubmission[];
  findByMessageId(messageId: string): ScranSubmission | undefined;
  deleteAll(predicate: (sub: ScranSubmission) => boolean): void;
  clear(): void;
  addOrUpdate(updatedSubmission: ScranSubmission): void;
}
