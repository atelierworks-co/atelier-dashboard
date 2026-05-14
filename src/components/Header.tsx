import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-semibold tracking-tight text-lg">
            Atelier
          </span>
          <span className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Dashboard
          </span>
        </Link>
        <UserButton />
      </div>
    </header>
  );
}
