import React, { useState, useRef, useEffect } from 'react'
import { Manager, Reference, Popper } from 'react-popper'

const CheckboxSelect = ({ onChange, values = [], options = [] }) => {
  const node = useRef()
  const [expand, setExpand] = useState(false)
  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // elided, because clicking inside popup
      return
    }
    // clicking outside popup
    setExpand(false)
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])
  const optionsToShow = options.filter(x => x.Header)
  const isCustom = optionsToShow.some(x => x.show === false)
  const onCheckAll = () => {
    optionsToShow.forEach(opt => {
      if (opt.show === false) {
        onChange(opt.Header, true)
      }
    })
    setExpand(false)
  }
  return (
    <div ref={node} className="f6 dark-grey">
      <Manager>
        <Reference>
          {({ ref }) => (
            <React.Fragment>
              <div
                className="pointer relative pv2 ph3 ba b--light-grey br2 bg-white flex justify-between items-center"
                ref={ref}
                onClick={() => setExpand(!expand)}
              >
                <React.Fragment>
                  <span className="w4 pr2" onClick={() => setExpand(!expand)}>
                    {isCustom ? 'Custom' : 'All Columns'}
                  </span>
                  <i
                    className="material-icons md-16"
                    onClick={() => setExpand(!expand)}
                  >
                    filter_list
                  </i>
                </React.Fragment>
              </div>
            </React.Fragment>
          )}
        </Reference>
        {expand && (
          <Popper placement="bottom-start">
            {({ ref, style, placement, arrowProps }) => (
              <div
                ref={ref}
                style={style}
                className="z-1"
                data-placement={placement}
              >
                <div className="ma1 w5 shadow-3 bg-white ba br2 b--light-grey">
                  <ul className="list pl0 mv2">
                    <li>
                      <label className="pointer pv2 ph3 flex justify-between items-center">
                        -- All --
                        <input
                          type="checkbox"
                          checked={!isCustom}
                          onChange={onCheckAll}
                        />
                      </label>
                    </li>
                    {optionsToShow.map((x, i) => {
                      return (
                        <li key={i}>
                          <label className="pointer pv2 ph3 flex justify-between items-center">
                            {x.Header}
                            <input
                              type="checkbox"
                              defaultChecked={!(x.show === false)}
                              onChange={e =>
                                onChange(x.Header, e.target.checked)
                              }
                            />
                          </label>
                        </li>
                      )
                    })}
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

export { CheckboxSelect }
