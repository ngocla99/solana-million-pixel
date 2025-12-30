import { Header } from "@/components/layouts/header";
import { Sidebar } from "@/components/layouts/sidebar";

import { MyPixelsView } from "@/features/my-pixels/components/my-pixels-view";

export default function MyPixelsPage() {
  return (
    <div className="flex flex-col h-screen w-full relative bg-zinc-950">
      <Header />
      <main className="flex-1 flex overflow-hidden pt-14 relative">
        <div className="flex-1 bg-zinc-950 relative overflow-hidden">
          <MyPixelsView />
        </div>
        {/* Right: Interaction Sidebar */}
        <Sidebar />
      </main>
    </div>
  );
}
