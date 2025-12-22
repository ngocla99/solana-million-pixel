"use client";

import { getSelectionInfo, normalizeSelection } from "@/lib/grid-utils";

interface SelectionOverlayProps {
  selection: { startX: number; startY: number; endX: number; endY: number };
  onClear: () => void;
  onConfirm: () => void;
}

export function SelectionOverlay({
  selection,
  onClear,
  onConfirm,
}: SelectionOverlayProps) {
  const { width, height, totalSpots } = getSelectionInfo(selection);
  const normalized = normalizeSelection(selection);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-card/95 backdrop-blur-sm border border-primary/50 rounded-xl px-6 py-4 shadow-2xl">
        <div className="flex items-center gap-6">
          {/* Selection Info */}
          <div className="text-center">
            <div className="text-foreground font-bold text-lg">
              {width} × {height}
            </div>
            <div className="text-muted-foreground text-sm">
              {totalSpots.toLocaleString()}{" "}
              {totalSpots === 1 ? "spot" : "spots"}
            </div>
          </div>

          {/* Coordinates */}
          <div className="text-center border-l border-border pl-6">
            <div className="text-muted-foreground text-sm">
              From ({normalized.startX}, {normalized.startY})
            </div>
            <div className="text-muted-foreground text-sm">
              To ({normalized.endX}, {normalized.endY})
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 border-l border-border pl-6">
            <button
              onClick={onClear}
              className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
