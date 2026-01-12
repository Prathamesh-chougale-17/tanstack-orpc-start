import { ORPCError, os } from '@orpc/server'
import { z } from 'zod'

/**
 * Divide procedure - Divides two numbers with error handling
 */
export const divide = os
  .input(
    z.object({
      a: z.number(),
      b: z.number(),
    }),
  )
  .output(z.object({ result: z.number() }))
  .route({
    method: 'POST',
    path: '/divide',
  })
  .handler(({ input }) => {
    if (input.b === 0) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Cannot divide by zero',
      })
    }
    return { result: input.a / input.b }
  })
