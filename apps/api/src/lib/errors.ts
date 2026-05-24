import type { FastifyReply } from 'fastify';
import { DomainError } from '@opscore/domain';
import { ZodError } from 'zod';

interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export function toProblemDetail(error: unknown, instance?: string): ProblemDetail {
  if (error instanceof DomainError) {
    return {
      type: `https://opscore.dev/errors/${error.code.toLowerCase()}`,
      title: error.code.replace(/_/g, ' '),
      status: error.statusCode,
      detail: error.message,
      instance,
    };
  }

  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const path = issue.path.join('.');
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return {
      type: 'https://opscore.dev/errors/validation_error',
      title: 'Validation Error',
      status: 422,
      detail: 'One or more fields failed validation.',
      errors: fieldErrors,
      instance,
    };
  }

  return {
    type: 'https://opscore.dev/errors/internal_error',
    title: 'Internal Server Error',
    status: 500,
    detail: error instanceof Error ? error.message : 'An unexpected error occurred.',
    instance,
  };
}

export function sendError(reply: FastifyReply, error: unknown, instance?: string): void {
  const problem = toProblemDetail(error, instance);
  reply
    .status(problem.status)
    .header('content-type', 'application/problem+json')
    .send(problem);
}
