import { CrownIcon } from "@phosphor-icons/react";

export function TopContributors() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* #2 Silver */}
      <div className="relative group bg-zinc-900/40 border border-white/5 hover:border-white/10 rounded-xl p-5 flex flex-col items-center gap-3 transition-all hover:-translate-y-1 md:mt-4">
        <div className="absolute top-3 left-3 text-xs font-mono text-zinc-500">#2</div>
        <div className="h-16 w-16 rounded-full p-[2px] bg-gradient-to-b from-slate-300 to-slate-600">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
            className="w-full h-full rounded-full object-cover border-2 border-zinc-950"
            alt="User"
          />
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-white">Aliceverse</div>
          <div className="text-xs font-mono text-zinc-500 mt-0.5">@alice_sol</div>
        </div>
        <div className="w-full h-px bg-white/5"></div>
        <div className="flex justify-between w-full text-xs">
          <span className="text-zinc-500">Pixels</span>
          <span className="text-white font-mono">1,204</span>
        </div>
        <div className="flex justify-between w-full text-xs">
          <span className="text-zinc-500">Volume</span>
          <span className="text-white font-mono">42.5 SOL</span>
        </div>
      </div>

      {/* #1 Gold */}
      <div className="relative group bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-xl p-5 flex flex-col items-center gap-3 shadow-[0_0_30px_rgba(234,179,8,0.1)] scale-105 z-10">
        <div className="absolute -top-3">
          <CrownIcon className="text-yellow-400 drop-shadow-lg w-6 h-6" />
        </div>
        <div className="h-20 w-20 rounded-full p-[2px] bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
            className="w-full h-full rounded-full object-cover border-4 border-zinc-950"
            alt="User"
          />
        </div>
        <div className="text-center">
          <div className="text-base font-semibold text-white">CryptoKing</div>
          <div className="text-xs font-mono text-yellow-500/80 mt-0.5">@king_dev</div>
        </div>
        <div className="w-full h-px bg-yellow-500/20"></div>
        <div className="flex justify-between w-full text-sm">
          <span className="text-zinc-400">Pixels</span>
          <span className="text-white font-mono">3,492</span>
        </div>
        <div className="flex justify-between w-full text-sm">
          <span className="text-zinc-400">Volume</span>
          <span className="text-white font-mono">158.2 SOL</span>
        </div>
      </div>

      {/* #3 Bronze */}
      <div className="relative group bg-zinc-900/40 border border-white/5 hover:border-white/10 rounded-xl p-5 flex flex-col items-center gap-3 transition-all hover:-translate-y-1 md:mt-4">
        <div className="absolute top-3 left-3 text-xs font-mono text-zinc-500">#3</div>
        <div className="h-16 w-16 rounded-full p-[2px] bg-gradient-to-b from-orange-300 to-orange-700">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
            className="w-full h-full rounded-full object-cover border-2 border-zinc-950"
            alt="User"
          />
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-white">PixelPirate</div>
          <div className="text-xs font-mono text-zinc-500 mt-0.5">7x...99b</div>
        </div>
        <div className="w-full h-px bg-white/5"></div>
        <div className="flex justify-between w-full text-xs">
          <span className="text-zinc-500">Pixels</span>
          <span className="text-white font-mono">982</span>
        </div>
        <div className="flex justify-between w-full text-xs">
          <span className="text-zinc-500">Volume</span>
          <span className="text-white font-mono">28.1 SOL</span>
        </div>
      </div>
    </div>
  );
}
