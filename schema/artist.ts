import { z } from 'zod'

import { Image } from '@/schema/shared'

export const artistSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  biography: z.string(),
  image: Image.nullable(),
  artworks: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      title: z.string(),
    })
  ),
})

export type Artist = z.infer<typeof artistSchema>
