import UserRating from "./UserRating.js";

class ScranScore {
  private userRatings: UserRating[];

  constructor() {
    this.userRatings = [];
  }

  private isValidScore(score: number): boolean {
    return Number.isInteger(score) && score >= 0 && score <= 10;
  }

  addOrUpdate(userId: string, score: number): void {
    if (!this.isValidScore(score)) {
      throw new Error(`Invalid score: ${score}. Must be an integer from 0 to 10.`);
    }

    const existingUser = this.userRatings.find((r) => r.userId === userId);
    if (existingUser) {
      existingUser.score = score;
    } else {
      this.userRatings.push(new UserRating(userId, score));
    }
  }

  calculateScore(): number {
    if (this.userRatings.length === 0) return 0;
    const sum = this.userRatings.reduce((a, r) => a + r.score, 0);
    return sum / this.getNumberOfSubmissions();
  }

  getNumberOfSubmissions(): number {
    return this.userRatings.length;
  }
}

export default ScranScore;
