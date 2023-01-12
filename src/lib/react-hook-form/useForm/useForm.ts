import { zodResolver } from '@hookform/resolvers/zod'
import { useForm as useRHForm, UseFormProps } from 'react-hook-form'
import type { z } from 'zod'

type Props<TSchema extends z.ZodType> = Omit<
  UseFormProps<TSchema['_input']>,
  'resolver'
> & {
  schema: TSchema
}

export const useForm = <TSchema extends z.ZodType>(props: Props<TSchema>) => {
  return useRHForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  })
}
