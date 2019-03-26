import React, { useState } from 'react'
import SidebarStore from '../stores/SidebarStore'
import { InputBarcode, SlidePanelHeader } from '../../utils'

const ExpandableRow = () => {
  let clippingInput = null
  const [expand, setExpand] = useState(false)
  const onScanMother = e => {
    if (e.key === 'Enter') {
      console.log('onScanMother')
      clippingInput.focus()
    }
  }
  const onScanClipping = e => {
    if (e.key === 'Enter') {
      console.log('onScanClipping')
    }
  }
  return (
    <React.Fragment>
      <div className="flex items-center pv1">
        <i
          className="material-icons md-18 black-20 pointer"
          onClick={() => setExpand(!expand)}
        >
          {expand ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
        </i>
        <span className="ph2 w-30 pointer" onClick={() => setExpand(!expand)}>
          MOT00123
        </span>
        <span className="ph2 w-30">MO1-SR2-R1-SH1-T3</span>
        <span className="ph2 w-20 tc">7/7</span>
        <span className="ph2 w3 tc">Done</span>
      </div>
      {expand && (
        <div className="flex pl3 pb3">
          <div className="pa2 w-100">
            <div className="pt2 pb3">
              <label className="db pb1">Scan mother plant: </label>
              <InputBarcode autoFocus={true} onKeyPress={onScanMother} />
            </div>
            <div className="pb3">
              <label className="db pb1">Scan each clipping: </label>
              <div className="flex justify-between">
                <InputBarcode
                  inputRef={input => (clippingInput = input)}
                  onKeyPress={onScanClipping}
                />
                <a href="#0" className="btn btn--primary btn--small">
                  DONE
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

const ClipPotTagForm = ({ show }) => {
  if (!show) return null
  return (
    <div className="flex flex-column h-100">
      <SlidePanelHeader
        onClose={() => SidebarStore.closeSidebar()}
        title={'Create plant ID after clipping'}
      />
      <div className="flex flex-column flex-auto justify-between">
        <div className="pa3 flex flex-column grey">
          <div className="flex f6 pv2">
            <span className="ph2 w-30 ml3">Mother Plant ID</span>
            <span className="ph2 w-30">Location</span>
            <span className="ph2 w-20"># of Clippings</span>
            <span className="ph2 w3">Scan UID</span>
          </div>
          {[1, 2, 3, 4].map(x => (
            <ExpandableRow key={x} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClipPotTagForm
