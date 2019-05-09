import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'

function TextInput({
  label,
  value = '',
  placeholder,
  onChange = () => {},
  errors = {},
  fieldname = null,
  readOnly = false
}) {
  return (
    <React.Fragment>
      {label && <label className="f6 fw6 db mb1 gray ttc">{label}</label>}
      <input
        value={value}
        className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        fieldname={fieldname}
        readOnly={readOnly}
      />
      {fieldname && <FieldError errors={errors} field={fieldname} />}
    </React.Fragment>
  )
}

function NumericInput({
  label,
  value = '',
  placeholder,
  min = '',
  max = '',
  onChange = () => {},
  errors = {},
  fieldname = null,
  readOnly = false,
  labelClassName = '',
  step = ''
}) {
  return (
    <React.Fragment>
      {label && (
        <label className={`f6 fw6 db mb1 gray ttc ${labelClassName}`}>
          {label}
        </label>
      )}
      <input
        value={value}
        className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tr"
        type="number"
        placeholder={placeholder}
        onChange={onChange}
        min={min}
        max={max}
        fieldname={fieldname}
        readOnly={readOnly}
        step={step}
      />
      {fieldname && <FieldError errors={errors} field={fieldname} />}
    </React.Fragment>
  )
}

function FieldError({ errors, field = '', className = '' }) {
  const messageArray = errors[field]
  if (messageArray) {
    const errorMessages = messageArray.map((message, i) => (
      <p key={i} className={`red f7 mt1 mb0 i ${className}`}>
        {message}
      </p>
    ))
    return <React.Fragment>{errorMessages}</React.Fragment>
  }
  return null
}

function CalendarPicker(props = {}) {
  return <DatePicker {...props} />
}

// function FieldSet(props) {
//   return <div className='ph4 mb3'>{props.children}</div>
// }

export { TextInput, NumericInput, FieldError, CalendarPicker }
