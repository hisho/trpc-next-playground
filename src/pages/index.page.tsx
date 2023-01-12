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
import { zodResolver } from '@hookform/resolvers/zod'
import { addPostSchema } from '@src/model/Post/addPostSchema'
import type { NextPageWithLayout } from '@src/pages/_app.page'
import type { AppRouter } from '@src/server/routers/_app'
import { trpc } from '@src/utils/trpc'
import type { inferProcedureInput } from '@trpc/server'
import NextLink from 'next/link'
import { Fragment } from 'react'
import { useForm } from 'react-hook-form'

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

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate()
    },
  })

  const getAddPostErrors = (name: keyof Input) => {
    return addPost.error?.data?.zodError?.fieldErrors[name]
  }

  type Input = inferProcedureInput<AppRouter['post']['add']>
  const form = useForm<Input>({
    defaultValues: {
      text: '',
      title: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(addPostSchema),
  })

  const onAddPost = async ({ id, text, title }: Input) => {
    try {
      await addPost.mutateAsync({ id, text, title })
    } catch (e) {
      console.log(e)
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
        onSubmit={form.handleSubmit(onAddPost)}
      >
        <FormControl
          isInvalid={
            !!form.formState.errors.title || !!getAddPostErrors('title')
          }
        >
          <FormLabel>Title:</FormLabel>
          <Input
            type={'text'}
            isDisabled={addPost.isLoading}
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <FormErrorMessage>
              {form.formState.errors.title.message}
            </FormErrorMessage>
          )}
          {getAddPostErrors('title') &&
            getAddPostErrors('title')?.map((message, index) => (
              <FormErrorMessage key={`addPost_title_error_${message}_${index}`}>
                {message}
              </FormErrorMessage>
            ))}
        </FormControl>

        <chakra.br />
        <FormControl
          isInvalid={!!form.formState.errors.text || !!getAddPostErrors('text')}
        >
          <FormLabel>Text:</FormLabel>
          <Textarea isDisabled={addPost.isLoading} {...form.register('text')} />
          {form.formState.errors.text && (
            <FormErrorMessage>
              {form.formState.errors.text.message}
            </FormErrorMessage>
          )}
          {getAddPostErrors('text') &&
            getAddPostErrors('text')?.map((message, index) => (
              <FormErrorMessage key={`addPost_text_error_${message}_${index}`}>
                {message}
              </FormErrorMessage>
            ))}
        </FormControl>
        <chakra.br />
        <Button type={'submit'} isLoading={addPost.isLoading}>
          送信
        </Button>
        {addPost.error && (
          <Text style={{ color: 'red' }}>
            {JSON.stringify(addPost.error.data?.zodError)}
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
