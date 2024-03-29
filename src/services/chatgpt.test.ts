import { describe, expect, it } from "vitest";
import {
  calculateMaxResponseLength,
  cosineSimilarity,
  createChatCompletion,
  createCompletion,
  createEmbedding,
  getTokenSize,
  splitTextToChunks,
} from "./chatgpt";

describe("createEmbedding", () => {
  it("should return array of embedding", async () => {
    const result = await createEmbedding("hello world");
    expect(Array.isArray(result)).toBe(true);
  });
  it("should return 2 embedding item", async () => {
    const result = await createEmbedding(["hello world", "hello world 2"]);
    expect(Array.isArray(result) && result.length === 2).toBe(true);
  });
});

describe("createCompletion", () => {
  it("should return a text", async () => {
    const result = await createCompletion("return me hello world", 1);
    expect(typeof result).toBe("string");
  });
});

describe("getTokenSize", () => {
  it("should return the size of the token", () => {
    const result = getTokenSize("a little long first sentence");
    expect(result).toBe(5);
  });
  it("should return the size of the token", () => {
    const result = getTokenSize("I am the second line");
    expect(result).toBe(5);
  });
});

describe("splitTextToChunks", () => {
  it("should return the text in array with length eq 2", () => {
    const result = splitTextToChunks(
      "a little long first sentence\nI am the second line",
      5
    );
    expect(result).to.eql([
      { chunk: "a little long first sentence", size: 5 },
      { chunk: "I am the second line", size: 5 },
    ]);
  });
  it("should return the text in array with length eq 1", () => {
    const result = splitTextToChunks(
      "a little long first sentence\nI am the second line",
      500
    );
    expect(result).to.eql([
      { chunk: "a little long first sentence\nI am the second line", size: 11 },
    ]);
  });
});

describe("cosineSimilarity", () => {
  it("should return the cosine similarity", () => {
    const result = cosineSimilarity([3, 2, 0, 5], [1, 0, 0, 0]);
    expect(result).toBeCloseTo(0.48666, 5);
  });
});

describe("calculateMaxResponseLength", () => {
  it("should return the max token of the model provide minus the prompt length", () => {
    const result = calculateMaxResponseLength("hello world this is a prompt");
    expect(result).toBe(4090);
  });
});

describe("createChatCompletion", () => {
  it("should return a text", async () => {
    const result = await createChatCompletion("return me hello world", 1);
    expect(typeof result).toBe("string");
  });
});
