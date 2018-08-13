import React from 'react'

function TextInput({ label, value = '', placeholder, onChange = () => {} }) {
  return (
    <React.Fragment>
      <label className="f6 fw6 db mb1 gray ttc">{label}</label>
      <input
        value={value}
        className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
      />
    </React.Fragment>
  )
}

function NumericInput({
  label,
  value = undefined,
  placeholder,
  onChange = () => {}
}) {
  return (
    <React.Fragment>
      <label className="f6 fw6 db mb1 gray ttc">{label}</label>
      <input
        value={value}
        className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
        type="number"
        placeholder={placeholder}
        onChange={onChange}
      />
    </React.Fragment>
  )
}

function FieldError({ errors, field = '' }) {
  const messageArray = errors[field]
  if (messageArray) {
    const errorMessages = messageArray.map((message, i) => (
      <p key={i} className="red f7 mt1 mb0 i">
        {message}
      </p>
    ))
    return <React.Fragment>{errorMessages}</React.Fragment>
  }
  return null
}

export { TextInput, NumericInput, FieldError }
