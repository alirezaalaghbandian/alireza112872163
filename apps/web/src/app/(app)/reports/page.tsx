'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText, Plus, Download, Play } from 'lucide-react';

const MOCK_REPORTS = [
  { id: '1', title: 'Weekly Incident Summary', type: 'incident_summary', lastRun: '2 days ago', status: 'completed' },
  { id: '2', title: 'KPI Trend Report — Q2', type: 'kpi_trend', lastRun: '1 week ago', status: 'completed' },
  { id: '3', title: 'Anomaly Digest — May', type: 'anomaly_digest', lastRun: null, status: 'never_run' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Reports</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Generate and export operational reports.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New report
        </Button>
      </div>

      <div className="space-y-3">
        {MOCK_REPORTS.map((report) => (
          <Card key={report.id} className="hover:border-border-strong transition-colors">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-bg-sunken">
                  <FileText className="h-4 w-4 text-text-secondary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-primary">{report.title}</h3>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {report.lastRun ? `Last run: ${report.lastRun}` : 'Never run'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{report.type.replace('_', ' ')}</Badge>
                <Button variant="ghost" size="sm">
                  <Play className="h-3.5 w-3.5" />
                  Run
                </Button>
                {report.status === 'completed' && (
                  <Button variant="ghost" size="sm">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
