"use client";

import { CanvasGrid } from "@/components/canvas/canvas-grid";
import { GridHeader } from "@/components/ui/grid-header";
import { useState, useCallback } from "react";

export default function Page() {
  const [selection, setSelection] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const handleSelectionComplete = useCallback((sel: typeof selection) => {
    setSelection(sel);
    console.log("Selection completed:", sel);
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      <GridHeader />
      <div className="pt-16 h-full">
        <CanvasGrid onSelectionComplete={handleSelectionComplete} />
      </div>
    </main>
  );
}
