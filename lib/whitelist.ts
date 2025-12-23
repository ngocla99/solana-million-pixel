/**
 * Whitelist utilities for free mint authorization
 * For MVP: Using local JSON storage
 * For Production: Replace with Supabase queries
 */

// Local whitelist configuration
// TODO: Move to Supabase for production
const WHITELIST: Record<string, { allowance: number }> = {
  // Add whitelisted wallet addresses here
  // Example:
  // "YourWalletAddressHere...": { allowance: 10 },
};

/**
 * Check if a wallet address is whitelisted
 * @param walletAddress - Solana wallet address
 * @returns Promise<boolean> - True if whitelisted
 */
export async function isWhitelisted(walletAddress: string): Promise<boolean> {
  // Normalize address (trim and lowercase for comparison)
  const normalizedAddress = walletAddress.trim();

  // Check if address exists in whitelist
  return normalizedAddress in WHITELIST;
}

/**
 * Get the remaining allowance for a whitelisted wallet
 * @param walletAddress - Solana wallet address
 * @returns Promise<number> - Number of free spots allowed (0 if not whitelisted)
 */
export async function getWhitelistAllowance(
  walletAddress: string
): Promise<number> {
  const normalizedAddress = walletAddress.trim();

  if (normalizedAddress in WHITELIST) {
    return WHITELIST[normalizedAddress].allowance;
  }

  return 0;
}

/**
 * Add a wallet to the whitelist (admin function)
 * @param walletAddress - Solana wallet address
 * @param allowance - Number of free spots
 */
export function addToWhitelist(walletAddress: string, allowance: number): void {
  const normalizedAddress = walletAddress.trim();
  WHITELIST[normalizedAddress] = { allowance };
}

/**
 * Remove a wallet from the whitelist (admin function)
 * @param walletAddress - Solana wallet address
 */
export function removeFromWhitelist(walletAddress: string): void {
  const normalizedAddress = walletAddress.trim();
  delete WHITELIST[normalizedAddress];
}

/**
 * Decrease allowance for a wallet (called after successful mint)
 * @param walletAddress - Solana wallet address
 * @param amount - Number of spots used
 */
export function decreaseAllowance(walletAddress: string, amount: number): void {
  const normalizedAddress = walletAddress.trim();

  if (normalizedAddress in WHITELIST) {
    WHITELIST[normalizedAddress].allowance = Math.max(
      0,
      WHITELIST[normalizedAddress].allowance - amount
    );
  }
}
