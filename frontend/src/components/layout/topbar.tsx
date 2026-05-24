"use client";

import { Search, Bell, Bot, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/5 bg-[#0a0a0f]/80 px-6 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input
            placeholder="Search plants, machines, documents..."
            className="h-9 border-white/5 bg-white/5 pl-9 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/30 focus:ring-cyan-500/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white/70">
          <Globe className="h-4 w-4" />
        </button>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white/70">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-3 text-sm text-cyan-400 transition-colors hover:from-cyan-500/20 hover:to-blue-500/20">
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
          v1.0
        </Badge>
      </div>
    </header>
  );
}
