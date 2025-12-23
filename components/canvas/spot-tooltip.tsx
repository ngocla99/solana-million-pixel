"use client";

interface SpotTooltipProps {
  x: number;
  y: number;
  screenX: number;
  screenY: number;
  sold?: boolean;
  imageUrl?: string;
}

export function SpotTooltip({
  x,
  y,
  screenX,
  screenY,
  sold = false,
  imageUrl,
}: SpotTooltipProps) {
  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: screenX + 16,
        top: screenY + 16,
      }}
    >
      <div className="bg-zinc-900 border border-white/10 px-2 py-1 rounded text-[10px] text-zinc-400 whitespace-nowrap shadow-xl flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>
          Spot ({x}, {y})
        </span>
        <span className="opacity-50">|</span>
        <span className={sold ? "text-rose-400" : "text-emerald-400"}>
          {sold ? "Sold" : "Available"}
        </span>
      </div>
    </div>
  );
}
