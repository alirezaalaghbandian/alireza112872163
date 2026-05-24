'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { CommandPalette } from '@/components/layout/command-palette';
import { useAppStore } from '@/lib/store';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className="flex flex-1 flex-col transition-all duration-normal"
        style={{ marginInlineStart: sidebarCollapsed ? 60 : 240 }}
      >
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <CommandPalette />
    </div>
  );
}
