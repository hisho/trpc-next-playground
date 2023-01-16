import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react'
import { useForm } from '@src/lib/react-hook-form/useForm/useForm'
import { isTRPCClientError } from '@src/lib/trpc/isTRPCClientError/isTRPCClientError'
import { useTRPCError } from '@src/lib/trpc/useTRPCError/useTRPCError'
import { trpc } from '@src/utils/trpc'
import type { inferProcedureInput } from '@trpc/server'
import { useMemo } from 'react'
import { z } from 'zod'

import type { AppRouter } from '@/backend/routers/_app'

const id = 'CreatePostForm' as const

export const CreatePostForm = () => {
  const utils = trpc.useContext()
  const { findErrorMessages, resetError, setError } =
    useTRPCError<AppRouter['post']['create']>()

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      text: '',
      title: '',
    },
    mode: 'onBlur',
    schema: z.object({
      text: z.string(),
      title: z.string(),
    }),
  })

  const tRPCErrorMessages = useMemo(
    () => ({
      text: findErrorMessages('text'),
      title: findErrorMessages('title'),
    }),
    [findErrorMessages]
  )

  const createPost = trpc.post.create.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate()
    },
  })

  const onCreatePost = async ({
    id,
    text,
    title,
  }: inferProcedureInput<AppRouter['post']['create']>) => {
    try {
      await createPost.mutateAsync({ id, text, title })
      resetError()
      reset()
    } catch (e) {
      if (isTRPCClientError(e)) {
        setError(e)
      }
    }
  }

  return (
    <chakra.form
      w={'full'}
      maxW={'xl'}
      onSubmit={handleSubmit(onCreatePost)}
      id={id}
    >
      <FormControl isInvalid={!!tRPCErrorMessages.title}>
        <FormLabel>Title:</FormLabel>
        <Input
          type={'text'}
          isDisabled={createPost.isLoading}
          {...register('title')}
        />
        {tRPCErrorMessages.title &&
          tRPCErrorMessages.title.map((message, index) => (
            <FormErrorMessage
              key={`createPost_title_error_${message}_${index}`}
            >
              {message}
            </FormErrorMessage>
          ))}
      </FormControl>

      <chakra.br />
      <FormControl isInvalid={!!tRPCErrorMessages.text}>
        <FormLabel>Text:</FormLabel>
        <Textarea isDisabled={createPost.isLoading} {...register('text')} />
        {tRPCErrorMessages.text &&
          tRPCErrorMessages.text.map((message, index) => (
            <FormErrorMessage key={`createPost_text_error_${message}_${index}`}>
              {message}
            </FormErrorMessage>
          ))}
      </FormControl>
      <chakra.br />
      <Button type={'submit'} isLoading={createPost.isLoading}>
        送信
      </Button>
    </chakra.form>
  )
}
