"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantStyles = {
  default: "from-white/5 to-white/[0.02] border-white/5",
  success: "from-emerald-500/10 to-emerald-500/[0.02] border-emerald-500/10",
  warning: "from-amber-500/10 to-amber-500/[0.02] border-amber-500/10",
  danger: "from-red-500/10 to-red-500/[0.02] border-red-500/10",
  info: "from-cyan-500/10 to-cyan-500/[0.02] border-cyan-500/10",
};

const iconStyles = {
  default: "bg-white/10 text-white/60",
  success: "bg-emerald-500/10 text-emerald-400",
  warning: "bg-amber-500/10 text-amber-400",
  danger: "bg-red-500/10 text-red-400",
  info: "bg-cyan-500/10 text-cyan-400",
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: KPICardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-white tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-white/30">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.value >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-white/30">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            iconStyles[variant]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
