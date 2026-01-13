import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-sm uppercase tracking-wide text-gray-500">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-gray-600">
        The page you are looking for does not exist or was moved. Please check
        the address or return home.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white transition hover:bg-neutral-800"
      >
        Go home
      </Link>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      }),
  )

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
