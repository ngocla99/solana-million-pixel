import { cn } from "@/lib/utils";

export function ActivityFeed() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-white tracking-tight">Recent Grid Activity</h2>
      <div className="space-y-3">
        {/* Item */}
        <div className="flex items-start gap-3 text-xs">
          <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
          <div>
            <p className="text-zinc-300">
              <span className="text-white font-medium">CryptoKing</span> acquired 10x10 block
            </p>
            <p className="text-zinc-600 mt-0.5">2 mins ago</p>
          </div>
        </div>
        {/* Item */}
        <div className="flex items-start gap-3 text-xs">
          <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-purple-500"></div>
          <div>
            <p className="text-zinc-300">
              <span className="text-white font-medium">Aliceverse</span> overwrote <span className="text-zinc-500">#892</span>
            </p>
            <p className="text-zinc-600 mt-0.5">15 mins ago</p>
          </div>
        </div>
        {/* Item */}
        <div className="flex items-start gap-3 text-xs">
          <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-zinc-700"></div>
          <div>
            <p className="text-zinc-300">
              <span className="text-white font-medium">New User</span> joined
            </p>
            <p className="text-zinc-600 mt-0.5">1 hr ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
