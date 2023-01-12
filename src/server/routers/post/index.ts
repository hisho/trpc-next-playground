/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from '@prisma/client'
import { createPostSchema } from '@src/model/Post/schema'
import { prisma } from '@src/server/prisma'
import { publicProcedure, router } from '@src/server/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  createdAt: true,
  id: true,
  text: true,
  title: true,
  updatedAt: true,
})

export const postRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input
      const post = await prisma.post.findUnique({
        select: defaultPostSelect,
        where: { id },
      })
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        })
      }
      return post
    }),
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      return await prisma.post.create({
        data: {
          text: input.text,
          title: input.title,
          ...(input.id ? { id: input.id } : {}),
        },
        select: defaultPostSelect,
      })
    }),
  list: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).nullish(),
      })
    )
    .query(async ({ input }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */

      const limit = input.limit ?? 50
      const { cursor } = input

      const items = await prisma.post.findMany({
        ...(cursor
          ? {
              cursor: {
                id: cursor,
              },
            }
          : {}),

        orderBy: {
          createdAt: 'desc',
        },

        select: defaultPostSelect,
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        where: {},
      })
      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!
        nextCursor = nextItem.id
      }

      return {
        items: items.reverse(),
        nextCursor,
      }
    }),
})
