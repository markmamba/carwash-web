import { route } from '@react-router/dev/routes'
import { adminRoutes } from './admin.routes.js'

export default [
  route('admin/login', './routes/admin/admin-login-page.jsx'),
  route('admin', 'layouts/admin/admin-layout.jsx', adminRoutes)
]
