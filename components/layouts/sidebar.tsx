"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PixelMintForm } from "@/features/pixels-grid/components/pixel-mint-form";
import { LeaderboardSidebar } from "@/features/leaderboard/components/leaderboard-sidebar";

import { MyPixelsSidebar } from "@/features/my-pixels/components/my-pixels-sidebar";

type ActiveTab = "selected" | "my-pixels" | "leaderboard";

const getActiveTab = (pathname: string): ActiveTab => {
  if (pathname === "/my-pixels") return "my-pixels";
  if (pathname === "/leaderboard") return "leaderboard";
  return "selected";
};

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  return (
    <aside className="w-80 bg-zinc-950 border-l border-white/5 flex flex-col z-20 shadow-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/5 shrink-0">
        {(["selected", "my-pixels", "leaderboard"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (tab === "my-pixels") {
                router.push("/my-pixels");
              } else if (tab === "leaderboard") {
                router.push("/leaderboard");
              } else {
                router.push("/");
              }
            }}
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

      {/* Content */}
      {activeTab === "selected" && (
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          <PixelMintForm />
        </div>
      )}

      {activeTab === "my-pixels" && <MyPixelsSidebar />}

      {activeTab === "leaderboard" && (
        <div className="flex-1 overflow-y-auto p-5">
          <LeaderboardSidebar />
        </div>
      )}
    </aside>
  );
}
