'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ShieldAlert, Plus } from 'lucide-react';

const MOCK_INCIDENTS = [
  { id: '1', title: 'High API response times detected', status: 'open', priority: 'critical', assignee: null, createdAt: '2h ago', summary: 'Multiple endpoints reporting p95 > 500ms' },
  { id: '2', title: 'Error rate spike on payment-service', status: 'in_progress', priority: 'high', assignee: 'Dave Engineer', createdAt: '4h ago', summary: 'Error rate exceeded 5% threshold' },
  { id: '3', title: 'Inventory service CPU saturation', status: 'resolved', priority: 'medium', assignee: 'Dave Engineer', createdAt: '1d ago', summary: 'CPU peaked at 98% due to cache leak' },
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

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Incidents</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Track and resolve operational issues.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New incident
        </Button>
      </div>

      <div className="space-y-3">
        {MOCK_INCIDENTS.map((incident) => (
          <Link key={incident.id} href={`/incidents/${incident.id}`}>
            <Card className="cursor-pointer hover:border-border-strong transition-colors">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-text-primary truncate">{incident.title}</h3>
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary truncate">{incident.summary}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-text-tertiary">
                    <span>{incident.createdAt}</span>
                    {incident.assignee && <span>Assigned to {incident.assignee}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 ms-4">
                  <Badge variant={priorityVariant[incident.priority]}>{incident.priority}</Badge>
                  <Badge variant={statusVariant[incident.status]}>{incident.status.replace('_', ' ')}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
