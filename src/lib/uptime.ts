export type UptimeResult = {
  status: "up" | "down";
  httpStatus: number;
  latencyMs: number;
};

export async function checkUptime(url: string): Promise<UptimeResult> {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const latencyMs = Date.now() - started;
    return {
      status: res.ok ? "up" : "down",
      httpStatus: res.status,
      latencyMs,
    };
  } catch {
    return {
      status: "down",
      httpStatus: 0,
      latencyMs: Date.now() - started,
    };
  }
}
