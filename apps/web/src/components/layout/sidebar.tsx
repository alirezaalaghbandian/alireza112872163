'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAppStore, useAuthStore } from '@/lib/store';
import {
  LayoutDashboard,
  Radio,
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  MessageSquare,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/signals', label: 'Signals', icon: Radio },
  { href: '/kpis', label: 'KPIs', icon: BarChart3 },
  { href: '/anomalies', label: 'Anomalies', icon: AlertTriangle },
  { href: '/incidents', label: 'Incidents', icon: ShieldAlert },
  { href: '/copilot', label: 'Copilot', icon: MessageSquare },
  { href: '/reports', label: 'Reports', icon: FileText },
];

const SETTINGS_ITEMS = [
  { href: '/settings/general', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const org = useAuthStore((s) => s.org);

  return (
    <aside
      className={cn(
        'fixed inset-y-0 start-0 z-30 flex flex-col border-e border-border-subtle bg-bg-elevated',
        'transition-all duration-normal ease-out',
      )}
      style={{ width: sidebarCollapsed ? 60 : 240 }}
    >
      {/* Workspace switcher */}
      <div className="flex h-12 items-center gap-2 border-b border-border-subtle px-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-500 text-white">
          <Building2 className="h-4 w-4" />
        </div>
        {!sidebarCollapsed && (
          <span className="truncate text-sm font-semibold text-text-primary">
            {org?.name ?? 'OpsCore'}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-fast',
                    active
                      ? 'bg-brand-50 text-brand-600 font-medium'
                      : 'text-text-secondary hover:bg-bg-sunken hover:text-text-primary',
                    sidebarCollapsed && 'justify-center px-0',
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border-subtle px-2 py-2">
        <ul className="space-y-0.5">
          {SETTINGS_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-fast',
                    active
                      ? 'bg-brand-50 text-brand-600 font-medium'
                      : 'text-text-secondary hover:bg-bg-sunken hover:text-text-primary',
                    sidebarCollapsed && 'justify-center px-0',
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          onClick={toggleSidebar}
          className="mt-2 flex w-full items-center justify-center rounded-md p-1.5 text-text-tertiary hover:bg-bg-sunken hover:text-text-secondary transition-colors"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 flip-rtl" />
          ) : (
            <ChevronLeft className="h-4 w-4 flip-rtl" />
          )}
        </button>
      </div>
    </aside>
  );
}
