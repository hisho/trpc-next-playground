import { trpc } from '@src/utils/trpc'

type Params = {
  id: string
}

export const usePost = ({ id }: Params) => {
  const postQuery = trpc.post.byId.useQuery({ id })

  return {
    data: postQuery.data,
    error: {
      httpStatus: postQuery.error?.data?.httpStatus,
      message: postQuery.error?.message,
    },
    isError: postQuery.isError,
    isLoading: postQuery.isLoading,
  } as const
}
