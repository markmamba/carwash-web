/**
 * Admin portal sidebar menu config.
 *
 * Path convention: /admin/finance/{resource}
 * Disabled items are shown but not clickable until their phase ships.
 */

export const ADMIN_SIDEBAR_CONFIG = {
  topLevel: [
    {
      label       : 'Dashboard',
      path        : '/admin',
      activeMatch : /^\/admin$/,
      isDisabled  : false
    }
  ],

  boundedContexts: [
    {
      id          : 'finance',
      label       : 'Finance',
      description : 'Daily sales, expenses, deposits, income, and loans.',
      items       : [
        {
          label       : 'Daily Sales',
          path        : '/admin/finance/daily-sales',
          activeMatch : /^\/admin\/finance\/daily-sales(\/|$)/,
          isDisabled  : false
        },
        {
          label       : 'Expenses',
          path        : '/admin/finance/expenses',
          activeMatch : /^\/admin\/finance\/expenses(\/|$)/,
          isDisabled  : true
        },
        {
          label       : 'Bank Deposits',
          path        : '/admin/finance/bank-deposits',
          activeMatch : /^\/admin\/finance\/bank-deposits(\/|$)/,
          isDisabled  : true
        },
        {
          label       : 'Other Income',
          path        : '/admin/finance/other-incomes',
          activeMatch : /^\/admin\/finance\/other-incomes(\/|$)/,
          isDisabled  : true
        },
        {
          label       : 'Loans',
          path        : '/admin/finance/loans',
          activeMatch : /^\/admin\/finance\/loans(\/|$)/,
          isDisabled  : true
        }
      ]
    },
    {
      id          : 'reports',
      label       : 'Reports',
      description : 'Weekly and monthly sales summaries.',
      items       : [
        {
          label       : 'Weekly Sales',
          path        : '/admin/finance/reports/weekly',
          activeMatch : /^\/admin\/finance\/reports\/weekly(\/|$)/,
          isDisabled  : true
        },
        {
          label       : 'Monthly Sales',
          path        : '/admin/finance/reports/monthly',
          activeMatch : /^\/admin\/finance\/reports\/monthly(\/|$)/,
          isDisabled  : true
        }
      ]
    }
  ]
}
