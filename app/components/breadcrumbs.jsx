import { Link, useMatches } from 'react-router'

const resolveBreadcrumbEntry = (entry, match) => {
  if (typeof entry === 'function') {
    return entry(match)
  }

  if (typeof entry === 'string') {
    return { label: entry, isClickable: true }
  }

  return entry
}

const Breadcrumbs = () => {
  const matches = useMatches()

  const breadcrumbItems = matches.flatMap((match) => {
    const breadcrumb = match.handle?.breadcrumb

    if (!breadcrumb) {
      return []
    }

    if (Array.isArray(breadcrumb)) {
      return breadcrumb.map((entry) => resolveBreadcrumbEntry(entry, match))
    }

    return [resolveBreadcrumbEntry(breadcrumb, match)]
  })

  if (breadcrumbItems.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="px-3 px-md-4 pt-3"
    >
      <ol className="breadcrumb mb-0">
        {
          breadcrumbItems.map((item, index) => {
            const isLastItem     = index === breadcrumbItems.length - 1
            const isClickable    = item.isClickable !== false && !isLastItem && item.to
            const breadcrumbKey  = `${item.label}-${index}`

            return (
              <li
                key={ breadcrumbKey }
                className={ `breadcrumb-item${isLastItem ? ' active' : ''}` }
                aria-current={ isLastItem ? 'page' : undefined }
              >
                {
                  isClickable
                    ? (
                      <Link to={ item.to }>
                        { item.label }
                      </Link>
                    )
                    : item.label
                }
              </li>
            )
          })
        }
      </ol>
    </nav>
  )
}

export default Breadcrumbs
