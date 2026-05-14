import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getSite, getSites } from "@/lib/sites";

export function generateStaticParams() {
  return getSites().map((s) => ({ slug: s.slug }));
}

export default async function SiteDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

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

        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Integrations
          </h2>
          <dl className="grid sm:grid-cols-3 gap-4 text-sm">
            <IntegrationItem
              label="GitHub"
              value={site.github ? `${site.github.owner}/${site.github.repo}` : "not configured"}
              status={site.github ? "configured" : "missing"}
            />
            <IntegrationItem
              label="Cloudflare"
              value={site.cloudflare?.zoneId ? site.cloudflare.zoneId : "not configured"}
              status={site.cloudflare?.zoneId ? "configured" : "missing"}
            />
            <IntegrationItem
              label="PostHog"
              value={site.posthog?.projectId ? site.posthog.projectId : "not configured"}
              status={site.posthog?.projectId ? "configured" : "missing"}
            />
          </dl>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-6">
            Live data wires up in S2 (Cloudflare + GitHub) and S3 (PostHog).
          </p>
        </section>
      </main>
    </>
  );
}

function IntegrationItem({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "configured" | "missing";
}) {
  return (
    <div>
      <dt className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </dt>
      <dd
        className={`text-sm font-mono mt-1 ${
          status === "configured" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
