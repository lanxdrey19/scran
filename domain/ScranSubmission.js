import { ScranScore } from "./ScranScore.js";

class ScranSubmission {
  constructor(
    sourceMsg,
    destMsg,
    expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
  ) {
    this.sourceMsg = sourceMsg;
    this.destMsg = destMsg;
    this.score = new ScranScore();
    this.expiresAt = expiresAt;
  }

  isExpired() {
    return Date.now() > this.expiresAt;
  }
}

module.exports = ScranSubmission;
