"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  BarChart3,
  Zap,
  MessageSquare,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type AIAgent, type AIRecommendation, api } from "@/lib/api";

const agentIcons: Record<string, string> = {
  executive: "bg-purple-500/10 text-purple-400",
  finance: "bg-emerald-500/10 text-emerald-400",
  production: "bg-cyan-500/10 text-cyan-400",
  maintenance: "bg-amber-500/10 text-amber-400",
  procurement: "bg-blue-500/10 text-blue-400",
  hr: "bg-pink-500/10 text-pink-400",
  legal: "bg-orange-500/10 text-orange-400",
  energy: "bg-yellow-500/10 text-yellow-400",
  domain_expert: "bg-red-500/10 text-red-400",
  data_governance: "bg-teal-500/10 text-teal-400",
};

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAIAgents(), api.getAIRecommendations()]).then(
      ([a, r]) => {
        setAgents(a.items);
        setRecommendations(r.items);
        setLoading(false);
      }
    ).catch(console.error);
  }, []);

  const runningCount = agents.filter((a) => a.status === "running").length;
  const avgConfidence = agents.length > 0
    ? agents.reduce((s, a) => s + a.confidence_score, 0) / agents.length
    : 0;
  const totalRuns = agents.reduce((s, a) => s + a.total_runs, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="AI Agents Control Room" description="Loading..." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl border border-white/5 bg-white/[0.02]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Agents Control Room"
        description="Monitor, manage, and interact with autonomous AI agents"
      >
        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
          <Activity className="mr-1 h-3 w-3" /> {runningCount} Active
        </Badge>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard title="Active Agents" value={runningCount} icon={Bot} variant="info" />
        <KPICard title="Total Runs" value={totalRuns.toLocaleString()} icon={Zap} variant="default" />
        <KPICard title="Avg Confidence" value={`${(avgConfidence * 100).toFixed(0)}%`} icon={BarChart3} variant="success" />
        <KPICard title="Pending Recommendations" value={recommendations.filter((r) => r.status === "pending").length} icon={MessageSquare} variant="warning" />
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const iconClass = agentIcons[agent.agent_type] || "bg-white/10 text-white/60";

          return (
            <div
              key={agent.id}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:shadow-lg hover:shadow-black/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                    <p className="text-[10px] text-white/30">{agent.model_provider} / {agent.model_name}</p>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
              </div>

              {agent.current_task && (
                <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
                  <p className="text-[10px] font-medium text-white/30 uppercase">Current Task</p>
                  <p className="mt-0.5 text-xs text-white/60 line-clamp-2">{agent.current_task}</p>
                </div>
              )}

              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-white/30">Confidence</p>
                  <p className="text-sm font-mono text-cyan-400">
                    {(agent.confidence_score * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30">Success Rate</p>
                  <p className="text-sm font-mono text-emerald-400">{agent.success_rate}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30">Risk</p>
                  <PriorityBadge priority={agent.risk_level} />
                </div>
              </div>

              {agent.last_recommendation && (
                <div className="mt-3 border-t border-white/5 pt-3">
                  <p className="text-[10px] text-white/30 uppercase">Last Recommendation</p>
                  <p className="mt-1 text-xs text-white/50 line-clamp-2">
                    {agent.last_recommendation}
                  </p>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] text-white/20">
                  {agent.total_runs} runs
                </span>
                <Button
                  size="sm"
                  className="h-7 bg-cyan-500/10 text-xs text-cyan-400 hover:bg-cyan-500/20"
                >
                  <MessageSquare className="mr-1 h-3 w-3" />
                  Ask Agent
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
