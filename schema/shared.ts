import { z } from 'zod'

export const Image = z.object({
  altText: z.string(),
  caption: z.string().nullable(),
  fileUrl: z.string(),
  width: z.number(),
  height: z.number(),
})

export type Image = z.infer<typeof Image>
