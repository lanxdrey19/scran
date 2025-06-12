import { Message } from "discord.js";
import ScranScore from "./ScranScore.js";

class ScranSubmission {
  sourceMsg: Message;
  destMsg: Message;
  score: ScranScore;
  expiresAt: number;

  constructor(
    sourceMsg: Message,
    destMsg: Message,
    expiresAt: number = Date.now() + parseInt(process.env.SCRAN_EXPIRY_MS || "604800000", 10)
  ) {
    this.sourceMsg = sourceMsg;
    this.destMsg = destMsg;
    this.score = new ScranScore();
    this.expiresAt = expiresAt;
  }

  isExpired(): boolean {
    return Date.now() > this.expiresAt;
  }
}

export default ScranSubmission;
