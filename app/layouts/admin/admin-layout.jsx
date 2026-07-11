import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Button, Container, Offcanvas } from 'react-bootstrap'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import AdminSidebar from './admin-sidebar'

export const handle = {
  breadcrumb: 'Admin'
}

/**
 * Admin layout — authenticated shell with sidebar navigation.
 *
 * Reads admin session from AdminAuthProvider context.
 * Redirects to /admin/login when not authenticated.
 */
const AdminLayout = () => {
  const { isAdminLoggedIn }           = useAdminAuth()
  const navigate                      = useNavigate()
  const location                      = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const commitSha                     = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7) || 'dev'

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      const redirectTarget = `${location.pathname}${location.search}`
      const redirectTo     = `/admin/login?redirect_to=${encodeURIComponent(redirectTarget)}`

      navigate(redirectTo, { replace: true })
    }
  }, [isAdminLoggedIn, navigate, location])

  if (!isAdminLoggedIn()) return null

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

export default AdminLayout
