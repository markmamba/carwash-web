const PHP_CURRENCY_FORMATTER = new Intl.NumberFormat('en-PH', {
  style                 : 'currency',
  currency              : 'PHP',
  minimumFractionDigits : 2,
  maximumFractionDigits : 2
})

export const CurrencyUtils = {
  /**
   * Formats a numeric amount as Philippine Peso (₱).
   * @param {number|string|null|undefined} amount
   * @returns {string}
   */
  format: (amount) => {
    if (amount === null || amount === undefined || amount === '') {
      return '—'
    }

    const numericAmount = Number(amount)

    if (Number.isNaN(numericAmount)) {
      return '—'
    }

    return PHP_CURRENCY_FORMATTER.format(numericAmount)
  }
}
