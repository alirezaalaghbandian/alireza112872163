'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Radio } from 'lucide-react';

const MOCK_SIGNALS = Array.from({ length: 20 }, (_, i) => ({
  id: `sig-${i}`,
  source: ['api-gateway', 'auth-service', 'payment-service', 'inventory-service'][i % 4],
  kind: 'metric',
  observedAt: new Date(Date.now() - i * 5 * 60 * 1000).toISOString(),
  payload: {
    duration_ms: Math.floor(100 + Math.random() * 400),
    status: [200, 200, 200, 500, 404][i % 5],
    cpu_percent: Math.floor(30 + Math.random() * 60),
  },
}));

export default function SignalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Signals</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Raw operational events from connected systems.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Source</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Kind</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Status</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Duration</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">CPU</th>
                  <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Observed</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SIGNALS.map((signal) => (
                  <tr
                    key={signal.id}
                    className="border-b border-border-subtle last:border-0 hover:bg-bg-sunken transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs">{signal.source}</td>
                    <td className="px-4 py-2.5">
                      <Badge>{signal.kind}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant={
                          (signal.payload.status as number) >= 500
                            ? 'danger'
                            : (signal.payload.status as number) >= 400
                              ? 'warning'
                              : 'success'
                        }
                      >
                        {signal.payload.status as number}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">{signal.payload.duration_ms as number}ms</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{signal.payload.cpu_percent as number}%</td>
                    <td className="px-4 py-2.5 text-xs text-text-secondary">
                      {new Date(signal.observedAt).toLocaleTimeString()}
                    </td>
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
