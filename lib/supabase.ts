import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

// Browser client for frontend operations
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

// Server client for API routes (with service role key for admin operations)
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database types
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
