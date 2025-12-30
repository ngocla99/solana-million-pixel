'use client';

import { TrophyIcon } from "@phosphor-icons/react";
import { TimeFilterTabs } from "./time-filter-tabs";
import { TopContributors } from "./top-contributors";
import { LeaderboardTable } from "./leaderboard-table";

export function LeaderboardContent() {
  return (
    <div className="flex-1 bg-zinc-950 relative overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-medium text-white tracking-tight flex items-center gap-2">
              <TrophyIcon className="text-purple-400 w-5 h-5" />
              Global Leaderboard
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Top contributors shaping the digital canvas.
            </p>
          </div>

          <TimeFilterTabs />
        </div>

        {/* Top 3 Cards */}
        <TopContributors />

        {/* Ranking Table */}
        <LeaderboardTable />
      </div>
    </div>
  );
}
