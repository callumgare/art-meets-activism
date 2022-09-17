import { z } from 'zod'

export const pageSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
})

export type Page = z.infer<typeof pageSchema>
