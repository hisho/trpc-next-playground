import { TRPCClientError } from '@trpc/client'

import type { AppRouter } from '@/backend/routers/_app'

/**
 * https://trpc.io/docs/infer-types#infer-trpclienterrors-based-on-your-router
 */
export const isTRPCClientError = (
  error: unknown
): error is TRPCClientError<AppRouter> => {
  return error instanceof TRPCClientError
}
