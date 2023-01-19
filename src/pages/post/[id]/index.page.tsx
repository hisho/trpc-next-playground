import { chakra, Heading, Link, Text } from '@chakra-ui/react'
import { usePost } from '@src/feature/post/Post/usePost'
import type { NextPageWithLayout } from '@src/pages/_app.page'
import type { RouterOutput } from '@src/utils/trpc'
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
  const { data, error, isError, isLoading } = usePost({ id })

  if (isError || !data) {
    return (
      <>
        <Head>
          <title>404</title>
        </Head>
        <div>
          <Heading>{error.httpStatus}</Heading>
          <Text>{error.message}</Text>
        </div>
      </>
    )
  }

  console.log(isLoading)
  if (isLoading) {
    return <>Loading...</>
  }

  return (
    <>
      <Link as={NextLink} href={'/'}>
        Back to home
      </Link>
      <PostItem post={data} />
    </>
  )
}

export default PostViewPage
