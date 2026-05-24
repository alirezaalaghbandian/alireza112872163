'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';

const MOCK_KPIS = [
  {
    name: 'API Response Time',
    value: '187ms',
    change: -12,
    direction: 'lower_is_better' as const,
    status: 'normal' as const,
  },
  {
    name: 'Error Rate',
    value: '0.8%',
    change: -5,
    direction: 'lower_is_better' as const,
    status: 'normal' as const,
  },
  {
    name: 'Request Throughput',
    value: '1,247 req/min',
    change: 8,
    direction: 'higher_is_better' as const,
    status: 'normal' as const,
  },
  {
    name: 'CPU Usage',
    value: '62%',
    change: 15,
    direction: 'lower_is_better' as const,
    status: 'warning' as const,
  },
];

const MOCK_INCIDENTS = [
  {
    id: '1',
    title: 'High API response times detected',
    status: 'open',
    priority: 'critical',
    createdAt: '2h ago',
  },
  {
    id: '2',
    title: 'Error rate spike on payment-service',
    status: 'in_progress',
    priority: 'high',
    createdAt: '4h ago',
  },
  {
    id: '3',
    title: 'Inventory service CPU saturation',
    status: 'resolved',
    priority: 'medium',
    createdAt: '1d ago',
  },
];

const statusVariant: Record<string, 'danger' | 'warning' | 'success' | 'info' | 'default'> = {
  open: 'danger',
  acknowledged: 'warning',
  in_progress: 'info',
  resolved: 'success',
  closed: 'default',
};

const priorityVariant: Record<string, 'danger' | 'warning' | 'info' | 'default'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'default',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Overview of your operational metrics and active incidents.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_KPIS.map((kpi) => {
          const isGood =
            kpi.direction === 'lower_is_better'
              ? kpi.change < 0
              : kpi.change > 0;

          return (
            <Card key={kpi.name} className="group cursor-pointer hover:border-border-strong transition-colors">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{kpi.name}</span>
                  <Badge
                    variant={
                      kpi.status === 'normal'
                        ? 'success'
                        : kpi.status === 'warning'
                          ? 'warning'
                          : 'danger'
                    }
                  >
                    {kpi.status}
                  </Badge>
                </div>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-2xl font-semibold text-text-primary">{kpi.value}</span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      isGood ? 'text-success-500' : 'text-danger-500'
                    }`}
                  >
                    {isGood ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {Math.abs(kpi.change)}%
                  </span>
                </div>
                {/* Sparkline placeholder - shown on hover */}
                <div className="mt-3 h-8 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex h-full items-end gap-px">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-brand-500/30"
                        style={{ height: `${30 + Math.random() * 70}%` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-text-secondary" />
              <h2 className="text-sm font-semibold text-text-primary">Active Incidents</h2>
            </div>
            <Badge variant="danger">{MOCK_INCIDENTS.filter((i) => i.status !== 'resolved' && i.status !== 'closed').length} open</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_INCIDENTS.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between rounded-md border border-border-subtle p-3 hover:bg-bg-sunken transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {incident.title}
                    </p>
                    <p className="mt-0.5 text-xs text-text-tertiary">{incident.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2 ms-3">
                    <Badge variant={priorityVariant[incident.priority]}>{incident.priority}</Badge>
                    <Badge variant={statusVariant[incident.status]}>{incident.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Anomalies */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-text-secondary" />
              <h2 className="text-sm font-semibold text-text-primary">Recent Anomalies</h2>
            </div>
            <Badge variant="warning">3 active</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { kpi: 'API Response Time', value: '532ms', severity: 'critical', time: '15m ago' },
                { kpi: 'CPU Usage', value: '92%', severity: 'warning', time: '45m ago' },
                { kpi: 'Error Rate', value: '3.2%', severity: 'warning', time: '1h ago' },
              ].map((anomaly, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-border-subtle p-3 hover:bg-bg-sunken transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{anomaly.kpi}</p>
                    <p className="mt-0.5 text-xs text-text-tertiary">Value: {anomaly.value}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={anomaly.severity === 'critical' ? 'danger' : 'warning'}>
                      <AlertTriangle className="h-3 w-3" />
                      {anomaly.severity}
                    </Badge>
                    <span className="text-xs text-text-tertiary">{anomaly.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
