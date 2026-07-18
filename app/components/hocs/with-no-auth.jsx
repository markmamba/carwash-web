import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAdminAuth } from '@/hooks/use-admin-auth'

/**
 * Redirects authenticated admins away from login and other guest-only pages.
 * @param {React.ComponentType} WrappedComponent
 * @returns {React.ComponentType}
 */
const withNoAuth = (WrappedComponent) => {
  const WithNoAuth = (props) => {
    const { isAdminLoggedIn } = useAdminAuth()
    const navigate            = useNavigate()
    const [searchParams]      = useSearchParams()

    useEffect(() => {
      if (!isAdminLoggedIn()) return

      const redirectTo = searchParams.get('redirect_to') || '/admin'

      navigate(redirectTo, { replace: true })
    }, [isAdminLoggedIn, navigate, searchParams])

    if (isAdminLoggedIn()) {
      return null
    }

    return (
      <WrappedComponent { ...props } />
    )
  }

  const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  WithNoAuth.displayName = `withNoAuth(${wrappedName})`

  return WithNoAuth
}

export default withNoAuth
