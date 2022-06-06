import { Prisma, Role } from '@prisma/client';
import { prisma } from '../prisma';
import { z } from 'zod';
import { createProtectedRouter, createRouter } from '../createRouter';

// private routes
const privateRecordRouter = createProtectedRouter(Role.ADMIN)
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
        data: {
          title: input.title,
          format: input.format,
          year: input.year,
          version: input.version,
          author: {
            connect: {
              id: input.authorId,
            },
          },
          label: {
            connect: {
              id: input.labelId,
            },
          },
          owner: {
            connect: {
              id: input.ownerId,
            },
          },
        },
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
      searchQuery: z.string().optional(),
    }),
    async resolve({ input }) {
      const skip = input.skip ?? 0;
      const take = input.take ?? 50;
      //const sortBy = input.sortBy ??
      const where: Prisma.RecordWhereInput | undefined = input.searchQuery
        ? { author: { name: { contains: input.searchQuery } } }
        : undefined;

      const data = await prisma.record.findMany({
        skip,
        take,
        where,
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
      });

      const total = await prisma.record.count();

      return { data, total };
    },
  })
  .query('search', {
    input: z.object({
      query: z.string(),
    }),
    async resolve({ input }) {
      return prisma.record.findMany({
        take: 20,
        where: {
          OR: [
            {
              title: {
                contains: input.query,
              },
            },
            {
              author: {
                name: {
                  contains: input.query,
                },
              },
            },
          ],
        },
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
    },
  })
  .merge(privateRecordRouter);
