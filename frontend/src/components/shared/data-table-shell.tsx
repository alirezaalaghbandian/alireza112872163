"use client";

import { Search, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableShellProps {
  children: React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  actions?: React.ReactNode;
}

export function DataTableShell({
  children,
  searchPlaceholder = "Search...",
  actions,
}: DataTableShellProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          <Input
            placeholder={searchPlaceholder}
            className="h-8 border-white/5 bg-white/5 pl-9 text-xs text-white placeholder:text-white/30"
          />
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-white/10 bg-transparent text-xs text-white/50 hover:bg-white/5 hover:text-white/80"
          >
            <Filter className="mr-1.5 h-3 w-3" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-white/10 bg-transparent text-xs text-white/50 hover:bg-white/5 hover:text-white/80"
          >
            <Download className="mr-1.5 h-3 w-3" />
            Export
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
