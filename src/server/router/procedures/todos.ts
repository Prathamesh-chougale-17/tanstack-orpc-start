import { os } from '@orpc/server'
import { z } from 'zod'

/**
 * Get Todos procedure - Returns a list of todos
 * Example async procedure that could be a database call
 */
export const getTodos = os
  .output(
    z.array(
      z.object({
        id: z.number(),
        text: z.string(),
        completed: z.boolean(),
      }),
    ),
  )
  .route({
    method: 'GET',
    path: '/todos',
  })
  .handler(async () => {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100))
    return [
      { id: 1, text: 'Learn oRPC', completed: true },
      { id: 2, text: 'Build something awesome', completed: false },
    ]
  })
