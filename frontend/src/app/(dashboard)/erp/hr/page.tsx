"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, Star, Building } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { Badge } from "@/components/ui/badge";
import { type HRRecord, api } from "@/lib/api";

export default function HRPage() {
  const [employees, setEmployees] = useState<HRRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHR().then((r) => { setEmployees(r.items); setLoading(false); }).catch(console.error);
  }, []);

  const activeCount = employees.filter((e) => e.status === "active").length;
  const avgPerformance = employees.length > 0
    ? employees.reduce((s, e) => s + (e.performance_score || 0), 0) / employees.length
    : 0;
  const departments = new Set(employees.map((e) => e.department));

  return (
    <div className="space-y-6">
      <PageHeader title="Human Resources" description="Workforce management, skills tracking, and performance analytics" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard title="Total Employees" value={employees.length} icon={Users} variant="info" />
        <KPICard title="Active" value={activeCount} icon={UserCheck} variant="success" />
        <KPICard title="Avg Performance" value={`${avgPerformance.toFixed(1)}%`} icon={Star} variant="default" />
        <KPICard title="Departments" value={departments.size} icon={Building} variant="default" />
      </div>

      <DataTableShell searchPlaceholder="Search employees...">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-medium text-white/40">ID</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Name</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Department</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Position</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Performance</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Grade</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 w-16 animate-pulse rounded bg-white/5" /></td>
                    ))}
                  </tr>
                ))
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs text-cyan-400">{emp.employee_id}</td>
                    <td className="px-4 py-3 text-xs font-medium text-white/80">{emp.full_name}</td>
                    <td className="px-4 py-3 text-xs text-white/50">{emp.department}</td>
                    <td className="px-4 py-3 text-xs text-white/50">{emp.position}</td>
                    <td className="px-4 py-3">
                      {emp.performance_score && (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
                            <div
                              className={`h-full rounded-full ${
                                emp.performance_score >= 90 ? "bg-emerald-500" : emp.performance_score >= 80 ? "bg-cyan-500" : "bg-amber-500"
                              }`}
                              style={{ width: `${emp.performance_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-white/50">{emp.performance_score}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-white/10 text-[10px] text-white/40">
                        {emp.salary_grade || "—"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
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
