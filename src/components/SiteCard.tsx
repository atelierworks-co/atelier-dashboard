import Link from "next/link";
import type { Site } from "@/lib/sites";
import { checkUptime, type UptimeResult } from "@/lib/uptime";
import { getLatestCommit, type LatestCommit } from "@/lib/github";
import { formatRelativeTime } from "@/lib/time";

export async function SiteCard({ site }: { site: Site }) {
  const [uptime, commit] = await Promise.all([
    site.url ? checkUptime(site.url) : Promise.resolve(null),
    site.github
      ? getLatestCommit(site.github.owner, site.github.repo, site.github.branch)
      : Promise.resolve(null),
  ]);

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
        <StatusDot uptime={uptime} />
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
        {site.description}
      </p>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <Stat
          label="Status"
          value={
            uptime
              ? uptime.status === "up"
                ? `${uptime.latencyMs}ms`
                : `HTTP ${uptime.httpStatus || "—"}`
              : "—"
          }
        />
        <Stat label="7d Views" value="—" />
        <LastDeploy commit={commit} />
      </div>
    </Link>
  );
}

function StatusDot({ uptime }: { uptime: UptimeResult | null }) {
  const status = uptime?.status ?? "pending";
  const color =
    status === "up"
      ? "bg-emerald-500"
      : status === "down"
      ? "bg-red-500"
      : "bg-zinc-300 dark:bg-zinc-700";
  return (
    <span
      className="relative flex h-2.5 w-2.5 mt-1.5"
      aria-label={`status: ${status}`}
    >
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

function LastDeploy({ commit }: { commit: LatestCommit | null }) {
  return (
    <div>
      <div className="text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
        Last Deploy
      </div>
      <div className="font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
        {commit ? formatRelativeTime(commit.date) : "—"}
      </div>
      {commit && (
        <div className="text-zinc-400 dark:text-zinc-500 font-mono text-[10px] mt-0.5">
          {commit.shortSha}
        </div>
      )}
    </div>
  );
}
