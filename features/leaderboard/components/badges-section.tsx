import { LightningIcon, PaletteIcon, LockIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function BadgesSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-white tracking-tight">Badges</h2>

      <div className="grid grid-cols-4 gap-2">
        {/* Badge 1: Early Adopter */}
        <div className="aspect-square bg-purple-500/10 border border-purple-500/30 rounded flex items-center justify-center text-purple-400 relative group cursor-help">
          <LightningIcon className="w-5 h-5" />
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-900 border border-white/10 px-2 py-1 text-[10px] text-white whitespace-nowrap rounded z-50">
            Early Adopter
          </div>
        </div>
        {/* Badge 2: Artist */}
        <div className="aspect-square bg-emerald-500/10 border border-emerald-500/30 rounded flex items-center justify-center text-emerald-400 relative group cursor-help">
          <PaletteIcon className="w-5 h-5" />
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-900 border border-white/10 px-2 py-1 text-[10px] text-white whitespace-nowrap rounded z-50">
            Pixel Artist
          </div>
        </div>
        {/* Locked */}
        <div className="aspect-square bg-zinc-900 border border-white/5 rounded flex items-center justify-center text-zinc-700">
          <LockIcon className="w-4 h-4" />
        </div>
        {/* Locked */}
        <div className="aspect-square bg-zinc-900 border border-white/5 rounded flex items-center justify-center text-zinc-700">
          <LockIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
