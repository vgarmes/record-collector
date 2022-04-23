import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../createRouter';

export const recordRouter = createRouter().query('all', {
  async resolve() {
    return prisma.record.findMany({ skip: 1, take: 10 });
  },
});
