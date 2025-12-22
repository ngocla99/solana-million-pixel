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
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xl">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              sold ? "bg-destructive" : "bg-primary"
            }`}
          />
          <span className="text-foreground text-sm font-medium">
            Spot ({x}, {y})
          </span>
        </div>
        <div className="text-muted-foreground text-xs mt-1">
          {sold ? "Sold" : "Available"}
        </div>
        {imageUrl && (
          <div className="mt-2">
            <img
              src={imageUrl}
              alt="Spot preview"
              className="w-24 h-24 object-cover rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
