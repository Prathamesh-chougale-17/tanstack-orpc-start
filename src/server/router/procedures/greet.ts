import { os } from '@orpc/server'
import { z } from 'zod'

/**
 * Greet procedure - Returns a personalized greeting message
 */
export const greet = os
  .input(z.object({ name: z.string().min(1) }))
  .output(z.object({ message: z.string() }))
  .route({
    method: 'POST',
    path: '/greet',
  })
  .handler(({ input }) => {
    return { message: `Hello, ${input.name}!` }
  })
