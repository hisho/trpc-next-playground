import { z } from 'zod'

export const createPostSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string().min(1),
  title: z.string().min(1).max(32),
})
