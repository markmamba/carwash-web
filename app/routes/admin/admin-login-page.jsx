import { Col } from 'react-bootstrap'
import AdminLoginLayout from '@/layouts/admin/admin-login-layout'

export const meta = () => ([
  { title: 'Login | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

export default function AdminLoginPage() {
  return (
    <AdminLoginLayout>
      <Col
        xs={ 12 }
        md={ 6 }
        className="d-flex align-items-center justify-content-center p-4"
      >
        <div className="card shadow-sm border-0 rounded-4 p-4 w-100" style={{ maxWidth: '420px' }}>
          <h1 className="h4 mb-3">
            { 'Admin Login' }
          </h1>
          <p className="text-body-secondary mb-0">
            { 'Login form will be wired in the next Phase 1 task.' }
          </p>
        </div>
      </Col>
    </AdminLoginLayout>
  )
}
