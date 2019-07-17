import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Manager, Reference, Popper } from 'react-popper'

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
    <div ref={node}>
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
          <Popper placement="bottom" positionFixed>
            {({ ref, style, placement, arrowProps }) => (
              <div
                ref={ref}
                style={style}
                className="lookup shadow-3"
                data-placement={placement}
              >
                <div className="flex flex-column">
                  <input
                    type="search"
                    placeholder="Search"
                    autoFocus={true}
                    className="input w-100"
                  />
                  <p className="dark-grey">Available tags:</p>
                  <ul className="list pl0 mv0">
                    <li className="w-100 flex justify-between items-center pv1">
                      <span className="f6 grey">1A4FF0100000022000042</span>
                      <button class="btn btn--small orange">Pick</button>
                    </li>
                    <li className="w-100 flex justify-between items-center pv1">
                      <span className="f6 grey">1A4FF0100000022000043</span>
                      <button class="btn btn--small orange">Pick</button>
                    </li>
                    <li className="w-100 flex justify-between items-center pv1">
                      <span className="f6 grey">1A4FF0100000022000044</span>
                      <button class="btn btn--small orange">Pick</button>
                    </li>
                  </ul>
                </div>
                <div ref={arrowProps.ref} style={arrowProps.style} />
              </div>
            )}
          </Popper>
        )}
      </Manager>
    </div>
  )
}

LookupIcon.propTypes = {
  mode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string
}

export { LookupIcon }
