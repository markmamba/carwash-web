export const ADMIN_FINANCE_EXPENSES_RESOURCE_ACTIONS = [
  { label: 'List',   to: '/admin/finance/expenses',        icon: 'list', end: true },
  { label: 'Create', to: '/admin/finance/expenses/create', icon: 'plus', end: true }
]

export const ADMIN_FINANCE_EXPENSES_PAGE_METADATA = {
  contextLabel    : 'Finance',
  contextHelpText : 'Track daily sales, expenses, and financial records.',
  title           : 'Expenses',
  description     : 'Record business expenses from the physical logbook.'
}
