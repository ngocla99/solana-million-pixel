import { Header } from "@/components/layouts/header";
import { Sidebar } from "@/components/layouts/sidebar";
import { LeaderboardContent } from "@/features/leaderboard/components/leaderboard-content";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col h-screen w-full relative bg-zinc-950">
      <Header />
      <main className="flex-1 flex overflow-hidden pt-14 relative">
        <LeaderboardContent />
        <Sidebar />
      </main>
    </div>
  );
}
