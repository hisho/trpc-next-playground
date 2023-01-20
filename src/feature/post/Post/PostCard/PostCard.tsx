import { Button, chakra, Heading, Spacer, Text } from '@chakra-ui/react'
import type { RouterOutput } from '@src/utils/trpc'
import NextLink from 'next/link'

type Props = {
  post: RouterOutput['post']['byId']
}

export const PostCard = ({ post }: Props) => {
  return (
    <chakra.article
      py={4}
      px={2}
      shadow={'md'}
      display={'flex'}
      flexDirection={'column'}
    >
      <Heading
        as={'h3'}
        fontSize={'xl'}
        wordBreak={'break-word'}
        noOfLines={1}
        lineHeight={1}
      >
        {post.title}
      </Heading>
      <Heading>{`${post.updatedAt.toLocaleDateString('ja-JP')}`}</Heading>
      <Text noOfLines={2}>{post.text}</Text>
      <Spacer />
      <Button as={NextLink} href={`/post/${post.id}`}>
        もっと見る
      </Button>
    </chakra.article>
  )
}
