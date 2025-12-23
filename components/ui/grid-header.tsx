"use client";

import { GRID_SIZE } from "@/lib/grid-utils";
import { WalletButton } from "./wallet-button";

interface GridHeaderProps {
  spotsRemaining?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
}

export function GridHeader({
  spotsRemaining = GRID_SIZE * GRID_SIZE,
  onZoomIn,
  onZoomOut,
  onReset,
}: GridHeaderProps) {
  const totalSpots = GRID_SIZE * GRID_SIZE;
  const soldSpots = totalSpots - spotsRemaining;
  const percentageSold = ((soldSpots / totalSpots) * 100).toFixed(2);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">
              M$
            </span>
          </div>
          <div>
            <h1 className="text-foreground font-bold text-lg">
              Million Dollar
            </h1>
            <p className="text-muted-foreground text-xs">Powered by Solana</p>
          </div>
        </div>

        {/* Scarcity Meter */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {spotsRemaining.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs">Spots Remaining</div>
          </div>
          <div className="w-40 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${percentageSold}%` }}
            />
          </div>
          <div className="text-muted-foreground text-sm">
            {percentageSold}% sold
          </div>
        </div>

        {/* Wallet & Controls */}
        <div className="flex items-center gap-2">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
