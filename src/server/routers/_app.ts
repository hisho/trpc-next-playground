/**
 * This file contains the root router of your tRPC-backend
 */
import { postRouter } from '@src/server/routers/post';
import { publicProcedure, router } from '@src/server/trpc';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  post: postRouter,
});

export type AppRouter = typeof appRouter;
