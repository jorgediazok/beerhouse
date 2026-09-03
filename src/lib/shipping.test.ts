import { describe, expect, it } from "vitest";
import { getShippingCost, SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

describe("getShippingCost", () => {
  it("charges the flat fee below the free-shipping threshold", () => {
    expect(getShippingCost(1000)).toBe(SHIPPING_FEE);
  });

  it("is free at exactly the threshold", () => {
    expect(getShippingCost(FREE_SHIPPING_THRESHOLD)).toBe(0);
  });

  it("is free above the threshold", () => {
    expect(getShippingCost(FREE_SHIPPING_THRESHOLD + 1)).toBe(0);
  });

  it("charges the flat fee just below the threshold", () => {
    expect(getShippingCost(FREE_SHIPPING_THRESHOLD - 1)).toBe(SHIPPING_FEE);
  });

  it("is free for a zero or negative subtotal", () => {
    expect(getShippingCost(0)).toBe(0);
    expect(getShippingCost(-100)).toBe(0);
  });
});
