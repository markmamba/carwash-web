import { Badge, Container, Row } from 'react-bootstrap'
import '@/styles/admin-login-gradient.scss'

/**
 * Shared gradient background layout for unauthenticated admin pages (login, etc.).
 */
const AdminLoginLayout = ({ children }) => {
  const commitSha = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7) || 'dev'

  return (
    <Container
      fluid
      className="min-vh-100 admin-gradient-bg bg-gradient-reward-hero"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="admin-gradient-svg"
      >
        <defs>
          <filter id="adminGoo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend
              in="SourceGraphic"
              in2="goo"
            />
          </filter>
        </defs>
      </svg>

      <div className="admin-gradient-blobs d-none d-md-block">
        <div className="admin-blob admin-blob-1" />
        <div className="admin-blob admin-blob-2" />
        <div className="admin-blob admin-blob-3" />
        <div className="admin-blob admin-blob-4" />
        <div className="admin-blob admin-blob-5" />
      </div>

      <Row className="g-0 min-vh-100 admin-login-content">
        { children }
      </Row>

      <div className="text-center">
        <Badge
          bg="dark"
          className="p-3 text-uppercase"
        >
          { 'Scorpio Carwash Admin' }
        </Badge>
        <small className="text-white-50 mb-3 d-block">
          { 'ver. ' }
          { commitSha }
        </small>
      </div>
    </Container>
  )
}

export default AdminLoginLayout
