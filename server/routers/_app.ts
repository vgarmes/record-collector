/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from '../createRouter';
import { recordAdminRouter, recordRouter } from './record';
import { userRouter } from './user';
import superjson from 'superjson';
import { authorRouter } from './author';

export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  .merge('user.', userRouter)
  .merge('record.', recordRouter)
  .merge('recordAdmin.', recordAdminRouter)
  .merge('author.', authorRouter);

export type AppRouter = typeof appRouter;
