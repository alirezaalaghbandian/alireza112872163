'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Key, Plus } from 'lucide-react';

export default function ApiKeysSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">API Keys</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage API keys for programmatic access.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Create API key
        </Button>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            icon={Key}
            title="No API keys"
            description="Create an API key to access OpsCore programmatically."
            action={{ label: 'Create API key', onClick: () => {} }}
            helpLink={{ label: 'Learn about API authentication', href: '#' }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
