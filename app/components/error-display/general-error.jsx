import { Alert } from 'react-bootstrap'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { isUnauthorizedApiError } from '@/utils/error-boundary-utils'

/**
 * Generic route error display for non-auth failures.
 */
const GeneralError = ({ error: errorProp }) => {
  const routeError = useRouteError()
  const error        = errorProp || routeError

  let title   = 'Something went wrong'
  let details = 'An unexpected error occurred.'

  if (isRouteErrorResponse(error)) {
    title   = error.status === 404 ? '404' : 'Error'
    details = error.status === 404
      ? 'The requested page could not be found.'
      : error.statusText || details
  } else if (isUnauthorizedApiError(error)) {
    title   = 'Session expired'
    details = 'Please sign in again to continue.'
  } else if (error instanceof Error) {
    details = error.message
  }

  return (
    <div className="p-3 p-md-4">
      <Alert variant="danger">
        <Alert.Heading>
          { title }
        </Alert.Heading>
        <p className="mb-0">
          { details }
        </p>
      </Alert>
    </div>
  )
}

export default GeneralError
