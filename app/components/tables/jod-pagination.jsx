import { Pagination } from 'react-bootstrap'

export const JodPagination = ({
  totalPages = 1,
  currentPage = 1,
  onClick = () => {}
}) => {
  const safeTotalPages  = Math.max(1, totalPages)
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages)

  if (safeTotalPages <= 1) {
    return null
  }

  const paginationItems = Array.from({ length: safeTotalPages }, (_, pageIndex) => {
    const pageNumber = pageIndex + 1

    return (
      <Pagination.Item
        key={ pageNumber }
        active={ pageNumber === safeCurrentPage }
        onClick={ () => onClick(pageNumber) }
      >
        { pageNumber }
      </Pagination.Item>
    )
  })

  return (
    <Pagination className="justify-content-center mt-3">
      <Pagination.Prev
        disabled={ safeCurrentPage <= 1 }
        onClick={ () => onClick(safeCurrentPage - 1) }
      />
      { paginationItems }
      <Pagination.Next
        disabled={ safeCurrentPage >= safeTotalPages }
        onClick={ () => onClick(safeCurrentPage + 1) }
      />
    </Pagination>
  )
}
