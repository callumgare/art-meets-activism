import { z } from 'zod'

export const pageInfoSchema = z.object({
  slug: z.string(),
  path: z.string(),
})

export type PageInfo = z.infer<typeof pageInfoSchema>
