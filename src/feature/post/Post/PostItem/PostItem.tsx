import { chakra, Heading, Text } from '@chakra-ui/react'
import type { RouterOutput } from '@src/utils/trpc'
import Head from 'next/head'

type Props = {
  post: RouterOutput['post']['byId']
}

export const PostItem = ({ post }: Props) => {
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

const Loading = () => {
  return <div>loading...</div>
}

const NoData = () => {
  return (
    <>
      <Head>
        <title>404</title>
      </Head>
      <div>
        <Heading>投稿が存在しません。</Heading>
      </div>
    </>
  )
}

PostItem.Loading = Loading
PostItem.NoData = NoData
