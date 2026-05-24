"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Factory,
  Cpu,
  ShoppingCart,
  Wrench,
  Bot,
  BookOpen,
  Network,
  Shield,
  Settings,
  ChevronDown,
  Boxes,
  DollarSign,
  Users,
  Package,
  Scale,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { label: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { label: "Plants", href: "/plants", icon: Factory },
  { label: "Digital Twin", href: "/digital-twin", icon: Cpu },
  {
    label: "ERP Intelligence",
    href: "/erp",
    icon: ShoppingCart,
    children: [
      { label: "Procurement", href: "/erp/procurement", icon: Package },
      { label: "Inventory", href: "/erp/inventory", icon: Boxes },
      { label: "Finance", href: "/erp/finance", icon: DollarSign },
      { label: "HR", href: "/erp/hr", icon: Users },
    ],
  },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "AI Agents", href: "/ai-agents", icon: Bot },
  { label: "Corporate Memory", href: "/corporate-memory", icon: BookOpen },
  { label: "Knowledge Graph", href: "/knowledge-graph", icon: Network },
  { label: "Cybersecurity", href: "/cybersecurity", icon: Shield },
  { label: "Governance", href: "/governance", icon: Scale },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["/erp"]);

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((h) => h !== href)
        : [...prev, href]
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
          L
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">LINK Platform</h1>
          <p className="text-[10px] text-white/40">Industrial Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.children &&
                item.children.some((c) => pathname === c.href));
            const isExpanded = expandedItems.includes(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.href)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/50 hover:bg-white/5 hover:text-white/80"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <ul className="ml-4 mt-1 space-y-0.5 border-l border-white/5 pl-3">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = pathname === child.href;
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                                  childActive
                                    ? "bg-cyan-500/10 text-cyan-400"
                                    : "text-white/40 hover:bg-white/5 hover:text-white/70"
                                )}
                              >
                                <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>{child.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
            MR
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-white/80">Mohammad Rezaei</p>
            <p className="truncate text-[10px] text-white/30">CEO</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
