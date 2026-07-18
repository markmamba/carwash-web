import { useState } from 'react'
import { Alert, Button, Modal, Table } from 'react-bootstrap'
import { Pencil } from 'lucide-react'
import FinanceDailyClosingForm from '@/domains/finance-daily-closing/finance-daily-closing-form'
import { FinanceDailyClosingService } from '@/domains/finance-daily-closing/finance-daily-closing-service'
import { CurrencyUtils } from '@/utils/currency-utils'
import { formatCivilDate } from '@/utils/date-time-utils'

const FinanceDailyClosingDaySummary = ({
  saleDate,
  dailySales,
  dailyClosing,
  dailyClosingLoadFailed = false,
  onSubmit
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const subTotal       = FinanceDailyClosingService.calculateBusinessShareSubTotal(dailySales)
  const lunchDeduction = dailyClosing?.lunch_deduction ?? 0
  const netTotal       = FinanceDailyClosingService.calculateNetTotal(subTotal, lunchDeduction)

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (values, setError) => {
    const isSaved = await onSubmit(values, setError)

    if (isSaved) {
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <p className="small text-uppercase fw-semibold text-body-secondary mb-2 mt-4">
        { 'Day closing summary' }
      </p>

      {
        dailyClosingLoadFailed
          ? (
            <Alert
              variant="warning"
              className="border mb-3"
            >
              { 'Could not load the lunch deduction for this day. Totals below may be incomplete until you refresh.' }
            </Alert>
          )
          : null
      }

      <div className="border rounded-3 overflow-hidden mb-3">
        <Table
          className="mb-0"
          responsive
        >
          <tbody>
            <tr>
              <th
                scope="row"
                className="text-body-secondary fw-medium"
              >
                { 'Date' }
              </th>
              <td className="text-end">
                { formatCivilDate(saleDate) }
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="text-body-secondary fw-medium"
              >
                { 'Sub-total (business share)' }
              </th>
              <td className="text-end fw-semibold">
                { CurrencyUtils.format(subTotal) }
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="text-body-secondary fw-medium"
              >
                { 'Lunch deduction' }
              </th>
              <td className="text-end">
                <span className="me-2">
                  { CurrencyUtils.format(lunchDeduction) }
                </span>
                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  onClick={ handleOpenModal }
                >
                  <Pencil
                    size={ 14 }
                    className="me-1"
                  />
                  { dailyClosing ? 'Edit' : 'Add' }
                </Button>
              </td>
            </tr>
            <tr className="table-light">
              <th
                scope="row"
                className="fw-semibold"
              >
                { 'Net total' }
              </th>
              <td className="text-end fw-semibold">
                { CurrencyUtils.format(netTotal) }
              </td>
            </tr>
          </tbody>
        </Table>
      </div>

      <Modal
        show={ isModalOpen }
        onHide={ handleCloseModal }
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            { dailyClosing ? 'Edit lunch deduction' : 'Add lunch deduction' }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FinanceDailyClosingForm
            dailyClosing={ dailyClosing || {} }
            closingDate={ saleDate }
            onSubmit={ handleFormSubmit }
            onCancel={ handleCloseModal }
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

export { FinanceDailyClosingDaySummary }
