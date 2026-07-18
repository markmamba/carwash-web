import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Button, Container, Offcanvas } from 'react-bootstrap'
import {
  Navigate,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useRouteError
} from 'react-router'
import { adminSessionsApi } from '@/api/admin-sessions-api'
import { ApiError } from '@/errors/api-error'
import GeneralError from '@/components/error-display/general-error'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import {
  buildAdminLoginRedirectPath,
  isUnauthorizedApiError
} from '@/utils/error-boundary-utils'
import AdminSidebar from './admin-sidebar'

export const handle = {
  breadcrumb: 'Admin'
}

export async function clientLoader({ request }) {
  try {
    const identitiesAdmin = await adminSessionsApi.current()

    return { identitiesAdmin }
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const url = new URL(request.url)

      throw redirect(buildAdminLoginRedirectPath(url.pathname, url.search))
    }

    throw error
  }
}

/**
 * Admin layout — authenticated shell with sidebar navigation.
 *
 * Session is validated in clientLoader before rendering protected routes.
 */
const AdminLayout = () => {
  const { identitiesAdmin }           = useLoaderData()
  const { onAdminUpdate }             = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const commitSha                     = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7) || 'dev'

  useEffect(() => {
    onAdminUpdate(identitiesAdmin)
  }, [identitiesAdmin, onAdminUpdate])

  const handleSidebarClose = () => setSidebarOpen(false)
  const handleSidebarShow  = () => setSidebarOpen(true)

  return (
    <Container
      fluid
      className="d-flex h-100 px-0"
    >
      <Offcanvas
        responsive="md"
        show={ sidebarOpen }
        placement="start"
        onHide={ handleSidebarClose }
        data-bs-theme="dark"
        className="admin-sidebar-offcanvas flex-shrink-0 d-flex flex-column"
        style={{
          width: 'clamp(200px, 20vw, 200px)'
        }}
      >
        <Offcanvas.Body
          className="p-0 flex-grow-1"
          style={{ minHeight: 0 }}
        >
          <div
            className="vh-100 overflow-y-auto overflow-x-hidden shadow bg-secondary-700"
            style={{ scrollbarWidth: 'none' }}
          >
            <AdminSidebar onClose={ handleSidebarClose } />
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="d-flex flex-column flex-grow-1 vh-100 overflow-hidden">
        <div className="d-md-none d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white">
          <p className="small text-uppercase fw-semibold text-body-secondary mb-0">
            { 'Scorpio Carwash Admin' }
          </p>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={ handleSidebarShow }
            aria-label="Open navigation menu"
          >
            <Menu size={ 18 } />
          </Button>
        </div>

        <main className="flex-grow-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>

        <small className="text-muted d-block px-3 pb-2">
          { 'ver. ' }
          { commitSha }
        </small>
      </div>
    </Container>
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

  return (
    <GeneralError error={ error } />
  )
}

export default AdminLayout
