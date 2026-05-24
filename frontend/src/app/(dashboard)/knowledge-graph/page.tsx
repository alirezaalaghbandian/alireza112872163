"use client";

import { useEffect, useState } from "react";
import { Network, Circle, ArrowRight, Layers, GitBranch } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { type KGNode, type KGEdge, api } from "@/lib/api";

const entityColors: Record<string, string> = {
  plant: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  line: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  machine: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  sensor: "border-teal-500/30 bg-teal-500/10 text-teal-400",
  product: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  customer: "border-pink-500/30 bg-pink-500/10 text-pink-400",
  supplier: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  contract: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  employee: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
  ai_agent: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  risk: "border-red-500/30 bg-red-500/10 text-red-400",
};

const relationshipColors: Record<string, string> = {
  contains: "text-cyan-400",
  monitors: "text-emerald-400",
  produces: "text-purple-400",
  supplies: "text-orange-400",
  consumes: "text-pink-400",
  manages: "text-indigo-400",
  operates_on: "text-blue-400",
  depends_on: "text-red-400",
};

export default function KnowledgeGraphPage() {
  const [nodes, setNodes] = useState<KGNode[]>([]);
  const [edges, setEdges] = useState<KGEdge[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getKGNodes("page_size=100"), api.getKGEdges("page_size=200")])
      .then(([n, e]) => {
        setNodes(n.items);
        setEdges(e.items);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const entityTypes = [...new Set(nodes.map((n) => n.entity_type))];
  const relationshipTypes = [...new Set(edges.map((e) => e.relationship_type))];
  const filteredNodes = selectedType
    ? nodes.filter((n) => n.entity_type === selectedType)
    : nodes;

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Knowledge Graph" description="Loading..." />
        <div className="h-96 animate-pulse rounded-xl border border-white/5 bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Graph"
        description="Entity relationships across the industrial ecosystem"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard title="Total Entities" value={nodes.length} icon={Circle} variant="info" />
        <KPICard title="Relationships" value={edges.length} icon={GitBranch} variant="default" />
        <KPICard title="Entity Types" value={entityTypes.length} icon={Layers} variant="success" />
        <KPICard title="Relation Types" value={relationshipTypes.length} icon={Network} variant="default" />
      </div>

      {/* Entity Type Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedType(null)}
          className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
            !selectedType
              ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
              : "border-white/5 text-white/40 hover:border-white/10"
          }`}
        >
          All ({nodes.length})
        </button>
        {entityTypes.map((type) => {
          const count = nodes.filter((n) => n.entity_type === type).length;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type === selectedType ? null : type)}
              className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition-all ${
                selectedType === type
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                  : "border-white/5 text-white/40 hover:border-white/10"
              }`}
            >
              {type.replace(/_/g, " ")} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Entity Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Entities</h3>
          <div className="max-h-[600px] space-y-2 overflow-y-auto pr-2">
            {filteredNodes.map((node) => {
              const colorClass = entityColors[node.entity_type] || "border-white/10 bg-white/5 text-white/50";
              const nodeEdges = edges.filter(
                (e) => e.source_node_id === node.id || e.target_node_id === node.id
              );
              return (
                <div
                  key={node.id}
                  className="rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[9px] capitalize ${colorClass}`}>
                        {node.entity_type.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs font-medium text-white/80">{node.name}</span>
                    </div>
                    <span className="text-[10px] text-white/20">
                      {nodeEdges.length} connections
                    </span>
                  </div>
                  {nodeEdges.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {nodeEdges.slice(0, 3).map((edge) => {
                        const otherNodeId = edge.source_node_id === node.id ? edge.target_node_id : edge.source_node_id;
                        const otherNode = nodeMap.get(otherNodeId);
                        const relColor = relationshipColors[edge.relationship_type] || "text-white/30";
                        return (
                          <span
                            key={edge.id}
                            className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/30"
                          >
                            <span className={relColor}>{edge.relationship_type}</span>
                            {" → "}
                            {otherNode?.name || "?"}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Relationship List */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Relationships</h3>
          <div className="max-h-[600px] space-y-2 overflow-y-auto pr-2">
            {edges.map((edge) => {
              const sourceNode = nodeMap.get(edge.source_node_id);
              const targetNode = nodeMap.get(edge.target_node_id);
              if (!sourceNode || !targetNode) return null;
              const relColor = relationshipColors[edge.relationship_type] || "text-white/30";
              return (
                <div
                  key={edge.id}
                  className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                >
                  <Badge
                    variant="outline"
                    className={`text-[9px] capitalize ${entityColors[sourceNode.entity_type] || ""}`}
                  >
                    {sourceNode.name}
                  </Badge>
                  <span className={`text-[10px] font-medium ${relColor}`}>
                    {edge.relationship_type.replace(/_/g, " ")}
                  </span>
                  <ArrowRight className="h-3 w-3 text-white/20" />
                  <Badge
                    variant="outline"
                    className={`text-[9px] capitalize ${entityColors[targetNode.entity_type] || ""}`}
                  >
                    {targetNode.name}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
