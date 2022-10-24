import { z } from 'zod'

export const siteInfoSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
  cmsUrl: z.string(),
  footerText: z.string(),
  headerInfoText: z.string(),
  eventDate: z.string(),
})

export type SiteInfo = z.infer<typeof siteInfoSchema>
