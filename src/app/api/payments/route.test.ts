import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/models/Order", () => ({ Order: { create: vi.fn() } }));
vi.mock("@/lib/contentful", () => ({ getBeerById: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendEmail: vi.fn() }));
vi.mock("@/lib/stock", () => ({ decrementStock: vi.fn(), incrementStock: vi.fn() }));
vi.mock("@/lib/mercadopago", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mercadopago")>("@/lib/mercadopago");
  return { mpPayment: { create: vi.fn() }, paymentRejectionMessage: actual.paymentRejectionMessage };
});

import { auth } from "@/lib/auth";
import { Order } from "@/models/Order";
import { getBeerById } from "@/lib/contentful";
import { sendEmail } from "@/lib/email";
import { decrementStock, incrementStock } from "@/lib/stock";
import { mpPayment } from "@/lib/mercadopago";
import { POST } from "@/app/api/payments/route";

// next-auth's `auth` export has multiple call-signature overloads (route
// handler / middleware), which trips up vi.mocked()'s overload resolution —
// cast once to a plain Mock instead.
const mockAuth = auth as unknown as Mock;

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validShipping = {
  name: "Jorge Diaz",
  phone: "1122334455",
  document: "12345678",
  address: "Talcahuano 1095",
  zipCode: "1000",
  time: "18-20",
};

const validCard = {
  token: "card-token",
  issuer_id: "25",
  payment_method_id: "visa",
  installments: 1,
  payer: { email: "jorge@example.com" },
};

function beer(id: string, name: string, price: number) {
  return { id, name, price, description: "", descriptionExtended: "", imageUrl: "" };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(sendEmail).mockResolvedValue({} as never);
});

describe("POST /api/payments", () => {
  it("returns 401 without a session", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(
      makeRequest({ items: [{ beerId: "beer-1", qty: 1 }], shipping: validShipping, card: validCard })
    );

    expect(res.status).toBe(401);
    expect(Order.create).not.toHaveBeenCalled();
  });

  it("returns 400 on invalid input (empty cart)", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } } as never);

    const res = await POST(makeRequest({ items: [], shipping: validShipping, card: validCard }));

    expect(res.status).toBe(400);
    expect(Order.create).not.toHaveBeenCalled();
  });

  it("returns 400 when an item's beer no longer resolves in Contentful", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } } as never);
    vi.mocked(getBeerById).mockResolvedValue(null);

    const res = await POST(
      makeRequest({ items: [{ beerId: "beer-1", qty: 1 }], shipping: validShipping, card: validCard })
    );

    expect(res.status).toBe(400);
    expect(Order.create).not.toHaveBeenCalled();
    expect(mpPayment.create).not.toHaveBeenCalled();
  });

  it("rolls back stock already reserved when a later item is out of stock", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } } as never);
    vi.mocked(getBeerById).mockImplementation(async (id: string) =>
      id === "beer-1" ? beer("beer-1", "Japi", 3500) : beer("beer-2", "Corona", 4120)
    );
    vi.mocked(decrementStock).mockImplementation(async (beerId: string) => beerId === "beer-1");

    const res = await POST(
      makeRequest({
        items: [
          { beerId: "beer-1", qty: 2 },
          { beerId: "beer-2", qty: 5 },
        ],
        shipping: validShipping,
        card: validCard,
      })
    );

    expect(res.status).toBe(400);
    expect(incrementStock).toHaveBeenCalledExactlyOnceWith("beer-1", 2);
    expect(mpPayment.create).not.toHaveBeenCalled();
    expect(Order.create).not.toHaveBeenCalled();
  });

  it("rolls back stock and returns 402 when Mercado Pago rejects the payment", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } } as never);
    vi.mocked(getBeerById).mockResolvedValue(beer("beer-1", "Japi", 3500));
    vi.mocked(decrementStock).mockResolvedValue(true);
    vi.mocked(mpPayment.create).mockResolvedValue({
      status: "rejected",
      status_detail: "cc_rejected_insufficient_amount",
    } as never);

    const res = await POST(
      makeRequest({ items: [{ beerId: "beer-1", qty: 1 }], shipping: validShipping, card: validCard })
    );

    expect(res.status).toBe(402);
    expect(incrementStock).toHaveBeenCalledExactlyOnceWith("beer-1", 1);
    expect(Order.create).not.toHaveBeenCalled();
    const body = await res.json();
    expect(body.error).toMatch(/fondos suficientes/);
  });

  it("rolls back stock and returns 400 when Mercado Pago's API call throws", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } } as never);
    vi.mocked(getBeerById).mockResolvedValue(beer("beer-1", "Japi", 3500));
    vi.mocked(decrementStock).mockResolvedValue(true);
    vi.mocked(mpPayment.create).mockRejectedValue(new Error("network error"));

    const res = await POST(
      makeRequest({ items: [{ beerId: "beer-1", qty: 1 }], shipping: validShipping, card: validCard })
    );

    expect(res.status).toBe(400);
    expect(incrementStock).toHaveBeenCalledExactlyOnceWith("beer-1", 1);
    expect(Order.create).not.toHaveBeenCalled();
  });

  it("creates the order with correctly computed totals when the payment is approved", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", email: "jorge@example.com" } } as never);
    vi.mocked(getBeerById).mockResolvedValue(beer("beer-1", "Japi", 3500));
    vi.mocked(decrementStock).mockResolvedValue(true);
    vi.mocked(mpPayment.create).mockResolvedValue({ id: 123456, status: "approved" } as never);
    vi.mocked(Order.create).mockResolvedValue({ _id: "aaaaaaaaaaaaaaaa1234" } as never);

    const res = await POST(
      makeRequest({ items: [{ beerId: "beer-1", qty: 2 }], shipping: validShipping, card: validCard })
    );

    // subtotal 7000, under the free-shipping threshold -> flat shipping fee, total 8500
    expect(Order.create).toHaveBeenCalledWith({
      userId: "u1",
      items: [{ beerId: "beer-1", name: "Japi", price: 3500, qty: 2 }],
      shipping: validShipping,
      subtotal: 7000,
      shippingCost: 1500,
      total: 8500,
      paymentId: "123456",
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ orderId: "aaaaaaaaaaaaaaaa1234", total: 8500 });
    expect(sendEmail).toHaveBeenCalledOnce();
  });
});
