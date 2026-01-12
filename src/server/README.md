# oRPC Server API

This directory contains the oRPC router definition and related server-side code.

## Router (`router.ts`)

The router defines all API procedures available to the client. It uses `os` from `@orpc/server` and Zod for input/output validation.

### Core Procedure Pattern

oRPC procedures are built using a chainable API:

1. `.input()` - Define and validate input schema (optional)
2. `.output()` - Define and validate output schema (recommended for type safety)
3. `.route()` - Define OpenAPI route metadata (optional, for REST/OpenAPI)
4. `.handler()` - Implement the procedure logic

### Example Procedures

#### Basic Procedure (with output validation)
```typescript
import { os } from '@orpc/server'
import { z } from 'zod'

const hello = os
  .output(z.object({ message: z.string() }))
  .handler(() => {
    return { message: 'Hello from oRPC!' }
  })
```

#### Procedure with Input, Output, and Route
```typescript
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
```

#### Async Procedure with Database
```typescript
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
    const todos = await db.todos.findMany()
    return todos
  })
```

#### Error Handling
```typescript
import { ORPCError, os } from '@orpc/server'

const divide = os
  .input(z.object({ a: z.number(), b: z.number() }))
  .output(z.object({ result: z.number() }))
  .handler(({ input }) => {
    if (input.b === 0) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Cannot divide by zero',
      })
    }
    return { result: input.a / input.b }
  })
```

## Nested Routers

Organize procedures into nested routers using `os.router()`:

```typescript
const getGames = os
  .input(z.object({ page: z.number().optional().default(1) }))
  .output(z.object({ games: z.array(z.any()), total: z.number() }))
  .route({ method: 'GET', path: '/arena/games' })
  .handler(({ input }) => {
    // Implementation
  })

const getGame = os
  .input(z.object({ id: z.string() }))
  .output(z.object({ id: z.string(), title: z.string() }))
  .route({ method: 'GET', path: '/arena/game' })
  .handler(({ input }) => {
    // Implementation
  })

// Export nested router
export const arenaRouter = os.router({
  games: getGames,
  game: getGame,
})

// Use in main router
export const router = os.router({
  hello,
  greet,
  arena: arenaRouter, // Nested under /arena
})
```

## Using Context

Access request context in procedures:

```typescript
const getUserProfile = os
  .output(z.object({ id: z.string(), name: z.string() }))
  .handler(async ({ context }) => {
    // Access headers, user session, etc.
    const userId = context.userId
    const user = await db.users.findById(userId)
    return user
  })
```

Context is configured in:
- `src/routes/api/rpc.$.ts` - Server-side context
- `src/lib/orpc.ts` - Client-side context (for SSR)

## Adding New Procedures

1. Import `os` from `@orpc/server` and `z` from `zod`
2. Create your procedure using the chainable API:
   - Start with `os`
   - Add `.input()` for input validation (optional)
   - Add `.output()` for output validation (recommended)
   - Add `.route()` for OpenAPI metadata (optional)
   - End with `.handler()` to implement logic
3. Add the procedure to `os.router()` at the bottom
4. TypeScript will automatically infer types on the client
5. Call from client: `await client.yourProcedure(input)`

**Example**:
```typescript
const myNewProcedure = os
  .input(z.object({ id: z.number() }))
  .output(z.object({ result: z.string() }))
  .route({ method: 'POST', path: '/my-endpoint' })
  .handler(({ input }) => {
    return { result: `ID is ${input.id}` }
  })

// Update router export
export const router = os.router({
  hello,
  greet,
  myNewProcedure,
})
```

## MongoDB Integration

If using MongoDB, import the connection from `@/lib/mongodb`:

```typescript
import clientPromise from '@/lib/mongodb'
import { env } from '@/env'

const getUsers = os
  .output(z.array(z.object({ id: z.string(), name: z.string() })))
  .handler(async () => {
    const client = await clientPromise
    const db = client.db(env.MONGODB_DB_NAME)
    const users = await db.collection('users').find({}).toArray()
    return users
  })
```

Configure MongoDB connection in `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=myapp
```

## Validation Types

Use Zod for all input/output validation:

- `z.string()` - String validation (`.min()`, `.max()`, `.email()`, `.url()`)
- `z.number()` - Number validation (`.min()`, `.max()`, `.int()`, `.positive()`)
- `z.boolean()` - Boolean
- `z.object({ ... })` - Object with properties
- `z.array(schema)` - Array of items
- `z.enum(['a', 'b'])` - Enum validation
- `z.optional()` - Make field optional
- `z.nullable()` - Allow null
- `z.coerce.date()` - Coerce to Date object

See [Zod documentation](https://zod.dev) for all validation options.
