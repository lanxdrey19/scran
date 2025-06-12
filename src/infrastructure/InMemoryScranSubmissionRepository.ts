import IRepository from "../interfaces/IRepository.js";
import ScranSubmission from "../domain/ScranSubmission.js";

class InMemoryScranSubmissionRepository implements IRepository {
  private submissions: ScranSubmission[] = [];

  add(submission: ScranSubmission): void {
    this.submissions.push(submission);
  }

  getAll(): ScranSubmission[] {
    return [...this.submissions];
  }

  findByMessageId(messageId: string): ScranSubmission | undefined {
    return this.submissions.find(sub => sub.destMsg.id === messageId);
  }

  deleteAll(predicate: (sub: ScranSubmission) => boolean): void {
    this.submissions = this.submissions.filter(sub => !predicate(sub));
  }

  clear(): void {
    this.submissions = [];
  }

  addOrUpdate(updatedSubmission: ScranSubmission): void {
    const index = this.submissions.findIndex(
      (sub) => sub.destMsg.id === updatedSubmission.destMsg.id
    );

    if (index !== -1) {
      this.submissions[index] = updatedSubmission;
    } else {
      this.submissions.push(updatedSubmission);
    }
  }
}

export default InMemoryScranSubmissionRepository;
