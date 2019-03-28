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
      className = 'w5'
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
            scanner.destroy()
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
