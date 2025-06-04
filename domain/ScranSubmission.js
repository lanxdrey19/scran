const ScranScore = require("./ScranScore");

class ScranSubmission {
  constructor(
    sourceMsg,
    destMsg,
    expiresAt = Date.now() + parseInt(process.env.SCRAN_EXPIRY_MS, 10)
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
