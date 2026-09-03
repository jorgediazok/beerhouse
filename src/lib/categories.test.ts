import { describe, expect, it } from "vitest";
import { getCategoryForBeer, getCategoryBySlug, CATEGORIES } from "@/lib/categories";

describe("getCategoryForBeer", () => {
  it("resolves a known beer id to its category", () => {
    const category = getCategoryForBeer("3o9tyw7fVWMbc8zSJpLN8U"); // Japi Premium Lager
    expect(category?.slug).toBe("rubias");
  });

  it("returns undefined for an unknown beer id", () => {
    expect(getCategoryForBeer("does-not-exist")).toBeUndefined();
  });
});

describe("getCategoryBySlug", () => {
  it("resolves every declared category slug", () => {
    for (const category of CATEGORIES) {
      expect(getCategoryBySlug(category.slug)).toEqual(category);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCategoryBySlug("no-existe")).toBeUndefined();
  });
});
