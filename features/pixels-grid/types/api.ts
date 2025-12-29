export interface Spot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  image_url?: string;
  link_url?: string;
  owner_wallet: string;
  tx_signature?: string;
  created_at: string;
  updated_at: string;
}

// GET /api/spots
export type GetSpotsResponse = {
  spots: Spot[];
};

// POST /api/spots
export type CreateSpotInput = {
  x: number;
  y: number;
  width: number;
  height: number;
  image_url?: string;
  link_url?: string;
  owner_wallet: string;
  tx_signature?: string;
};

export type CreateSpotResponse = {
  spot: Spot;
};

// POST /api/spots/check
export type CheckSpotAvailabilityInput = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type CheckSpotAvailabilityResponse = {
  available: boolean;
  hasCollision: boolean;
  conflictingSpots: Spot[];
};

// POST /api/spots/upload
export type UploadSpotImageInput = {
  file: File;
  spotId: string;
};

export type UploadSpotImageResponse = {
  url: string;
  path: string;
};

// GET /api/spots/stats
export type GetStatsResponse = {
  totalPixelsSold: number;
  totalSpots: number;
  uniqueOwners: number;
  lastUpdated: string | null;
};

// GET /api/whitelist/check
export type CheckWhitelistInput = {
  wallet: string;
};

export type CheckWhitelistResponse = {
  isWhitelisted: boolean;
  allowance: number;
  walletAddress: string;
};
