'use client';

import { usePathname } from 'next/navigation';
import { useAppStore, useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Kbd } from '@/components/ui/kbd';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/signals': 'Signals',
  '/kpis': 'KPIs',
  '/anomalies': 'Anomalies',
  '/incidents': 'Incidents',
  '/copilot': 'Copilot',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/settings/general': 'General',
  '/settings/members': 'Members',
  '/settings/roles': 'Roles',
  '/settings/api-keys': 'API Keys',
  '/settings/audit': 'Audit Log',
};

export function Topbar() {
  const pathname = usePathname();
  const { setCommandPaletteOpen } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('opscore-theme') ?? 'light';
    setTheme(stored as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('opscore-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((_, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    return { path, label: BREADCRUMB_MAP[path] ?? segments[i] };
  });

  return (
    <header className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-border-subtle bg-bg-elevated/80 backdrop-blur-sm px-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumbs">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.path} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-text-tertiary">/</span>}
            <span
              className={cn(
                i === breadcrumbs.length - 1
                  ? 'font-medium text-text-primary'
                  : 'text-text-secondary',
              )}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Search */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border-subtle bg-bg-sunken px-3 py-1.5 text-sm text-text-tertiary hover:border-border-strong transition-colors max-w-xs"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search...</span>
        <Kbd>&#8984;K</Kbd>
      </button>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-bg-sunken transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-bg-sunken transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-medium text-white">
          {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
        </div>
      </div>
    </header>
  );
}
