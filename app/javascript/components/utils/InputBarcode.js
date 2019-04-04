import React, { useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { ImgBarcode } from './Icons'
import { launchBarcodeScanner } from '../utils/BarcodeScanner'

const InputBarcode = forwardRef(
  (
    {
      onChange,
      onKeyPress,
      onBarcodeScan,
      scanditLicense,
      value,
      error,
      readOnly = false,
      autoFocus = false,
      className = 'w5',
      multiple = false
    },
    ref
  ) => {
    let scanner = null
    let scannerRef = null

    const onShowScanner = e => {
      if (!scanner || scanner.destroyed) {
        launchBarcodeScanner({
          licenseKey: scanditLicense,
          targetRef: scannerRef,
          onScan: result => {
            onBarcodeScan(result)
            if (!multiple) {
              scanner.destroy()
            }
          }
        }).then(ref => {
          scanner = ref
          console.log('scanner:', scanner)
        })
      } else {
        if (scanner) {
          scanner.destroy()
        }
      }
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
                className={`grey input input--with-icon ${className}`}
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
            </React.Fragment>
          )}
        </div>
        {error && <span className="f6 i red dib pv1">{error}</span>}
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
        <div className="flex items-center mt3">
          <div className="scanner" ref={x => (scannerRef = x)} />
        </div>
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
