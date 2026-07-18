import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import FinanceDailySaleFormFields from '@/domains/finance-daily-sale/finance-daily-sale-form-fields'
import { financeDailySaleSchema } from '@/domains/finance-daily-sale/finance-daily-sale-schema'

const FinanceDailySaleForm = ({
  onSubmit = () => {},
  dailySale = {}
}) => {
  const formHook = useForm({
    resolver      : zodResolver(financeDailySaleSchema),
    mode          : 'onChange',
    defaultValues : {
      sale_date    : dailySale.sale_date || '',
      plate_number : dailySale.plate_number || '',
      car_type     : dailySale.car_type || '',
      total_amount : dailySale.total_amount || '',
      staff_name   : dailySale.staff_name || '',
      notes        : dailySale.notes || ''
    }
  })

  const handleFormSubmit = (dailySaleFormState) => {
    return onSubmit(dailySaleFormState, formHook.setError)
  }

  return (
    <FormProvider { ...formHook }>
      <FinanceDailySaleFormFields onSubmit={ handleFormSubmit } />
    </FormProvider>
  )
}

export default FinanceDailySaleForm
