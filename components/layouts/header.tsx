"use client";

import { GRID_SIZE } from "@/features/pixels-grid/utils/grid-utils";
import { useStats } from "@/features/pixels-grid/api/get-stats";
import { WalletButton } from "../ui/wallet-button";
import { CircleNotchIcon } from "@phosphor-icons/react";

export function Header() {
  const { data: stats, isError, isLoading } = useStats();

  const totalSpots = GRID_SIZE * GRID_SIZE;
  const soldPixels = stats?.totalPixelsSold ?? 0;

  return (
    <header className="h-14 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-4 z-50 fixed top-0 w-full">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-linear-to-br from-purple-600 to-emerald-400 rounded flex items-center justify-center shadow-[0_0_15px_rgba(153,69,255,0.3)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4.5 h-4.5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
        </div>
        <h1 className="font-semibold tracking-tighter text-white text-base">
          SOLGRID
        </h1>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-[10px] uppercase tracking-wide text-zinc-500">
          Beta
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-400">Live</span>
          </div>
          <div>
            <span className="text-zinc-400">
              {isLoading ? (
                <CircleNotchIcon className="inline-block w-3.5 h-3.5 animate-spin" />
              ) : isError ? (
                "—"
              ) : (
                soldPixels.toLocaleString()
              )}
            </span>{" "}
            / {totalSpots.toLocaleString()} Pixels
          </div>
          <div>
            Floor: <span className="text-zinc-400">0.05 SOL</span>
          </div>
        </div>

        <WalletButton />
      </div>
    </header>
  );
}
