import { z } from 'zod'

export const siteInfoSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
})

export type SiteInfo = z.infer<typeof siteInfoSchema>
