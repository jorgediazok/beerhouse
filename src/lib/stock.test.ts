import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/models/Stock", () => ({
  Stock: {
    findOne: vi.fn(),
    updateOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
  DEFAULT_STOCK: 100,
}));

import { Stock, DEFAULT_STOCK } from "@/models/Stock";
import { getStock, decrementStock, incrementStock } from "@/lib/stock";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getStock", () => {
  it("returns the stored quantity when a Stock doc exists", async () => {
    const lean = vi.fn().mockResolvedValue({ beerId: "beer-1", quantity: 7 });
    vi.mocked(Stock.findOne).mockReturnValue({ lean } as unknown as ReturnType<typeof Stock.findOne>);

    expect(await getStock("beer-1")).toBe(7);
  });

  it("falls back to DEFAULT_STOCK when no doc exists", async () => {
    const lean = vi.fn().mockResolvedValue(null);
    vi.mocked(Stock.findOne).mockReturnValue({ lean } as unknown as ReturnType<typeof Stock.findOne>);

    expect(await getStock("beer-1")).toBe(DEFAULT_STOCK);
  });
});

describe("decrementStock", () => {
  it("returns true and decrements when enough stock remains", async () => {
    vi.mocked(Stock.updateOne).mockResolvedValue({} as never);
    vi.mocked(Stock.findOneAndUpdate).mockResolvedValue({ beerId: "beer-1", quantity: 3 } as never);

    const ok = await decrementStock("beer-1", 5);

    expect(ok).toBe(true);
    expect(Stock.updateOne).toHaveBeenCalledWith(
      { beerId: "beer-1" },
      { $setOnInsert: { quantity: DEFAULT_STOCK } },
      { upsert: true }
    );
    expect(Stock.findOneAndUpdate).toHaveBeenCalledWith(
      { beerId: "beer-1", quantity: { $gte: 5 } },
      { $inc: { quantity: -5 } }
    );
  });

  it("returns false without mutating when there isn't enough stock", async () => {
    vi.mocked(Stock.updateOne).mockResolvedValue({} as never);
    vi.mocked(Stock.findOneAndUpdate).mockResolvedValue(null);

    expect(await decrementStock("beer-1", 999)).toBe(false);
  });
});

describe("incrementStock", () => {
  it("upserts an increment on the beer's stock", async () => {
    vi.mocked(Stock.updateOne).mockResolvedValue({} as never);

    await incrementStock("beer-1", 5);

    expect(Stock.updateOne).toHaveBeenCalledWith(
      { beerId: "beer-1" },
      { $inc: { quantity: 5 } },
      { upsert: true }
    );
  });
});
