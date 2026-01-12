import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { client } from './orpc'

/**
 * oRPC TanStack Query utilities
 *
 * Provides type-safe query and mutation options for all procedures.
 * Use this instead of calling the client directly for better integration with React Query.
 *
 * @example
 * ```ts
 * // In a component
 * const query = useQuery(orpc.getTodos.queryOptions())
 * const mutation = useMutation(orpc.greet.mutationOptions())
 * ```
 */
export const orpc = createTanstackQueryUtils(client)
