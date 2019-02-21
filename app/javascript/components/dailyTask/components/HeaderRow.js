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
        className="flex items-center justify-center f6 pa2 black-40"
        style={wbsWidth}
      >
        #
      </div>

      <div className="flex items-center justify-start pa2" style={taskWidth}>
        <span className="f6 black-40" style={{ marginLeft: '30px' }}>
          Task
        </span>
      </div>

      <div
        className="flex items-center justify-center pa2"
        style={locationWidth}
      >
        <span className="f6 black-40">Location</span>
      </div>

      <div className="flex items-center justify-center pa2" style={btnWidth}>
        &nbsp;
      </div>

      <div className="flex items-center justify-center pa2" style={statusWidth}>
        <span className="f6 black-40">Status</span>
      </div>
    </div>
  )
}

export default HeaderRow
