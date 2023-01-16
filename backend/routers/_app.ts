/**
 * This file contains the root router of your tRPC-backend
 */
import { postRouter } from '@backend/routers/post'
import { publicProcedure, router } from '@backend/trpc'

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  post: postRouter,
})

export type AppRouter = typeof appRouter
