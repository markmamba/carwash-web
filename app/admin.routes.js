import { index, route } from '@react-router/dev/routes'

export const adminRoutes = [
  index('./routes/admin/admin-dashboard-home.jsx'),
  route('finance', './routes/admin/finance-layout.jsx', [
    route('daily-sales', './routes/admin/finance-daily-sale/admin-finance-daily-sale-page-layout.jsx', [
      index('./routes/admin/finance-daily-sale/admin-finance-daily-sale-list-page.jsx'),
      route('create', './routes/admin/finance-daily-sale/admin-finance-daily-sale-create-page.jsx'),
      route(':dailySaleId', './routes/admin/finance-daily-sale/admin-finance-daily-sale-detail-page.jsx')
    ]),
    route('expenses', './routes/admin/finance-expense/admin-finance-expense-page-layout.jsx', [
      index('./routes/admin/finance-expense/admin-finance-expense-list-page.jsx'),
      route('create', './routes/admin/finance-expense/admin-finance-expense-create-page.jsx'),
      route(':expenseId', './routes/admin/finance-expense/admin-finance-expense-detail-page.jsx')
    ])
  ])
]
