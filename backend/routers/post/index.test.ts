/**
 * Integration test example for the `post` router
 */
import { createContextInner } from '@backend/context'
import { AppRouter, appRouter } from '@backend/routers/_app'
import type { inferProcedureInput } from '@trpc/server'
import { expect, test } from 'vitest'

test('create and get post', async () => {
  const ctx = await createContextInner({})
  const caller = appRouter.createCaller(ctx)

  const input: inferProcedureInput<AppRouter['post']['create']> = {
    text: 'hello test',
    title: 'hello test',
  }

  const post = await caller.post.create(input)
  const byId = await caller.post.byId({ id: post.id })

  expect(byId).toMatchObject(input)
})
