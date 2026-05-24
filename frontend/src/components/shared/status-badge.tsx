import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  running: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  operational: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  delivered: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  in_stock: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  implemented: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",

  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  idle: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  pending_approval: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  in_progress: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  in_transit: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  ordered: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  scheduled: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  low_stock: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  on_leave: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  draft: "border-gray-500/30 bg-gray-500/10 text-gray-400",
  open: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  queued: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",

  critical: "border-red-500/30 bg-red-500/10 text-red-400",
  offline: "border-red-500/30 bg-red-500/10 text-red-400",
  error: "border-red-500/30 bg-red-500/10 text-red-400",
  cancelled: "border-red-500/30 bg-red-500/10 text-red-400",
  out_of_stock: "border-red-500/30 bg-red-500/10 text-red-400",
  terminated: "border-red-500/30 bg-red-500/10 text-red-400",
  maintenance: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  suspended: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  paused: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  disabled: "border-gray-500/30 bg-gray-500/10 text-gray-400",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = statusColors[status] || "border-gray-500/30 bg-gray-500/10 text-gray-400";
  const displayText = status.replace(/_/g, " ");

  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] uppercase tracking-wider font-medium", colorClass, className)}
    >
      {displayText}
    </Badge>
  );
}

const priorityColors: Record<string, string> = {
  critical: "border-red-500/30 bg-red-500/10 text-red-400",
  high: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

export function PriorityBadge({ priority, className }: { priority: string; className?: string }) {
  const colorClass = priorityColors[priority] || "border-gray-500/30 bg-gray-500/10 text-gray-400";
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] uppercase tracking-wider font-medium", colorClass, className)}
    >
      {priority}
    </Badge>
  );
}
