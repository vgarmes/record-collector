import { Context } from './context';
import * as trpc from '@trpc/server';
import { Role } from '@prisma/client';
import { TRPCError } from '@trpc/server';

/**
 * Helper function to create a router with context
 */
export function createRouter() {
  return trpc.router<Context>();
}

export function createProtectedRouter(role?: Role) {
  return trpc.router<Context>().middleware(async ({ ctx, next }) => {
    if (!ctx.session || (role && ctx.session.role !== role)) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    // infers that `session` is non-nullable to downstream procedures
    return next({ ctx: { ...ctx, session: ctx.session } });
  });
}
