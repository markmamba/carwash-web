import { Form } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'

const CurrencyField = ({
  name,
  label,
  required = false,
  className = 'mb-3',
  formText
}) => {
  const formHook   = useFormContext()
  const fieldError = formHook.formState.errors[name]

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
        type="number"
        step="0.01"
        min="0"
        inputMode="decimal"
        isInvalid={ !!fieldError }
        { ...formHook.register(name) }
      />
      {
        formText
          ? (
            <Form.Text className="text-muted">
              { formText }
            </Form.Text>
          )
          : null
      }
      <Form.Control.Feedback type="invalid">
        { fieldError?.message }
      </Form.Control.Feedback>
    </Form.Group>
  )
}

export default CurrencyField
