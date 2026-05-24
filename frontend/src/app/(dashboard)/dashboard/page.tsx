"use client";

import { useEffect, useState } from "react";
import {
  Factory,
  Zap,
  Wrench,
  DollarSign,
  Bot,
  TrendingUp,
  Activity,
  Package,
  Target,
} from "lucide-react";
import { KPICard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  type ExecutiveSummary,
  type AIRecommendation,
  type Plant,
  api,
} from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const productionTrend = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  output: Math.round(30 + Math.random() * 15),
  target: 37.5,
}));

const energyTrend = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  consumption: Math.round(5.5 + Math.random() * 2.5),
}));

export default function DashboardPage() {
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    api.getExecutiveSummary().then(setSummary).catch(console.error);
    api.getAIRecommendations().then((r) => setRecommendations(r.items)).catch(console.error);
    api.getPlants().then((r) => setPlants(r.items)).catch(console.error);
  }, []);

  if (!summary) {
    return (
      <div className="space-y-6">
        <PageHeader title="Executive Command Center" description="Loading..." />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-white/5 bg-white/[0.02]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Command Center"
        description="Real-time overview of all industrial operations across the holding"
      >
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
          <Activity className="mr-1 h-3 w-3" /> Live
        </Badge>
      </PageHeader>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard
          title="Production Today"
          value={`${summary.production.production_today_tons} t`}
          subtitle={`Target: ${summary.production.production_target_tons} t`}
          icon={Factory}
          variant="info"
          trend={{ value: 3.2, label: "vs yesterday" }}
        />
        <KPICard
          title="Energy Consumption"
          value={`${summary.energy.total_consumption_mwh} MWh`}
          subtitle={`${summary.energy.energy_per_ton} MWh/ton`}
          icon={Zap}
          variant="warning"
          trend={{ value: -2.1, label: "vs avg" }}
        />
        <KPICard
          title="Maintenance Alerts"
          value={summary.maintenance.open_work_orders}
          subtitle={`${summary.maintenance.critical_alerts} critical`}
          icon={Wrench}
          variant={summary.maintenance.critical_alerts > 0 ? "danger" : "success"}
        />
        <KPICard
          title="Financial Exposure"
          value={`${(summary.finance.cash_exposure / 1e9).toFixed(1)}B IRR`}
          subtitle={`Budget var: ${summary.finance.budget_variance_percent}%`}
          icon={DollarSign}
          variant="default"
          trend={{ value: summary.finance.budget_variance_percent, label: "variance" }}
        />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard
          title="Plant Health Score"
          value={`${summary.production.avg_health_score}%`}
          subtitle={`${summary.production.operational_plants}/${summary.production.total_plants} operational`}
          icon={Activity}
          variant="success"
        />
        <KPICard
          title="Yield Rate"
          value={`${summary.production.yield_percent}%`}
          subtitle="Across all lines"
          icon={Target}
          variant="success"
          trend={{ value: 1.8, label: "this week" }}
        />
        <KPICard
          title="Procurement Risk"
          value={summary.procurement.pending_orders}
          subtitle={`${summary.procurement.low_stock_items} low stock items`}
          icon={Package}
          variant={summary.procurement.risk_level === "high" ? "danger" : "warning"}
        />
        <KPICard
          title="AI Agents Active"
          value={summary.ai.active_agents}
          subtitle={`${summary.ai.pending_recommendations} pending recommendations`}
          icon={Bot}
          variant="info"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Production Trend */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Production Output</h3>
              <p className="text-xs text-white/30">Today&apos;s hourly production (tons/hr)</p>
            </div>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={productionTrend}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: 12 }}
                labelStyle={{ color: "rgba(255,255,255,0.5)" }}
              />
              <Area type="monotone" dataKey="output" stroke="#06b6d4" fill="url(#prodGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="target" stroke="#f59e0b" fill="none" strokeWidth={1} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Energy Consumption */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Energy Consumption</h3>
              <p className="text-xs text-white/30">Hourly energy usage (MWh)</p>
            </div>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={energyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: 12 }}
                labelStyle={{ color: "rgba(255,255,255,0.5)" }}
              />
              <Bar dataKey="consumption" radius={[4, 4, 0, 0]}>
                {energyTrend.map((entry, index) => (
                  <Cell key={index} fill={entry.consumption > 7 ? "#f59e0b" : "#06b6d4"} fillOpacity={0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Risk Heatmap, Plant Comparison, AI Recommendations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Risk Heatmap */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Risk Heatmap</h3>
            <p className="text-xs text-white/30">Current operational risk areas</p>
          </div>
          <div className="space-y-3">
            {summary.risk_heatmap.map((risk) => (
              <div key={risk.area} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs text-white/70">{risk.area}</p>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        risk.risk === "high"
                          ? "bg-red-500"
                          : risk.risk === "medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${risk.score}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-mono text-white/40 w-8 text-right">{risk.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plant Comparison */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Plant Comparison</h3>
            <p className="text-xs text-white/30">Health scores across plants</p>
          </div>
          <div className="space-y-3">
            {plants.slice(0, 6).map((plant) => (
              <div key={plant.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-xs text-white/70">{plant.name}</p>
                    <StatusBadge status={plant.status} />
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${
                        plant.health_score >= 90
                          ? "bg-emerald-500"
                          : plant.health_score >= 75
                          ? "bg-cyan-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${plant.health_score}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-mono text-white/50 w-10 text-right">
                  {plant.health_score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
              <p className="text-xs text-white/30">Pending agent recommendations</p>
            </div>
            <Bot className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="space-y-3">
            {recommendations.slice(0, 5).map((rec) => (
              <div
                key={rec.id}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-white/80 line-clamp-2">
                    {rec.title}
                  </p>
                  <StatusBadge status={rec.priority} />
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[10px] text-white/30">{rec.category}</span>
                  <span className="text-[10px] text-cyan-400">
                    {(rec.confidence * 100).toFixed(0)}% confidence
                  </span>
                  {rec.estimated_savings && rec.estimated_savings > 0 && (
                    <span className="text-[10px] text-emerald-400">
                      {(rec.estimated_savings / 1e9).toFixed(1)}B IRR savings
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
