import { describe, expect, it } from "vitest";
import { hashResetToken, generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/resetToken";

describe("hashResetToken", () => {
  it("is deterministic for the same input", () => {
    expect(hashResetToken("abc123")).toBe(hashResetToken("abc123"));
  });

  it("differs for different inputs", () => {
    expect(hashResetToken("abc123")).not.toBe(hashResetToken("abc124"));
  });
});

describe("generateResetToken", () => {
  it("returns a token whose hash matches tokenHash", () => {
    const { token, tokenHash } = generateResetToken();
    expect(hashResetToken(token)).toBe(tokenHash);
  });

  it("sets an expiry roughly one hour out", () => {
    const before = Date.now();
    const { expiresAt } = generateResetToken();
    const delta = expiresAt.getTime() - before;
    expect(delta).toBeGreaterThan(RESET_TOKEN_TTL_MS - 1000);
    expect(delta).toBeLessThanOrEqual(RESET_TOKEN_TTL_MS + 1000);
  });

  it("generates a different token on every call", () => {
    expect(generateResetToken().token).not.toBe(generateResetToken().token);
  });
});
