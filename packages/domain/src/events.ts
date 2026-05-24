export interface DomainEvent {
  type: string;
  tenantId: string;
  entityId: string;
  entityType: string;
  occurredAt: Date;
  payload: Record<string, unknown>;
  actorId?: string;
}

export interface SignalIngested extends DomainEvent {
  type: 'signal.ingested';
  entityType: 'signal';
}

export interface KpiSnapshotComputed extends DomainEvent {
  type: 'kpi.snapshot_computed';
  entityType: 'kpi_snapshot';
}

export interface AnomalyDetected extends DomainEvent {
  type: 'anomaly.detected';
  entityType: 'anomaly';
}

export interface IncidentCreated extends DomainEvent {
  type: 'incident.created';
  entityType: 'incident';
}

export interface IncidentStatusChanged extends DomainEvent {
  type: 'incident.status_changed';
  entityType: 'incident';
  payload: {
    from: string;
    to: string;
    [key: string]: unknown;
  };
}

export interface CommentAdded extends DomainEvent {
  type: 'comment.added';
  entityType: 'comment';
}

export interface CopilotMessageSent extends DomainEvent {
  type: 'copilot.message_sent';
  entityType: 'copilot_message';
}

export interface ReportRunCompleted extends DomainEvent {
  type: 'report.run_completed';
  entityType: 'report_run';
}

export type AppDomainEvent =
  | SignalIngested
  | KpiSnapshotComputed
  | AnomalyDetected
  | IncidentCreated
  | IncidentStatusChanged
  | CommentAdded
  | CopilotMessageSent
  | ReportRunCompleted;
