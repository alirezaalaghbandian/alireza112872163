'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  Radio,
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  MessageSquare,
  FileText,
  Settings,
} from 'lucide-react';

const COMMANDS = [
  { label: 'Go to Dashboard', icon: LayoutDashboard, href: '/dashboard', group: 'Navigation' },
  { label: 'Go to Signals', icon: Radio, href: '/signals', group: 'Navigation' },
  { label: 'Go to KPIs', icon: BarChart3, href: '/kpis', group: 'Navigation' },
  { label: 'Go to Anomalies', icon: AlertTriangle, href: '/anomalies', group: 'Navigation' },
  { label: 'Go to Incidents', icon: ShieldAlert, href: '/incidents', group: 'Navigation' },
  { label: 'Go to Copilot', icon: MessageSquare, href: '/copilot', group: 'Navigation' },
  { label: 'Go to Reports', icon: FileText, href: '/reports', group: 'Navigation' },
  { label: 'Go to Settings', icon: Settings, href: '/settings/general', group: 'Navigation' },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }

      // gh-style navigation: g then i = incidents
      if (!commandPaletteOpen && e.key === 'g') {
        const next = (e2: KeyboardEvent) => {
          if (e2.key === 'i') router.push('/incidents');
          if (e2.key === 'd') router.push('/dashboard');
          if (e2.key === 's') router.push('/signals');
          if (e2.key === 'c') router.push('/copilot');
          document.removeEventListener('keydown', next);
        };
        document.addEventListener('keydown', next, { once: true });
        setTimeout(() => document.removeEventListener('keydown', next), 1000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen, router]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />
      <Command
        className="relative w-full max-w-lg rounded-xl border border-border-subtle bg-bg-elevated shadow-md overflow-hidden"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setCommandPaletteOpen(false);
        }}
      >
        <Command.Input
          placeholder="Type a command or search..."
          className="w-full border-b border-border-subtle bg-transparent px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none"
          autoFocus
        />
        <Command.List className="max-h-72 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-text-tertiary">
            No results found.
          </Command.Empty>
          <Command.Group heading="Navigation" className="text-xs text-text-tertiary px-2 py-1.5">
            {COMMANDS.map((cmd) => (
              <Command.Item
                key={cmd.href}
                onSelect={() => {
                  router.push(cmd.href);
                  setCommandPaletteOpen(false);
                }}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary cursor-pointer data-[selected=true]:bg-bg-sunken data-[selected=true]:text-text-primary"
              >
                <cmd.icon className="h-4 w-4" />
                <span>{cmd.label}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
