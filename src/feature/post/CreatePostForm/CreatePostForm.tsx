import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { useForm } from '@src/lib/react-hook-form/useForm/useForm'
import { isTRPCClientError } from '@src/lib/trpc/isTRPCClientError/isTRPCClientError'
import { useTRPCError } from '@src/lib/trpc/useTRPCError/useTRPCError'
import type { AppRouter } from '@src/server/routers/_app'
import { trpc } from '@src/utils/trpc'
import type { inferProcedureInput } from '@trpc/server'
import { z } from 'zod'

export const CreatePostForm = () => {
  const utils = trpc.useContext()
  const { findErrorMessages, resetError, setError } =
    useTRPCError<AppRouter['post']['create']>()

  const form = useForm({
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

  const onCreatePost = async ({
    id,
    text,
    title,
  }: inferProcedureInput<AppRouter['post']['create']>) => {
    try {
      await createPost.mutateAsync({ id, text, title })
      resetError()
    } catch (e) {
      if (isTRPCClientError(e)) {
        setError(e)
      }
    }
  }

  const createPost = trpc.post.create.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate()
    },
  })

  return (
    <chakra.form
      w={'full'}
      maxW={'xl'}
      onSubmit={form.handleSubmit(onCreatePost)}
    >
      <FormControl isInvalid={!!findErrorMessages('title')}>
        <FormLabel>Title:</FormLabel>
        <Input
          type={'text'}
          isDisabled={createPost.isLoading}
          {...form.register('title')}
        />
        {form.formState.errors.title && (
          <FormErrorMessage>
            {form.formState.errors.title.message}
          </FormErrorMessage>
        )}
        {findErrorMessages('title') &&
          findErrorMessages('title')?.map((message, index) => (
            <FormErrorMessage
              key={`createPost_title_error_${message}_${index}`}
            >
              {message}
            </FormErrorMessage>
          ))}
      </FormControl>

      <chakra.br />
      <FormControl isInvalid={!!findErrorMessages('text')}>
        <FormLabel>Text:</FormLabel>
        <Textarea
          isDisabled={createPost.isLoading}
          {...form.register('text')}
        />
        {form.formState.errors.text && (
          <FormErrorMessage>
            {form.formState.errors.text.message}
          </FormErrorMessage>
        )}
        {findErrorMessages('text') &&
          findErrorMessages('text')?.map((message, index) => (
            <FormErrorMessage key={`createPost_text_error_${message}_${index}`}>
              {message}
            </FormErrorMessage>
          ))}
      </FormControl>
      <chakra.br />
      <Button type={'submit'} isLoading={createPost.isLoading}>
        送信
      </Button>
      {createPost.error && (
        <Text style={{ color: 'red' }}>
          {JSON.stringify(createPost.error.data?.zodError)}
        </Text>
      )}
    </chakra.form>
  )
}
