import { os } from '@orpc/server'
import { hello } from './procedures/hello'
import { greet } from './procedures/greet'
import { divide } from './procedures/divide'
import { getTodos } from './procedures/todos'
import { getCurrentTime } from './procedures/time'

/**
 * Main API Router
 *
 * Each procedure is defined in its own file under ./procedures/
 * This keeps the codebase organized and maintainable.
 *
 * To add new procedures:
 * 1. Create a new file in ./procedures/
 * 2. Define your procedure using the oRPC chainable API
 * 3. Import and add it to the router below
 */
export const router = os.router({
  hello,
  greet,
  divide,
  getTodos,
  getCurrentTime,
})

export type Router = typeof router
