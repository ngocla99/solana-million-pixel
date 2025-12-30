-- Migration: Add color_hex column to spots table
-- Allows users to specify a solid color instead of uploading an image

ALTER TABLE spots ADD COLUMN IF NOT EXISTS color_hex TEXT;

-- Add comment for documentation
COMMENT ON COLUMN spots.color_hex IS 'Optional hex color code (e.g., #FF5733) for solid color blocks when no image is uploaded';
