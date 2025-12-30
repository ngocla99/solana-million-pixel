import { ShareNetworkIcon } from "@phosphor-icons/react";
import { UserRankCard } from "./user-rank-card";
import { BadgesSection } from "./badges-section";
import { ActivityFeed } from "./activity-feed";

export function LeaderboardSidebar() {
  return (
    <>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-8">
        <UserRankCard />
        <BadgesSection />
        <ActivityFeed />
      </div>

      {/* Footer Action */}
      <div className="border-t border-white/5 bg-zinc-950/50 backdrop-blur-sm z-10">
        <button className="w-full border border-white/10 hover:bg-white/5 text-zinc-300 rounded py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <ShareNetworkIcon className="w-3.5 h-3.5" />
          Share Profile
        </button>
      </div>
    </>
  );
}
