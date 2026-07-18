import { Form } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'

const DateField = ({
  name,
  label,
  required = false,
  className = 'mb-3'
}) => {
  const formHook    = useFormContext()
  const fieldError  = formHook.formState.errors[name]

  return (
    <Form.Group
      className={ className }
      controlId={ name }
    >
      <Form.Label>
        { label }
        {
          required
            ? (
              <span className="text-danger">
                { ' *' }
              </span>
            )
            : null
        }
      </Form.Label>
      <Form.Control
        type="date"
        isInvalid={ !!fieldError }
        { ...formHook.register(name) }
      />
      <Form.Control.Feedback type="invalid">
        { fieldError?.message }
      </Form.Control.Feedback>
    </Form.Group>
  )
}

export default DateField
