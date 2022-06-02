import { Prisma, Role, Record } from '@prisma/client';
import { prisma } from '../prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter, createRouter } from '../createRouter';

export const authorRouter = createRouter()
  .query('paginated', {
    input: z.object({
      skip: z.number().nonnegative().nullish(),
      take: z.number().positive().nullish(),
      searchQuery: z.string().optional(),
    }),
    async resolve({ input }) {
      const skip = input.skip ?? 0;
      const take = input.take ?? 50;
      const where: Prisma.AuthorWhereInput | undefined = input.searchQuery
        ? { name: { contains: input.searchQuery } }
        : undefined;

      return prisma.author.findMany({
        skip,
        take,
        where,
        include: {
          _count: {
            select: {
              records: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    },
  })
  .query('search', {
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
