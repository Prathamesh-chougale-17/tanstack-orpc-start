import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { createFileRoute } from '@tanstack/react-router'
import { CORSPlugin } from '@orpc/server/plugins'
import { ZodSmartCoercionPlugin } from '@orpc/zod'
import { router } from '@/server/router'

const handler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin(),
    new ZodSmartCoercionPlugin(),
  ],
})

export const Route = createFileRoute('/api/rpc/$')({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { response } = await handler.handle(request, {
          prefix: '/api/rpc',
          context: {},
        })

        return response ?? new Response('Not Found', { status: 404 })
      },
    },
  },
})
