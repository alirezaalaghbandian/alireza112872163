'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { MessageSquare, Plus, Send, ExternalLink } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  { id: '1', title: 'Root cause analysis: API latency spike', updatedAt: '2h ago' },
];

const MOCK_MESSAGES = [
  { role: 'user', content: 'What is causing the API response time spike in the last 2 hours?' },
  {
    role: 'assistant',
    content:
      'Based on my analysis of recent signals and anomalies, the API response time spike appears to be caused by increased error rates on the payment-service. The error rate exceeded the critical threshold of 5% starting approximately 2 hours ago, correlating with a surge in 500-status responses from the downstream payment gateway. I recommend investigating the payment gateway connectivity and reviewing the recent deployment changes to the payment-service.',
    citations: [
      { type: 'anomaly', id: 'anom-1', label: 'API Response Time anomaly' },
      { type: 'signal', id: 'sig-1', label: 'payment-service signal' },
    ],
  },
];

export default function CopilotPage() {
  const [input, setInput] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Copilot</h1>
          <p className="mt-1 text-sm text-text-secondary">
            AI-assisted root-cause analysis and operational intelligence.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New conversation
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Conversation list */}
        <div className="space-y-2">
          {MOCK_CONVERSATIONS.map((conv) => (
            <div
              key={conv.id}
              className="rounded-md border border-brand-500/30 bg-brand-50 p-3 cursor-pointer"
            >
              <p className="text-sm font-medium text-text-primary truncate">{conv.title}</p>
              <p className="mt-0.5 text-xs text-text-tertiary">{conv.updatedAt}</p>
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3">
          <Card className="flex flex-col" style={{ minHeight: 500 }}>
            <CardContent className="flex-1 space-y-4 p-4 overflow-y-auto">
              {MOCK_MESSAGES.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-brand-500 text-white'
                        : 'bg-bg-sunken text-text-primary'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {'citations' in msg && msg.citations && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {msg.citations.map((citation, j) => (
                          <button
                            key={j}
                            className="inline-flex items-center gap-1 rounded-md bg-bg-elevated/80 px-2 py-1 text-xs font-medium text-brand-600 hover:bg-bg-elevated transition-colors border border-border-subtle"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {citation.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="border-t border-border-subtle p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about anomalies, incidents, or KPIs..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
