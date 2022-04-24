import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';

interface CreateContextOptions {
  // session: Session | null
}

export async function createContextInner(_opts: CreateContextOptions) {
  return {};
}

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const req = opts?.req;
  const user = await getSession({ req });

  return {
    user,
  };

  //return await createContextInner({});
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
