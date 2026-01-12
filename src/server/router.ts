import { ORPCError, os } from '@orpc/server'
import { z } from 'zod'

// Simple hello procedure (no input, no route)
const hello = os
  .output(z.object({ message: z.string() }))
  .handler(() => {
    return { message: 'Hello from oRPC!' }
  })

// Procedure with input validation and route
const greet = os
  .input(z.object({ name: z.string().min(1) }))
  .output(z.object({ message: z.string() }))
  .route({
    method: 'POST',
    path: '/greet',
  })
  .handler(({ input }) => {
    return { message: `Hello, ${input.name}!` }
  })

// Example with error handling
const divide = os
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

// Example async procedure (could be a database call)
const getTodos = os
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

// Example procedure with context (useful for auth, etc.)
const getCurrentTime = os
  .output(
    z.object({
      timestamp: z.string(),
      timezone: z.string(),
    }),
  )
  .route({
    method: 'GET',
    path: '/time',
  })
  .handler(() => {
    return {
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  })

// Export router using os.router() for nested organization
export const router = os.router({
  hello,
  greet,
  divide,
  getTodos,
  getCurrentTime,
})

export type Router = typeof router
