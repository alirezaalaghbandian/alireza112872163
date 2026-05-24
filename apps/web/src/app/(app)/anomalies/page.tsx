'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const MOCK_ANOMALIES = [
  { id: '1', kpi: 'API Response Time', value: '532ms', severity: 'critical', detectedAt: '15 minutes ago', resolved: false },
  { id: '2', kpi: 'CPU Usage', value: '92%', severity: 'warning', detectedAt: '45 minutes ago', resolved: false },
  { id: '3', kpi: 'Error Rate', value: '3.2%', severity: 'warning', detectedAt: '1 hour ago', resolved: false },
  { id: '4', kpi: 'API Response Time', value: '420ms', severity: 'warning', detectedAt: '3 hours ago', resolved: true },
  { id: '5', kpi: 'Request Throughput', value: '85 req/min', severity: 'critical', detectedAt: '6 hours ago', resolved: true },
];

export default function AnomaliesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Anomalies</h1>
        <p className="mt-1 text-sm text-text-secondary">
          KPI snapshots that violated threshold bands.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">KPI</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Value</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Severity</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Status</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Detected</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ANOMALIES.map((anomaly) => (
                  <tr key={anomaly.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-sunken transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-medium text-text-primary">{anomaly.kpi}</td>
                    <td className="px-4 py-3 font-mono text-xs">{anomaly.value}</td>
                    <td className="px-4 py-3">
                      <Badge variant={anomaly.severity === 'critical' ? 'danger' : 'warning'}>
                        <AlertTriangle className="h-3 w-3" />
                        {anomaly.severity}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={anomaly.resolved ? 'success' : 'danger'}>
                        {anomaly.resolved ? 'Resolved' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">{anomaly.detectedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
