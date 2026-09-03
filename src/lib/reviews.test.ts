import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/models/Review", () => ({
  Review: {
    aggregate: vi.fn(),
    find: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

import { Review } from "@/models/Review";
import { getRatingSummary, getReviews, upsertReview } from "@/lib/reviews";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getRatingSummary", () => {
  it("maps the aggregate result to average/count", async () => {
    vi.mocked(Review.aggregate).mockResolvedValue([{ _id: null, average: 4.5, count: 2 }]);

    const summary = await getRatingSummary("beer-1");

    expect(summary).toEqual({ average: 4.5, count: 2 });
    expect(Review.aggregate).toHaveBeenCalledWith([
      { $match: { beerId: "beer-1" } },
      { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
  });

  it("falls back to zero when there are no reviews", async () => {
    vi.mocked(Review.aggregate).mockResolvedValue([]);

    expect(await getRatingSummary("beer-1")).toEqual({ average: 0, count: 0 });
  });
});

describe("getReviews", () => {
  it("queries by beerId, sorts newest-first, and maps each document", async () => {
    const lean = vi.fn().mockResolvedValue([
      {
        _id: "r1",
        userId: "u1",
        name: "Jorge",
        rating: 5,
        comment: "Buena",
        createdAt: new Date("2026-01-01"),
      },
    ]);
    const sort = vi.fn().mockReturnValue({ lean });
    vi.mocked(Review.find).mockReturnValue({ sort } as unknown as ReturnType<typeof Review.find>);

    const reviews = await getReviews("beer-1");

    expect(Review.find).toHaveBeenCalledWith({ beerId: "beer-1" });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(reviews).toEqual([
      {
        id: "r1",
        userId: "u1",
        name: "Jorge",
        rating: 5,
        comment: "Buena",
        createdAt: new Date("2026-01-01"),
      },
    ]);
  });
});

describe("upsertReview", () => {
  it("upserts on the beerId + userId filter", async () => {
    vi.mocked(Review.findOneAndUpdate).mockResolvedValue(null);

    await upsertReview({ userId: "u1", beerId: "beer-1", name: "Jorge", rating: 4, comment: "Bien" });

    expect(Review.findOneAndUpdate).toHaveBeenCalledWith(
      { beerId: "beer-1", userId: "u1" },
      { name: "Jorge", rating: 4, comment: "Bien" },
      { upsert: true, setDefaultsOnInsert: true }
    );
  });
});
