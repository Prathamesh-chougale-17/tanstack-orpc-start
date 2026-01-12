import { os } from '@orpc/server'
import { z } from 'zod'

/**
 * Hello procedure - Returns a simple hello message
 */
export const hello = os
  .output(z.object({ message: z.string() }))
  .handler(() => {
    return { message: 'Hello from oRPC!' }
  })
