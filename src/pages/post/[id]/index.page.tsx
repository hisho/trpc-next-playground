import { chakra, Heading, Text } from '@chakra-ui/react'
import type { NextPageWithLayout } from '@src/pages/_app.page'
import { RouterOutput, trpc } from '@src/utils/trpc'
import NextError from 'next/error'
import { useRouter } from 'next/router'

type PostByIdOutput = RouterOutput['post']['byId']

function PostItem(props: { post: PostByIdOutput }) {
  const { post } = props
  return (
    <>
      <Heading as={'h1'}>{post.title}</Heading>
      <chakra.em>
        Created {post.createdAt.toLocaleDateString('en-us')}
      </chakra.em>

      <Text>{post.text}</Text>

      <Heading as={'h2'}>Raw data:</Heading>
      <chakra.pre>{JSON.stringify(post, null, 4)}</chakra.pre>
    </>
  )
}

const PostViewPage: NextPageWithLayout = () => {
  const id = useRouter().query['id'] as string
  const postQuery = trpc.post.byId.useQuery({ id })

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    )
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>
  }
  const { data } = postQuery
  return <PostItem post={data} />
}

export default PostViewPage
