import { Nav } from 'react-bootstrap'
import { Link, NavLink as RRNavLink, useLocation } from 'react-router'
import { ADMIN_SIDEBAR_CONFIG } from './admin-sidebar-config'

const normalizePath = (path = '') => path.replace(/\/+$/, '')

const isItemEnabled = (item) => !item.isDisabled

const isPathActive = (pathname, item) => {
  if (!isItemEnabled(item)) return false

  const normalized = normalizePath(pathname)
  if (normalizePath(item.path) === normalized) return true
  return item.activeMatch?.test(pathname) ?? false
}

const AdminSidebarNavItem = ({ item, pathname, onClose }) => {
  const active  = isPathActive(pathname, item)
  const enabled = isItemEnabled(item)

  if (!enabled) {
    return (
      <Nav.Item as="li">
        <Nav.Link
          disabled
          className="d-flex justify-content-between"
        >
          { item.label }
        </Nav.Link>
      </Nav.Item>
    )
  }

  return (
    <Nav.Item as="li">
      <Nav.Link
        as={ RRNavLink }
        to={ item.path }
        onClick={ onClose }
        end
        active={ active }
      >
        { item.label }
      </Nav.Link>
    </Nav.Item>
  )
}

const SidebarDivider = () => (
  <div
    className="mx-3 my-2"
    style={{
      height     : 1,
      background : 'linear-gradient(to right, transparent, rgba(21, 101, 192, 0.25), transparent)'
    }}
  />
)

const AdminSidebar = ({ onClose }) => {
  const { pathname } = useLocation()

  return (
    <nav className="admin-sidebar d-flex flex-column">
      <Link
        to="/admin"
        onClick={ onClose }
        className="d-block m-3 text-decoration-none"
      >
        <span className="fw-bold text-white">
          { 'Scorpio Carwash' }
        </span>
      </Link>

      <SidebarDivider />

      <Nav
        as="ul"
        variant="pills"
        className="flex-column px-3"
      >
        {
          ADMIN_SIDEBAR_CONFIG.topLevel.map((item) => (
            <AdminSidebarNavItem
              key={ item.path }
              item={ item }
              pathname={ pathname }
              onClose={ onClose }
            />
          ))
        }
      </Nav>

      {
        ADMIN_SIDEBAR_CONFIG.boundedContexts.map((context) => (
          <div key={ context.id }>
            <SidebarDivider />
            <div className="px-3 pt-2">
              <div className="text-uppercase mb-0 fw-bold">
                { context.label }
              </div>
              <p className="small text-body-tertiary">
                { context.description }
              </p>

              <Nav
                as="ul"
                variant="pills"
                className="flex-column"
              >
                {
                  context.items.map((item) => (
                    <AdminSidebarNavItem
                      key={ item.path }
                      item={ item }
                      pathname={ pathname }
                      onClose={ onClose }
                    />
                  ))
                }
              </Nav>
            </div>
          </div>
        ))
      }
    </nav>
  )
}

export default AdminSidebar
