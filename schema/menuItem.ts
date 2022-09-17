import { z } from 'zod'

export const menuItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  path: z.string(),
})

export type MenuItem = z.infer<typeof menuItemSchema>
