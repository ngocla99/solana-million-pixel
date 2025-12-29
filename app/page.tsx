"use client";

import { Header } from "@/components/layouts/header";
import { useState, useCallback, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CanvasGrid } from "@/features/pixels-grid/components/canvas-grid";
import { Sidebar } from "@/components/layouts/sidebar";
import { SidebarProvider } from "@/features/pixels-grid/context/sidebar-context";
import {
  setIsChecking,
  setIsAvailable,
} from "@/features/pixels-grid/stores/use-grid-store";
import { useCheckSpotAvailability } from "@/features/pixels-grid/api/check-spot-availability";
import { useUploadSpotImage } from "@/features/pixels-grid/api/upload-spot-image";
import { useCreateSpot } from "@/features/pixels-grid/api/create-spot";

export default function Page() {
  const { publicKey } = useWallet();
  const [selection, setSelection] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkSpotAvailability = useCheckSpotAvailability();
  const uploadSpotImage = useUploadSpotImage();
  const createSpot = useCreateSpot();

  const handleSelectionComplete = useCallback(async (sel: typeof selection) => {
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
  }, [checkSpotAvailability]);

  const handlePurchaseSubmit = useCallback(
    async (data: { image: File | null; linkUrl: string }) => {
      if (!selection || !publicKey) {
        alert("Please connect your wallet first");
        return;
      }

      setIsSubmitting(true);
      try {
        let imageUrl = "";

        // Handle image upload if provided
        if (data.image) {
          const uploadData = await uploadSpotImage.mutateAsync({
            file: data.image,
            spotId: `${selection.startX}-${selection.startY}`,
          });
          imageUrl = uploadData.url;
        }

        const width = Math.abs(selection.endX - selection.startX) + 1;
        const height = Math.abs(selection.endY - selection.startY) + 1;

        await createSpot.mutateAsync({
          x: Math.min(selection.startX, selection.endX),
          y: Math.min(selection.startY, selection.endY),
          width,
          height,
          image_url: imageUrl,
          link_url: data.linkUrl,
          owner_wallet: publicKey.toBase58(),
        });

        alert(
          "Spot purchased successfully! (Payment integration coming in Milestone 4)"
        );
        setSelection(null);
      } catch (error) {
        console.error("Error purchasing spot:", error);
        alert("Failed to purchase spot. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [selection, publicKey, uploadSpotImage, createSpot]
  );

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full relative bg-zinc-950">
        <Header />

        <main className="flex-1 flex overflow-hidden pt-14 relative">
          {/* Left: Infinite Canvas */}
          <div className="flex-1 bg-zinc-950 relative overflow-hidden">
            <CanvasGrid onSelectionComplete={handleSelectionComplete} />
          </div>

          {/* Right: Interaction Sidebar */}
          <Sidebar
            onSubmit={handlePurchaseSubmit}
            isSubmitting={isSubmitting}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
