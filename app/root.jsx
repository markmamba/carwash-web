import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from 'react-router'
import { AdminAuthProvider } from '@/hooks/use-admin-auth'
import './styles/main.scss'

export const links = () => ([
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel         : 'preconnect',
    href        : 'https://fonts.gstatic.com',
    crossOrigin : 'anonymous'
  },
  {
    rel  : 'stylesheet',
    href : 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap'
  }
])

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        { children }
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  )
}

export function ErrorBoundary({ error }) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details = error.status === 404
      ? 'The requested page could not be found.'
      : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack   = error.stack
  }

  return (
    <main style={ { padding: '2rem' } }>
      <h1>
        { message }
      </h1>
      <p>
        { details }
      </p>
      {
        stack
          ? (
            <pre style={ { overflowX: 'auto', padding: '1rem' } }>
              <code>
                { stack }
              </code>
            </pre>
          )
          : null
      }
    </main>
  )
}
