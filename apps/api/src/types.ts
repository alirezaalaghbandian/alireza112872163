import type { RequestContext } from '@opscore/domain';

declare module 'fastify' {
  interface FastifyRequest {
    ctx: RequestContext;
  }
}

export type RequestCtx = RequestContext;
