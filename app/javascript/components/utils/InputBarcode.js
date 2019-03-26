import React from 'react'
import PropTypes from 'prop-types'
import { ImgBarcode } from './Icons'

const InputBarcode = ({
  inputRef,
  onChange,
  onKeyPress,
  onBarcodeClick,
  autoFocus = false,
  className = 'w5'
}) => {
  return (
    <div className="flex items-center">
      <input
        type="text"
        ref={inputRef}
        className={`grey input input--with-icon ${className}`}
        autoFocus={autoFocus}
        onKeyPress={onKeyPress}
        onChange={onChange}
      />
      <img
        className="input__icon"
        src={ImgBarcode}
        alt="Scan barcode"
        onClick={onBarcodeClick}
      />
    </div>
  )
}

InputBarcode.propTypes = {
  inputRef: PropTypes.func,
  onChange: PropTypes.func,
  onBarcodeClick: PropTypes.func,
  onKeyPress: PropTypes.func,
  autoFocus: PropTypes.bool,
  className: PropTypes.string
}

export { InputBarcode }
