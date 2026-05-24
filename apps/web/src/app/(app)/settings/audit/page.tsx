'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MOCK_AUDIT = [
  { id: '1', actor: 'Bob Manager', action: 'incident.created', entity: 'Incident', time: '2h ago', detail: 'Created incident: High API response times' },
  { id: '2', actor: 'Bob Manager', action: 'incident.status_changed', entity: 'Incident', time: '1h ago', detail: 'Changed status: open → in_progress' },
  { id: '3', actor: 'Alice Owner', action: 'organization.created', entity: 'Organization', time: '30d ago', detail: 'Created organization: Acme Corp' },
];

export default function AuditSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Audit Log</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Immutable record of all write actions in your organization.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Actor</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Action</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Entity</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Detail</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Time</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_AUDIT.map((entry) => (
                <tr key={entry.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">{entry.actor}</td>
                  <td className="px-4 py-3"><Badge>{entry.action}</Badge></td>
                  <td className="px-4 py-3 text-text-secondary">{entry.entity}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs">{entry.detail}</td>
                  <td className="px-4 py-3 text-text-tertiary text-xs">{entry.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
