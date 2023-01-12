import type { AppRouter } from '@src/server/routers/_app'
import type { TRPCClientError } from '@trpc/client'
import type { inferProcedureInput } from '@trpc/server'
import type { AnyProcedure } from '@trpc/server/src/core/procedure'
import { useState } from 'react'

export const useTRPCError = <T extends AnyProcedure>() => {
  const [error, setError] = useState<TRPCClientError<AppRouter> | undefined>(
    undefined
  )

  const resetError = () => setError(undefined)

  const findErrorMessages = (key: keyof inferProcedureInput<T>) => {
    return error?.data?.zodError?.fieldErrors[key]
  }

  return {
    findErrorMessages,
    resetError,
    setError,
  }
}
