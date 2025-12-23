"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch wallet balance
  useEffect(() => {
    if (publicKey && connected) {
      connection
        .getBalance(publicKey)
        .then((bal) => setBalance(bal / LAMPORTS_PER_SOL))
        .catch(() => setBalance(null));
    } else {
      setBalance(null);
    }
  }, [publicKey, connected, connection]);

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = () => {
    disconnect();
    setDropdownOpen(false);
  };

  if (!connected) {
    return (
      <button
        onClick={handleConnect}
        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
          />
        </svg>
        Connect Wallet
      </button>
    );
  }

  const truncatedAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full" />
        <span>{truncatedAddress}</span>
        {balance !== null && (
          <span className="text-primary-foreground/80 text-sm">
            {balance.toFixed(2)} SOL
          </span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-transform ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-3 border-b border-border">
              <div className="text-xs text-muted-foreground">
                Wallet Address
              </div>
              <div className="text-sm font-mono text-foreground mt-1 break-all">
                {publicKey?.toBase58()}
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-2 text-left hover:bg-accent text-foreground transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}
