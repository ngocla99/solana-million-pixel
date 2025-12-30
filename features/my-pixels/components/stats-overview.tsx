import { BellIcon } from "@phosphor-icons/react";

export function StatsOverview() {
  const stats = [
    { label: "Total Pixels", value: "12" },
    { label: "Portfolio Value", value: "0.6", unit: "SOL" },
    { label: "Listed for Sale", value: "2" },
    {
      label: "Offers Received",
      value: "3",
      highlight: true,
      icon: <BellIcon className="w-3.5 h-3.5" weight="bold" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded bg-zinc-900/20 border border-white/5 hover:bg-zinc-900/40 transition-colors"
        >
          <div className="text-[10px] uppercase text-zinc-500 font-medium tracking-wide">
            {stat.label}
          </div>
          <div
            className={`text-2xl font-mono mt-1 flex items-center gap-2 ${
              stat.highlight ? "text-emerald-400" : "text-white"
            }`}
          >
            {stat.value}
            {stat.unit && (
              <span className="text-sm text-zinc-500">{stat.unit}</span>
            )}
            {stat.icon && stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
