import type { FastifyInstance } from 'fastify';
import { LoginSchema, SignupSchema, InviteMemberSchema, UpdateMemberRoleSchema, UpdateOrgSchema } from '@opscore/domain';
import { sendError } from '../../../lib/errors.js';
import type { AuthService } from '../application/auth-service.js';
import type { OrgService } from '../application/org-service.js';

export function registerIdentityRoutes(
  app: FastifyInstance,
  authService: AuthService,
  orgService: OrgService,
) {
  // Auth routes
  app.post('/api/v1/auth/signup', async (request, reply) => {
    try {
      const body = SignupSchema.parse(request.body);
      const result = await authService.signup(body.email, body.password, body.name, body.orgName);

      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth',
        maxAge: 14 * 24 * 60 * 60,
      });

      return reply.status(201).send({
        accessToken: result.accessToken,
        user: result.user,
        org: result.org,
        role: result.role,
      });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/auth/login', async (request, reply) => {
    try {
      const body = LoginSchema.parse(request.body);
      const result = await authService.login(body.email, body.password);

      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth',
        maxAge: 14 * 24 * 60 * 60,
      });

      return reply.send({
        accessToken: result.accessToken,
        user: result.user,
        org: result.org,
        role: result.role,
      });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/auth/refresh', async (request, reply) => {
    try {
      const refreshToken = request.cookies['refreshToken'];
      if (!refreshToken) {
        return reply.status(401).send({ message: 'No refresh token provided' });
      }

      const result = await authService.refresh(refreshToken);

      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth',
        maxAge: 14 * 24 * 60 * 60,
      });

      return reply.send({ accessToken: result.accessToken });
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/auth/logout', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as { userId: string } | undefined;
      if (ctx) {
        await authService.logout(ctx.userId);
      }
      reply.clearCookie('refreshToken', { path: '/api/v1/auth' });
      return reply.status(204).send();
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  // Org routes (authenticated)
  app.get('/api/v1/orgs/me', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as { tenantId: string };
      const org = await orgService.getOrg(ctx.tenantId);
      return reply.send(org);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.patch('/api/v1/orgs/me', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as { tenantId: string; role: string };
      const body = UpdateOrgSchema.parse(request.body);
      const org = await orgService.updateOrg(ctx.tenantId, ctx.role as 'org_owner', body);
      return reply.send(org);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/orgs/me/invitations', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as { tenantId: string; userId: string; role: string };
      const body = InviteMemberSchema.parse(request.body);
      const invitation = await orgService.invite(
        ctx.tenantId,
        body.email,
        body.role,
        ctx.userId,
        ctx.role as 'org_owner',
      );
      return reply.status(201).send(invitation);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/orgs/me/members/:id/role', async (request, reply) => {
    try {
      const ctx = (request as Record<string, unknown>)['ctx'] as { tenantId: string; role: string };
      const params = request.params as { id: string };
      const body = UpdateMemberRoleSchema.parse(request.body);
      await orgService.updateMemberRole(ctx.tenantId, params.id, body.role, ctx.role as 'org_owner');
      return reply.status(204).send();
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });
}
