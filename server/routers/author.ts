import { Prisma, Role, Record } from '@prisma/client';
import { prisma } from '../prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter, createRouter } from '../createRouter';

export const authorRouter = createRouter().query('search', {
  input: z.object({
    searchQuery: z.string().optional(),
  }),
  async resolve({ input }) {
    return prisma.author.findMany({
      where: {
        name: {
          contains: input.searchQuery,
        },
      },
      take: 20,
    });
  },
});
