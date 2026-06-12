import { v4 as uuid } from 'uuid';
import type { AuditEntry } from '../types';
import { addAuditEntry } from '../db';

export async function logAudit(
  agent: string,
  action: string,
  details: string,
  status: 'success' | 'error' | 'info' = 'info',
  metadata?: Record<string, unknown>
): Promise<AuditEntry> {
  const entry: AuditEntry = {
    id: uuid(),
    timestamp: new Date().toISOString(),
    agent,
    action,
    details,
    status,
    metadata,
  };
  await addAuditEntry(entry);
  return entry;
}

export async function logAgentStart(agent: string, task: string): Promise<AuditEntry> {
  return logAudit(agent, 'task_started', task, 'info');
}

export async function logAgentSuccess(agent: string, action: string, details: string, meta?: Record<string, unknown>): Promise<AuditEntry> {
  return logAudit(agent, action, details, 'success', meta);
}

export async function logAgentError(agent: string, action: string, error: string, meta?: Record<string, unknown>): Promise<AuditEntry> {
  return logAudit(agent, action, `ERROR: ${error}`, 'error', meta);
}
