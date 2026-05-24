"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  Search,
  Calendar,
  Tag,
  Brain,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KPICard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Document as DocType, api } from "@/lib/api";

const typeIcons: Record<string, string> = {
  report: "bg-blue-500/10 text-blue-400",
  meeting_notes: "bg-purple-500/10 text-purple-400",
  technical_report: "bg-cyan-500/10 text-cyan-400",
  lesson_learned: "bg-amber-500/10 text-amber-400",
  manual: "bg-emerald-500/10 text-emerald-400",
  procedure: "bg-teal-500/10 text-teal-400",
  policy: "bg-red-500/10 text-red-400",
};

export default function CorporateMemoryPage() {
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDocuments().then((r) => { setDocuments(r.items); setLoading(false); }).catch(console.error);
  }, []);

  const categories = [...new Set(documents.map((d) => d.category))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corporate Memory"
        description="Organizational knowledge base, documents, decisions, and lessons learned"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard title="Total Documents" value={documents.length} icon={FileText} variant="info" />
        <KPICard title="Categories" value={categories.length} icon={Tag} variant="default" />
        <KPICard title="Knowledge Base" value="Active" icon={BookOpen} variant="success" />
        <KPICard title="RAG Pipeline" value="Ready" icon={Brain} variant="info" />
      </div>

      {/* Search */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              placeholder="Search documents, reports, decisions, lessons learned..."
              className="h-10 border-white/5 bg-white/5 pl-10 text-sm text-white placeholder:text-white/30"
            />
          </div>
          <Button className="h-10 bg-cyan-500/10 text-sm text-cyan-400 hover:bg-cyan-500/20">
            <Brain className="mr-2 h-4 w-4" />
            Semantic Search
          </Button>
        </div>
        <p className="mt-2 text-[10px] text-white/20">
          Semantic search powered by RAG pipeline — connects to pgvector for embedding-based retrieval when configured
        </p>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border border-white/5 bg-white/[0.02]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => {
            const iconClass = typeIcons[doc.document_type] || "bg-white/10 text-white/60";
            return (
              <div
                key={doc.id}
                className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/20"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white line-clamp-2">
                      {doc.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="border-white/10 text-[9px] text-white/40 capitalize">
                        {doc.document_type.replace(/_/g, " ")}
                      </Badge>
                      <Badge variant="outline" className="border-white/10 text-[9px] text-white/30">
                        {doc.classification}
                      </Badge>
                    </div>
                  </div>
                </div>

                {doc.content && (
                  <p className="mt-3 text-xs text-white/40 line-clamp-3">{doc.content}</p>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="flex items-center gap-2 text-[10px] text-white/20">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.author && (
                      <span className="text-[10px] text-white/30">{doc.author}</span>
                    )}
                    {doc.version && (
                      <Badge variant="outline" className="border-white/10 text-[9px] text-white/20">
                        v{doc.version}
                      </Badge>
                    )}
                  </div>
                </div>

                {doc.tags && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {doc.tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/30"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
