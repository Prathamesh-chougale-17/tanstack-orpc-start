import { os } from '@orpc/server'
import { z } from 'zod'

/**
 * Get Current Time procedure - Returns current timestamp and timezone
 * Example procedure that can use context for auth, etc.
 */
export const getCurrentTime = os
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
