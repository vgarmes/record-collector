import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../createRouter';

export const userRouter = createRouter().query('session', {
  resolve: ({ ctx }) => {
    return ctx.user;
  },
});
