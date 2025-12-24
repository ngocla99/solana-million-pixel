"use client";

import { env } from "@/config/env";
import { getSelectionInfo } from "@/features/pixels-grid/utils/grid-utils";
import {
  compressImage,
  isValidImageType,
} from "@/features/pixels-grid/utils/image-utils";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  X,
} from "@phosphor-icons/react";
import { useCallback, useRef, useState } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "./label";

interface PurchaseModalProps {
  selection: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null;
  onClose: () => void;
  onSubmit: (data: { image: File; linkUrl: string }) => Promise<void>;
}

export function PurchaseModal({
  selection,
  onClose,
  onSubmit,
}: PurchaseModalProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selection) return null;

  const selectionInfo = getSelectionInfo(selection);
  const spotPrice = parseFloat(env.NEXT_PUBLIC_SPOT_PRICE_SOL);
  const totalPrice = selectionInfo.totalSpots * spotPrice;

  const handleImageSelect = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      if (!isValidImageType(file)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      // Validate file size (max 10MB before compression)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image file is too large (max 10MB)");
        return;
      }

      try {
        setIsCompressing(true);

        // Compress image
        const compressedFile = await compressImage(
          file,
          selectionInfo.width,
          selectionInfo.height
        );

        // Create preview
        const previewUrl = URL.createObjectURL(compressedFile);
        setImagePreview(previewUrl);
        setImage(compressedFile);
      } catch (err) {
        console.error("Error processing image:", err);
        setError("Failed to process image. Please try again.");
      } finally {
        setIsCompressing(false);
      }
    },
    [selectionInfo.width, selectionInfo.height]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleImageSelect(file);
      }
    },
    [handleImageSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!image) {
      setError("Please select an image");
      return;
    }

    if (!linkUrl) {
      setError("Please enter a link URL");
      return;
    }

    // Validate URL format
    try {
      new URL(linkUrl);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ image, linkUrl });
    } catch (err) {
      console.error("Error submitting:", err);
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Purchase Spots
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your image and add a clickable link
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Selection Info */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
              <p className="text-lg font-semibold">
                {selectionInfo.width} × {selectionInfo.height}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Spots</p>
              <p className="text-lg font-semibold">
                {selectionInfo.totalSpots.toLocaleString()}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Price</p>
              <p className="text-lg font-semibold">
                {totalPrice.toFixed(3)} SOL
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label htmlFor="image" className="flex items-center gap-2 mb-2">
                <ImageIcon className="h-4 w-4" />
                Image Upload
              </Label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {isCompressing
                        ? "Compressing image..."
                        : "Drag and drop an image, or click to browse"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, GIF, or WebP (max 10MB)
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Link URL */}
            <div>
              <Label htmlFor="linkUrl" className="flex items-center gap-2 mb-2">
                <LinkIcon className="h-4 w-4" />
                Link URL
              </Label>
              <Input
                id="linkUrl"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Users will be redirected here when clicking your spot
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isCompressing || !image || !linkUrl}
              >
                {isSubmitting
                  ? "Processing..."
                  : `Purchase for ${totalPrice.toFixed(3)} SOL`}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
