import { adminApiClient } from '@/api/ky-client'
import { removeObjectEmptyAttributes } from '@/utils/object-utils'

const ADMIN_FINANCE_DAILY_SALES_PATH = 'admins/finance/daily_sales'

export const adminFinanceDailySalesApi = {
  /**
   * Fetches paginated daily sales.
   * @param {Object} filters - Filter and pagination params
   * @param {number} [filters.page] - Page number
   * @param {number} [filters.page_size] - Page size
   * @param {string} [filters.sale_date] - Filter by sale date (YYYY-MM-DD)
   * @returns {Promise<Object>} Daily sales list with meta
   */
  index: (filters) => adminApiClient.get(
    ADMIN_FINANCE_DAILY_SALES_PATH,
    { searchParams: removeObjectEmptyAttributes(filters) }
  ).json(),

  /**
   * Fetches a single daily sale.
   * @param {number|string} dailySaleId
   * @returns {Promise<Object>} Daily sale detail
   */
  show: (dailySaleId) => adminApiClient.get(
    `${ADMIN_FINANCE_DAILY_SALES_PATH}/${dailySaleId}`
  ).json(),

  /**
   * Creates a daily sale.
   * @param {Object} dailySale
   * @param {string} dailySale.sale_date
   * @param {string} dailySale.plate_number
   * @param {string} dailySale.car_type
   * @param {number|string} dailySale.total_amount
   * @param {string} dailySale.staff_name
   * @param {string} [dailySale.notes]
   * @returns {Promise<Object>} Created daily sale
   */
  create: (dailySale) => {
    const payload = {
      sale_date    : dailySale.sale_date,
      plate_number : dailySale.plate_number,
      car_type     : dailySale.car_type,
      total_amount : String(dailySale.total_amount),
      staff_name   : dailySale.staff_name,
      notes        : dailySale.notes
    }

    return adminApiClient.post(
      ADMIN_FINANCE_DAILY_SALES_PATH,
      { json: payload }
    ).json()
  },

  /**
   * Updates a daily sale.
   * @param {number|string} dailySaleId
   * @param {Object} dailySale
   * @returns {Promise<Object>} Updated daily sale
   */
  update: (dailySaleId, dailySale) => {
    const payload = {
      sale_date    : dailySale.sale_date,
      plate_number : dailySale.plate_number,
      car_type     : dailySale.car_type,
      total_amount : String(dailySale.total_amount),
      staff_name   : dailySale.staff_name,
      notes        : dailySale.notes
    }

    return adminApiClient.patch(
      `${ADMIN_FINANCE_DAILY_SALES_PATH}/${dailySaleId}`,
      { json: payload }
    ).json()
  },

  /**
   * Archives a daily sale.
   * @param {number|string} dailySaleId
   * @returns {Promise<Object>} Destroy confirmation
   */
  destroy: (dailySaleId) => adminApiClient.delete(
    `${ADMIN_FINANCE_DAILY_SALES_PATH}/${dailySaleId}`
  ).json()
}
