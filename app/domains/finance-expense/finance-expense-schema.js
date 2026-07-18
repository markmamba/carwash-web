import { z } from 'zod'

export const financeExpenseSchema = z.object({
  expense_date : z.string().min(1, 'Expense date is required'),
  category     : z.string().min(1, 'Category is required'),
  amount       : z.coerce.number().positive('Amount must be greater than zero'),
  description  : z.string().optional()
})
