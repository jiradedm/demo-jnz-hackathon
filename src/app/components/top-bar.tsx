import { Sparkles } from "lucide-react";

export function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#6366f1] rounded-lg shadow-lg shadow-[#4F46E5]/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Pitch<span className="text-[#4F46E5]">Deck</span> Generator
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
