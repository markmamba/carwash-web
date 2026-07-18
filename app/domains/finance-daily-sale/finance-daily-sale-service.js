const FinanceDailySaleService = {
  /**
   * Builds a plain-text representation of a Finance::DailySale for clipboard copy.
   * @param {Object} dailySale
   * @returns {string}
   */
  copyText: (dailySale) => {
    const lines = [
      'Finance::DailySale',
      `id: ${dailySale.id}`,
      `uuid: ${dailySale.uuid || '—'}`,
      `sale_date: ${dailySale.sale_date || '—'}`,
      `plate_number: ${dailySale.plate_number || '—'}`,
      `car_type: ${dailySale.car_type || '—'}`,
      `total_amount: ${dailySale.total_amount || '—'}`,
      `business_share: ${dailySale.business_share || '—'}`,
      `staff_share: ${dailySale.staff_share || '—'}`,
      `staff_name: ${dailySale.staff_name || '—'}`,
      `notes: ${dailySale.notes || '—'}`,
      `status: ${dailySale.status || '—'}`,
      `admin_created_by_id: ${dailySale.admin_created_by_id || '—'}`,
      `created_at: ${dailySale.created_at || '—'}`,
      `updated_at: ${dailySale.updated_at || '—'}`
    ]

    return lines.join('\n')
  }
}

export { FinanceDailySaleService }
