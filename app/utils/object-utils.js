/**
 * Removes keys whose values are null, undefined, or empty strings.
 * @param {Object} object - Source object
 * @returns {Object} Cleaned object
 */
export function removeObjectEmptyAttributes(object = {}) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => {
      if (value === null || value === undefined) return false
      if (typeof value === 'string' && value.trim() === '') return false
      return true
    })
  )
}
