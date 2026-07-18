import {
  isRouteErrorResponse,
  Links,
  Meta,
  Navigate,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError
} from 'react-router'
import { AdminAuthProvider } from '@/hooks/use-admin-auth'
import { ToastProvider } from '@/hooks/use-toast'
import GeneralError from '@/components/error-display/general-error'
import {
  buildAdminLoginRedirectPath,
  isUnauthorizedApiError
} from '@/utils/error-boundary-utils'
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
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </AdminAuthProvider>
  )
}

export function ErrorBoundary() {
  const error    = useRouteError()
  const location = useLocation()

  if (isUnauthorizedApiError(error)) {
    return (
      <Navigate
        to={ buildAdminLoginRedirectPath(location.pathname, location.search) }
        replace
      />
    )
  }

  if (isRouteErrorResponse(error)) {
    return (
      <main style={ { padding: '2rem' } }>
        <GeneralError error={ error } />
      </main>
    )
  }

  let stack

  if (import.meta.env.DEV && error && error instanceof Error) {
    stack = error.stack
  }

  return (
    <main style={ { padding: '2rem' } }>
      <GeneralError error={ error } />
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
