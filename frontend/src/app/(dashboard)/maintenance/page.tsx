"use client";

import { useEffect, useState } from "react";
import { Wrench, AlertTriangle, Clock, CheckCircle, Bot, Activity } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { Badge } from "@/components/ui/badge";
import { type MaintenanceEvent, api } from "@/lib/api";

export default function MaintenancePage() {
  const [events, setEvents] = useState<MaintenanceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMaintenanceEvents().then((r) => { setEvents(r.items); setLoading(false); }).catch(console.error);
  }, []);

  const openCount = events.filter((e) => e.status === "open").length;
  const inProgressCount = events.filter((e) => e.status === "in_progress").length;
  const completedCount = events.filter((e) => e.status === "completed").length;
  const aiPredicted = events.filter((e) => e.is_ai_predicted).length;
  const criticalCount = events.filter((e) => e.priority === "critical").length;
  const totalDowntime = events.reduce((s, e) => s + e.downtime_hours, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance & Reliability"
        description="Work orders, predictive maintenance, and asset reliability management"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KPICard title="Open" value={openCount} icon={Wrench} variant="warning" />
        <KPICard title="In Progress" value={inProgressCount} icon={Clock} variant="info" />
        <KPICard title="Completed" value={completedCount} icon={CheckCircle} variant="success" />
        <KPICard title="Critical" value={criticalCount} icon={AlertTriangle} variant="danger" />
        <KPICard title="AI Predicted" value={aiPredicted} icon={Bot} variant="info" />
        <KPICard title="Total Downtime" value={`${totalDowntime.toFixed(1)}h`} icon={Activity} variant="default" />
      </div>

      <DataTableShell searchPlaceholder="Search maintenance events...">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-medium text-white/40">Title</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Type</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Priority</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Downtime</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Cost Est.</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">AI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded bg-white/5" /></td>
                    ))}
                  </tr>
                ))
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-xs text-white/70 max-w-[250px] truncate">{event.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-white/10 text-[10px] text-white/50 capitalize">
                        {event.event_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3"><PriorityBadge priority={event.priority} /></td>
                    <td className="px-4 py-3"><StatusBadge status={event.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-white/50">{event.downtime_hours}h</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/50">
                      {(event.cost_estimate / 1e6).toFixed(0)}M
                    </td>
                    <td className="px-4 py-3">
                      {event.is_ai_predicted && (
                        <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-[10px] text-cyan-400">
                          <Bot className="mr-1 h-2.5 w-2.5" />
                          {((event.ai_confidence || 0) * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DataTableShell>
    </div>
  );
}
