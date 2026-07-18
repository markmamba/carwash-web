/**
 * Formats an ISO date/time string for display.
 * @param {string|null|undefined} value
 * @param {string} [locale='en-PH']
 * @param {Intl.DateTimeFormatOptions} [options={}]
 * @returns {string}
 */
export function formatDateTime(value, locale = 'en-PH', options = {}) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat(locale, options).format(date)
}

/**
 * Formats a civil date (YYYY-MM-DD) without timezone shift.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function formatCivilDate(value) {
  if (!value) {
    return '—'
  }

  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return value
  }

  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('en-PH', {
    day   : '2-digit',
    month : 'short',
    year  : 'numeric'
  }).format(date)
}
