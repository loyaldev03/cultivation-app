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
                type="text"
                ref={ref}
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
