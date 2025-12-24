import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * These are only available on the server.
   */
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z
      .string()
      .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Client-side environment variables schema.
   * These are exposed to the client via NEXT_PUBLIC_ prefix.
   */
  client: {
    NEXT_PUBLIC_BASE_API_URL: z.string().optional(),
    NEXT_PUBLIC_SUPABASE_URL: z
      .string()
      .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z
      .string()
      .min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY is required"),
    NEXT_PUBLIC_SOLANA_NETWORK: z
      .enum(["devnet", "testnet", "mainnet-beta"])
      .default("devnet"),
    NEXT_PUBLIC_SOLANA_RPC_URL: z.string().url().optional(),
    NEXT_PUBLIC_SPOT_PRICE_SOL: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
      .default("0.01"),
  },

  /**
   * Runtime environment variables.
   * Maps the actual environment variables to the schema.
   */
  runtimeEnv: {
    // Server
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    // Client
    NEXT_PUBLIC_BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK,
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    NEXT_PUBLIC_SPOT_PRICE_SOL: process.env.NEXT_PUBLIC_SPOT_PRICE_SOL,
  },

  /**
   * Skip validation in certain environments.
   * Useful for Docker builds where env vars aren't available during build.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
