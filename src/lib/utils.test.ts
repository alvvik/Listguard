import { describe, it, expect } from "vitest";
import { formatDate } from "./utils";

describe("formatDate", () => {
  it('should return "Nie prawidłowy format daty" for null', () => {
    expect(formatDate(null)).toBe("Nie prawidłowy format daty");
  });

  it('should return "Nie prawidłowy format daty" for undefined', () => {
    expect(formatDate(undefined)).toBe("Nie prawidłowy format daty");
  });

  it("should format a valid Date object correctly", () => {
    const date = new Date("2026-10-15T12:00:00Z");
    const result = formatDate(date);
    expect(typeof result).toBe("string");
    expect(result).not.toBe("Nie prawidłowy format daty");
  });

  it("should format a valid date string correctly", () => {
    const result = formatDate("2026-10-15T12:00:00Z");
    expect(typeof result).toBe("string");
    expect(result).not.toBe("Nie prawidłowy format daty");
  });

  it("should format a valid timestamp number correctly", () => {
    const timestamp = new Date("2026-10-15T12:00:00Z").getTime();
    const result = formatDate(timestamp);
    expect(typeof result).toBe("string");
    expect(result).not.toBe("Nie prawidłowy format daty");
  });

  it("should return the original input string for an invalid date string", () => {
    const invalidDate = "not-a-date";
    expect(formatDate(invalidDate)).toBe(invalidDate);
  });
});
