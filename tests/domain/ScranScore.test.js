import { describe, it, expect } from "vitest";
import ScranScore from "../../domain/ScranScore.js";

describe("ScranScore", () => {
  it("starts with 0 submissions", () => {
    const score = new ScranScore();
    expect(score.getNumberOfSubmissions()).toBe(0);
  });

  it("adds a valid score", () => {
    const score = new ScranScore();
    score.addOrUpdate("user1", 7);

    expect(score.getNumberOfSubmissions()).toBe(1);
    expect(score.calculateScore()).toBe(7);
  });

  it("updates an existing user's score", () => {
    const score = new ScranScore();
    score.addOrUpdate("user1", 6);
    score.addOrUpdate("user1", 9);

    expect(score.getNumberOfSubmissions()).toBe(1);
    expect(score.calculateScore()).toBe(9);
  });

  it("adds multiple users and calculates average", () => {
    const score = new ScranScore();
    score.addOrUpdate("user1", 8);
    score.addOrUpdate("user2", 6);
    score.addOrUpdate("user3", 10);

    expect(score.getNumberOfSubmissions()).toBe(3);
    expect(score.calculateScore()).toBeCloseTo((8 + 6 + 10) / 3, 5);
  });

  it("throws for invalid score < 0", () => {
    const score = new ScranScore();
    expect(() => score.addOrUpdate("user1", -1)).toThrow(
      "Invalid score: -1. Must be an integer from 0 to 10."
    );
  });

  it("throws for invalid score > 10", () => {
    const score = new ScranScore();
    expect(() => score.addOrUpdate("user1", 11)).toThrow(
      "Invalid score: 11. Must be an integer from 0 to 10."
    );
  });

  it("throws for non-integer score", () => {
    const score = new ScranScore();
    expect(() => score.addOrUpdate("user1", 7.5)).toThrow();
  });

  it("returns 0 average when no scores", () => {
    const score = new ScranScore();
    expect(score.calculateScore()).toBe(0);
  });
});
