import { Link } from '@chakra-ui/react'
import { PostItem } from '@src/feature/post/Post/PostItem/PostItem'
import { usePost } from '@src/feature/post/Post/usePost'
import type { NextPageWithLayout } from '@src/pages/_app.page'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { z } from 'zod'

const schema = z.object({
  id: z.string().catch(''),
})

const PostViewPage: NextPageWithLayout = () => {
  const { query } = useRouter()
  const { id } = schema.parse(query)
  const { data, isError, isLoading } = usePost({ id })

  if (isError || !data) {
    return <PostItem.NoData />
  }

  if (isLoading) {
    return <PostItem.Loading />
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
