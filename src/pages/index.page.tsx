import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  Textarea,
} from '@chakra-ui/react'
import type { NextPageWithLayout } from '@src/pages/_app.page'
import type { AppRouter } from '@src/server/routers/_app'
import { trpc } from '@src/utils/trpc'
import type { inferProcedureInput } from '@trpc/server'
import NextLink from 'next/link'
import { Fragment } from 'react'

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

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  //   for (const { id } of allPosts) {
  //     void utils.post.byId.prefetch({ id });
  //   }
  // }, [postsQuery.data, utils]);

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
        onSubmit={async (e) => {
          /**
           * In a real app you probably don't want to use this manually
           * Checkout React Hook Form - it works great with tRPC
           * @see https://react-hook-form.com/
           * @see https://kitchen-sink.trpc.io/react-hook-form
           */
          e.preventDefault()
          const $form = e.currentTarget
          const values = Object.fromEntries(new FormData($form))
          type Input = inferProcedureInput<AppRouter['post']['add']>
          //    ^?
          const input: Input = {
            text: values['text'] as string,
            title: values['title'] as string,
          }
          try {
            await addPost.mutateAsync(input)

            $form.reset()
          } catch (cause) {
            console.error({ cause }, 'Failed to add post')
          }
        }}
      >
        <FormControl>
          <FormLabel>Title:</FormLabel>
          <Input name="title" type="text" disabled={addPost.isLoading} />
        </FormControl>

        <chakra.br />
        <FormControl>
          <FormLabel>Text:</FormLabel>
          <Textarea name="text" disabled={addPost.isLoading} />
        </FormControl>
        <chakra.br />
        <Button type={'submit'} disabled={addPost.isLoading}>
          送信
        </Button>
        {addPost.error && (
          <Text style={{ color: 'red' }}>{addPost.error.message}</Text>
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
