import { z } from 'zod'

import { Image } from '@/schema/shared'

export const artworkSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  image: Image,
  startingPrice: z.number(),
  statement: z.string().nullable(),
  auctionType: z.enum(['public', 'silent']),
  auctionURL: z.string().nullable(),
  artists: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
    })
  ),
})

export type Artwork = z.infer<typeof artworkSchema>
