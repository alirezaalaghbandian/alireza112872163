"use client";

import { useEffect, useState } from "react";
import { Boxes, AlertTriangle, TrendingUp, Package } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { type InventoryItem, api } from "@/lib/api";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInventory().then((r) => { setItems(r.items); setLoading(false); }).catch(console.error);
  }, []);

  const totalValue = items.reduce((s, i) => s + i.total_value, 0);
  const lowStock = items.filter((i) => i.status === "low_stock").length;
  const outOfStock = items.filter((i) => i.status === "out_of_stock").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Track raw materials, spare parts, and consumables across all plants" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard title="Total Items" value={items.length} icon={Boxes} variant="info" />
        <KPICard title="Total Value" value={`${(totalValue / 1e9).toFixed(1)}B IRR`} icon={TrendingUp} variant="default" />
        <KPICard title="Low Stock" value={lowStock} icon={AlertTriangle} variant="warning" />
        <KPICard title="Out of Stock" value={outOfStock} icon={Package} variant="danger" />
      </div>

      <DataTableShell searchPlaceholder="Search inventory...">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-medium text-white/40">Code</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Name</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Category</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Quantity</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Min Stock</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Unit Cost</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Total Value</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 w-16 animate-pulse rounded bg-white/5" /></td>
                    ))}
                  </tr>
                ))
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs text-cyan-400">{item.code}</td>
                    <td className="px-4 py-3 text-xs text-white/70 max-w-[180px] truncate">{item.name}</td>
                    <td className="px-4 py-3 text-xs text-white/50 capitalize">{item.category.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/70">{item.quantity.toLocaleString()} {item.unit}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/40">{item.min_stock.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/50">{(item.unit_cost / 1e6).toFixed(1)}M</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/70">{(item.total_value / 1e9).toFixed(2)}B</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
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
