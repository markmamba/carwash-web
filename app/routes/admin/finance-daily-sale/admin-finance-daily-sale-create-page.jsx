import { useNavigate } from 'react-router'
import { adminFinanceDailySalesApi } from '@/api/admin-finance-daily-sales-api'
import FinanceDailySaleForm from '@/domains/finance-daily-sale/finance-daily-sale-form'
import { useToast } from '@/hooks/use-toast'
import { getApiErrorToastConfig, setApiErrorsToFormFields } from '@/utils/error-utils'

export const meta = () => ([
  { title: 'Create Daily Sale | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

export const handle = {
  breadcrumb: 'Create',
  pageShell  : {
    title        : 'Create daily sale',
    description  : 'Enter a new logbook entry for a car wash.',
    guidanceText : 'Fill in the sale details from the physical logbook.'
  }
}

const AdminFinanceDailySaleCreatePage = () => {
  const { showToast } = useToast()
  const navigate      = useNavigate()

  const handleSubmit = async (values, setError) => {
    try {
      await adminFinanceDailySalesApi.create(values)

      showToast({
        message : 'Daily sale created',
        type    : 'success'
      })

      navigate('/admin/finance/daily-sales', { replace: true })
    } catch (error) {
      const toastConfig = getApiErrorToastConfig(error, {
        defaultMessage: 'An error occurred while creating the daily sale'
      })
      showToast(toastConfig)

      setApiErrorsToFormFields(
        error,
        setError,
        'An error occurred while creating the daily sale'
      )
    }
  }

  return (
    <FinanceDailySaleForm onSubmit={ handleSubmit } />
  )
}

export default AdminFinanceDailySaleCreatePage
