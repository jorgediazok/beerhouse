const requestLog = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (requestLog.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  requestLog.set(key, hits);
  return hits.length > limit;
}

export function getRequestIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
