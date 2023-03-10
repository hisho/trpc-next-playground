/**
 * Integration test example for the `post` router
 */
import { createContextInner } from '@src/server/context'
import { AppRouter, appRouter } from '@src/server/routers/_app'
import type { inferProcedureInput } from '@trpc/server'
import { expect, test } from 'vitest'

test('add and get post', async () => {
  const ctx = await createContextInner({})
  const caller = appRouter.createCaller(ctx)

  const input: inferProcedureInput<AppRouter['post']['add']> = {
    text: 'hello test',
    title: 'hello test',
  }

  const post = await caller.post.add(input)
  const byId = await caller.post.byId({ id: post.id })

  expect(byId).toMatchObject(input)
})
