import React from 'react'
import {
  wbsWidth,
  taskWidth,
  locationWidth,
  btnWidth,
  statusWidth,
  headerRow
} from './TaskTableStyles'

const HeaderRow = () => {
  return (
    <div className="flex items-center pv0" style={headerRow}>
      <div
        className="flex items-center justify-center f6 pa2 grey"
        style={wbsWidth}
      >
        #
      </div>

      <div className="flex items-center justify-start pa2" style={taskWidth}>
        <span className="f6 grey" style={{ marginLeft: '30px' }}>
          Task
        </span>
      </div>

      <div
        className="flex items-center justify-center pa2"
        style={locationWidth}
      >
        <span className="f6 grey">Location</span>
      </div>

      <div className="flex items-center justify-center pa2" style={btnWidth}>
        &nbsp;
      </div>

      <div className="flex items-center justify-center pa2" style={statusWidth}>
        <span className="f6 grey">Status</span>
      </div>
    </div>
  )
}

export default HeaderRow
