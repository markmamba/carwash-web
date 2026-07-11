import { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react'

const defaultContext = {
  identitiesAdmin : null,
  isAdminLoggedIn : () => false,
  onAdminUpdate   : () => { }
}

const AdminAuthContext = createContext(defaultContext)

export function AdminAuthProvider({ children, identitiesAdminData = null }) {
  const [identitiesAdmin, setIdentitiesAdmin] = useState(identitiesAdminData || defaultContext.identitiesAdmin)

  useEffect(() => {
    setIdentitiesAdmin(identitiesAdminData || defaultContext.identitiesAdmin)
  }, [identitiesAdminData])

  const onAdminUpdate = useCallback((admin) => {
    setIdentitiesAdmin(admin || defaultContext.identitiesAdmin)
  }, [])

  const isAdminLoggedIn = useCallback(() => !!(identitiesAdmin && identitiesAdmin.id), [identitiesAdmin])

  const adminAuthContextValue = useMemo(() => ({
    identitiesAdmin,
    isAdminLoggedIn,
    onAdminUpdate
  }), [
    identitiesAdmin,
    isAdminLoggedIn,
    onAdminUpdate
  ])

  return (
    <AdminAuthContext.Provider value={ adminAuthContextValue }>
      { children }
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)

  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }

  return context
}
