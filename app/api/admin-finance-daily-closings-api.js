import { adminApiClient } from '@/api/ky-client'
import { removeObjectEmptyAttributes } from '@/utils/object-utils'

const ADMIN_FINANCE_DAILY_CLOSINGS_PATH = 'admins/finance/daily_closings'

export const adminFinanceDailyClosingsApi = {
  /**
   * Fetches paginated daily closings.
   * @param {Object} filters - Filter and pagination params
   * @param {number} [filters.page] - Page number
   * @param {number} [filters.page_size] - Page size
   * @param {string} [filters.closing_date] - Filter by closing date (YYYY-MM-DD)
   * @param {string} [filters.closing_date_from] - Filter from closing date (YYYY-MM-DD)
   * @param {string} [filters.closing_date_to] - Filter to closing date (YYYY-MM-DD)
   * @returns {Promise<Object>} Daily closings list with meta
   */
  index: (filters) => adminApiClient.get(
    ADMIN_FINANCE_DAILY_CLOSINGS_PATH,
    { searchParams: removeObjectEmptyAttributes(filters) }
  ).json(),

  /**
   * Fetches a single daily closing.
   * @param {number|string} dailyClosingId
   * @returns {Promise<Object>} Daily closing detail
   */
  show: (dailyClosingId) => adminApiClient.get(
    `${ADMIN_FINANCE_DAILY_CLOSINGS_PATH}/${dailyClosingId}`
  ).json(),

  /**
   * Creates a daily closing.
   * @param {Object} dailyClosing
   * @param {string} dailyClosing.closing_date
   * @param {number|string} dailyClosing.lunch_deduction
   * @param {string} [dailyClosing.notes]
   * @returns {Promise<Object>} Created daily closing
   */
  create: (dailyClosing) => {
    const payload = {
      closing_date    : dailyClosing.closing_date,
      lunch_deduction : String(dailyClosing.lunch_deduction),
      notes           : dailyClosing.notes
    }

    return adminApiClient.post(
      ADMIN_FINANCE_DAILY_CLOSINGS_PATH,
      { json: payload }
    ).json()
  },

  /**
   * Updates a daily closing.
   * @param {number|string} dailyClosingId
   * @param {Object} dailyClosing
   * @returns {Promise<Object>} Updated daily closing
   */
  update: (dailyClosingId, dailyClosing) => {
    const payload = {
      closing_date    : dailyClosing.closing_date,
      lunch_deduction : String(dailyClosing.lunch_deduction),
      notes           : dailyClosing.notes
    }

    return adminApiClient.patch(
      `${ADMIN_FINANCE_DAILY_CLOSINGS_PATH}/${dailyClosingId}`,
      { json: payload }
    ).json()
  }
}
