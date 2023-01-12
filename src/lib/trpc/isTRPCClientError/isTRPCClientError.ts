import type { AppRouter } from '@src/server/routers/_app'
import { TRPCClientError } from '@trpc/client'

/**
 * https://trpc.io/docs/infer-types#infer-trpclienterrors-based-on-your-router
 */
export const isTRPCClientError = (
  error: unknown
): error is TRPCClientError<AppRouter> => {
  return error instanceof TRPCClientError
}
