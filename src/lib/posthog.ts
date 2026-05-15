export type DailyViews = { date: string; views: number };

export type SiteTraffic = {
  total7d: number;
  daily7d: DailyViews[];
};

export type DailyViewsLong = { date: string; views: number };

export type TopPage = { path: string; views: number };
export type TopReferrer = { source: string; views: number };

function host() {
  return process.env.POSTHOG_HOST ?? "https://us.posthog.com";
}

function token() {
  return process.env.POSTHOG_API_KEY;
}

async function hogql(projectId: string, query: string): Promise<unknown[][]> {
  const t = token();
  if (!t) return [];
  try {
    const res = await fetch(`${host()}/api/projects/${projectId}/query/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.results) ? data.results : [];
  } catch {
    return [];
  }
}

/** 7-day traffic for a host. Returns total + per-day series. */
export async function getSiteTraffic(
  projectId: string,
  hostFilter: string,
): Promise<SiteTraffic | null> {
  if (!token()) return null;
  const safeHost = hostFilter.replace(/'/g, "");
  const rows = await hogql(
    projectId,
    `SELECT toDate(timestamp) AS day, count() AS views
     FROM events
     WHERE event = '$pageview'
       AND timestamp > now() - INTERVAL 7 DAY
       AND properties.$host = '${safeHost}'
     GROUP BY day
     ORDER BY day ASC`,
  );

  const byDay = new Map<string, number>();
  for (const row of rows) {
    const [day, views] = row as [string, number];
    byDay.set(day, Number(views) || 0);
  }

  const daily7d: DailyViews[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    daily7d.push({ date: key, views: byDay.get(key) ?? 0 });
  }

  const total7d = daily7d.reduce((acc, d) => acc + d.views, 0);
  return { total7d, daily7d };
}

/** 30-day daily series for the site detail chart. */
export async function getSiteTraffic30d(
  projectId: string,
  hostFilter: string,
): Promise<DailyViews[] | null> {
  if (!token()) return null;
  const safeHost = hostFilter.replace(/'/g, "");
  const rows = await hogql(
    projectId,
    `SELECT toDate(timestamp) AS day, count() AS views
     FROM events
     WHERE event = '$pageview'
       AND timestamp > now() - INTERVAL 30 DAY
       AND properties.$host = '${safeHost}'
     GROUP BY day
     ORDER BY day ASC`,
  );

  const byDay = new Map<string, number>();
  for (const row of rows) {
    const [day, views] = row as [string, number];
    byDay.set(day, Number(views) || 0);
  }

  const out: DailyViews[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, views: byDay.get(key) ?? 0 });
  }
  return out;
}

/** Top 10 pages on a host in last 7 days. */
export async function getTopPages(
  projectId: string,
  hostFilter: string,
): Promise<TopPage[]> {
  if (!token()) return [];
  const safeHost = hostFilter.replace(/'/g, "");
  const rows = await hogql(
    projectId,
    `SELECT properties.$pathname AS path, count() AS views
     FROM events
     WHERE event = '$pageview'
       AND timestamp > now() - INTERVAL 7 DAY
       AND properties.$host = '${safeHost}'
     GROUP BY path
     ORDER BY views DESC
     LIMIT 10`,
  );
  return rows.map((r) => ({
    path: String((r as unknown[])[0] ?? "/"),
    views: Number((r as unknown[])[1] ?? 0),
  }));
}

/** Top 10 referrers on a host in last 7 days. */
export async function getTopReferrers(
  projectId: string,
  hostFilter: string,
): Promise<TopReferrer[]> {
  if (!token()) return [];
  const safeHost = hostFilter.replace(/'/g, "");
  const rows = await hogql(
    projectId,
    `SELECT coalesce(properties.$referring_domain, '(direct)') AS source, count() AS views
     FROM events
     WHERE event = '$pageview'
       AND timestamp > now() - INTERVAL 7 DAY
       AND properties.$host = '${safeHost}'
     GROUP BY source
     ORDER BY views DESC
     LIMIT 10`,
  );
  return rows.map((r) => ({
    source: String((r as unknown[])[0] ?? "(direct)"),
    views: Number((r as unknown[])[1] ?? 0),
  }));
}
