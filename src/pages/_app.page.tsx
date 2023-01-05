import { ChakraProvider } from '@chakra-ui/react'
import { DefaultLayout } from '@src/components/DefaultLayout'
import { trpc } from '@src/utils/trpc'
import type { NextPage } from 'next'
import type { AppProps, AppType } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    <ChakraProvider>{getLayout(<Component {...pageProps} />)}</ChakraProvider>
  )
}) as AppType

export default trpc.withTRPC(MyApp)
