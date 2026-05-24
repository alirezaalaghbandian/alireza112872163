'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

const MOCK_KPIS = [
  { id: '1', name: 'API Response Time', value: 187, unit: 'ms', direction: 'lower_is_better', change: -12, status: 'normal' },
  { id: '2', name: 'Error Rate', value: 0.8, unit: '%', direction: 'lower_is_better', change: -5, status: 'normal' },
  { id: '3', name: 'Request Throughput', value: 1247, unit: 'req/min', direction: 'higher_is_better', change: 8, status: 'normal' },
  { id: '4', name: 'CPU Usage', value: 62, unit: '%', direction: 'lower_is_better', change: 15, status: 'warning' },
];

export default function KpisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">KPIs</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Key performance indicators computed from operational signals.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {MOCK_KPIS.map((kpi) => {
          const isGood = kpi.direction === 'lower_is_better' ? kpi.change < 0 : kpi.change > 0;

          return (
            <Card key={kpi.id} className="cursor-pointer hover:border-border-strong transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-text-secondary" />
                  <h3 className="text-sm font-semibold text-text-primary">{kpi.name}</h3>
                </div>
                <Badge variant={kpi.status === 'normal' ? 'success' : 'warning'}>{kpi.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-semibold text-text-primary">
                    {kpi.value.toLocaleString()}
                  </span>
                  <span className="mb-1 text-sm text-text-secondary">{kpi.unit}</span>
                  <span className={`mb-1 flex items-center gap-0.5 text-sm font-medium ms-auto ${isGood ? 'text-success-500' : 'text-danger-500'}`}>
                    {isGood ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                    {Math.abs(kpi.change)}%
                  </span>
                </div>
                <div className="mt-4 h-16 w-full">
                  <div className="flex h-full items-end gap-px">
                    {Array.from({ length: 48 }, (_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-brand-500/20 hover:bg-brand-500/40 transition-colors"
                        style={{ height: `${20 + Math.random() * 80}%` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
