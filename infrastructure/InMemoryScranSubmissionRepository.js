class InMemoryScranSubmissionRepository {
  constructor() {
    this.submissions = [];
  }

  save(submission) {
    this.submissions.push(submission);
  }

  findByMessageId(messageId) {
    return this.submissions.find((sub) => sub.destMsg.id === messageId);
  }

  deleteAll(predicate) {
    this.submissions = this.submissions.filter((sub) => !predicate(sub));
  }

  getAll() {
    return [...this.submissions];
  }

  addOrUpdate(updatedSubmission) {
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

module.exports = InMemoryScranSubmissionRepository;
