"use client";

import { GridHeader } from "@/components/layouts/grid-header";
import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CanvasGrid } from "@/features/pixels-grid/components/canvas-grid";
import { Sidebar } from "@/components/layouts/sidebar";

export default function Page() {
  const { publicKey } = useWallet();
  const [selection, setSelection] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleSelectionComplete = useCallback(async (sel: typeof selection) => {
    if (!sel) {
      setSelection(null);
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch("/api/spots/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sel),
      });

      const data = await response.json();

      if (data.hasCollision) {
        alert(
          `These spots are already taken! ${data.conflictingSpots.length} conflicting spot(s) found.`
        );
        setSelection(null);
        return;
      }

      setSelection(sel);
    } catch (error) {
      console.error("Error checking spots:", error);
      alert("Failed to check spot availability. Please try again.");
    } finally {
      setIsChecking(false);
    }
  }, []);

  const handlePurchaseSubmit = useCallback(
    async (data: { image: File | null; linkUrl: string }) => {
      if (!selection || !publicKey) {
        alert("Please connect your wallet first");
        return;
      }

      setIsSubmitting(true);
      try {
        let imageUrl = "";

        // Handle image upload if provided (Sidebar might need actual file input eventually)
        if (data.image) {
          const formData = new FormData();
          formData.append("file", data.image);
          formData.append("spotId", `${selection.startX}-${selection.startY}`);

          const uploadResponse = await fetch("/api/spots/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) throw new Error("Failed to upload image");
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }

        const width = Math.abs(selection.endX - selection.startX) + 1;
        const height = Math.abs(selection.endY - selection.startY) + 1;

        const createResponse = await fetch("/api/spots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            x: Math.min(selection.startX, selection.endX),
            y: Math.min(selection.startY, selection.endY),
            width,
            height,
            image_url: imageUrl,
            link_url: data.linkUrl,
            owner_wallet: publicKey.toBase58(),
          }),
        });

        if (!createResponse.ok) throw new Error("Failed to create spot");

        alert(
          "Spot purchased successfully! (Payment integration coming in Milestone 4)"
        );
        setSelection(null);
        window.location.reload();
      } catch (error) {
        console.error("Error purchasing spot:", error);
        alert("Failed to purchase spot. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [selection, publicKey]
  );

  return (
    <div className="flex flex-col h-screen w-full relative bg-zinc-950">
      <GridHeader />

      <main className="flex-1 flex overflow-hidden pt-14 relative">
        {/* Left: Infinite Canvas */}
        <div className="flex-1 bg-zinc-950 relative overflow-hidden">
          <CanvasGrid onSelectionComplete={handleSelectionComplete} />
        </div>

        {/* Right: Interaction Sidebar */}
        <Sidebar
          selection={selection}
          onSubmit={handlePurchaseSubmit}
          isSubmitting={isSubmitting}
        />
      </main>

      {isChecking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all animate-in fade-in">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-zinc-300">
              Checking spot availability...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
