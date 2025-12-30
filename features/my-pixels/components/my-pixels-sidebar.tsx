"use client";

import { FloppyDiskIcon } from "@phosphor-icons/react";
import { useState } from "react";

export function MyPixelsSidebar() {
  const [color, setColor] = useState("#9945FF");
  const [r, setR] = useState(153);
  const [g, setG] = useState(69);
  const [b, setB] = useState(255);

  const swatches = [
    "#9945FF",
    "#14F195",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#ffffff",
    "#000000",
  ];

  return (
    <>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Selected Pixel Header */}
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded border border-white/10 shadow-[0_0_15px_rgba(153,69,255,0.2)] transition-colors"
            style={{ backgroundColor: color }}
          ></div>
          <div>
            <h2 className="text-sm font-medium text-white">Block #1024</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-zinc-500">
                X:42 Y:88
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
              <span className="text-[10px] text-emerald-400">Owned</span>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-white/5"></div>

        {/* Color Picker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-400">Color</label>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              {color}
            </span>
          </div>

          {/* Hex Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">
                #
              </span>
              <input
                type="text"
                value={color.replace("#", "")}
                onChange={(e) => setColor(`#${e.target.value}`)}
                className="w-full bg-zinc-900 border border-white/10 rounded pl-6 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50 transition-colors uppercase"
              />
            </div>
            <div
              className="w-10 h-10 rounded border border-white/10 transition-colors"
              style={{ backgroundColor: color }}
            ></div>
          </div>

          {/* Swatches */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {swatches.map((s) => (
              <button
                key={s}
                onClick={() => setColor(s)}
                className={`aspect-square rounded border transition-all ${
                  color === s
                    ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-zinc-950 scale-95"
                    : "border-white/10 hover:border-white/30"
                }`}
                style={{ backgroundColor: s }}
              ></button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-2">
          {[
            { label: "R", value: r, setter: setR },
            { label: "G", value: g, setter: setG },
            { label: "B", value: b, setter: setB },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>{item.label}</span>
                <span className="font-mono">{item.value}</span>
              </div>
              <input
                type="range"
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                min="0"
                max="255"
                value={item.value}
                onChange={(e) => item.setter(parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-white/5"></div>

        {/* Metadata */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-zinc-400">
            Attributes
          </label>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-zinc-900 border border-white/5 rounded p-2">
              <div className="text-[10px] text-zinc-500 mb-1 font-medium uppercase tracking-wider">
                Status
              </div>
              <select className="w-full bg-transparent text-xs text-white outline-none border-none p-0 appearance-none cursor-pointer">
                <option className="bg-zinc-900">Public</option>
                <option className="bg-zinc-900">Private</option>
              </select>
            </div>
            <div className="bg-zinc-900 border border-white/5 rounded p-2">
              <div className="text-[10px] text-zinc-500 mb-1 font-medium uppercase tracking-wider">
                Link (Optional)
              </div>
              <input
                type="text"
                placeholder="https://"
                className="w-full bg-transparent text-xs text-white outline-none placeholder-zinc-700"
              />
            </div>
          </div>
        </div>

        {/* Sell Option */}
        <div className="p-3 rounded border border-dashed border-white/10 hover:border-white/20 transition-colors bg-white/5 cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-300">
              List for Sale
            </span>
            <div className="w-8 h-4 bg-zinc-800 rounded-full relative transition-colors group-hover:bg-zinc-700">
              <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-zinc-500"></div>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Set a price to allow others to buy this pixel from you.
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-5 border-t border-white/5 bg-zinc-950/50 backdrop-blur-sm z-10 space-y-3">
        <button className="w-full bg-white hover:bg-zinc-200 text-black rounded py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95">
          <FloppyDiskIcon size={16} weight="bold" />
          Update Pixel
        </button>
        <div className="text-[10px] text-center text-zinc-600">
          Gas fee estimate: <span className="text-zinc-400">0.00005 SOL</span>
        </div>
      </div>
    </>
  );
}
