class UserRating {
  userId: string;
  score: number;

  constructor(userId: string, score: number) {
    this.userId = userId;
    this.score = score;
  }
}

export default UserRating;
