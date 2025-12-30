import { Header } from "@/components/layouts/header";
import { Sidebar } from "@/components/layouts/sidebar";
import { PixelMintForm } from "@/features/pixels-grid/components/pixel-mint-form";

export default function MyPixelsPage() {
  return (
    <div className="flex flex-col h-screen w-full relative bg-zinc-950">
      <Header />
      <main className="flex-1 flex overflow-hidden pt-14 relative">
        <div className="flex-1 bg-zinc-950 relative overflow-hidden p-6">
          <div className="max-w-md">
            <h1 className="text-xl font-semibold text-white mb-6">My Pixels</h1>
            <PixelMintForm />
          </div>
        </div>
        {/* Right: Interaction Sidebar */}
        <Sidebar />
      </main>
    </div>
  );
}
