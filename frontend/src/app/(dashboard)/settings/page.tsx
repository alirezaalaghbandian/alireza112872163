"use client";

import {
  Settings,
  Database,
  Key,
  Bell,
  Shield,
  Bot,
  Plug,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";


const settingSections = [
  {
    title: "General",
    icon: Settings,
    items: [
      { label: "Platform Name", value: "LINK Industrial Intelligence Platform", type: "text" },
      { label: "Default Language", value: "English", type: "select" },
      { label: "Timezone", value: "Asia/Tehran (UTC+3:30)", type: "select" },
      { label: "Date Format", value: "YYYY-MM-DD", type: "select" },
    ],
  },
  {
    title: "Database",
    icon: Database,
    items: [
      { label: "Connection", value: "PostgreSQL", type: "status", status: "connected" },
      { label: "pgvector Extension", value: "Available", type: "status", status: "ready" },
      { label: "Redis Cache", value: "Connected", type: "status", status: "connected" },
      { label: "Auto Backup", value: "Daily at 02:00", type: "text" },
    ],
  },
  {
    title: "AI Providers",
    icon: Bot,
    items: [
      { label: "OpenAI API Key", value: "Not configured", type: "secret" },
      { label: "Anthropic API Key", value: "Not configured", type: "secret" },
      { label: "OpenRouter API Key", value: "Not configured", type: "secret" },
      { label: "Local LLM Endpoint", value: "Not configured", type: "text" },
    ],
  },
  {
    title: "Integrations",
    icon: Plug,
    items: [
      { label: "SCADA/OPC-UA", value: "Placeholder", type: "status", status: "pending" },
      { label: "ERP (SAP/Oracle)", value: "Placeholder", type: "status", status: "pending" },
      { label: "MES/MOM", value: "Placeholder", type: "status", status: "pending" },
      { label: "Historian (OSIsoft/AVEVA)", value: "Placeholder", type: "status", status: "pending" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    items: [
      { label: "JWT Token Expiry", value: "8 hours", type: "text" },
      { label: "Password Policy", value: "Strong (8+ chars, mixed)", type: "text" },
      { label: "2FA", value: "Not enabled", type: "status", status: "pending" },
      { label: "API Rate Limiting", value: "100 req/min", type: "text" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Email Notifications", value: "Not configured", type: "status", status: "pending" },
      { label: "SMS Alerts", value: "Not configured", type: "status", status: "pending" },
      { label: "Critical Alert Threshold", value: "Health < 70%", type: "text" },
      { label: "AI Recommendation Alerts", value: "Enabled", type: "status", status: "connected" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Platform configuration, integrations, and system preferences"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
                  >
                    <span className="text-xs text-white/50">{item.label}</span>
                    {item.type === "status" ? (
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          item.status === "connected"
                            ? "border-emerald-500/30 text-emerald-400"
                            : item.status === "ready"
                            ? "border-cyan-500/30 text-cyan-400"
                            : "border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {item.value}
                      </Badge>
                    ) : item.type === "secret" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/30">{item.value}</span>
                        <Key className="h-3 w-3 text-white/20" />
                      </div>
                    ) : (
                      <span className="text-xs text-white/70">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Environment Variables */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold text-white">Environment Variables</h3>
        <div className="rounded-lg bg-black/40 p-4 font-mono text-xs text-white/50">
          <p className="text-white/30"># .env configuration</p>
          <p>DATABASE_URL=postgresql://link_user:link_password@localhost:5432/link_platform</p>
          <p>REDIS_URL=redis://localhost:6379/0</p>
          <p>SECRET_KEY=&lt;your-secret-key&gt;</p>
          <p>CORS_ORIGINS=http://localhost:3000</p>
          <p className="text-white/30"># AI Provider Keys (optional)</p>
          <p>OPENAI_API_KEY=</p>
          <p>ANTHROPIC_API_KEY=</p>
          <p>OPENROUTER_API_KEY=</p>
        </div>
      </div>
    </div>
  );
}
