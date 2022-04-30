import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter, createRouter } from '../createRouter';
import { hashPassword, verifyPassword } from '../../utils/auth';

export const userRouter = createProtectedRouter().mutation('change-password', {
  input: z.object({
    password: z.string().min(1).max(32),
    newPassword: z.string().min(1).max(32),
  }),
  async resolve({ input, ctx }) {
    const { password, newPassword } = input;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (!user || !verifyPassword(hashedPassword, user.password)) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    const newHashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newHashedPassword,
      },
    });
  },
});
