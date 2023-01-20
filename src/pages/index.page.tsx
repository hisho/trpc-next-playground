import { Box, Button, Center, Container, Grid, Heading } from '@chakra-ui/react'
import { CreatePostForm } from '@src/feature/post/Create/CreatePostForm/CreatePostForm'
import { PostCard } from '@src/feature/post/Post/PostCard/PostCard'
import { usePosts } from '@src/feature/post/Posts/usePosts'
import type { NextPageWithLayout } from '@src/pages/_app.page'
import { Fragment } from 'react'

const IndexPage: NextPageWithLayout = () => {
  const {
    data,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    isLoading,
  } = usePosts({
    limit: 5,
  })

  return (
    <Container>
      <Heading as={'h1'} textAlign={'center'}>
        Welcome to your tRPC starter!
      </Heading>

      <Box h={4} />

      <Heading as={'h2'}>
        Posts
        {isLoading && '(loading)'}
      </Heading>

      <Grid gridTemplateColumns={'repeat(2,1fr)'} gap={2}>
        {data?.pages.map((page, index) => (
          <Fragment key={page.items[0]?.id || index}>
            {page.items.map((item) => (
              <PostCard post={item} key={item.id} />
            ))}
          </Fragment>
        ))}
      </Grid>

      <Box h={4} />

      <Center>
        <Button
          onClick={() => fetchPreviousPage()}
          disabled={!hasPreviousPage || isFetchingPreviousPage}
        >
          {isFetchingPreviousPage
            ? 'Loading more...'
            : hasPreviousPage
            ? 'Load More'
            : 'Nothing more to load'}
        </Button>
      </Center>

      <Box h={4} />

      <Heading as={'h3'}>Add a Post</Heading>

      <CreatePostForm />
    </Container>
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
