"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { type FinancialRecord, api } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function FinancePage() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFinance("page_size=100").then((r) => { setRecords(r.items); setLoading(false); }).catch(console.error);
  }, []);

  const revenue = records.filter((r) => r.record_type === "revenue").reduce((s, r) => s + r.amount, 0);
  const expenses = records.filter((r) => r.record_type === "expense").reduce((s, r) => s + r.amount, 0);
  const profit = revenue - expenses;

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = i + 1;
    const monthRecords = records.filter((r) => r.fiscal_month === month);
    const rev = monthRecords.filter((r) => r.record_type === "revenue").reduce((s, r) => s + r.amount, 0);
    const exp = monthRecords.filter((r) => r.record_type === "expense").reduce((s, r) => s + r.amount, 0);
    return {
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
      revenue: rev / 1e9,
      expenses: exp / 1e9,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Finance" description="Financial overview including revenue, expenses, and cost analysis" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard title="Total Revenue" value={`${(revenue / 1e9).toFixed(1)}B IRR`} icon={TrendingUp} variant="success" />
        <KPICard title="Total Expenses" value={`${(expenses / 1e9).toFixed(1)}B IRR`} icon={TrendingDown} variant="warning" />
        <KPICard title="Net Profit" value={`${(profit / 1e9).toFixed(1)}B IRR`} icon={DollarSign} variant={profit > 0 ? "success" : "danger"} />
        <KPICard title="Records" value={records.length} icon={BarChart3} variant="info" />
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold text-white">Revenue vs Expenses (Billions IRR)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} />
            <Bar dataKey="revenue" name="Revenue" fill="#10b981" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#f59e0b" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DataTableShell searchPlaceholder="Search financial records...">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-medium text-white/40">Type</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Category</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Description</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Period</th>
                <th className="px-4 py-3 text-xs font-medium text-white/40">Status</th>
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
                records.slice(0, 20).map((record) => (
                  <tr key={record.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <StatusBadge status={record.record_type === "revenue" ? "active" : "warning"} />
                    </td>
                    <td className="px-4 py-3 text-xs text-white/50 capitalize">{record.category}</td>
                    <td className="px-4 py-3 text-xs text-white/70 max-w-[250px] truncate">{record.description}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/70">{(record.amount / 1e9).toFixed(1)}B IRR</td>
                    <td className="px-4 py-3 text-xs text-white/40">{record.fiscal_year}-M{record.fiscal_month}</td>
                    <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
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
