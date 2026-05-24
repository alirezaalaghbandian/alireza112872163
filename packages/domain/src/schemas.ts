import { z } from 'zod';
import {
  Role,
  IncidentStatus,
  IncidentPriority,
  KpiDirection,
  AnomalySeverity,
  SignalKind,
  CitationType,
  CopilotRole,
} from './values.js';

// --- Auth ---
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(255),
  orgName: z.string().min(1).max(255),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().optional(),
});

// --- Organization ---
export const UpdateOrgSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(2).max(63).regex(/^[a-z0-9-]+$/).optional(),
});

export const InviteMemberSchema = z.object({
  email: z.string().email(),
  role: Role,
});

export const UpdateMemberRoleSchema = z.object({
  role: Role,
});

// --- Signals ---
export const CreateSignalSchema = z.object({
  source: z.string().min(1).max(255),
  kind: SignalKind,
  payload: z.record(z.unknown()),
  observedAt: z.string().datetime(),
});

export const ListSignalsSchema = z.object({
  cursor: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  source: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// --- KPIs ---
export const ThresholdBand = z.object({
  label: z.string(),
  min: z.number().nullable(),
  max: z.number().nullable(),
  severity: AnomalySeverity,
});

export const CreateKpiSchema = z.object({
  name: z.string().min(1).max(255),
  formula: z.string().min(1),
  unit: z.string().min(1).max(50),
  direction: KpiDirection,
  thresholds: z.array(ThresholdBand).min(1),
  windowSeconds: z.number().int().min(60).max(86400),
});

export const ListSnapshotsSchema = z.object({
  window: z.enum(['1h', '6h', '24h', '7d', '30d']).default('24h'),
});

// --- Incidents ---
export const CreateIncidentSchema = z.object({
  title: z.string().min(1).max(500),
  summary: z.string().max(5000).optional(),
  priority: IncidentPriority,
  anomalyIds: z.array(z.string().uuid()).optional(),
});

export const UpdateIncidentSchema = z.object({
  status: IncidentStatus.optional(),
  priority: IncidentPriority.optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(500).optional(),
  summary: z.string().max(5000).optional(),
});

export const CreateCommentSchema = z.object({
  body: z.string().min(1).max(10000),
});

// --- Copilot ---
export const Citation = z.object({
  type: CitationType,
  id: z.string().uuid(),
});

export const CreateConversationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
});

export const SendMessageSchema = z.object({
  content: z.string().min(1).max(10000),
});

export const CopilotMessageSchema = z.object({
  role: CopilotRole,
  content: z.string(),
  citations: z.array(Citation).optional(),
});

// --- Reports ---
export const CreateReportSchema = z.object({
  title: z.string().min(1).max(255),
  type: z.enum(['incident_summary', 'kpi_trend', 'anomaly_digest', 'pir']),
  config: z.record(z.unknown()).optional(),
});

// --- Audit ---
export const ListAuditSchema = z.object({
  actor: z.string().uuid().optional(),
  entityType: z.string().optional(),
  entityId: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// --- Common ---
export const PaginatedResponse = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().uuid().nullable(),
    totalEstimate: z.number().int().optional(),
  });

export const ProblemDetail = z.object({
  type: z.string().url().optional(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string().optional(),
  instance: z.string().optional(),
});
