import React from 'react'

function TextInput({ label, value = '', onChange = () => {} }) {
  return (
    <React.Fragment>
      <label className="f6 fw5 db mb1 gray ttc">{label}</label>
      <input
        value={value}
        className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
        type="text"
        onChange={onChange}
      />
    </React.Fragment>
  )
}

export { TextInput }