import type { Role } from '@opscore/domain';
import { ForbiddenError } from '@opscore/domain';

type Action =
  | 'org:read'
  | 'org:update'
  | 'org:invite'
  | 'org:manage_roles'
  | 'signals:read'
  | 'signals:write'
  | 'kpis:read'
  | 'kpis:write'
  | 'anomalies:read'
  | 'incidents:read'
  | 'incidents:write'
  | 'incidents:assign'
  | 'incidents:comment'
  | 'copilot:read'
  | 'copilot:write'
  | 'reports:read'
  | 'reports:write'
  | 'reports:run'
  | 'audit:read'
  | 'settings:read'
  | 'settings:write';

const PERMISSIONS: Record<Role, Set<Action>> = {
  org_owner: new Set([
    'org:read', 'org:update', 'org:invite', 'org:manage_roles',
    'signals:read', 'signals:write',
    'kpis:read', 'kpis:write',
    'anomalies:read',
    'incidents:read', 'incidents:write', 'incidents:assign', 'incidents:comment',
    'copilot:read', 'copilot:write',
    'reports:read', 'reports:write', 'reports:run',
    'audit:read',
    'settings:read', 'settings:write',
  ]),
  ops_manager: new Set([
    'org:read',
    'signals:read', 'signals:write',
    'kpis:read', 'kpis:write',
    'anomalies:read',
    'incidents:read', 'incidents:write', 'incidents:assign', 'incidents:comment',
    'copilot:read', 'copilot:write',
    'reports:read', 'reports:write', 'reports:run',
    'audit:read',
    'settings:read',
  ]),
  analyst: new Set([
    'org:read',
    'signals:read',
    'kpis:read',
    'anomalies:read',
    'incidents:read',
    'copilot:read', 'copilot:write',
    'reports:read', 'reports:write', 'reports:run',
    'settings:read',
  ]),
  engineer: new Set([
    'org:read',
    'signals:read',
    'kpis:read',
    'anomalies:read',
    'incidents:read', 'incidents:comment',
    'copilot:read', 'copilot:write',
    'settings:read',
  ]),
  auditor: new Set([
    'org:read',
    'signals:read',
    'kpis:read',
    'anomalies:read',
    'incidents:read',
    'copilot:read',
    'reports:read',
    'audit:read',
    'settings:read',
  ]),
};

export function can(role: Role, action: Action): boolean {
  const perms = PERMISSIONS[role];
  return perms.has(action);
}

export function assertCan(role: Role, action: Action): void {
  if (!can(role, action)) {
    throw new ForbiddenError(`Role '${role}' does not have permission '${action}'`);
  }
}
