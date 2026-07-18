import { z } from 'zod'

export const financeDailyClosingSchema = z.object({
  closing_date    : z.string().min(1, 'Closing date is required'),
  lunch_deduction : z.coerce.number().nonnegative('Lunch deduction cannot be negative'),
  notes           : z.string().optional()
})
