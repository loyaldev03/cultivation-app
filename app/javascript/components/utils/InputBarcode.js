import React, { useState, forwardRef } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { ImgBarcode } from './Icons'
import BarCodeComponent from './BarcodeComponent'

const InputBarcode = forwardRef(
  (
    {
      onChange,
      onKeyPress,
      onBarcodeScan,
      value,
      error,
      metrcTagLookup = false,
      readOnly = false,
      autoFocus = false,
      className = 'w5',
      multiple = false
    },
    ref
  ) => {
    const [hidden, setHidden] = useState(false)

    const onShowScanner = e => {
      setHidden(!hidden)
    }

    return (
      <React.Fragment>
        <div className="flex items-center">
          {multiple ? (
            <textarea
              ref={ref}
              readOnly={readOnly}
              value={value}
              className={`grey ${className}`}
              autoFocus={autoFocus}
              onKeyPress={onKeyPress}
              onChange={onChange}
              rows="3"
            />
          ) : (
            <React.Fragment>
              <input
                ref={ref}
                readOnly={readOnly}
                type="text"
                value={value}
                className={classNames('grey input ${}', {
                  className: true,
                  'input--with-icon': !metrcTagLookup,
                  'input--with-icon--2': metrcTagLookup
                })}
                autoFocus={autoFocus}
                onKeyPress={onKeyPress}
                onChange={onChange}
              />
              <img
                className="input__icon"
                src={ImgBarcode}
                alt="Scan barcode"
                onClick={onShowScanner}
              />
              {metrcTagLookup && (
                <i class="material-icons input__icon--2" alt="Metrc Tag Lookup">
                  search
                </i>
              )}
            </React.Fragment>
          )}
        </div>
        {hidden && (
          <BarCodeComponent
            onBarcodeScan={onBarcodeScan}
            onShowScanner={onShowScanner}
          />
        )}
        {error && <span className="f7 i red dib pv1">{error}</span>}
        {multiple ? (
          <div className="w-100 mb2 mt2 flex justify-end">
            <a
              className="ph2 pv2 btn--secondary f6 link pointer"
              onClick={onShowScanner}
            >
              Scan Tags
            </a>
          </div>
        ) : null}
      </React.Fragment>
    )
  }
)

InputBarcode.propTypes = {
  inputRef: PropTypes.func,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  autoFocus: PropTypes.bool,
  className: PropTypes.string
}

export { InputBarcode }
