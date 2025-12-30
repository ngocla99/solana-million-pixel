"use client";

import {
  StackIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { StatsOverview } from "./stats-overview";
import { PixelItemCard } from "./pixel-item-card";

export function MyPixelsView() {
  const pixels = [
    {
      id: "1024",
      x: 42,
      y: 88,
      color: "#9945FF",
      status: "active" as const,
      lastEdit: "2h ago",
      isSelected: true,
    },
    {
      id: "882",
      x: 12,
      y: 4,
      color: "#14F195",
      imageUrl:
        "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=300&auto=format&fit=crop",
      status: "active" as const,
      lastEdit: "1d ago",
    },
    {
      id: "331",
      x: 99,
      y: 12,
      color: "#3B82F6",
      status: "for-sale" as const,
      price: 0.5,
      lastEdit: "Listed 5h ago",
    },
    {
      id: "1204",
      x: 15,
      y: 15,
      status: "empty" as const,
    },
    {
      id: "12",
      x: 1,
      y: 1,
      color: "#4F46E5",
      status: "genesis" as const,
      lastEdit: "Genesis Block",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 h-full overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-xl font-medium text-white tracking-tight flex items-center gap-2">
            <StackIcon
              className="text-emerald-400"
              size={24}
              weight="duotone"
            />
            My Collection
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Manage, edit, and list your digital real estate.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500">
              <MagnifyingGlassIcon size={14} />
            </span>
            <input
              type="text"
              placeholder="Search coordinates..."
              className="bg-zinc-900 border border-white/5 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 w-48 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-all">
            <FunnelIcon size={14} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-black bg-white rounded hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <PlusIcon size={14} weight="bold" />
            Mint New
          </button>
        </div>
      </div>

      <StatsOverview />

      {/* Pixel Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {pixels.map((pixel) => (
          <PixelItemCard key={pixel.id} {...pixel} />
        ))}

        {/* Add New Placeholder */}
        <div className="group relative border border-dashed border-white/10 hover:border-white/20 rounded flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all hover:bg-white/5 cursor-pointer">
          <div className="h-10 w-10 rounded bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <PlusIcon
              className="text-zinc-400 group-hover:text-white"
              size={20}
            />
          </div>
          <div className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300">
            Mint New Pixel
          </div>
        </div>
      </div>
    </div>
  );
}
