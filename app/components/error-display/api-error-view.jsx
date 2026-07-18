/**
 * Renders API field validation messages for toasts and error panels.
 */
const ApiErrorView = ({ error }) => {
  const messages = error?.messages || {}
  const entries  = Object.entries(messages)

  if (entries.length === 0) {
    return (
      <span>
        { error?.title || error?.message || 'Validation failed.' }
      </span>
    )
  }

  return (
    <ul className="mb-0 ps-3">
      {
        entries.map(([field, fieldMessages]) => {
          const messageList = Array.isArray(fieldMessages) ? fieldMessages : [fieldMessages]

          return messageList.map((message) => (
            <li key={ `${field}-${message}` }>
              { message }
            </li>
          ))
        })
      }
    </ul>
  )
}

export default ApiErrorView
