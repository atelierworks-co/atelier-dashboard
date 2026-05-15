import type { Site } from "@/lib/sites";

export function SiteCardSkeleton({ site }: { site: Site }) {
  return (
    <div className="block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-base">{site.name}</h3>
          {site.url && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
              {site.url.replace(/^https?:\/\//, "")}
            </p>
          )}
        </div>
        <span className="relative flex h-2.5 w-2.5 mt-1.5">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </span>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
        {site.description}
      </p>
      <div className="grid grid-cols-3 gap-3 text-xs">
        {(["Status", "7d Views", "Last Deploy"] as const).map((label) => (
          <div key={label}>
            <div className="text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
              {label}
            </div>
            <div className="h-4 mt-0.5 w-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
