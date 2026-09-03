import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getOrderStatus } from "@/lib/orderStatus";

describe("getOrderStatus", () => {
  const createdAt = new Date("2026-01-01T12:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is confirmado right away", () => {
    vi.setSystemTime(createdAt);
    expect(getOrderStatus(createdAt).status).toBe("confirmado");
  });

  it("is preparando after 2 minutes", () => {
    vi.setSystemTime(new Date(createdAt.getTime() + 2 * 60 * 1000));
    expect(getOrderStatus(createdAt).status).toBe("preparando");
  });

  it("is enviado after 10 minutes", () => {
    vi.setSystemTime(new Date(createdAt.getTime() + 10 * 60 * 1000));
    expect(getOrderStatus(createdAt).status).toBe("enviado");
  });

  it("is entregado after 20 minutes", () => {
    vi.setSystemTime(new Date(createdAt.getTime() + 20 * 60 * 1000));
    expect(getOrderStatus(createdAt).status).toBe("entregado");
  });

  it("stays entregado well beyond the last stage", () => {
    vi.setSystemTime(new Date(createdAt.getTime() + 60 * 60 * 1000));
    expect(getOrderStatus(createdAt).status).toBe("entregado");
  });

  it("accepts a string createdAt the same way as a Date", () => {
    vi.setSystemTime(new Date(createdAt.getTime() + 2 * 60 * 1000));
    expect(getOrderStatus(createdAt.toISOString()).status).toBe("preparando");
  });
});
