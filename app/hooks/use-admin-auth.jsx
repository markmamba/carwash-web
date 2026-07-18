import { createContext, useState, useContext, useCallback, useMemo } from 'react'

const defaultContext = {
  identitiesAdmin : null,
  isAdminLoggedIn : () => false,
  onAdminUpdate   : () => { }
}

const AdminAuthContext = createContext(defaultContext)

export function AdminAuthProvider({ children }) {
  const [identitiesAdmin, setIdentitiesAdmin] = useState(defaultContext.identitiesAdmin)

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
