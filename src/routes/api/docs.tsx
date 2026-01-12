import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/docs')({
  server: {
    handlers: {
      GET: async () => {
        const html = `
<!doctype html>
<html>
  <head>
    <title>API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="https://orpc.dev/icon.svg" />
  </head>
  <body>
    <div id="app"></div>

    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
      Scalar.createApiReference('#app', {
        url: '/api/openapi',
        authentication: {
          securitySchemes: {
            bearerAuth: {
              token: 'default-token',
            },
          },
        },
      })
    </script>
  </body>
</html>
        `

        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        })
      },
    },
  },
})
