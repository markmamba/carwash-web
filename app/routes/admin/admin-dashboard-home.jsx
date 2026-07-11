export const meta = () => ([
  { title: 'Dashboard | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

export const handle = {
  breadcrumb: 'Dashboard'
}

export default function AdminDashboardHomePage() {
  return (
    <div className="p-3 p-md-4">
      <h1 className="h4 mb-3">
        { 'Dashboard' }
      </h1>
      <p className="text-body-secondary mb-0">
        { 'KPI cards and charts will appear here in Phase 4.' }
      </p>
    </div>
  )
}
