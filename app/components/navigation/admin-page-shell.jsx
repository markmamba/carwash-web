import { CheckCircle, List, Plus } from 'lucide-react'
import { Nav } from 'react-bootstrap'
import { NavLink } from 'react-router'

const RESOURCE_ACTION_ICONS = {
  'check-circle' : CheckCircle,
  list           : List,
  plus           : Plus
}

const AdminPageShell = ({
  pageMetadata = {},
  resourceActions = [],
  children
}) => {
  const title         = pageMetadata.title || ''
  const description   = pageMetadata.description || ''
  const contextLabel  = pageMetadata.contextLabel || ''
  const contextHelp   = pageMetadata.contextHelpText || ''
  const guidanceText  = pageMetadata.guidanceText || ''

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-gradient-chrome text-white px-3 px-md-4 py-4">
        <div className="resource-shell-title-card rounded-3 p-3 mb-3">
          {
            contextLabel
              ? (
                <p className="small text-uppercase fw-semibold text-white text-opacity-75 mb-1">
                  { contextLabel }
                </p>
              )
              : null
          }
          <h1 className="h4 mb-1">
            { title }
          </h1>
          {
            description
              ? (
                <p className="mb-0 text-white text-opacity-75">
                  { description }
                </p>
              )
              : null
          }
          {
            contextHelp
              ? (
                <p className="small mb-0 mt-2 text-white text-opacity-50">
                  { contextHelp }
                </p>
              )
              : null
          }
        </div>

        {
          resourceActions.length > 0
            ? (
              <Nav
                variant="tabs"
                className="border-0"
              >
                {
                  resourceActions.map((resourceAction) => {
                    const ActionIcon = RESOURCE_ACTION_ICONS[resourceAction.icon] || List

                    return (
                      <Nav.Item key={ resourceAction.to }>
                        <Nav.Link
                          as={ NavLink }
                          to={ resourceAction.to }
                          end={ resourceAction.end }
                          className="d-inline-flex align-items-center gap-1"
                          disabled={ resourceAction.disabled }
                        >
                          <ActionIcon size={ 16 } />
                          { resourceAction.label }
                          {
                            resourceAction.badge
                              ? (
                                <span className="badge text-bg-secondary ms-1">
                                  { resourceAction.badge }
                                </span>
                              )
                              : null
                          }
                        </Nav.Link>
                      </Nav.Item>
                    )
                  })
                }
              </Nav>
            )
            : null
        }
      </header>

      <div className="flex-grow-1 bg-body-secondary">
        {
          guidanceText
            ? (
              <div className="resource-shell-guidance mx-3 mx-md-4 mt-3 p-3 rounded-3 small">
                { guidanceText }
              </div>
            )
            : null
        }

        <div className="p-3 p-md-4">
          { children }
        </div>
      </div>
    </div>
  )
}

export { AdminPageShell }
