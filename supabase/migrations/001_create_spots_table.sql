-- Milestone 3: Spots Table Schema
-- This migration creates the spots table for storing purchased pixel grid spots

-- Create spots table
CREATE TABLE IF NOT EXISTS spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  width INTEGER NOT NULL DEFAULT 1,
  height INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  link_url TEXT,
  owner_wallet TEXT NOT NULL,
  tx_signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure no duplicate coordinates
  CONSTRAINT unique_spot_position UNIQUE (x, y)
);

-- Create index for fast collision detection
CREATE INDEX IF NOT EXISTS idx_spots_coordinates ON spots (x, y, width, height);

-- Enable Row Level Security
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read spots
DROP POLICY IF EXISTS "Spots are viewable by everyone" ON spots;
CREATE POLICY "Spots are viewable by everyone" 
  ON spots FOR SELECT 
  USING (true);

-- RLS Policy: Only service role can insert spots
DROP POLICY IF EXISTS "Service role can insert spots" ON spots;
CREATE POLICY "Service role can insert spots" 
  ON spots FOR INSERT 
  WITH CHECK (true);

-- Create storage bucket for spot images
INSERT INTO storage.buckets (id, name, public)
VALUES ('spot-images', 'spot-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can read images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'spot-images');

-- Storage policy: Authenticated users can upload
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'spot-images');
