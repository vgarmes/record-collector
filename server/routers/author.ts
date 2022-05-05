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
    console.log(input);
    return prisma.author.findMany({
      where: {
        name: {
          contains: input.searchQuery,
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
    });
  },
});
