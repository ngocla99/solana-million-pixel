"use client";

import { CanvasGrid } from "@/components/canvas/canvas-grid";
import { GridHeader } from "@/components/ui/grid-header";
import { PurchaseModal } from "@/components/ui/purchase-modal";
import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Page() {
  const { publicKey } = useWallet();
  const [selection, setSelection] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleSelectionComplete = useCallback(async (sel: typeof selection) => {
    if (!sel) return;

    setIsChecking(true);

    try {
      // Check for collisions
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

      // If available, show purchase modal
      setSelection(sel);
      setShowModal(true);
    } catch (error) {
      console.error("Error checking spots:", error);
      alert("Failed to check spot availability. Please try again.");
    } finally {
      setIsChecking(false);
    }
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setSelection(null);
  }, []);

  const handlePurchaseSubmit = useCallback(
    async (data: { image: File; linkUrl: string }) => {
      if (!selection || !publicKey) {
        alert("Please connect your wallet first");
        return;
      }

      try {
        // 1. Upload image to Supabase Storage
        const formData = new FormData();
        formData.append("file", data.image);
        formData.append("spotId", `${selection.startX}-${selection.startY}`);

        const uploadResponse = await fetch("/api/spots/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const { url: imageUrl } = await uploadResponse.json();

        // 2. Create spot in database
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

        if (!createResponse.ok) {
          throw new Error("Failed to create spot");
        }

        alert(
          "Spot purchased successfully! (Payment integration coming in Milestone 4)"
        );
        handleModalClose();

        // Refresh the page to show the new spot
        window.location.reload();
      } catch (error) {
        console.error("Error purchasing spot:", error);
        throw error;
      }
    },
    [selection, publicKey, handleModalClose]
  );

  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      <GridHeader />
      <div className="pt-16 h-full">
        <CanvasGrid onSelectionComplete={handleSelectionComplete} />
      </div>

      {showModal && (
        <PurchaseModal
          selection={selection}
          onClose={handleModalClose}
          onSubmit={handlePurchaseSubmit}
        />
      )}

      {isChecking && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="bg-background rounded-lg p-6 shadow-lg">
            <p className="text-sm">Checking spot availability...</p>
          </div>
        </div>
      )}
    </main>
  );
}
