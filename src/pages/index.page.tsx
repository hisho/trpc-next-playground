import { Button, chakra, Heading, Link, Text } from '@chakra-ui/react'
import { CreatePostForm } from '@src/feature/post/CreatePostForm/CreatePostForm'
import type { NextPageWithLayout } from '@src/pages/_app.page'
import { trpc } from '@src/utils/trpc'
import NextLink from 'next/link'
import { Fragment } from 'react'

const IndexPage: NextPageWithLayout = () => {
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

      <CreatePostForm />
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
