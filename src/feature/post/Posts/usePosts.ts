import { trpc } from '@src/utils/trpc'

type Params = {
  limit?: number
}

export const usePosts = ({ limit }: Partial<Params> = {}) => {
  const postsQuery = trpc.post.list.useInfiniteQuery(
    {
      limit,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor
      },
    }
  )

  return {
    data: postsQuery.data,
    fetchPreviousPage: postsQuery.fetchPreviousPage,
    hasPreviousPage: postsQuery.hasPreviousPage,
    isError: postsQuery.isError,
    isFetchingPreviousPage: postsQuery.isFetchingPreviousPage,
    isLoading: postsQuery.isLoading,
  } as const
}
