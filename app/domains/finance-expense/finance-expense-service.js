const FinanceExpenseService = {
  /**
   * Builds a plain-text representation of a Finance::Expense for clipboard copy.
   * @param {Object} expense
   * @returns {string}
   */
  copyText: (expense) => {
    const lines = [
      'Finance::Expense',
      `id: ${expense.id}`,
      `uuid: ${expense.uuid || '—'}`,
      `expense_date: ${expense.expense_date || '—'}`,
      `category: ${expense.category || '—'}`,
      `amount: ${expense.amount || '—'}`,
      `description: ${expense.description || '—'}`,
      `status: ${expense.status || '—'}`,
      `admin_created_by_id: ${expense.admin_created_by_id || '—'}`,
      `created_at: ${expense.created_at || '—'}`,
      `updated_at: ${expense.updated_at || '—'}`
    ]

    return lines.join('\n')
  }
}

export { FinanceExpenseService }
