import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { useForm } from '@src/lib/react-hook-form/useForm/useForm'
import { isTRPCClientError } from '@src/lib/trpc/isTRPCClientError/isTRPCClientError'
import { useTRPCError } from '@src/lib/trpc/useTRPCError/useTRPCError'
import type { NextPageWithLayout } from '@src/pages/_app.page'
import type { AppRouter } from '@src/server/routers/_app'
import { trpc } from '@src/utils/trpc'
import type { inferProcedureInput } from '@trpc/server'
import NextLink from 'next/link'
import { Fragment } from 'react'
import { z } from 'zod'

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext()
  const postsQuery = trpc.post.list.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor
      },
    }
  )

  const createPost = trpc.post.create.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate()
    },
  })

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

  return (
    <>
      <Heading as={'h1'}>Welcome to your tRPC starter!</Heading>
      <Text>
        If you get stuck, check <Link href="https://trpc.io">the docs</Link>,
        write a message in our{' '}
        <Link href="https://trpc.io/discord">Discord-channel</Link>, or write a
        message in{' '}
        <Link href="https://github.com/trpc/trpc/discussions">
          GitHub Discussions
        </Link>
        .
      </Text>

      <Heading as={'h2'}>
        Latest Posts
        {postsQuery.status === 'loading' && '(loading)'}
      </Heading>

      <Button
        onClick={() => postsQuery.fetchPreviousPage()}
        disabled={
          !postsQuery.hasPreviousPage || postsQuery.isFetchingPreviousPage
        }
      >
        {postsQuery.isFetchingPreviousPage
          ? 'Loading more...'
          : postsQuery.hasPreviousPage
          ? 'Load More'
          : 'Nothing more to load'}
      </Button>

      {postsQuery.data?.pages.map((page, index) => (
        <Fragment key={page.items[0]?.id || index}>
          {page.items.map((item) => (
            <chakra.article key={item.id}>
              <Heading as={'h3'}>{item.title}</Heading>
              <Link as={NextLink} href={`/post/${item.id}`}>
                View more
              </Link>
            </chakra.article>
          ))}
        </Fragment>
      ))}

      <chakra.hr />

      <Heading as={'h3'}>Add a Post</Heading>

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
              <FormErrorMessage
                key={`createPost_text_error_${message}_${index}`}
              >
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
    </>
  )
}

export default IndexPage

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createProxySSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.post.all.fetch();
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
