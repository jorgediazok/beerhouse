import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/email", () => ({ sendEmail: vi.fn() }));
vi.mock("@/lib/rateLimit", () => ({ isRateLimited: vi.fn(), getRequestIp: vi.fn() }));

import { sendEmail } from "@/lib/email";
import { isRateLimited, getRequestIp } from "@/lib/rateLimit";
import { POST } from "@/app/api/contact/route";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = { name: "Jorge", email: "jorge@example.com", message: "Hola, quiero hacer un pedido grande." };
const originalContactEmail = process.env.CONTACT_EMAIL;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getRequestIp).mockReturnValue("1.2.3.4");
  vi.mocked(isRateLimited).mockReturnValue(false);
  process.env.CONTACT_EMAIL = "hola@beerhouse.com";
});

afterEach(() => {
  process.env.CONTACT_EMAIL = originalContactEmail;
});

describe("POST /api/contact", () => {
  it("silently succeeds without sending when the honeypot is filled", async () => {
    const res = await POST(makeRequest({ ...validBody, website: "http://spam.example" }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it.each([
    ["missing name", { ...validBody, name: "" }],
    ["invalid email", { ...validBody, email: "not-an-email" }],
    ["missing message", { ...validBody, message: "" }],
    ["oversized message", { ...validBody, message: "a".repeat(5001) }],
  ])("returns 400 on invalid input: %s", async (_label, body) => {
    const res = await POST(makeRequest(body));

    expect(res.status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 429 when rate-limited", async () => {
    vi.mocked(isRateLimited).mockReturnValue(true);

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(429);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 503 when CONTACT_EMAIL isn't configured", async () => {
    delete process.env.CONTACT_EMAIL;

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(503);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 502 when sendEmail fails", async () => {
    vi.mocked(sendEmail).mockResolvedValue({ error: "boom" } as never);

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(502);
  });

  it("sends the message and returns ok on the happy path", async () => {
    vi.mocked(sendEmail).mockResolvedValue({} as never);

    const res = await POST(makeRequest(validBody));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendEmail).toHaveBeenCalledWith({
      to: "hola@beerhouse.com",
      replyTo: "jorge@example.com",
      subject: "Nuevo mensaje de contacto de Jorge",
      text: "De: Jorge <jorge@example.com>\n\nHola, quiero hacer un pedido grande.",
    });
  });
});
