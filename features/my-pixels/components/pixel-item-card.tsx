import { TagIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface PixelItemCardProps {
  id: string;
  x: number;
  y: number;
  color?: string;
  imageUrl?: string;
  status?: "active" | "for-sale" | "empty" | "genesis";
  price?: number;
  lastEdit?: string;
  isSelected?: boolean;
}

export function PixelItemCard({
  id,
  x,
  y,
  color,
  imageUrl,
  status = "active",
  price,
  lastEdit,
  isSelected,
}: PixelItemCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-zinc-900 border rounded overflow-hidden transition-all hover:-translate-y-1 cursor-pointer",
        isSelected
          ? "border-purple-500/50 shadow-lg shadow-purple-500/10"
          : "border-white/5 hover:border-white/10"
      )}
    >
      <div
        className="aspect-square relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: color || "#27272a" }}
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={`Block #${id}`}
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
          />
        )}

        {status === "active" && (
          <div className="absolute top-2 right-2 bg-black/40 backdrop-blur rounded px-1.5 py-0.5 text-[10px] font-mono text-white border border-white/10">
            Active
          </div>
        )}

        {status === "for-sale" && price && (
          <div className="absolute top-2 right-2 bg-amber-500/20 backdrop-blur rounded px-1.5 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <TagIcon size={10} weight="bold" />
            {price} SOL
          </div>
        )}

        {status === "empty" && (
          <span className="text-zinc-600 font-mono text-xs">#{id}</span>
        )}
      </div>

      <div className="p-3 border-t border-white/5 bg-zinc-900/40">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-sm font-medium text-white">
              {status === "empty" ? "Empty Plot" : `Block #${id}`}
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              X: {x}, Y: {y}
            </div>
          </div>
          {status === "active" && (
            <div className="h-2 w-2 rounded-full bg-purple-500 mt-1"></div>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500">
          <span>
            {lastEdit ||
              (status === "empty"
                ? "Virgin Land"
                : status === "genesis"
                ? "Genesis Block"
                : "")}
          </span>
          {status !== "empty" && (
            <span className="group-hover:text-purple-400 transition-colors">
              Edit
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
