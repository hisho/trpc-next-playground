import { chakra, Heading, Link } from '@chakra-ui/react'
import type { RouterOutput } from '@src/utils/trpc'
import NextLink from 'next/link'

type Props = {
  post: RouterOutput['post']['byId']
}

export const PostCard = ({ post }: Props) => {
  return (
    <chakra.article key={post.id}>
      <Heading as={'h3'} wordBreak={'break-word'}>
        {post.title}
      </Heading>
      <Link as={NextLink} href={`/post/${post.id}`}>
        View more
      </Link>
    </chakra.article>
  )
}
