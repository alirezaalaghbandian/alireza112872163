"use client";

import { useEffect, useState } from "react";
import { Package, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { type ProcurementOrder, api } from "@/lib/api";

export default function ProcurementPage() {
  const [orders, setOrders] = useState<ProcurementOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProcurement().then((r) => { setOrders(r.items); setLoading(false); }).catch(console.error);
  }, []);

  const totalValue = orders.reduce((s, o) => s + o.total_amount, 0);
  const pendingCount = orders.filter((o) => ["draft", "pending_approval"].includes(o.status)).length;
  const highRiskCount = orders.filter((o) => o.risk_level === "high").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Procurement" description="Manage purchase orders, supplier relationships, and procurement risks" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard title="Total Orders" value={orders.length} icon={Package} variant="info" />
        <KPICard title="Total Value" value={`${(totalValue / 1e9).toFixed(1)}B IRR`} icon={TrendingUp} variant="default" />
        <KPICard title="Pending Approval" value={pendingCount} icon={Clock} variant="warning" />
        <KPICard title="High Risk" value={highRiskCount} icon={AlertTriangle} variant="danger" />
      </div>

      <DataTableShell searchPlaceholder="Search orders...">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-medium text-white/40">Order #</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Title</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Supplier</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Priority</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Risk</th>
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
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs text-cyan-400">{order.order_number}</td>
                    <td className="px-4 py-3 text-xs text-white/70 max-w-[200px] truncate">{order.title}</td>
                    <td className="px-4 py-3 text-xs text-white/50">{order.supplier}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/70">{(order.total_amount / 1e9).toFixed(1)}B</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={order.priority} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={order.risk_level} /></td>
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
