import { useNavigate } from 'react-router'
import { adminFinanceExpensesApi } from '@/api/admin-finance-expenses-api'
import FinanceExpenseForm from '@/domains/finance-expense/finance-expense-form'
import { useToast } from '@/hooks/use-toast'
import { getApiErrorToastConfig, setApiErrorsToFormFields } from '@/utils/error-utils'

export const meta = () => ([
  { title: 'Create Expense | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

export const handle = {
  breadcrumb: 'Create',
  pageShell  : {
    title        : 'Create expense',
    description  : 'Enter a new expense from the physical logbook.',
    guidanceText : 'Fill in the expense details from the logbook.'
  }
}

const AdminFinanceExpenseCreatePage = () => {
  const { showToast } = useToast()
  const navigate      = useNavigate()

  const handleSubmit = async (values, setError) => {
    try {
      await adminFinanceExpensesApi.create(values)

      showToast({
        message : 'Expense created',
        type    : 'success'
      })

      navigate('/admin/finance/expenses', { replace: true })
    } catch (error) {
      const toastConfig = getApiErrorToastConfig(error, {
        defaultMessage: 'An error occurred while creating the expense'
      })
      showToast(toastConfig)

      setApiErrorsToFormFields(
        error,
        setError,
        'An error occurred while creating the expense'
      )
    }
  }

  return (
    <FinanceExpenseForm onSubmit={ handleSubmit } />
  )
}

export default AdminFinanceExpenseCreatePage
