import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Sparkline } from "@/components/Sparkline";
import { getSite, getSites } from "@/lib/sites";
import { getLatestCommit } from "@/lib/github";
import {
  getSiteTraffic30d,
  getTopPages,
  getTopReferrers,
} from "@/lib/posthog";
import { formatRelativeTime } from "@/lib/time";

export function generateStaticParams() {
  return getSites().map((s) => ({ slug: s.slug }));
}

function hostOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export default async function SiteDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  const hostname = hostOf(site.url);
  const projectId = site.posthog?.projectId;

  const [commit, daily30d, topPages, topReferrers] = await Promise.all([
    site.github
      ? getLatestCommit(site.github.owner, site.github.repo, site.github.branch)
      : Promise.resolve(null),
    projectId && hostname ? getSiteTraffic30d(projectId, hostname) : Promise.resolve(null),
    projectId && hostname ? getTopPages(projectId, hostname) : Promise.resolve([]),
    projectId && hostname ? getTopReferrers(projectId, hostname) : Promise.resolve([]),
  ]);

  const total30d = daily30d?.reduce((acc, d) => acc + d.views, 0) ?? 0;
  const series = daily30d?.map((d) => d.views) ?? [];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <Link
          href="/"
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          ← All sites
        </Link>
        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>
          {site.url && (
            <a
              href={site.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-zinc-500 dark:text-zinc-400 font-mono hover:underline"
            >
              {site.url}
            </a>
          )}
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            {site.description}
          </p>
        </div>

        {/* 30-day traffic */}
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 mb-6">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              30-day Traffic
            </h2>
            <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {total30d.toLocaleString()}
            </span>
          </div>
          {daily30d ? (
            <Sparkline
              values={series}
              width={600}
              height={80}
              className="w-full h-20"
            />
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 py-8 text-center">
              No PostHog tracking configured for this site.
            </p>
          )}
        </section>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Top pages */}
          <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
              Top Pages (7d)
            </h2>
            {topPages.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {topPages.map((p) => (
                  <li
                    key={p.path}
                    className="flex items-center justify-between gap-3 py-1"
                  >
                    <span className="font-mono truncate text-zinc-700 dark:text-zinc-300">
                      {p.path}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 tabular-nums">
                      {p.views.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No pageviews in the last 7 days.
              </p>
            )}
          </section>

          {/* Top referrers */}
          <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
              Top Referrers (7d)
            </h2>
            {topReferrers.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {topReferrers.map((r) => (
                  <li
                    key={r.source}
                    className="flex items-center justify-between gap-3 py-1"
                  >
                    <span className="font-mono truncate text-zinc-700 dark:text-zinc-300">
                      {r.source}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 tabular-nums">
                      {r.views.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No referrers in the last 7 days.
              </p>
            )}
          </section>
        </div>

        {/* Latest deploy + integrations */}
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Latest Deploy
          </h2>
          {commit ? (
            <a
              href={commit.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="block hover:bg-zinc-50 dark:hover:bg-zinc-800 -m-2 p-2 rounded transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {commit.shortSha}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatRelativeTime(commit.date)}
                </span>
              </div>
              <p className="text-sm text-zinc-900 dark:text-zinc-100">
                {commit.message}
              </p>
            </a>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No GitHub integration configured.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
