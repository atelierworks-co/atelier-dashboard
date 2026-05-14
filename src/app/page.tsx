import { Header } from "@/components/Header";
import { SiteCard } from "@/components/SiteCard";
import { getSites } from "@/lib/sites";

export default function DashboardHome() {
  const sites = getSites();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Sites</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {sites.length} {sites.length === 1 ? "site" : "sites"} tracked
          </p>
        </div>

        {sites.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <SiteCard key={site.slug} site={site} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
      <p className="text-zinc-500 dark:text-zinc-400">
        No sites yet. Add one in{" "}
        <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
          config/sites.json
        </code>
        .
      </p>
    </div>
  );
}
