import { ChartBarIcon } from "@phosphor-icons/react";

export function UserRankCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-white tracking-tight">Your Ranking</h2>
      </div>
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-900 border border-white/10 rounded-lg p-4 relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <ChartBarIcon className="w-16 h-16" />
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Current Rank</span>
          <span className="text-2xl font-mono font-medium text-white">#428</span>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
          <div>
            <div className="text-[10px] text-zinc-500">Pixels Owned</div>
            <div className="text-sm font-mono text-white mt-1">12</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-500">Est. Value</div>
            <div className="text-sm font-mono text-white mt-1">0.6 SOL</div>
          </div>
        </div>
      </div>
    </div>
  );
}
