import { createFileRoute } from '@tanstack/react-router'
import { OpenAPIGenerator } from '@orpc/openapi'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { router } from '@/server/router'

export const Route = createFileRoute('/api/openapi')({
  server: {
    handlers: {
      GET: async () => {
        const generator = new OpenAPIGenerator({
          schemaConverters: [new ZodToJsonSchemaConverter()],
        })

        const spec = await generator.generate(router, {
          info: {
            title: 'My App API',
            version: '1.0.0',
            description:
              'API documentation for My App - type-safe RPC endpoints',
          },
          servers: [
            {
              url: '/api/rpc',
              description: 'RPC endpoint',
            },
          ],
          security: [{ bearerAuth: [] }],
          components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
              },
            },
          },
        })

        return new Response(JSON.stringify(spec, null, 2), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      },
    },
  },
})
