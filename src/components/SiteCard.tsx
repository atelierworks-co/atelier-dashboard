import Link from "next/link";
import type { Site } from "@/lib/sites";

export function SiteCard({ site }: { site: Site }) {
  return (
    <Link
      href={`/sites/${site.slug}`}
      className="group block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-base">{site.name}</h3>
          {site.url && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
              {site.url.replace(/^https?:\/\//, "")}
            </p>
          )}
        </div>
        <StatusDot status="pending" />
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
        {site.description}
      </p>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <Stat label="Uptime" value="—" />
        <Stat label="7d Views" value="—" />
        <Stat label="Last Deploy" value="—" />
      </div>
    </Link>
  );
}

function StatusDot({ status }: { status: "up" | "down" | "pending" }) {
  const color =
    status === "up"
      ? "bg-emerald-500"
      : status === "down"
      ? "bg-red-500"
      : "bg-zinc-300 dark:bg-zinc-700";
  return (
    <span className="relative flex h-2.5 w-2.5 mt-1.5" aria-label={`status: ${status}`}>
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
        {label}
      </div>
      <div className="font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
        {value}
      </div>
    </div>
  );
}
