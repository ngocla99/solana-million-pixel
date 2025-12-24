"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/features/pixels-grid/context/sidebar-context";
import { PixelMintForm } from "@/features/pixels-grid/components/pixel-mint-form";

interface SidebarProps {
  onSubmit: (data: { image: File | null; linkUrl: string }) => void;
  isSubmitting?: boolean;
}

export function Sidebar({ onSubmit, isSubmitting }: SidebarProps) {
  const { selection, activeTab, setActiveTab } = useSidebar();

  return (
    <aside className="w-80 bg-zinc-950 border-l border-white/5 flex flex-col z-20 shadow-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/5 shrink-0">
        {(["selected", "my-pixels", "leaderboard"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3 text-[10px] uppercase tracking-wider font-semibold transition-colors",
              activeTab === tab
                ? "text-white border-b border-purple-500 bg-white/5"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            )}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        {activeTab === "selected" && (
          <PixelMintForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        )}

        {activeTab !== "selected" && (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-600 italic text-xs">
            Coming soon...
          </div>
        )}
      </div>
    </aside>
  );
}
