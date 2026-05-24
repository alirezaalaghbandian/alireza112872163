export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = 'Access denied') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class InvalidTransitionError extends DomainError {
  constructor(from: string, to: string) {
    super(`Invalid status transition: ${from} → ${to}`, 'INVALID_TRANSITION', 422);
    this.name = 'InvalidTransitionError';
  }
}

export class RateLimitError extends DomainError {
  constructor() {
    super('Rate limit exceeded', 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message, 'VALIDATION_ERROR', 422);
    this.name = 'ValidationError';
  }
}
