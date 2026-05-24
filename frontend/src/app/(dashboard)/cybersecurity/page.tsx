"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Lock,
  Eye,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { type AuditLog, api } from "@/lib/api";

const roles = [
  { name: "Chairman", level: "executive", modules: "All", status: "active" },
  { name: "CEO", level: "executive", modules: "All", status: "active" },
  { name: "CFO", level: "executive", modules: "Finance, Procurement, Dashboard", status: "active" },
  { name: "Plant Manager", level: "management", modules: "Plant, Production, Maintenance, Inventory", status: "active" },
  { name: "Production Manager", level: "management", modules: "Production, Digital Twin, Maintenance", status: "active" },
  { name: "Maintenance Manager", level: "management", modules: "Maintenance, Inventory, AI Agents", status: "active" },
  { name: "HR Manager", level: "management", modules: "HR, Corporate Memory", status: "active" },
  { name: "Procurement Manager", level: "management", modules: "Procurement, Inventory, Contracts", status: "active" },
  { name: "Data Scientist", level: "technical", modules: "AI Agents, Knowledge Graph, Digital Twin", status: "active" },
  { name: "AI Agent Operator", level: "technical", modules: "AI Agents, Dashboard", status: "active" },
  { name: "External Auditor", level: "external", modules: "Audit Logs, Finance (Read Only)", status: "active" },
  { name: "System Administrator", level: "system", modules: "All + Settings + Security", status: "active" },
];

const accessMatrix = [
  { module: "Executive Dashboard", chairman: "RW", ceo: "RW", cfo: "R", plant_mgr: "R", ext_auditor: "-" },
  { module: "Digital Twin", chairman: "R", ceo: "RW", cfo: "-", plant_mgr: "RW", ext_auditor: "-" },
  { module: "ERP - Finance", chairman: "R", ceo: "R", cfo: "RW", plant_mgr: "R", ext_auditor: "R" },
  { module: "ERP - Procurement", chairman: "R", ceo: "R", cfo: "RW", plant_mgr: "RW", ext_auditor: "-" },
  { module: "Maintenance", chairman: "-", ceo: "R", cfo: "-", plant_mgr: "RW", ext_auditor: "-" },
  { module: "AI Agents", chairman: "R", ceo: "RW", cfo: "R", plant_mgr: "R", ext_auditor: "-" },
  { module: "Cybersecurity", chairman: "R", ceo: "R", cfo: "-", plant_mgr: "-", ext_auditor: "R" },
  { module: "Settings", chairman: "-", ceo: "R", cfo: "-", plant_mgr: "-", ext_auditor: "-" },
];

const governanceRules = [
  { rule: "AI recommendations above $1B require CEO approval", status: "active", type: "approval" },
  { rule: "Sensor data anomalies trigger automatic audit log", status: "active", type: "automation" },
  { rule: "All procurement >500M IRR requires CFO sign-off", status: "active", type: "approval" },
  { rule: "External auditor access limited to read-only", status: "active", type: "access" },
  { rule: "AI agents cannot execute actions without human approval", status: "active", type: "safety" },
  { rule: "Data classification review required quarterly", status: "active", type: "compliance" },
];

export default function CybersecurityPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs().then((r) => { setAuditLogs(r.items); setLoading(false); }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cybersecurity & Governance"
        description="Access control, audit trails, data classification, and AI governance"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard title="Active Roles" value={roles.length} icon={Users} variant="info" />
        <KPICard title="Audit Events" value={auditLogs.length} icon={Eye} variant="default" />
        <KPICard title="Governance Rules" value={governanceRules.length} icon={Shield} variant="success" />
        <KPICard title="Security Score" value="92%" icon={Lock} variant="success" />
      </div>

      {/* Roles */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold text-white">User Roles</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {roles.map((role) => (
            <div
              key={role.name}
              className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-white/80">{role.name}</p>
                <StatusBadge status={role.status} />
              </div>
              <p className="mt-1 text-[10px] text-white/30 capitalize">{role.level}</p>
              <p className="mt-1 text-[10px] text-white/20 line-clamp-2">{role.modules}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Access Matrix */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold text-white">Access Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-3 py-2 text-left text-xs font-medium text-white/40">Module</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-white/40">Chairman</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-white/40">CEO</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-white/40">CFO</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-white/40">Plant Mgr</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-white/40">Auditor</th>
              </tr>
            </thead>
            <tbody>
              {accessMatrix.map((row) => (
                <tr key={row.module} className="border-b border-white/5">
                  <td className="px-3 py-2 text-xs text-white/70">{row.module}</td>
                  {[row.chairman, row.ceo, row.cfo, row.plant_mgr, row.ext_auditor].map(
                    (access, i) => (
                      <td key={i} className="px-3 py-2 text-center">
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            access === "RW"
                              ? "text-emerald-400"
                              : access === "R"
                              ? "text-cyan-400"
                              : "text-white/10"
                          }`}
                        >
                          {access}
                        </span>
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Governance Rules */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold text-white">AI Governance Rules</h3>
        <div className="space-y-2">
          {governanceRules.map((rule, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-white/70">{rule.rule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-white/10 text-[9px] text-white/40 capitalize">
                  {rule.type}
                </Badge>
                <StatusBadge status={rule.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs */}
      <DataTableShell searchPlaceholder="Search audit logs...">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-medium text-white/40">Time</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">User</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Action</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Resource</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Description</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Severity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 w-16 animate-pulse rounded bg-white/5" /></td>
                    ))}
                  </tr>
                ))
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-white/60">{log.user_email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-white/10 text-[10px] text-white/50 capitalize">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/50 capitalize">{log.resource_type}</td>
                    <td className="px-4 py-3 text-xs text-white/40 max-w-[200px] truncate">{log.description}</td>
                    <td className="px-4 py-3"><StatusBadge status={log.severity === "warning" ? "warning" : log.severity === "critical" ? "critical" : "active"} /></td>
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
