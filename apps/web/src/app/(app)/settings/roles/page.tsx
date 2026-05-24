'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ROLES = [
  { name: 'Org Owner', key: 'org_owner', permissions: 'Full access to all features and settings' },
  { name: 'Operations Manager', key: 'ops_manager', permissions: 'Manage signals, KPIs, incidents, copilot, and reports' },
  { name: 'Analyst', key: 'analyst', permissions: 'Read-only on production data, full access to reports' },
  { name: 'Engineer', key: 'engineer', permissions: 'Read access, can comment on incidents' },
  { name: 'Auditor', key: 'auditor', permissions: 'Read-only on everything including audit log' },
];

export default function RolesSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Roles</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Role-based access control configuration.
        </p>
      </div>

      <div className="space-y-3">
        {ROLES.map((role) => (
          <Card key={role.key}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <h3 className="text-sm font-medium text-text-primary">{role.name}</h3>
                <p className="mt-0.5 text-xs text-text-secondary">{role.permissions}</p>
              </div>
              <Badge variant="brand">{role.key}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
