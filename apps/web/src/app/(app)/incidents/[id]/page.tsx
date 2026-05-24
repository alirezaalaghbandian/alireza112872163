'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, User, MessageSquare, Activity } from 'lucide-react';

const MOCK_INCIDENT = {
  id: '1',
  title: 'High API response times detected',
  summary: 'Multiple endpoints reporting p95 > 500ms in the last 2 hours',
  status: 'open',
  priority: 'critical',
  assignee: null,
  createdBy: 'Bob Manager',
  openedAt: '2 hours ago',
  events: [
    { kind: 'created', actor: 'Bob Manager', time: '2h ago', payload: { priority: 'critical' } },
  ],
  comments: [
    { author: 'Dave Engineer', body: 'Investigating the logs now.', time: '1h ago' },
  ],
};

export default function IncidentDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{MOCK_INCIDENT.title}</h1>
          <p className="mt-1 text-sm text-text-secondary">{MOCK_INCIDENT.summary}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Assign</Button>
          <Button>Acknowledge</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-text-secondary" />
                <h2 className="text-sm font-semibold text-text-primary">Timeline</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_INCIDENT.events.map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bg-sunken">
                      <Activity className="h-3 w-3 text-text-tertiary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-primary">
                        <span className="font-medium">{event.actor}</span> {event.kind} this incident
                      </p>
                      <p className="text-xs text-text-tertiary">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-text-secondary" />
                <h2 className="text-sm font-semibold text-text-primary">Comments</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_INCIDENT.comments.map((comment, i) => (
                  <div key={i} className="rounded-md border border-border-subtle p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">{comment.author}</span>
                      <span className="text-xs text-text-tertiary">{comment.time}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-text-secondary">{comment.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Input placeholder="Add a comment..." className="flex-1" />
                <Button variant="secondary">Comment</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">Status</span>
                <Badge variant="danger">{MOCK_INCIDENT.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">Priority</span>
                <Badge variant="danger">{MOCK_INCIDENT.priority}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">Assignee</span>
                <span className="text-sm text-text-tertiary">Unassigned</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">Created by</span>
                <span className="text-sm text-text-primary">{MOCK_INCIDENT.createdBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">Opened</span>
                <span className="text-sm text-text-secondary">{MOCK_INCIDENT.openedAt}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
