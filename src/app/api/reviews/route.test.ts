import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/contentful", () => ({ getBeerById: vi.fn() }));
vi.mock("@/lib/reviews", () => ({ upsertReview: vi.fn() }));

import { auth } from "@/lib/auth";
import { getBeerById } from "@/lib/contentful";
import { upsertReview } from "@/lib/reviews";
import { POST } from "@/app/api/reviews/route";

// next-auth's `auth` export has multiple call-signature overloads (route
// handler / middleware), which trips up vi.mocked()'s overload resolution —
// cast once to a plain Mock instead.
const mockAuth = auth as unknown as Mock;

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = { beerId: "beer-1", name: "Jorge", rating: 4, comment: "Muy rica" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/reviews", () => {
  it("returns 401 without a session", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(401);
    expect(upsertReview).not.toHaveBeenCalled();
  });

  it.each([
    ["empty name", { ...validBody, name: "" }],
    ["rating too high", { ...validBody, rating: 6 }],
    ["rating too low", { ...validBody, rating: 0 }],
    ["comment too short", { ...validBody, comment: "hi" }],
  ])("returns 400 on invalid input: %s", async (_label, body) => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } } as never);

    const res = await POST(makeRequest(body));

    expect(res.status).toBe(400);
    expect(upsertReview).not.toHaveBeenCalled();
  });

  it("returns 400 when the beer no longer resolves in Contentful", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } } as never);
    vi.mocked(getBeerById).mockResolvedValue(null);

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(400);
    expect(upsertReview).not.toHaveBeenCalled();
  });

  it("upserts and returns 201 on success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } } as never);
    vi.mocked(getBeerById).mockResolvedValue({ id: "beer-1", name: "Japi" } as never);
    vi.mocked(upsertReview).mockResolvedValue(undefined);

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(201);
    expect(upsertReview).toHaveBeenCalledWith({
      userId: "u1",
      beerId: "beer-1",
      name: "Jorge",
      rating: 4,
      comment: "Muy rica",
    });
  });
});
