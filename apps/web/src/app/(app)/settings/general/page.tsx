'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">General Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your organization settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-text-primary">Organization</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="org-name" className="block text-sm font-medium text-text-primary mb-1.5">
              Organization name
            </label>
            <Input id="org-name" defaultValue="Acme Corp" />
          </div>
          <div>
            <label htmlFor="org-slug" className="block text-sm font-medium text-text-primary mb-1.5">
              Slug
            </label>
            <Input id="org-slug" defaultValue="acme-corp" />
          </div>
          <Button>Save changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-text-primary">Appearance</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Theme</label>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Light</Button>
              <Button variant="secondary" size="sm">Dark</Button>
              <Button variant="secondary" size="sm">System</Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Language</label>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">English</Button>
              <Button variant="secondary" size="sm">فارسی</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
