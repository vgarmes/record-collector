import { Prisma, Role, Record } from '@prisma/client';
import { prisma } from '../prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter, createRouter } from '../createRouter';

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

      const data = await prisma.record.findMany({
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
      });

      const total = await prisma.record.count();

      return { data, total };
    },
  });

export const recordAdminRouter = createProtectedRouter(Role.ADMIN)
  .mutation('create', {
    input: z.object({
      title: z.string().min(1).max(50),
      format: z.string(),
      authorId: z.number(),
      year: z.number().nullable(),
      version: z.string().nullable(),
      ownerId: z.number(),
      labelId: z.number(),
    }),
    async resolve({ input }) {
      const newRecord = await prisma.record.create({
        data: input,
      });
      return newRecord;
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      data: z.object({
        title: z.string().min(1).max(50).optional(),
        format: z.string().optional(),
        authorId: z.number().optional(),
        year: z.number().nullable().optional(),
        version: z.string().nullable().optional(),
        ownerId: z.number().optional(),
        labelId: z.number().optional(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const record = await prisma.record.update({
        where: { id },
        data,
      });
      return record;
    },
  });
