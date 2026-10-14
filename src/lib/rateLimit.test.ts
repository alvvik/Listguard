import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let getRateLimitStatus: typeof import("./rateLimit").getRateLimitStatus;
let isRateLimited: typeof import("./rateLimit").isRateLimited;

beforeEach(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  vi.resetModules();

  ({ getRateLimitStatus, isRateLimited } = await import("./rateLimit"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("isRateLimited", () => {
  it("allows requests until the configured limit is exceeded", () => {
    expect(isRateLimited("192.0.2.1", 2, 60_000)).toBe(false);
    expect(isRateLimited("192.0.2.1", 2, 60_000)).toBe(false);
    expect(isRateLimited("192.0.2.1", 2, 60_000)).toBe(true);
  });

  it("keeps rate-limit records separate for each IP address", () => {
    expect(isRateLimited("192.0.2.1", 1, 60_000)).toBe(false);
    expect(isRateLimited("198.51.100.1", 1, 60_000)).toBe(false);
    expect(isRateLimited("192.0.2.1", 1, 60_000)).toBe(true);
    expect(isRateLimited("198.51.100.1", 1, 60_000)).toBe(true);
  });

  it("allows requests again after the configured time window expires", () => {
    expect(isRateLimited("192.0.2.1", 1, 60_000)).toBe(false);
    expect(isRateLimited("192.0.2.1", 1, 60_000)).toBe(true);

    vi.advanceTimersByTime(60_001);

    expect(isRateLimited("192.0.2.1", 1, 60_000)).toBe(false);
  });
});

describe("getRateLimitStatus", () => {
  it("returns null for an IP address without a rate-limit record", () => {
    expect(getRateLimitStatus("203.0.113.1")).toBeNull();
  });

  it("returns the tracked request count and reset time", () => {
    const initialTime = Date.now();

    isRateLimited("192.0.2.1", 3, 60_000);
    isRateLimited("192.0.2.1", 3, 60_000);

    expect(getRateLimitStatus("192.0.2.1")).toEqual({
      remaining: 2,
      resetTime: initialTime + 60_000,
    });
  });
});
