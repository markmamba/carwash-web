import { Form } from 'react-bootstrap'
import { useFormContext } from 'react-hook-form'

const TextField = ({
  name,
  label,
  type = 'text',
  autoComplete,
  placeholder
}) => {
  const { register, formState: { errors } } = useFormContext()
  const fieldError                            = errors[name]

  return (
    <Form.Group
      className="mb-3"
      controlId={ name }
    >
      <Form.Label>
        { label }
      </Form.Label>
      <Form.Control
        type={ type }
        placeholder={ placeholder }
        autoComplete={ autoComplete }
        isInvalid={ !!fieldError }
        { ...register(name) }
      />
      <Form.Control.Feedback type="invalid">
        { fieldError?.message }
      </Form.Control.Feedback>
    </Form.Group>
  )
}

export default TextField
