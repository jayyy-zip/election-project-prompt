import { describe, it, expect } from "vitest";
import { formatDate, getDaysUntil, getGreeting } from "@/lib/utils";

describe("formatDate", () => {
  it("formats a valid date string into readable Indian date", () => {
    const result = formatDate("2026-05-07");
    expect(result).toContain("May");
    expect(result).toContain("2026");
  });

  it("includes the day number", () => {
    const result = formatDate("2026-05-07");
    expect(result).toContain("7");
  });
});

describe("getDaysUntil", () => {
  it("returns 0 for today", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(getDaysUntil(today)).toBe(0);
  });

  it("returns positive number for a future date", () => {
    const future = "2099-01-01";
    expect(getDaysUntil(future)).toBeGreaterThan(0);
  });

  it("returns negative number for a past date", () => {
    const past = "2000-01-01";
    expect(getDaysUntil(past)).toBeLessThan(0);
  });
});

describe("getGreeting", () => {
  it("returns a non-empty string", () => {
    const result = getGreeting();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns one of the three expected greetings", () => {
    const result = getGreeting();
    expect(["Good morning", "Good afternoon", "Good evening"]).toContain(result);
  });
});
