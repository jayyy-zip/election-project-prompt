import { describe, it, expect } from "vitest";
import { sanitizeText, isSafeInput } from "@/lib/sanitize";

describe("sanitizeText", () => {
  it("strips HTML tags", () => {
    expect(sanitizeText("<script>alert('xss')</script>")).toBe("alert('xss')");
  });

  it("strips lone angle brackets and content inside them", () => {
    // Tags including their content are stripped for safety
    expect(sanitizeText("Hello <World>")).toBe("Hello");
  });

  it("trims whitespace", () => {
    expect(sanitizeText("  hello  ")).toBe("hello");
  });

  it("truncates to 500 characters", () => {
    const long = "a".repeat(600);
    expect(sanitizeText(long).length).toBe(500);
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeText("")).toBe("");
  });

  it("preserves normal text", () => {
    expect(sanitizeText("How do I vote?")).toBe("How do I vote?");
  });
});

describe("isSafeInput", () => {
  it("returns false for empty string", () => {
    expect(isSafeInput("")).toBe(false);
  });

  it("returns false for HTML-only input", () => {
    expect(isSafeInput("<b></b>")).toBe(false);
  });

  it("returns true for valid input", () => {
    expect(isSafeInput("When is the election?")).toBe(true);
  });
});
