import { z } from 'zod';

export const TenantId = z.string().uuid().brand('TenantId');
export type TenantId = z.infer<typeof TenantId>;

export const UserId = z.string().uuid().brand('UserId');
export type UserId = z.infer<typeof UserId>;

export const Email = z.string().email().max(255).brand('Email');
export type Email = z.infer<typeof Email>;

export const Role = z.enum(['org_owner', 'ops_manager', 'analyst', 'engineer', 'auditor']);
export type Role = z.infer<typeof Role>;

export const IncidentStatus = z.enum([
  'open',
  'acknowledged',
  'in_progress',
  'waiting_on_reporter',
  'resolved',
  'closed',
]);
export type IncidentStatus = z.infer<typeof IncidentStatus>;

export const IncidentPriority = z.enum(['critical', 'high', 'medium', 'low']);
export type IncidentPriority = z.infer<typeof IncidentPriority>;

export const KpiDirection = z.enum(['higher_is_better', 'lower_is_better']);
export type KpiDirection = z.infer<typeof KpiDirection>;

export const AnomalySeverity = z.enum(['critical', 'warning', 'info']);
export type AnomalySeverity = z.infer<typeof AnomalySeverity>;

export const SignalKind = z.enum(['metric', 'log', 'trace', 'event']);
export type SignalKind = z.infer<typeof SignalKind>;

export const CitationType = z.enum(['signal', 'kpi', 'snapshot', 'anomaly', 'incident']);
export type CitationType = z.infer<typeof CitationType>;

export const CopilotRole = z.enum(['user', 'assistant', 'system']);
export type CopilotRole = z.infer<typeof CopilotRole>;

export const VALID_INCIDENT_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  open: ['acknowledged'],
  acknowledged: ['in_progress', 'waiting_on_reporter'],
  in_progress: ['resolved', 'waiting_on_reporter'],
  waiting_on_reporter: ['in_progress', 'acknowledged'],
  resolved: ['closed'],
  closed: [],
};
