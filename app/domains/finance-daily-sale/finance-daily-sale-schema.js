import { z } from 'zod'

export const financeDailySaleSchema = z.object({
  sale_date    : z.string().min(1, 'Sale date is required'),
  plate_number : z.string().min(1, 'Plate number is required'),
  car_type     : z.string().min(1, 'Car type is required'),
  total_amount : z.coerce.number().positive('Total amount must be greater than zero'),
  staff_name   : z.string().min(1, 'Staff name is required'),
  notes        : z.string().optional()
})
