/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from '../createRouter';
import { recordRouter } from './record';
import { userRouter } from './user';
import superjson from 'superjson';
import { authorRouter } from './author';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('record.', recordRouter)
  .merge('author.', authorRouter);

export type AppRouter = typeof appRouter;
