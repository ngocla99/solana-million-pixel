"use client";

import { Header } from "@/components/layouts/header";
import { Sidebar } from "@/components/layouts/sidebar";
import { useCheckSpotAvailability } from "@/features/pixels-grid/api/check-spot-availability";
import { CanvasGrid } from "@/features/pixels-grid/components/canvas-grid";
import {
  setIsAvailable,
  setIsChecking,
} from "@/features/pixels-grid/stores/use-grid-store";
import { useCallback, useState } from "react";

export default function Page() {
  const [selection, setSelection] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const checkSpotAvailability = useCheckSpotAvailability();

  const handleSelectionComplete = useCallback(
    async (sel: typeof selection) => {
      if (!sel) {
        setSelection(null);
        setIsAvailable(false);
        return;
      }

      setSelection(sel);
      setIsChecking(true);
      setIsAvailable(false);

      try {
        const data = await checkSpotAvailability.mutateAsync(sel);

        if (data.hasCollision) {
          setIsAvailable(false);
        } else {
          setIsAvailable(true);
        }
      } catch (error) {
        console.error("Error checking spots:", error);
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    },
    [checkSpotAvailability]
  );

  return (
    <div className="flex flex-col h-screen w-full relative bg-zinc-950">
      <Header />

      <main className="flex-1 flex overflow-hidden pt-14 relative">
        {/* Left: Infinite Canvas */}
        <div className="flex-1 bg-zinc-950 relative overflow-hidden">
          <CanvasGrid onSelectionComplete={handleSelectionComplete} />
        </div>

        {/* Right: Interaction Sidebar */}
        <Sidebar />
      </main>
    </div>
  );
}
