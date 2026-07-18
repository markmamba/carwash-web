import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FinanceExpenseFormFields from '@/domains/finance-expense/finance-expense-form-fields'
import { financeExpenseSchema } from '@/domains/finance-expense/finance-expense-schema'

const FinanceExpenseForm = ({
  onSubmit = () => {},
  expense = {}
}) => {
  const formHook = useForm({
    resolver      : zodResolver(financeExpenseSchema),
    mode          : 'onChange',
    defaultValues : {
      expense_date : expense.expense_date || '',
      category     : expense.category || '',
      amount       : expense.amount || '',
      description  : expense.description || ''
    }
  })

  const handleFormSubmit = (expenseFormState) => {
    return onSubmit(expenseFormState, formHook.setError)
  }

  return (
    <FormProvider { ...formHook }>
      <FinanceExpenseFormFields onSubmit={ handleFormSubmit } />
    </FormProvider>
  )
}

export default FinanceExpenseForm
