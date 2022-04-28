import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../createRouter';

export const recordRouter = createRouter()
  .query('all', {
    async resolve() {
      return prisma.record.findMany({ skip: 1, take: 10 });
    },
  })
  .query('paginated', {
    input: z.object({
      skip: z.number().nonnegative().nullish(),
      take: z.number().positive().nullish(),
      sortBy: z.string().nullish(),
    }),
    async resolve({ input }) {
      const skip = input.skip ?? 0;
      const take = input.take ?? 50;
      //const sortBy = input.sortBy ??

      return prisma.$transaction([
        prisma.record.findMany({
          skip,
          take,
          orderBy: [
            {
              author: {
                name: 'asc',
              },
            },
            {
              year: 'asc',
            },
          ],
          include: {
            author: {
              select: {
                name: true,
              },
            },
            label: {
              select: {
                name: true,
              },
            },
          },
        }),
        prisma.record.count(),
      ]);
    },
  });
