import type { Role, IncidentStatus, IncidentPriority, KpiDirection, AnomalySeverity, SignalKind, CopilotRole, CitationType } from './values.js';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  orgId: string;
  role: Role;
  createdAt: Date;
}

export interface Invitation {
  id: string;
  tenantId: string;
  email: string;
  role: Role;
  invitedBy: string;
  acceptedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface Signal {
  id: string;
  tenantId: string;
  source: string;
  kind: SignalKind;
  payload: Record<string, unknown>;
  observedAt: Date;
  ingestedAt: Date;
}

export interface Kpi {
  id: string;
  tenantId: string;
  name: string;
  formula: string;
  unit: string;
  direction: KpiDirection;
  thresholds: ThresholdBand[];
  windowSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThresholdBand {
  label: string;
  min: number | null;
  max: number | null;
  severity: AnomalySeverity;
}

export interface KpiSnapshot {
  id: string;
  tenantId: string;
  kpiId: string;
  value: number;
  computedAt: Date;
  windowStart: Date;
  windowEnd: Date;
}

export interface Anomaly {
  id: string;
  tenantId: string;
  kpiSnapshotId: string;
  severity: AnomalySeverity;
  detectedAt: Date;
  resolvedAt: Date | null;
}

export interface Incident {
  id: string;
  tenantId: string;
  title: string;
  summary: string | null;
  status: IncidentStatus;
  priority: IncidentPriority;
  openedAt: Date;
  acknowledgedAt: Date | null;
  resolvedAt: Date | null;
  closedAt: Date | null;
  assigneeId: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentEvent {
  id: string;
  tenantId: string;
  incidentId: string;
  kind: string;
  payload: Record<string, unknown>;
  actorId: string;
  occurredAt: Date;
}

export interface Comment {
  id: string;
  tenantId: string;
  incidentId: string;
  authorId: string;
  body: string;
  createdAt: Date;
}

export interface CopilotConversation {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CopilotMessage {
  id: string;
  tenantId: string;
  conversationId: string;
  role: CopilotRole;
  content: string;
  citations: Citation[];
  tokensIn: number;
  tokensOut: number;
  model: string;
  createdAt: Date;
}

export interface Citation {
  type: CitationType;
  id: string;
}

export interface Report {
  id: string;
  tenantId: string;
  title: string;
  type: string;
  config: Record<string, unknown>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportRun {
  id: string;
  tenantId: string;
  reportId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  outputUrl: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

export interface AuditEntry {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
  occurredAt: Date;
}

export interface RequestContext {
  tenantId: string;
  userId: string;
  role: Role;
  ipAddress: string;
  userAgent: string;
}
