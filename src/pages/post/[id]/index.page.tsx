import { chakra, Heading, Link, Text } from '@chakra-ui/react'
import type { NextPageWithLayout } from '@src/pages/_app.page'
import { RouterOutput, trpc } from '@src/utils/trpc'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { z } from 'zod'

type Props = {
  post: RouterOutput['post']['byId']
}

const PostItem = ({ post }: Props) => {
  return (
    <>
      <Heading as={'h1'}>{post.title}</Heading>
      <chakra.em>
        Created {post.createdAt.toLocaleDateString('ja-JP')}
      </chakra.em>

      <Text>{post.text}</Text>

      <Heading as={'h2'}>Raw data:</Heading>
      <chakra.pre>{JSON.stringify(post, null, 2)}</chakra.pre>
    </>
  )
}

const schema = z.object({
  id: z.string().catch(''),
})

const PostViewPage: NextPageWithLayout = () => {
  const { query } = useRouter()
  const { id } = schema.parse(query)
  const postQuery = trpc.post.byId.useQuery({ id })

  if (postQuery.error) {
    return (
      <>
        <Head>
          <title>404</title>
        </Head>
        <div>
          <Heading>{postQuery.error.data?.httpStatus}</Heading>
          <Text>{postQuery.error.message}</Text>
        </div>
      </>
    )
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>
  }

  return (
    <>
      <Link as={NextLink} href={'/'}>
        Back to home
      </Link>
      <PostItem post={postQuery.data} />
    </>
  )
}

export default PostViewPage
