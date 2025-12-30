import { UserIcon } from "@phosphor-icons/react";

export function LeaderboardTable() {
  return (
    <div className="rounded border border-white/5 bg-zinc-900/30 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-zinc-500">
            <th className="px-6 py-4 font-medium w-16 text-center">Rank</th>
            <th className="px-6 py-4 font-medium">User</th>
            <th className="px-6 py-4 font-medium text-right">Pixels</th>
            <th className="px-6 py-4 font-medium text-right">Area Covered</th>
            <th className="px-6 py-4 font-medium text-right">Total Volume</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-xs">
          {/* Row 4 */}
          <tr className="group hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 text-center font-mono text-zinc-500">4</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-medium">
                  D
                </div>
                <div>
                  <div className="text-white font-medium">DAO_Treasury</div>
                  <div className="text-[10px] text-zinc-500">dao.sol</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-right font-mono text-zinc-300">
              850
            </td>
            <td className="px-6 py-4 text-right font-mono text-zinc-500">
              0.85%
            </td>
            <td className="px-6 py-4 text-right font-mono text-white">
              21.4 SOL
            </td>
          </tr>
          {/* Row 5 */}
          <tr className="group hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 text-center font-mono text-zinc-500">5</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-medium">
                  M
                </div>
                <div>
                  <div className="text-white font-medium">MoonBois</div>
                  <div className="text-[10px] text-zinc-500">3x...88c</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-right font-mono text-zinc-300">
              620
            </td>
            <td className="px-6 py-4 text-right font-mono text-zinc-500">
              0.62%
            </td>
            <td className="px-6 py-4 text-right font-mono text-white">
              18.2 SOL
            </td>
          </tr>
          {/* Row 6 */}
          <tr className="group hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 text-center font-mono text-zinc-500">6</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100&auto=format&fit=crop"
                  className="h-8 w-8 rounded-full object-cover"
                  alt="User"
                />
                <div>
                  <div className="text-white font-medium">NFT_Collector</div>
                  <div className="text-[10px] text-zinc-500">collect.sol</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-right font-mono text-zinc-300">
              445
            </td>
            <td className="px-6 py-4 text-right font-mono text-zinc-500">
              0.44%
            </td>
            <td className="px-6 py-4 text-right font-mono text-white">
              12.9 SOL
            </td>
          </tr>
          {/* Row 7 */}
          <tr className="group hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 text-center font-mono text-zinc-500">7</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-medium">
                  S
                </div>
                <div>
                  <div className="text-white font-medium">SolanaLover</div>
                  <div className="text-[10px] text-zinc-500">9z...11a</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-right font-mono text-zinc-300">
              320
            </td>
            <td className="px-6 py-4 text-right font-mono text-zinc-500">
              0.32%
            </td>
            <td className="px-6 py-4 text-right font-mono text-white">
              8.5 SOL
            </td>
          </tr>
          {/* Row 8 */}
          <tr className="group hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 text-center font-mono text-zinc-500">8</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-zinc-400 font-medium italic">
                    Anonymous
                  </div>
                  <div className="text-[10px] text-zinc-500">1a...b2c</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-right font-mono text-zinc-300">
              210
            </td>
            <td className="px-6 py-4 text-right font-mono text-zinc-500">
              0.21%
            </td>
            <td className="px-6 py-4 text-right font-mono text-white">
              5.1 SOL
            </td>
          </tr>
        </tbody>
      </table>

      {/* Pagination */}
      <div className="border-t border-white/5 p-4 flex items-center justify-between text-xs text-zinc-500">
        <span>Showing 1-8 of 1,204</span>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 hover:bg-white/5 rounded transition-colors disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-2 py-1 hover:bg-white/5 rounded transition-colors text-white">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
