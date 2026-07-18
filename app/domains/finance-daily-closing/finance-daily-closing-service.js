const FinanceDailyClosingService = {
  /**
   * Sums business_share from daily sales rows for a day sub-total.
   * @param {Array<Object>} dailySales
   * @returns {number}
   */
  calculateBusinessShareSubTotal: (dailySales) => {
    return dailySales.reduce((sum, dailySale) => {
      const amount = Number(dailySale.business_share)

      if (Number.isNaN(amount)) {
        return sum
      }

      return sum + amount
    }, 0)
  },

  /**
   * Computes net total after lunch deduction.
   * @param {number|string} subTotal
   * @param {number|string|null|undefined} lunchDeduction
   * @returns {number}
   */
  calculateNetTotal: (subTotal, lunchDeduction) => {
    const numericSubTotal      = Number(subTotal) || 0
    const numericLunchDeduction = Number(lunchDeduction) || 0

    return numericSubTotal - numericLunchDeduction
  },

  /**
   * Builds a plain-text representation of a Finance::DailyClosing for clipboard copy.
   * @param {Object} dailyClosing
   * @returns {string}
   */
  copyText: (dailyClosing) => {
    const lines = [
      'Finance::DailyClosing',
      `id: ${dailyClosing.id}`,
      `uuid: ${dailyClosing.uuid || '—'}`,
      `closing_date: ${dailyClosing.closing_date || '—'}`,
      `lunch_deduction: ${dailyClosing.lunch_deduction || '—'}`,
      `notes: ${dailyClosing.notes || '—'}`,
      `admin_created_by_id: ${dailyClosing.admin_created_by_id || '—'}`
    ]

    return lines.join('\n')
  }
}

export { FinanceDailyClosingService }
