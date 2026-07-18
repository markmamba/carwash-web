import { adminApiClient } from '@/api/ky-client'
import { removeObjectEmptyAttributes } from '@/utils/object-utils'

const ADMIN_FINANCE_EXPENSES_PATH = 'admins/finance/expenses'

export const adminFinanceExpensesApi = {
  /**
   * Fetches paginated expenses.
   * @param {Object} filters - Filter and pagination params
   * @param {number} [filters.page] - Page number
   * @param {number} [filters.page_size] - Page size
   * @param {string} [filters.expense_date] - Filter by expense date (YYYY-MM-DD)
   * @param {string} [filters.category] - Filter by category
   * @returns {Promise<Object>} Expenses list with meta
   */
  index: (filters) => adminApiClient.get(
    ADMIN_FINANCE_EXPENSES_PATH,
    { searchParams: removeObjectEmptyAttributes(filters) }
  ).json(),

  /**
   * Fetches a single expense.
   * @param {number|string} expenseId
   * @returns {Promise<Object>} Expense detail
   */
  show: (expenseId) => adminApiClient.get(
    `${ADMIN_FINANCE_EXPENSES_PATH}/${expenseId}`
  ).json(),

  /**
   * Creates an expense.
   * @param {Object} expense
   * @param {string} expense.expense_date
   * @param {string} expense.category
   * @param {number|string} expense.amount
   * @param {string} [expense.description]
   * @returns {Promise<Object>} Created expense
   */
  create: (expense) => {
    const payload = {
      expense_date : expense.expense_date,
      category     : expense.category,
      amount       : String(expense.amount),
      description  : expense.description
    }

    return adminApiClient.post(
      ADMIN_FINANCE_EXPENSES_PATH,
      { json: payload }
    ).json()
  },

  /**
   * Updates an expense.
   * @param {number|string} expenseId
   * @param {Object} expense
   * @returns {Promise<Object>} Updated expense
   */
  update: (expenseId, expense) => {
    const payload = {
      expense_date : expense.expense_date,
      category     : expense.category,
      amount       : String(expense.amount),
      description  : expense.description
    }

    return adminApiClient.patch(
      `${ADMIN_FINANCE_EXPENSES_PATH}/${expenseId}`,
      { json: payload }
    ).json()
  },

  /**
   * Archives an expense.
   * @param {number|string} expenseId
   * @returns {Promise<Object>} Destroy confirmation
   */
  destroy: (expenseId) => adminApiClient.delete(
    `${ADMIN_FINANCE_EXPENSES_PATH}/${expenseId}`
  ).json()
}
