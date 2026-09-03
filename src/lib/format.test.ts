import { describe, expect, it } from "vitest";
import { formatPrice, formatDate } from "@/lib/format";

describe("formatPrice", () => {
  it("formats with a leading $ and no decimals", () => {
    expect(formatPrice(3500)).toBe("$ 3.500");
  });

  it("rounds/truncates to whole units", () => {
    expect(formatPrice(0)).toBe("$ 0");
  });
});

describe("formatDate", () => {
  it("formats a Date in day/month/year, hour:minute form", () => {
    const fixed = new Date("2026-03-05T14:30:00-03:00");
    const result = formatDate(fixed);
    expect(result).toContain("05/03/2026");
  });

  it("accepts a string input the same way", () => {
    const fromDate = formatDate(new Date("2026-01-01T00:00:00-03:00"));
    const fromString = formatDate("2026-01-01T00:00:00-03:00");
    expect(fromString).toBe(fromDate);
  });
});
