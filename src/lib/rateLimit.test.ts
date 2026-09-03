import { describe, expect, it } from "vitest";
import { isRateLimited, getRequestIp } from "@/lib/rateLimit";

// Each test uses its own key so the module-level request log from other
// tests (or other cases in this file) never bleeds across assertions.
let keyCounter = 0;
const uniqueKey = () => `test-key-${keyCounter++}`;

describe("isRateLimited", () => {
  it("allows requests under the limit", () => {
    const key = uniqueKey();
    expect(isRateLimited(key, 3, 10_000)).toBe(false);
    expect(isRateLimited(key, 3, 10_000)).toBe(false);
    expect(isRateLimited(key, 3, 10_000)).toBe(false);
  });

  it("blocks once the request count exceeds the limit within the window", () => {
    const key = uniqueKey();
    isRateLimited(key, 2, 10_000);
    isRateLimited(key, 2, 10_000);
    expect(isRateLimited(key, 2, 10_000)).toBe(true);
  });

  it("does not mix counts between different keys", () => {
    const keyA = uniqueKey();
    const keyB = uniqueKey();
    isRateLimited(keyA, 1, 10_000);
    isRateLimited(keyA, 1, 10_000);
    expect(isRateLimited(keyB, 1, 10_000)).toBe(false);
  });
});

describe("getRequestIp", () => {
  it("reads the first address from x-forwarded-for", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getRequestIp(request)).toBe("1.2.3.4");
  });

  it("falls back to 'unknown' when the header is missing", () => {
    const request = new Request("http://localhost");
    expect(getRequestIp(request)).toBe("unknown");
  });
});
