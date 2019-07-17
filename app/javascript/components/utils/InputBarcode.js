import React, { useEffect, useRef, useState, forwardRef } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Manager, Reference, Popper } from 'react-popper'
import { ImgBarcode } from './Icons'
import BarCodeComponent from './BarcodeComponent'

function LookupIcon({ title, mode, className }) {
  if (!mode) {
    return null
  }
  const node = useRef()
  const [expand, setExpand] = useState(false)
  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])
  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // elided, because clicking inside popup
      return
    }
    // clicking outside popup
    setExpand(false)
  }
  return (
    <span ref={node}>
      <Manager>
        <Reference>
          {({ ref }) => (
            <i
              ref={ref}
              className={`material-icons ${className}`}
              title={title}
              onClick={() => setExpand(!expand)}
            >
              search
            </i>
          )}
        </Reference>
        {expand && (
          <Popper placement="bottom-start" positionFixed>
            {({ ref, style, placement, arrowProps }) => (
              <div
                ref={ref}
                style={style}
                className="z-999 mt1 bg-white shadow-3 ba br2 b--light-grey tc"
                data-placement={placement}
              >
                Lookup mode {mode}
                <div ref={arrowProps.ref} style={arrowProps.style} />
              </div>
            )}
          </Popper>
        )}
      </Manager>
    </span>
  )
}

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
      multiple = false
    },
    ref
  ) => {
    const [hidden, setHidden] = useState(false)
    const onShowScanner = () => {
      setHidden(!hidden)
    }
    // const node = useRef()
    // const handleLookup = e => {
    //   if (node.current.contains(e.target)) {
    //     // elided, because clicking inside popup
    //     return
    //   }
    //   setEnableLookup(false) // clicking outside popup
    // }
    // useEffect(() => {
    //   document.addEventListener('mousedown', handleLookup)
    //   return () => {
    //     document.removeEventListener('mousedown', handleLookup)
    //   }
    // }, [])
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
