import React, { useState, forwardRef } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { ImgBarcode } from './Icons'
import { LookupIcon } from './LookupIcon'
import BarCodeComponent from './BarcodeComponent'

const InputBarcode = forwardRef(
  (
    {
      onChange,
      onKeyPress,
      onBarcodeScan,
      value,
      error,
      lookupMode = '',
      readOnly = false,
      autoFocus = false,
      className = 'w5',
      multiple = false,
      name = ''
    },
    ref
  ) => {
    const [hidden, setHidden] = useState(false)
    const onShowScanner = () => {
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
                name={name}
                readOnly={readOnly}
                type="text"
                value={value}
                className={classNames(`grey input ${className}`, {
                  'input--with-icon': !lookupMode,
                  'input--with-icon--2': lookupMode
                })}
                autoFocus={autoFocus}
                onKeyPress={onKeyPress}
                onChange={onChange}
              />
              <img
                className="input__icon"
                src={ImgBarcode}
                title="Use camera to scan barcode"
                onClick={onShowScanner}
              />
              {lookupMode && (
                <LookupIcon
                  className="input__icon--2"
                  title="Metrc tags lookup"
                  mode={lookupMode}
                  onChange={() => {
                    console.log('changed metrc tag')
                  }}
                />
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
        {multiple && (
          <div className="w-100 mb2 mt2 flex justify-end">
            <a
              className="ph2 pv2 btn--secondary f6 link pointer"
              onClick={onShowScanner}
            >
              Scan Tags
            </a>
          </div>
        )}
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
