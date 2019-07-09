import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash.isempty'
import classNames from 'classnames'
import { Manager, Reference, Popper } from 'react-popper'

function HeaderFilter({ title, accessor, getOptions, onUpdate }) {
  const node = useRef()
  const [expand, setExpand] = useState(false)
  const [options, setOptions] = useState([])
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
  const handleExpand = () => {
    if (isEmpty(options)) {
      const defaultOptions = getOptions(accessor).map(x => ({
        label: x,
        value: true
      }))
      setOptions(defaultOptions)
    }
    setExpand(!expand)
  }
  const handleChange = option => e => {
    option.value = e.target.checked
    const updated = options.map(x => (x.label === option.label ? option : x))
    setOptions(updated)
    onUpdate(accessor, updated)
  }
  const handlerClear = () => {
    const updated = options.map(x => ({ ...x, value: true }))
    setOptions(updated)
    onUpdate(accessor, updated)
  }
  const isActive = options.some(x => x.value === false)
  return (
    <div ref={node} className="grey flex items-center justify-between">
      <Manager>
        <Reference>
          {({ ref }) => (
            <React.Fragment>
              <span>{title}</span>
              <span
                ref={ref}
                className={classNames('f7 pointer self-start', { blue: isActive })}
                onClick={handleExpand}
              >
                ▼
              </span>
            </React.Fragment>
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
                <ul className="list pa1 ma0" style={{ minWidth: 150 }}>
                  {options.map((x, i) => {
                    let label
                    if (typeof x.label === 'boolean') {
                      label = !!x.label ? 'Yes' : 'No'
                    } else {
                      label = x.label
                    }
                    return (
                      <li key={i}>
                        <label className="hover-bg-grey pointer pa2 flex justify-between items-center">
                          <span className="pr4 ttc">{label}</span>
                          <input
                            type="checkbox"
                            checked={x.value}
                            onChange={handleChange(x)}
                          />
                        </label>
                      </li>
                    )
                  })}
                </ul>
                <button
                  className="btn btn--secondary btn--small ma2"
                  onClick={handlerClear}
                >
                  Clear filter
                </button>
                <div ref={arrowProps.ref} style={arrowProps.style} />
              </div>
            )}
          </Popper>
        )}
      </Manager>
    </div>
  )
}

HeaderFilter.propTypes = {
  title: PropTypes.string.isRequired,
  accessor: PropTypes.string.isRequired,
  getOptions: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
}

export { HeaderFilter }
