import { cn } from "@/lib/utils";

interface TimeFilterTabsProps {
  className?: string;
}

export function TimeFilterTabs({ className }: TimeFilterTabsProps) {
  return (
    <div className={cn("flex items-center bg-zinc-900 border border-white/5 rounded p-1", className)}>
      <button className="px-3 py-1 text-xs font-medium text-white bg-white/10 rounded shadow-sm">
        24h
      </button>
      <button className="px-3 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
        7d
      </button>
      <button className="px-3 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
        All Time
      </button>
    </div>
  );
}
