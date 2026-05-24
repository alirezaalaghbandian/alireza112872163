import type { FastifyInstance } from 'fastify';
import { LoginSchema, SignupSchema, InviteMemberSchema, UpdateMemberRoleSchema, UpdateOrgSchema } from '@opscore/domain';
import { sendError } from '../../../lib/errors.js';
import type { AuthService } from '../application/auth-service.js';
import type { OrgService } from '../application/org-service.js';
import '../../../types.js';

export function registerIdentityRoutes(
  app: FastifyInstance,
  authService: AuthService,
  orgService: OrgService,
) {
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
      if (request.ctx) {
        await authService.logout(request.ctx.userId);
      }
      reply.clearCookie('refreshToken', { path: '/api/v1/auth' });
      return reply.status(204).send();
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.get('/api/v1/orgs/me', async (request, reply) => {
    try {
      const org = await orgService.getOrg(request.ctx.tenantId);
      return reply.send(org);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.patch('/api/v1/orgs/me', async (request, reply) => {
    try {
      const body = UpdateOrgSchema.parse(request.body);
      const org = await orgService.updateOrg(request.ctx.tenantId, request.ctx.role as 'org_owner', body);
      return reply.send(org);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/orgs/me/invitations', async (request, reply) => {
    try {
      const body = InviteMemberSchema.parse(request.body);
      const invitation = await orgService.invite(
        request.ctx.tenantId,
        body.email,
        body.role,
        request.ctx.userId,
        request.ctx.role as 'org_owner',
      );
      return reply.status(201).send(invitation);
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });

  app.post('/api/v1/orgs/me/members/:id/role', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = UpdateMemberRoleSchema.parse(request.body);
      await orgService.updateMemberRole(request.ctx.tenantId, params.id, body.role, request.ctx.role as 'org_owner');
      return reply.status(204).send();
    } catch (error) {
      sendError(reply, error, request.url);
    }
  });
}
