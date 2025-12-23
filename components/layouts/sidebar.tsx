"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selection: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null;
  onSubmit: (data: { image: File | null; linkUrl: string }) => void;
  isSubmitting?: boolean;
}

export function Sidebar({ selection, onSubmit, isSubmitting }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<
    "selected" | "my-pixels" | "leaderboard"
  >("selected");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [blockSize, setBlockSize] = useState<"1x1" | "2x2" | "5x5">("1x1");

  const x = selection ? Math.min(selection.startX, selection.endX) : 0;
  const y = selection ? Math.min(selection.startY, selection.endY) : 0;
  const width = selection ? Math.abs(selection.endX - selection.startX) + 1 : 0;
  const height = selection
    ? Math.abs(selection.endY - selection.startY) + 1
    : 0;

  const basePrice = 0.05; // Hardcoded for now as per mock
  const networkFee = 0.00005;
  const total = basePrice + networkFee;

  return (
    <aside className="w-80 bg-zinc-950 border-l border-white/5 flex flex-col z-20 shadow-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/5 shrink-0">
        {(["selected", "my-pixels", "leaderboard"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3 text-[10px] uppercase tracking-wider font-semibold transition-colors",
              activeTab === tab
                ? "text-white border-b border-purple-500 bg-white/5"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            )}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        {activeTab === "selected" && (
          <>
            {/* Coordinates Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-white tracking-tight">
                  Coordinates
                </h2>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Available
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/50 border border-white/10 rounded px-3 py-2 flex flex-col">
                  <label className="text-[10px] text-zinc-500 uppercase font-mono">
                    X-Axis
                  </label>
                  <span className="font-mono text-sm text-white">
                    {selection ? x : "--"}
                  </span>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 rounded px-3 py-2 flex flex-col">
                  <label className="text-[10px] text-zinc-500 uppercase font-mono">
                    Y-Axis
                  </label>
                  <span className="font-mono text-sm text-white">
                    {selection ? y : "--"}
                  </span>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-white tracking-tight">
                Pixel Data
              </h2>

              {/* Block Size Selector */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Block Size</span>
                  <span className="text-white">{blockSize}</span>
                </div>
                <div className="flex gap-2">
                  {(["1x1", "2x2", "5x5"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setBlockSize(size)}
                      className={cn(
                        "flex-1 py-1.5 text-xs rounded transition-colors border",
                        blockSize === size
                          ? "border-purple-500/50 bg-purple-500/10 text-white"
                          : "border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400">Upload Image</label>
                <div className="relative w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-white/10 rounded cursor-pointer bg-zinc-900/30 hover:bg-zinc-900/80 hover:border-purple-500/50 transition-all group overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-3 pb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          className="mb-2 text-zinc-500 group-hover:text-purple-400 transition-colors"
                        >
                          <g
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" x2="12" y1="3" y2="15"></line>
                          </g>
                        </svg>
                        <p className="text-[10px] text-zinc-500 group-hover:text-zinc-400 text-center leading-tight">
                          <span className="font-medium text-zinc-300 group-hover:text-purple-200">
                            Click to upload
                          </span>
                          <br />
                          or drag & drop
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFile(file);
                          const url = URL.createObjectURL(file);
                          setPreviewUrl(url);
                        }
                      }}
                    />
                  </label>
                  {previewUrl && (
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl("");
                      }}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="text-[10px] text-zinc-600">
                  Supports PNG, JPG, GIF (Max 2MB)
                </div>
              </div>

              {/* Redirect Link */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400">Redirect Link</label>
                <div className="relative group focus-within:ring-1 focus-within:ring-purple-500 rounded transition-all">
                  <div className="absolute left-3 top-2.5 text-zinc-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="your-project.com"
                    className="w-full bg-zinc-900 border border-white/10 rounded py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-700 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-3 rounded bg-zinc-900/50 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Base Price</span>
                <span className="text-zinc-300 font-mono">
                  {basePrice.toFixed(2)} SOL
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Network Fee</span>
                <span className="text-zinc-300 font-mono">
                  ~{networkFee} SOL
                </span>
              </div>
              <div className="h-px bg-white/5 w-full my-1"></div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-white">Total</span>
                <div className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-400"
                  >
                    <circle cx="8" cy="8" r="6" />
                    <path d="M18.09 10.37A6 6 0 1 1 10.34 18.1" />
                    <path d="M7 6h1v4" />
                    <path d="m16.71 13.88.7.71-2.82 2.82" />
                  </svg>
                  <span className="text-white font-mono tracking-tight">
                    {total.toFixed(2)} SOL
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab !== "selected" && (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-600 italic text-xs">
            Coming soon...
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-5 border-t border-white/5 bg-zinc-950/50 backdrop-blur-sm shrink-0">
        <button
          onClick={() => onSubmit({ image: file, linkUrl })}
          disabled={!selection || isSubmitting}
          className="w-full group relative overflow-hidden rounded py-2.5 text-sm font-medium text-white transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-emerald-500 opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="group-hover:opacity-20 transition-opacity opacity-70 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] absolute inset-0"></div>
          <span className="relative flex items-center justify-center gap-2">
            {isSubmitting ? "Processing..." : "Mint Pixel"}
            {!isSubmitting && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </span>
        </button>
        <p className="text-[10px] text-zinc-600 text-center mt-3">
          By minting, you agree to the{" "}
          <span className="text-zinc-500 hover:text-zinc-400 underline cursor-pointer">
            Pixel Protocol Terms
          </span>
          .
        </p>
      </div>
    </aside>
  );
}
