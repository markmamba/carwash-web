import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Col, Form, Spinner } from 'react-bootstrap'
import { FormProvider, useForm } from 'react-hook-form'
import { redirect, useNavigate, useSearchParams } from 'react-router'
import { z } from 'zod'
import { adminSessionsApi } from '@/api/admin-sessions-api'
import { ApiError } from '@/errors/api-error'
import TextField from '@/components/forms/text-field'
import withNoAuth from '@/components/hocs/with-no-auth'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { useToast } from '@/hooks/use-toast'
import AdminLoginLayout from '@/layouts/admin/admin-login-layout'
import { getApiErrorToastConfig, setApiErrorsToFormFields } from '@/utils/error-utils'

export const meta = () => ([
  { title: 'Login | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

const adminLoginSchema = z.object({
  email    : z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password : z.string().min(1, 'Password is required')
})

export async function clientLoader({ request }) {
  try {
    await adminSessionsApi.current()

    const url          = new URL(request.url)
    const redirectTo   = url.searchParams.get('redirect_to') || '/admin'

    throw redirect(redirectTo)
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }

    if (error instanceof ApiError && error.status === 401) {
      return null
    }

    throw error
  }
}

const AdminLoginPage = () => {
  const { onAdminUpdate } = useAdminAuth()
  const { showToast }     = useToast()
  const navigate          = useNavigate()
  const [searchParams]    = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm({
    resolver      : zodResolver(adminLoginSchema),
    defaultValues : {
      email    : '',
      password : ''
    }
  })

  const { handleSubmit, setError, formState: { errors } } = methods
  const redirectTo                                        = searchParams.get('redirect_to') || '/admin'

  const onSubmit = async (values) => {
    setIsSubmitting(true)

    try {
      const identitiesAdmin = await adminSessionsApi.create(values)

      onAdminUpdate(identitiesAdmin)

      navigate(redirectTo, { replace: true })
    } catch (error) {
      const toastConfig = getApiErrorToastConfig(error, {
        defaultMessage: 'Could not sign in. Check your email and password.'
      })

      showToast(toastConfig)

      setApiErrorsToFormFields(
        error,
        setError,
        'Could not sign in. Check your email and password.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLoginLayout>
      <Col
        xs={ 12 }
        md={ 6 }
        className="d-flex align-items-center justify-content-center p-4"
      >
        <div
          className="card shadow-sm border-0 rounded-4 p-4 w-100"
          style={{ maxWidth: '420px' }}
        >
          <h1 className="h4 mb-1">
            { 'Admin Login' }
          </h1>
          <p className="text-body-secondary mb-4">
            { 'Sign in to manage Scorpio Carwash records.' }
          </p>

          <FormProvider { ...methods }>
            <Form
              noValidate
              onSubmit={ handleSubmit(onSubmit) }
            >
              <TextField
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />

              <TextField
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
              />

              {
                errors.root
                  ? (
                    <Alert
                      variant="danger"
                      className="py-2"
                    >
                      { errors.root.message }
                    </Alert>
                  )
                  : null
              }

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={ isSubmitting }
              >
                {
                  isSubmitting
                    ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        { 'Signing in…' }
                      </>
                    )
                    : 'Sign in'
                }
              </Button>
            </Form>
          </FormProvider>
        </div>
      </Col>
    </AdminLoginLayout>
  )
}

export default withNoAuth(AdminLoginPage)
