'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const MOCK_MEMBERS = [
  { id: '1', name: 'Alice Owner', email: 'owner@acme.test', role: 'org_owner' },
  { id: '2', name: 'Bob Manager', email: 'manager@acme.test', role: 'ops_manager' },
  { id: '3', name: 'Carol Analyst', email: 'analyst@acme.test', role: 'analyst' },
  { id: '4', name: 'Dave Engineer', email: 'engineer@acme.test', role: 'engineer' },
];

export default function MembersSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Members</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage organization members and invitations.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Invite member
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Member</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-text-secondary">Role</th>
                <th className="px-4 py-3 text-end text-xs font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MEMBERS.map((member) => (
                <tr key={member.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-text-primary">{member.name}</p>
                      <p className="text-xs text-text-secondary">{member.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="brand">{member.role.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Button variant="ghost" size="sm">Change role</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
